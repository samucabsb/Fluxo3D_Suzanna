import React, { useState, useEffect, useCallback, useRef } from 'react';
import World from '../scene/World';
import TopHUD from '../components/TopHUD';
import QuestionInput from '../components/QuestionInput';
import EntityInspector from '../components/EntityInspector';
import GuidedTourBar from '../components/GuidedTourBar';
import AboutModal from '../components/AboutModal';
import StageLegend from '../components/StageLegend';
import {
  INITIAL_EXECUTION,
  createDemoExecution,
  createLiveExecution
} from '../features/flow/flowMachine';
import { checkApiHealth, sendQueryToSusana } from '../services/susanaApi';
import { DEMO_SCENARIOS, STATIONS_METADATA } from '../data/demoScenarios';

// Rótulo do resultado ao vivo: nunca sugere verificação factual
function getLiveBadge(result) {
  if (result.status === 'out_of_scope') return 'Fora do Escopo';
  if (result.status === 'clarification') return 'Pedido de Esclarecimento';
  if (result.status === 'answered') {
    return result.sources?.length > 0 ? 'Resposta com Referências' : 'Resposta sem Referências';
  }
  return `Status da API: ${result.status}`;
}

export default function App() {
  const [execution, setExecution] = useState(() => createDemoExecution('scenario-a'));
  const [selectedStationId, setSelectedStationId] = useState('input');
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [mode, setMode] = useState('demo');
  const [isApiHealthy, setIsApiHealthy] = useState(false);
  const [cameraResetSignal, setCameraResetSignal] = useState(0);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Estados do Modo de Exploração Guiada
  const [isGuidedTour, setIsGuidedTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [isTourPlaying, setIsTourPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Id da última consulta ao vivo: respostas antigas (stale) são descartadas
  const liveRequestRef = useRef(null);

  // Checagem periódica da saúde da API
  useEffect(() => {
    checkApiHealth().then((healthy) => setIsApiHealthy(healthy));
    const interval = setInterval(() => {
      checkApiHealth().then((healthy) => setIsApiHealthy(healthy));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Callback acionado pela partícula quando cruza a fronteira física de uma estação
  const handleStageAdvance = useCallback((nextStageId) => {
    setExecution((prev) => {
      if (!prev || prev.status !== 'running') return prev;

      const targetStages = prev.targetStages || STATIONS_METADATA.map((s) => s.id);
      const nextIndex = targetStages.indexOf(nextStageId);
      if (nextIndex === -1) return prev;

      const updatedStages = prev.stages.map((st) => {
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
        ...prev,
        stageIndex: nextIndex,
        currentStageId: nextStageId,
        stages: updatedStages
      };
    });

    // Fora do tour o inspetor não muda sozinho (o visitante pode estar lendo outra estação)
    if (isGuidedTour) {
      setSelectedStationId(nextStageId);
      const idx = STATIONS_METADATA.findIndex((s) => s.id === nextStageId);
      if (idx !== -1) {
        setTourStepIndex(idx);
      }
    }
  }, [isGuidedTour]);

  // Callback acionado pela partícula ao concluir 100% da trajetória contínua
  const handleComplete = useCallback(() => {
    setExecution((prev) => {
      if (!prev || prev.status !== 'running') return prev;

      const targetStages = prev.targetStages || STATIONS_METADATA.map((s) => s.id);
      const finalStages = prev.stages.map((st) => {
        if (targetStages.includes(st.id)) {
          return { ...st, status: 'completed', completedAt: Date.now() };
        }
        return { ...st, status: 'skipped' };
      });

      return {
        ...prev,
        status: 'completed',
        currentStageId: targetStages[targetStages.length - 1] || 'output',
        stageIndex: targetStages.length - 1,
        stages: finalStages,
        metrics: {
          ...prev.metrics,
          endTime: Date.now()
        }
      };
    });

    if (isGuidedTour) {
      setSelectedStationId('output');
      setTourStepIndex(STATIONS_METADATA.length - 1);
      setIsTourPlaying(false);
    }
  }, [isGuidedTour]);

  // Alvo de foco da câmera quando em modo guiado
  const tourFocusTarget = isGuidedTour
    ? STATIONS_METADATA[tourStepIndex]?.cameraTarget || STATIONS_METADATA[0].cameraTarget
    : null;

  // Ativação / Desativação da Exploração Guiada (sem efeitos colaterais dentro de updater)
  const handleToggleGuidedTour = useCallback(() => {
    if (!isGuidedTour) {
      setExecution(createDemoExecution('scenario-a'));
      setMode('demo');
      setTourStepIndex(0);
      setIsTourPlaying(true);
      setIsPaused(false);
      setSelectedStationId(STATIONS_METADATA[0].id);
      setInspectorOpen(true);
      setIsGuidedTour(true);
    } else {
      setIsGuidedTour(false);
      setIsTourPlaying(false);
      setIsPaused(false);
      setCameraResetSignal((s) => s + 1);
    }
  }, [isGuidedTour]);

  // O tour navega/seleciona; quem avança a execução é sempre a partícula (fonte única da posição)
  const handleTourNextStep = useCallback(() => {
    if (tourStepIndex < STATIONS_METADATA.length - 1) {
      const nextIndex = tourStepIndex + 1;
      setTourStepIndex(nextIndex);
      setSelectedStationId(STATIONS_METADATA[nextIndex].id);
    }
  }, [tourStepIndex]);

  const handleTourPrevStep = useCallback(() => {
    if (tourStepIndex > 0) {
      const prevIndex = tourStepIndex - 1;
      setTourStepIndex(prevIndex);
      setSelectedStationId(STATIONS_METADATA[prevIndex].id);
    }
  }, [tourStepIndex]);

  // Executa um cenário demonstrativo com reinício suave
  const handleRunScenario = useCallback((scenarioId) => {
    liveRequestRef.current = null; // invalida resposta ao vivo pendente
    setIsGuidedTour(false);
    setIsPaused(false);
    const newExec = createDemoExecution(scenarioId);
    setExecution(newExec);
    setSelectedStationId('input');
    setInspectorOpen(true);
  }, []);

  // Executa uma consulta personalizada (ao vivo ou simulada)
  const handleRunCustomQuery = useCallback(async (question) => {
    setIsGuidedTour(false);
    setIsPaused(false);

    if (mode === 'live') {
      const liveExec = createLiveExecution(question);
      setExecution(liveExec);
      setSelectedStationId('input');
      setInspectorOpen(true);

      liveRequestRef.current = liveExec.id;

      // A API não emite eventos intermediários: a partícula é só uma representação didática
      // e aguarda na geração até a resposta chegar. Nenhuma etapa é simulada por timer.
      const result = await sendQueryToSusana(question);
      if (liveRequestRef.current !== liveExec.id) return; // consulta mais nova ou cenário demo assumiu

      if (result.success) {
        setExecution((prev) => ({
          ...prev,
          status: 'completed',
          currentStageId: 'output',
          metrics: {
            ...prev.metrics,
            durationMs: result.durationMs,
            docsRetrieved: result.sources?.length || 0,
            endTime: Date.now()
          },
          stages: prev.stages.map((s) => ({ ...s, status: 'completed' })),
          scopeData: {
            allowed: result.status !== 'out_of_scope',
            category: result.intent || 'Consulta de Saúde Pública',
            confidence: null,
            notes: result.status === 'out_of_scope'
              ? 'Pergunta classificada como fora do escopo pelo backend.'
              : 'Pergunta aceita e processada pelo backend da Susana.'
          },
          retrievalData: {
            status: result.sources?.length > 0 ? 'found' : 'insufficient',
            count: result.sources?.length || 0,
            reason: result.sources?.length > 0 ? null : 'A API não retornou referências para esta pergunta.',
            documents: (result.sources || []).map((s, idx) => ({
              id: s.id || `live-doc-${idx}`,
              title: s.title || 'Documento sem título',
              source: s.source || s.origin || null,
              url: s.url || null,
              updatedAt: s.updated_at || null,
              score: typeof s.score === 'number' ? s.score : null,
              excerpt: s.excerpt || s.content || result.evidence?.[idx]?.content || null
            }))
          },
          generationData: {
            model: null,
            promptTokens: null,
            outputTokens: null,
            durationMs: result.durationMs,
            systemDirective: 'Resposta em linguagem natural gerada pelo serviço RAG da Susana.'
          },
          evidenceData: {
            verified: (result.sources?.length || 0) > 0,
            citedSourcesCount: result.sources?.length || 0,
            citations: (result.sources || []).map((s) => s.title || s.source).filter(Boolean),
            disclaimer: 'Referências associadas pela API; não há verificação factual independente.'
          },
          outputData: {
            status: result.status,
            statusBadge: getLiveBadge(result),
            text: result.reply,
            summary: `Tempo medido no navegador: ${result.durationMs} ms (inclui rede).`
          }
        }));
        setSelectedStationId('output');
      } else {
        setExecution((prev) => ({
          ...prev,
          status: 'error',
          error: result.error,
          currentStageId: 'output',
          outputData: {
            status: 'error',
            statusBadge: 'Erro de Conexão com a API',
            text: `${result.error} (Você pode alternar para o Modo Demonstração no topo para continuar a visualização).`,
            summary: 'Falha na comunicação com o serviço FastAPI.'
          }
        }));
        setSelectedStationId('output');
      }
    } else {
      // Demonstração: palavras de pedido clínico levam ao cenário "fora do escopo"
      const isClinical = /\b(dor|rem[ée]dio|medicamento|receita|diagn[óo]stico)\b/i.test(question);
      const matched = DEMO_SCENARIOS.find((sc) => sc.id === (isClinical ? 'scenario-c' : 'scenario-a'))
        || DEMO_SCENARIOS[0];

      const newExec = {
        ...createDemoExecution(matched.id),
        question: question
      };
      setExecution(newExec);
      setSelectedStationId('input');
      setInspectorOpen(true);
    }
  }, [mode, handleStageAdvance]);

  const handleToggleMode = () => {
    const nextMode = mode === 'demo' ? 'live' : 'demo';
    setMode(nextMode);
    if (nextMode === 'demo') {
      handleRunScenario('scenario-a');
    }
  };

  const handleResetExecution = () => {
    setIsPaused(false);
    if (execution?.scenarioId) {
      handleRunScenario(execution.scenarioId);
    } else {
      handleRunScenario('scenario-a');
    }
  };

  const handleResetCamera = () => {
    setIsGuidedTour(false);
    setCameraResetSignal((prev) => prev + 1);
  };

  const handleSelectStation = (stationId) => {
    setSelectedStationId(stationId);
    setInspectorOpen(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sus-bg flex flex-col font-sans select-none">
      {/* Barra Superior (HUD) */}
      <TopHUD
        execution={execution}
        mode={mode}
        onToggleMode={handleToggleMode}
        isApiHealthy={isApiHealthy}
        onResetExecution={handleResetExecution}
        onResetCamera={handleResetCamera}
        onOpenHelp={() => setAboutModalOpen(true)}
        isGuidedTour={isGuidedTour}
        onToggleGuidedTour={handleToggleGuidedTour}
      />

      {/* Área Central: Mundo 3D + HUD Sobreposto */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Renderizador 3D Three.js com percurso contínuo e câmera desacoplada */}
        <World
          execution={execution}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
          cameraResetSignal={cameraResetSignal}
          isGuidedTour={isGuidedTour}
          tourFocusTarget={tourFocusTarget}
          isPaused={isPaused}
          onStageAdvance={handleStageAdvance}
          onComplete={handleComplete}
        />

        {/* Menu Lateral / Legenda das 6 Macroetapas */}
        <StageLegend
          execution={execution}
          selectedStationId={selectedStationId}
          onSelectStation={handleSelectStation}
        />

        {/* Painel Inferior: Visita Guiada ou Entrada de Pergunta */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full px-4 z-10 pointer-events-none">
          {isGuidedTour ? (
            <GuidedTourBar
              currentStepIndex={tourStepIndex}
              isPlaying={isTourPlaying}
              onTogglePlay={() => {
                const nextPlaying = !isTourPlaying;
                setIsTourPlaying(nextPlaying);
                setIsPaused(!nextPlaying);
              }}
              onNextStep={handleTourNextStep}
              onPrevStep={handleTourPrevStep}
              onExitTour={() => handleToggleGuidedTour()}
              onSelectStation={handleSelectStation}
            />
          ) : (
            <QuestionInput
              onRunScenario={handleRunScenario}
              onRunCustomQuery={handleRunCustomQuery}
              isRunning={execution?.status === 'running'}
              activeScenarioId={execution?.scenarioId}
              mode={mode}
              isGuidedTour={isGuidedTour}
            />
          )}
        </div>

        {/* Inspetor Lateral Contextual */}
        {inspectorOpen && (
          <div className="absolute top-0 right-0 h-full z-20 pointer-events-auto">
            <EntityInspector
              selectedStationId={selectedStationId}
              execution={execution}
              onClose={() => setInspectorOpen(false)}
            />
          </div>
        )}

        {/* Botão flutuante para reabrir o Inspetor se estiver fechado */}
        {!inspectorOpen && (
          <button
            type="button"
            onClick={() => setInspectorOpen(true)}
            className="absolute top-4 right-4 z-10 px-3 py-2 rounded-2xl glass-panel text-xs font-semibold text-sus-ink hover:text-sus-deep shadow-md flex items-center gap-2 pointer-events-auto transition-all"
          >
            <span>Abrir Inspetor</span>
          </button>
        )}
      </div>

      {/* Modal Didático de Divulgação Científica */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}
