/**
 * Camada de serviço de integração HTTP com o backend oficial da Susana
 * Endpoints esperados em FastAPI sob o prefixo /api/v1
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUSANA_API_URL) || 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 12000;

/**
 * Verifica se a API da Susana está acessível
 */
export async function checkApiHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    }).catch(async () => {
      // Tenta rota raiz ou docs caso /health não esteja padronizado
      return await fetch(`${API_BASE_URL}/`, { method: 'GET', signal: controller.signal });
    });

    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    clearTimeout(timeoutId);
    return false;
  }
}

/**
 * Envia uma mensagem de consulta ao endpoint de chat da API
 * Contrato:
 * Request body: { session_id, message, context? }
 * Response body: { session_id, reply, status, intent, sources, evidence, clarification }
 */
export async function sendQueryToSusana(message, sessionId = null) {
  const activeSessionId = sessionId || `visualizer-${Date.now()}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        session_id: activeSessionId,
        message: message.trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: response.statusText };
      }

      return {
        success: false,
        status: 'error',
        statusCode: response.status,
        error: errorBody.detail || errorBody.message || `Erro no servidor HTTP ${response.status}`,
        durationMs
      };
    }

    const data = await response.json();

    // Mapeamento normalizado garantindo formato seguro
    return {
      success: true,
      sessionId: data.session_id || activeSessionId,
      status: data.status || 'answered',
      reply: data.reply || data.response || 'Sem resposta disponível.',
      intent: data.intent || 'saude_geral_df',
      sources: Array.isArray(data.sources) ? data.sources : [],
      evidence: Array.isArray(data.evidence) ? data.evidence : [],
      clarification: data.clarification || null,
      durationMs
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);

    const isTimeout = err.name === 'AbortError';

    return {
      success: false,
      status: 'error',
      isTimeout,
      error: isTimeout 
        ? `Tempo limite excedido (${DEFAULT_TIMEOUT_MS / 1000}s). O backend não respondeu.`
        : `Não foi possível conectar ao backend da Susana (${API_BASE_URL}). Verifique se o serviço FastAPI está ativo.`,
      durationMs
    };
  }
}
