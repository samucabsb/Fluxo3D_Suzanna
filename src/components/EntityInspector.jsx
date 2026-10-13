import React from 'react';
import {
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Copy
} from 'lucide-react';
import SourceList from './SourceList';
import { getStationById } from '../features/flow/flowSelectors';

export default function EntityInspector({
  selectedStationId,
  execution,
  onClose
}) {
  const station = getStationById(selectedStationId);
  if (!station) return null;

  const stageState = execution?.stages?.find((s) => s.id === station.id);
  const isCurrentlyActive = execution?.currentStageId === station.id && execution?.status === 'running';

  const copyToClipboard = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <aside className="w-96 max-w-[90vw] h-full flex flex-col glass-panel shadow-liquid border-l border-white/80 z-20 transition-all duration-300">
      {/* Cabeçalho do Inspetor */}
      <div className="p-4 border-b border-white/80 flex items-center justify-between gap-3 bg-white/70">
        <div className="flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sus-deep">
                Inspetor 3D
              </span>
              {isCurrentlyActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-sus-deep animate-pulse border border-blue-200">
                  Em Processamento
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-sus-ink leading-tight">
              {station.name}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-sus-muted hover:text-sus-ink hover:bg-white/80 transition-colors"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Corpo com Rolagem */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Descrição Didática da Estação */}
        <div className="p-3.5 rounded-2xl bg-white/80 border border-sus-ice shadow-sm">
          <h4 className="font-semibold text-sus-ink mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sus-primary" />
            <span>Função no Ecossistema Susana:</span>
          </h4>
          <p className="text-sus-muted leading-relaxed text-[11px]">
            {station.description}
          </p>
          <p className="text-sus-ink/70 text-[10px] mt-1.5 pt-1.5 border-t border-blue-100/60 leading-normal">
            {station.details}
          </p>
        </div>

        {/* Status do Estágio Atual na Execução */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/90 border border-sus-ice shadow-sm">
          <span className="text-[11px] font-medium text-sus-muted">Estado nesta consulta:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              stageState?.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : stageState?.status === 'active'
                ? 'bg-blue-100 text-sus-deep'
                : stageState?.status === 'skipped'
                ? 'bg-slate-100 text-slate-500'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {stageState?.status || 'Pendente'}
          </span>
        </div>

        {/* Conteúdo Contextual Específico de Cada Estação */}
        {station.id === 'input' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-sus-ice shadow-sm">
              <span className="text-[10px] font-semibold text-sus-muted uppercase tracking-wider block mb-1">
                Pergunta Registrada:
              </span>
              <p className="text-xs font-medium text-sus-ink italic">
                "{execution?.question || 'Nenhuma pergunta enviada ainda.'}"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-2xl bg-white/80 border border-sus-ice">
                <span className="text-sus-muted block text-[10px]">Identificador:</span>
                <span className="font-mono text-sus-ink truncate block">
                  {execution?.id || 'idle'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-sus-ice">
                <span className="text-sus-muted block text-[10px]">Modo Operacional:</span>
                <span className="font-semibold text-sus-deep capitalize">
                  {execution?.mode === 'live' ? 'Ao Vivo (FastAPI)' : 'Demonstração'}
                </span>
              </div>
            </div>
          </div>
        )}

        {station.id === 'scope' && (
          <div className="space-y-3">
            {execution?.scopeData ? (
              <>
                <div
                  className={`p-3.5 rounded-2xl border ${
                    execution.scopeData.allowed
                      ? 'bg-blue-50/80 border-blue-200 text-sus-deep'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                    {execution.scopeData.allowed ? (
                      <CheckCircle className="w-4 h-4 text-sus-primary" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      {execution.scopeData.allowed
                        ? 'Dentro do Escopo SUS-DF'
                        : 'Fora do Escopo Clínico'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {execution.scopeData.notes}
                  </p>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/90 border border-sus-ice space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-sus-muted">Categoria Detectada:</span>
                    <span className="font-semibold text-sus-ink">
                      {execution.scopeData.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-sus-muted">Confiabilidade da Triagem:</span>
                    <span className="font-mono text-sus-deep">
                      {execution.scopeData.confidence != null
                        ? `${Math.round(execution.scopeData.confidence * 100)}%`
                        : 'Indisponível'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sus-muted text-center py-4">
                Aguardando envio de pergunta para avaliação de escopo.
              </p>
            )}
          </div>
        )}

        {station.id === 'retrieval' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/90 border border-sus-ice">
              <div>
                <span className="text-[10px] text-sus-muted block">Modelo de Embeddings:</span>
                <span className="font-mono text-[11px] text-sus-ink">
                  {execution?.metrics?.embeddingModel || 'Indisponível'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-sus-muted block">Documentos:</span>
                <span className="font-bold text-sus-primary text-sm">
                  {execution?.retrievalData?.count ?? 0}
                </span>
              </div>
            </div>

            {/* Motivo de insuficiência quando aplicável */}
            {execution?.retrievalData?.status === 'insufficient' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Recuperação Insuficiente</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {execution.retrievalData.reason}
                </p>
              </div>
            )}

            {/* Lista de Documentos */}
            <SourceList
              documents={execution?.retrievalData?.documents || []}
              emptyMessage={
                execution?.retrievalData?.status === 'skipped'
                  ? 'Busca vetorial ignorada pelo controle de escopo.'
                  : 'Nenhum documento com similaridade suficiente encontrado.'
              }
            />
          </div>
        )}

        {station.id === 'generation' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-sus-ice shadow-sm space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-blue-100/60">
                <span className="text-sus-muted text-[11px]">Modelo LLM:</span>
                <span className="font-semibold text-sus-ink font-mono text-xs">
                  {execution?.generationData?.model || 'Indisponível'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-sus-muted">Tokens de Entrada (Prompt + RAG):</span>
                <span className="font-mono text-sus-ink">
                  {execution?.generationData?.promptTokens ?? 'Indisponível'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-sus-muted">Tokens Gerados:</span>
                <span className="font-mono text-sus-ink">
                  {execution?.generationData?.outputTokens ?? 'Indisponível'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-sus-muted">Tempo de Inferência:</span>
                <span className="font-mono text-sus-deep">
                  {execution?.generationData?.durationMs ? `${execution.generationData.durationMs}ms` : '—'}
                </span>
              </div>
            </div>

            {execution?.generationData?.systemDirective && (
              <div className="p-3.5 rounded-2xl bg-white/80 border border-sus-ice">
                <span className="text-[10px] font-semibold text-sus-muted uppercase tracking-wider block mb-1">
                  Diretriz do Sistema Injetada:
                </span>
                <p className="text-[11px] text-sus-ink/80 italic leading-relaxed">
                  "{execution.generationData.systemDirective}"
                </p>
              </div>
            )}
          </div>
        )}

        {station.id === 'evidence' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-sus-ice shadow-sm space-y-2">
              <span className="text-[10px] font-semibold text-sus-muted uppercase tracking-wider block">
                Auditoria de Evidências:
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    execution?.evidenceData?.verified ? 'bg-sus-success' : 'bg-amber-500'
                  }`}
                />
                <span className="font-semibold text-sus-ink text-xs">
                  {execution?.evidenceData?.verified
                    ? 'Resposta com Fontes Associadas'
                    : 'Sem Associação de Fontes Primárias'}
                </span>
              </div>
              <p className="text-[11px] text-sus-muted leading-relaxed">
                {execution?.evidenceData?.disclaimer ||
                  'Nenhuma referência foi processada nesta etapa.'}
              </p>
            </div>

            {execution?.evidenceData?.citations?.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/80 border border-sus-ice">
                <span className="text-[10px] font-semibold text-sus-muted uppercase tracking-wider block mb-1.5">
                  Órgãos e Portais Citados:
                </span>
                <ul className="space-y-1">
                  {execution.evidenceData.citations.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-sus-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-sus-primary" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {station.id === 'output' && (
          <div className="space-y-3">
            {execution?.outputData ? (
              <>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sus-ice shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sus-deep px-2 py-0.5 rounded-full bg-sus-ice border border-blue-200">
                      {execution.outputData.statusBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(execution.outputData.text)}
                      className="inline-flex items-center gap-1 text-[11px] text-sus-muted hover:text-sus-ink p-1 rounded-xl hover:bg-white"
                      title="Copiar texto da resposta"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>

                  <p className="text-xs text-sus-ink leading-relaxed font-sans bg-sus-bg/70 p-3 rounded-xl border border-sus-ice">
                    {execution.outputData.text}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-[11px] text-sus-deep leading-relaxed">
                  <strong>Síntese da Execução:</strong> {execution.outputData.summary}
                </div>
              </>
            ) : (
              <p className="text-sus-muted text-center py-4">
                A resposta será gerada e exibida aqui ao término do percurso.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rodapé do Inspetor */}
      <div className="p-3 border-t border-white/80 bg-white/60 flex items-center justify-between text-[11px] text-sus-muted">
        <span>Clique em qualquer estação 3D para inspecionar</span>
        <button
          type="button"
          onClick={onClose}
          className="text-sus-deep hover:text-sus-primary font-semibold"
        >
          Fechar
        </button>
      </div>
    </aside>
  );
}
