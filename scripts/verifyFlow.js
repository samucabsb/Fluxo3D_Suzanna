import {
  createDemoExecution,
  advanceExecutionStage,
  createLiveExecution
} from '../src/features/flow/flowMachine.js';
import { DEMO_SCENARIOS, STATIONS_METADATA } from '../src/data/demoScenarios.js';
import {
  getStationById,
  getExecutionStatusBadge
} from '../src/features/flow/flowSelectors.js';
import {
  buildScenarioRoute,
  stepProgress,
  stageIndexAt,
  usesBypass
} from '../src/scene/trajectory.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  console.log(`✅ SUCESSO: ${message}`);
}

console.log('--- TESTE 1: Estrutura das Estações 3D ---');
assert(STATIONS_METADATA.length === 6, 'Existem exatamente 6 estações 3D configuradas');
assert(STATIONS_METADATA[0].id === 'input', 'Estação 1 é Entrada do Usuário & Sessão');
assert(STATIONS_METADATA[1].id === 'scope', 'Estação 2 é Triagem de Segurança (Guardrails Clínicos & Escopo)');
assert(STATIONS_METADATA[2].id === 'entities', 'Estação 3 é Resolução de Entidades (NLU & Território DF)');
assert(STATIONS_METADATA[3].id === 'retrieval', 'Estação 4 é Recuperação de Evidências (RAG Híbrido & Fontes Oficiais)');
assert(STATIONS_METADATA[4].id === 'generation', 'Estação 5 é Geração Fundamentada (Núcleo de LLM com Prompt Restritivo)');
assert(STATIONS_METADATA[5].id === 'output', 'Estação 6 é Entrega com Citações (Streaming, Referências & Interface)');

console.log('\n--- TESTE 2: Cenário A (Recuperação Bem-sucedida) ---');
let execA = createDemoExecution('scenario-a');
assert(execA.status === 'running', 'Cenário A inicia com status "running"');
assert(execA.question.includes('Samambaia'), 'Pergunta contém Samambaia');
assert(execA.stages.length === 6, 'Contém 6 etapas');

while (execA.status === 'running') {
  execA = advanceExecutionStage(execA);
}
assert(execA.status === 'completed', 'Cenário A conclui com status "completed"');
assert(execA.outputData.status === 'answered', 'Resultado final é "answered"');
assert(execA.retrievalData.count === 3, 'Recuperou 3 documentos oficiais');
assert(execA.retrievalData.documents[0].source.includes('SES-DF'), 'Documento é da SES-DF');
assert(execA.entitiesData != null, 'Contém dados de resolução de entidades NLU & Território DF');
assert(execA.evidenceData.verified === true, 'Evidências estão marcadas como verificadas');

console.log('\n--- TESTE 3: Cenário B (Recuperação Insuficiente) ---');
let execB = createDemoExecution('scenario-b');
assert(execB.outputData.status === 'no_evidence', 'Desfecho previsto é "no_evidence"');
assert(execB.retrievalData.count === 0, 'Documentos recuperados é 0');
assert(execB.retrievalData.reason.includes('Escalas nominais'), 'Apresenta justificativa técnica clara');
while (execB.status === 'running') {
  execB = advanceExecutionStage(execB);
}
assert(execB.status === 'completed', 'Cenário B conclui percurso');
assert(execB.outputData.statusBadge.includes('Evidências Insuficientes'), 'Badge de evidência insuficiente');

console.log('\n--- TESTE 4: Cenário C (Fora do Escopo Clínico) ---');
let execC = createDemoExecution('scenario-c');
assert(execC.scopeData.allowed === false, 'Controle de escopo bloqueia prescrição médica');
assert(execC.outputData.status === 'out_of_scope', 'Status é "out_of_scope"');
assert(execC.retrievalData.status === 'skipped', 'Busca documental é ignorada por segurança');
while (execC.status === 'running') {
  execC = advanceExecutionStage(execC);
}
assert(execC.status === 'completed', 'Cenário C conclui percurso');
assert(execC.outputData.text.includes('não diagnostica doenças nem receita medicamentos'), 'Mantém salvaguarda ética');

console.log('\n--- TESTE 5: Mapeamento de Badges e Seletores ---');
const badgeCompleted = getExecutionStatusBadge('completed');
assert(badgeCompleted.color.includes('emerald'), 'Badge de conclusão é verde/emerald');
const badgeError = getExecutionStatusBadge('error');
assert(badgeError.color.includes('rose'), 'Badge de erro é rose/vermelho');

console.log('\n--- TESTE 6: Continuidade Matemática da Trajetória (Sem Teletransporte) ---');
const routeA = buildScenarioRoute(execA.targetStages, false);
assert(routeA.curves.length === 5, 'Rota A contém exatamente 5 curvas conectadas');

// Testa 100 amostras contínuas de 0 a 1
let prevPoint = routeA.getPointAt(0);
let maxStepDist = 0;
for (let i = 1; i <= 100; i++) {
  const u = i / 100;
  const currPoint = routeA.getPointAt(u);
  assert(!isNaN(currPoint.x) && !isNaN(currPoint.y) && !isNaN(currPoint.z), `Ponto u=${u} é válido em 3D`);
  const dist = currPoint.distanceTo(prevPoint);
  if (dist > maxStepDist) maxStepDist = dist;
  assert(dist < 0.6, `Passo u=${u} é suave (distância ${dist.toFixed(3)} < 0.600)`);
  prevPoint = currPoint;
}
assert(maxStepDist > 0 && maxStepDist < 0.6, `Variação máxima de passo delimitada (${maxStepDist.toFixed(3)})`);

const routeC = buildScenarioRoute(execC.targetStages, true);
assert(routeC.curves.length === 2, 'Rota C (Bypass) contém 2 curvas contínuas');
const bypassP0 = routeC.getPointAt(0);
const bypassP1 = routeC.getPointAt(1);
assert(!isNaN(bypassP0.x) && !isNaN(bypassP1.x), 'Curva de bypass do Cenário C calculada sem descontinuidades');

console.log('\n--- TESTE 7: Progresso geométrico independente do estado lógico ---');
const lenA = routeA.getLength();
const thrA = routeA.getCurveLengths().map((l) => l / lenA);

// Pausa: progresso intocado, qualquer delta
assert(stepProgress(0.42, 5, lenA, { running: false }) === 0.42, 'Pausa preserva o progresso exato');

// Retomada continua do mesmo ponto
const resumed = stepProgress(0.42, 1 / 60, lenA, { running: true });
assert(resumed > 0.42 && resumed - 0.42 < 0.01, 'Retomada avança a partir de 0.42, sem salto');

// Independência da taxa de quadros: 1s a 60fps == 1s a 30fps
let p60 = 0;
let p30 = 0;
for (let i = 0; i < 60; i++) p60 = stepProgress(p60, 1 / 60, lenA, { running: true });
for (let i = 0; i < 30; i++) p30 = stepProgress(p30, 1 / 30, lenA, { running: true });
assert(Math.abs(p60 - p30) < 1e-9, 'Mesma posição após 1s a 60fps e a 30fps');

// Teto (modo ao vivo aguardando a API) e fim da rota
assert(stepProgress(0.5, 100, lenA, { running: true, cap: 0.6 }) === 0.6, 'Teto de espera ao vivo respeitado');
assert(stepProgress(0.99, 100, lenA, { running: true }) === 1, 'Progresso nunca passa de 1');

// Etapa derivada da posição: monotônica e coerente com as 6 estações
let lastIdx = 0;
let monotonic = true;
for (let i = 0; i <= 1000; i++) {
  const idx = stageIndexAt(i / 1000, thrA);
  if (idx < lastIdx || idx - lastIdx > 1) monotonic = false;
  lastIdx = idx;
}
assert(monotonic, 'Etapa derivada da posição é monotônica e nunca pula estação');
assert(stageIndexAt(0, thrA) === 0, 'Início da rota = etapa 0 (input)');
assert(stageIndexAt(1, thrA) === 5, 'Fim da rota A = etapa 5 (output)');

// Rotas por cenário
const routeB = buildScenarioRoute(execB.targetStages, false);
assert(routeB.curves.length === 5, 'Rota B (recuperação insuficiente) tem 5 curvas conectadas através das 6 estações');
assert(usesBypass(execC) === true, 'Demo fora do escopo usa rota de desvio');
assert(usesBypass({ mode: 'live', scopeData: { allowed: false } }) === false, 'Modo ao vivo nunca troca de rota no meio do percurso');

// Execuções novas partem do início; a posição do ponto inicial é estável
const start1 = buildScenarioRoute(createDemoExecution('scenario-a').targetStages).getPointAt(0);
const start2 = buildScenarioRoute(createDemoExecution('scenario-c').targetStages).getPointAt(0);
assert(start1.distanceTo(start2) < 1e-9, 'Todas as rotas começam na estação de entrada');

console.log('\n🎉 TODOS OS TESTES (INCLUINDO CONTINUIDADE MATEMÁTICA E PROGRESSO) FORAM APROVADOS COM SUCESSO!');
