import React from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { STATIONS_METADATA } from '../data/demoScenarios';

export default function GuidedTourBar({
  currentStepIndex,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onExitTour,
  onSelectStation
}) {
  const currentStation = STATIONS_METADATA[currentStepIndex] || STATIONS_METADATA[0];
  const totalSteps = STATIONS_METADATA.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-4 shadow-liquid border border-white/80 pointer-events-auto transition-all animate-fadeIn">
      {/* Barra de progresso da visita */}
      <div className="w-full h-1.5 bg-blue-100/80 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-sus-deep via-sus-primary to-sus-light transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Cabeçalho da visita com controles */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sus-ice text-sus-deep uppercase tracking-wider flex items-center gap-1 border border-blue-200">
            <Sparkles className="w-3 h-3 text-sus-primary" />
            <span>Visita Guiada SUS Digital</span>
          </span>
          <span className="text-xs font-semibold text-sus-muted">
            Etapa {currentStepIndex + 1} de {totalSteps}
          </span>
        </div>

        <button
          type="button"
          onClick={onExitTour}
          className="p-1.5 rounded-xl text-sus-muted hover:text-sus-ink hover:bg-white/80 transition-colors flex items-center gap-1 text-xs"
          title="Encerrar visita e liberar controle da câmera"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Modo Livre</span>
        </button>
      </div>

      {/* Título e Explicação Didática */}
      <div className="mb-3.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {currentStation.stepNumber}
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {currentStation.name}
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            ({currentStation.subtitle})
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white/90 p-3 rounded-2xl border border-slate-100">
          {currentStation.didactic || currentStation.tourNote}
        </p>
      </div>

      {/* Barra de Ações: Navegação e Play/Pause */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-blue-100/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-2xl border border-sus-ice bg-white hover:bg-sus-bg disabled:opacity-40 disabled:cursor-not-allowed text-sus-ink transition-all shadow-sm"
            title="Etapa anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'btn-sus-primary text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Continuar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-2xl border border-sus-ice bg-white hover:bg-sus-bg disabled:opacity-40 disabled:cursor-not-allowed text-sus-ink transition-all shadow-sm"
            title="Próxima etapa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectStation(currentStation.id)}
          className="text-xs font-medium text-sus-deep hover:text-sus-primary hover:underline flex items-center gap-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ver no Inspetor</span>
        </button>
      </div>
    </div>
  );
}
