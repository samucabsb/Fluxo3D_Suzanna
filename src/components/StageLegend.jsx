import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react';
import { STATIONS_METADATA } from '../data/demoScenarios';

export default function StageLegend({
  execution,
  selectedStationId,
  onSelectStation
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="absolute top-4 left-4 z-20 pointer-events-auto transition-all duration-300">
      <div className="glass-panel shadow-liquid border border-white/80 rounded-2xl overflow-hidden backdrop-blur-md bg-white/90">
        {/* Cabeçalho */}
        <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 bg-white/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-sus-deep">
              <Layers className="w-3.5 h-3.5 text-sus-primary" />
            </div>
            {isOpen && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  6 Etapas do Pipeline
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  Fluxo SUSANA RAG
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isOpen ? 'Recolher Legenda' : 'Expandir Legenda'}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Lista das 6 Etapas */}
        <div className={`p-1.5 space-y-1 ${isOpen ? 'w-64 max-w-[calc(100vw-2rem)]' : 'w-auto'}`}>
          {STATIONS_METADATA.map((st, index) => {
            const isSelected = selectedStationId === st.id;
            const stageState = execution?.stages?.find((s) => s.id === st.id);
            const status = stageState?.status || 'idle';
            const isActive = execution?.currentStageId === st.id && execution?.status === 'running';

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation?.(st.id)}
                title={st.name}
                className={`w-full text-left rounded-xl transition-all flex items-center gap-2.5 p-2 ${
                  isSelected
                    ? 'bg-blue-50/90 border border-blue-300 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* Indicador Numérico */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 animate-pulse'
                      : status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : isSelected
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {status === 'completed' && !isActive ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Conteúdo Expandido */}
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {st.name}
                      </h4>
                      {/* Ponto de status visual */}
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping flex-shrink-0" />
                      ) : status === 'completed' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {st.subtitle}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Rodapé Didático */}
        {isOpen && (
          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[10px] text-slate-500">
            <span>Clique para ver no 3D</span>
            <span className="font-semibold text-blue-700">6 macroetapas</span>
          </div>
        )}
      </div>
    </aside>
  );
}
