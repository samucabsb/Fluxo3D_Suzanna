import React, { useState, useEffect } from 'react';
import {
  Compass,
  RotateCcw,
  Layers,
  Clock,
  Radio,
  Server,
  HelpCircle,
  Sparkles,
  Droplet
} from 'lucide-react';
import StatusIndicator from './StatusIndicator';

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value === displayValue) return;
    const diff = value - displayValue;
    const step = Math.ceil(Math.abs(diff) / 8) || 1;
    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev < value) return Math.min(prev + step, value);
        if (prev > value) return Math.max(prev - step, value);
        clearInterval(timer);
        return value;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [value, displayValue]);

  return <span>{displayValue}</span>;
}

export default function TopHUD({
  execution,
  mode,
  onToggleMode,
  isApiHealthy,
  onResetExecution,
  onResetCamera,
  onOpenHelp,
  isGuidedTour,
  onToggleGuidedTour
}) {
  const docsCount = execution?.retrievalData?.count ?? execution?.metrics?.docsRetrieved ?? 0;
  const durationMs = execution?.metrics?.durationMs ?? 0;

  return (
    <header className="w-full glass-panel border-b border-white/80 px-4 py-2.5 flex items-center justify-between gap-4 select-none z-10 pointer-events-auto">
      {/* Lado Esquerdo: Marca SUS Digital — Clara como água */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl btn-sus-primary flex items-center justify-center text-white shadow-liquid">
          <Droplet className="w-5 h-5 fill-white/20" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-sus-ink tracking-tight font-sans">
              Susana AI Visualizer
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sus-ice text-sus-deep border border-sus-light/30">
              SUS Digital
            </span>
          </div>
          <p className="text-[11px] text-sus-muted leading-none">
            Saúde pública, clara como água • RAG 3D
          </p>
        </div>
      </div>

      {/* Centro: Métricas da Consulta */}
      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/70 border border-white/90 shadow-sm text-xs">
        <StatusIndicator status={execution?.status || 'idle'} />

        <div className="h-4 w-px bg-blue-100" />

        <div className="flex items-center gap-1.5 text-sus-muted" title="Documentos recuperados na base oficial">
          <Layers className="w-3.5 h-3.5 text-sus-primary" />
          <span>Docs:</span>
          <span className="font-semibold text-sus-ink font-mono">
            {execution?.status === 'idle' ? '—' : <AnimatedNumber value={docsCount} />}
          </span>
        </div>

        <div className="h-4 w-px bg-blue-100" />

        <div className="flex items-center gap-1.5 text-sus-muted" title="Tempo total do percurso">
          <Clock className="w-3.5 h-3.5 text-sus-deep" />
          <span>Tempo:</span>
          <span className="font-semibold text-sus-ink font-mono">
            {durationMs > 0 ? (
              <>
                <AnimatedNumber value={durationMs} />
                <span>ms</span>
              </>
            ) : '—'}
          </span>
        </div>
      </div>

      {/* Lado Direito: Modos Operacionais & Ações */}
      <div className="flex items-center gap-2">
        {/* Ativação do Modo de Exploração Guiada */}
        <button
          type="button"
          onClick={onToggleGuidedTour}
          className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            isGuidedTour
              ? 'btn-sus-primary shadow-liquid'
              : 'bg-white/90 hover:bg-white text-sus-ink border border-sus-ice shadow-sm'
          }`}
          title="Iniciar ou pausar tour explicativo guiado passo a passo"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGuidedTour ? 'text-white animate-spin' : 'text-sus-primary'}`} />
          <span className="hidden sm:inline">{isGuidedTour ? 'Visita Ativa' : 'Visita Guiada'}</span>
        </button>

        {/* Seletor de Modo: Demonstração / Ao Vivo */}
        <button
          type="button"
          onClick={onToggleMode}
          className={`px-2.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            mode === 'live'
              ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-sm'
              : 'bg-white/90 text-sus-muted border-sus-ice hover:bg-white'
          }`}
          title="Alternar entre Demonstração e Conexão HTTP FastAPI"
        >
          {mode === 'live' ? (
            <>
              <Server className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Ao Vivo</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isApiHealthy ? 'bg-sus-success' : 'bg-rose-500'
                }`}
                title={isApiHealthy ? 'Backend FastAPI Conectado' : 'Backend Inacessível'}
              />
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-sus-primary" />
              <span>Demo</span>
            </>
          )}
        </button>

        {/* Restaurar Câmera Isométrica */}
        <button
          type="button"
          onClick={onResetCamera}
          className="p-1.5 rounded-2xl bg-white/90 border border-sus-ice text-sus-muted hover:text-sus-deep hover:bg-white transition-colors shadow-sm"
          title="Centralizar e restaurar visão isométrica"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Reiniciar Consulta */}
        <button
          type="button"
          onClick={onResetExecution}
          className="p-1.5 rounded-2xl bg-white/90 border border-sus-ice text-sus-muted hover:text-sus-deep hover:bg-white transition-colors shadow-sm"
          title="Reiniciar consulta atual"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Ajuda / Sobre */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="p-1.5 rounded-2xl bg-white/90 border border-sus-ice text-sus-muted hover:text-sus-deep hover:bg-white transition-colors shadow-sm"
          title="Informações sobre a Susana e a Feira de Ciências"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
