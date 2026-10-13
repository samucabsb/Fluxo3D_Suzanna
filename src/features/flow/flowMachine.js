/**
 * Máquina de estados e motor de orquestração do fluxo Susana AI Visualizer
 */
import { DEMO_SCENARIOS, STATIONS_METADATA } from '../../data/demoScenarios.js';
import { sendQueryToSusana } from '../../services/susanaApi.js';

export const INITIAL_STAGES = STATIONS_METADATA.map((s) => ({
  id: s.id,
  name: s.name,
  status: 'idle', // 'idle' | 'active' | 'completed' | 'skipped' | 'warning' | 'error'
  activeAt: null,
  completedAt: null
}));

export const INITIAL_EXECUTION = {
  id: null,
  mode: 'demo', // 'demo' | 'live'
  status: 'idle', // 'idle' | 'running' | 'completed' | 'error'
  currentStageId: null,
  stageIndex: -1,
  question: '',
  scenarioId: 'scenario-a',
  metrics: {
    docsRetrieved: 0,
    durationMs: 0,
    startTime: null,
    endTime: null,
    embeddingModel: 'nomic-embed-text:latest',
    llmModel: 'llama3.2:3b',
    avgSimilarity: null
  },
  stages: INITIAL_STAGES,
  scopeData: null,
  entitiesData: null,
  retrievalData: null,
  generationData: null,
  evidenceData: null,
  outputData: null,
  error: null
};

/**
 * Cria nova execução com base no cenário de demonstração
 */
export function createDemoExecution(scenarioId = 'scenario-a') {
  const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
  const executionId = `exec-demo-${Date.now()}`;

  const stages = STATIONS_METADATA.map((s) => ({
    id: s.id,
    name: s.name,
    status: 'idle',
    activeAt: null,
    completedAt: null
  }));

  return {
    id: executionId,
    mode: 'demo',
    status: 'running',
    currentStageId: scenario.stages[0],
    stageIndex: 0,
    question: scenario.question,
    scenarioId: scenario.id,
    targetStages: scenario.stages,
    metrics: {
      ...scenario.metrics,
      startTime: Date.now(),
      endTime: null
    },
    stages,
    scopeData: scenario.scopeResult,
    entitiesData: scenario.entitiesResult,
    retrievalData: scenario.retrievalResult,
    generationData: scenario.generationResult,
    evidenceData: scenario.evidenceResult,
    outputData: scenario.outputResult,
    error: null
  };
}

/**
 * Atualiza o estado da execução para o próximo estágio
 */
export function advanceExecutionStage(prevExec) {
  if (!prevExec || prevExec.status !== 'running') return prevExec;

  const targetStages = prevExec.targetStages || STATIONS_METADATA.map((s) => s.id);
  const nextIndex = prevExec.stageIndex + 1;

  if (nextIndex >= targetStages.length) {
    // Conclusão
    const finalStages = prevExec.stages.map((st) => {
      if (targetStages.includes(st.id)) {
        return { ...st, status: 'completed', completedAt: Date.now() };
      }
      return { ...st, status: 'skipped' };
    });

    return {
      ...prevExec,
      status: 'completed',
      currentStageId: targetStages[targetStages.length - 1],
      stageIndex: targetStages.length - 1,
      stages: finalStages,
      metrics: {
        ...prevExec.metrics,
        endTime: Date.now()
      }
    };
  }

  const nextStageId = targetStages[nextIndex];

  const updatedStages = prevExec.stages.map((st) => {
    if (st.id === nextStageId) {
      return { ...st, status: 'active', activeAt: Date.now() };
    }
    const idxInTarget = targetStages.indexOf(st.id);
    if (idxInTarget !== -1 && idxInTarget < nextIndex) {
      return { ...st, status: 'completed' };
    }
    if (targetStages.includes(st.id)) {
      return { ...st, status: 'idle' };
    }
    return { ...st, status: 'skipped' };
  });

  return {
    ...prevExec,
    stageIndex: nextIndex,
    currentStageId: nextStageId,
    stages: updatedStages
  };
}

/**
 * Inicia execução com pergunta customizada ou via API real
 */
export function createLiveExecution(question) {
  const executionId = `exec-live-${Date.now()}`;
  const allStages = STATIONS_METADATA.map((s) => s.id);

  const stages = STATIONS_METADATA.map((s) => ({
    id: s.id,
    name: s.name,
    status: s.id === 'input' ? 'active' : 'idle',
    activeAt: s.id === 'input' ? Date.now() : null,
    completedAt: null
  }));

  return {
    id: executionId,
    mode: 'live',
    status: 'running',
    currentStageId: 'input',
    stageIndex: 0,
    question: question.trim(),
    scenarioId: null,
    targetStages: allStages,
    metrics: {
      docsRetrieved: 0,
      durationMs: 0,
      startTime: Date.now(),
      endTime: null,
      embeddingModel: null,
      llmModel: null,
      avgSimilarity: null
    },
    stages,
    scopeData: null,
    retrievalData: null,
    generationData: null,
    evidenceData: null,
    outputData: null,
    error: null
  };
}
