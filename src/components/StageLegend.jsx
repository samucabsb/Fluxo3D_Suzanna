import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Compass,
  Database,
  Cpu,
  Share2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { STATIONS_METADATA } from '../data/demoScenarios';

// Ícones técnicos representativos de cada uma das 6 macroetapas
const STAGE_ICONS = {
  input: MessageSquare,
  scope: ShieldCheck,
  entities: Compass,
  retrieval: Database,
  generation: Cpu,
  output: Share2,
};

export default function StageLegend({
  execution,
  selectedStationId,
  onSelectStation
}) {
  const [isOpen, setIsOpen] = useState(true);

  const stages = STATIONS_METADATA;

  return (
    <aside
      className={`absolute top-4 left-4 z-20 transition-all duration-300 pointer-events-auto ${
        isOpen ? 'w-80 max-w-[calc(100vw-2rem)]' : 'w-auto'
      }`}
    >
      <div className="glass-panel shadow-liquid border border-white/80 rounded-2xl overflow-hidden backdrop-blur-md bg-white/85">
        {/* Cabeçalho da Legenda Lateral */}
        <div className="p-3 border-b border-white/80 flex items-center justify-between gap-2 bg-white/70">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-sus-deep flex-shrink-0">
              <Layers className="w-4 h-4 text-sus-primary" />
            </div>
            {isOpen && (
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sus-deep block">
                  Legenda do Dashboard 3D
                </span>
                <h3 className="text-xs font-bold text-sus-ink truncate">
                  6 Macroetapas do Pipeline
                </h3>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-xl text-sus-muted hover:text-sus-ink hover:bg-white/80 transition-colors flex-shrink-0"
            title={isOpen ? 'Recolher Legenda' : 'Expandir Legenda'}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Lista das 6 Macroetapas */}
        {isOpen && (
          <div className="p-2 space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {stages.map((st, index) => {
              const Icon = STAGE_ICONS[st.id] || Layers;
              const isSelected = selectedStationId === st.id;
              const stageState = execution?.stages?.find((s) => s.id === st.id);
              const status = stageState?.status || 'idle';
              const isActive = execution?.currentStageId === st.id && execution?.status === 'running';

              // Badges e cores de estado
              let statusBadge = (
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Pendente</span>
                </span>
              );

              if (isActive || status === 'active') {
                statusBadge = (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-sus-primary animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>Em Execução</span>
                  </span>
                );
              } else if (status === 'completed') {
                statusBadge = (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Concluído</span>
                  </span>
                );
              } else if (status === 'skipped') {
                statusBadge = (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <AlertTriangle className="w-3 h-3 text-slate-400" />
                    <span>Ignorado</span>
                  </span>
                );
              }

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStation?.(st.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 border ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-300 shadow-sm'
                      : 'bg-white/60 hover:bg-white/90 border-white/60'
                  }`}
                >
                  {/* Número de Ordem e Ícone */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-sus-primary text-white shadow-sm ring-2 ring-blue-300 ring-offset-1'
                        : status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSelected
                        ? 'bg-blue-100 text-sus-deep'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Informações da Etapa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-sus-deep truncate">
                        {st.subtitle}
                      </span>
                      {statusBadge}
                    </div>

                    <h4 className="text-xs font-bold text-sus-ink leading-snug line-clamp-2">
                      {st.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Rodapé Informativo */}
        {isOpen && (
          <div className="p-2.5 border-t border-white/80 bg-white/60 flex items-center justify-between text-[10px] text-sus-muted">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sus-primary animate-pulse" />
              <span>Clique para focar no 3D</span>
            </span>
            <span className="font-mono text-sus-deep font-semibold">6 Etapas</span>
          </div>
        )}
      </div>
    </aside>
  );
}
