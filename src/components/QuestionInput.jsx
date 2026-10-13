import React, { useState } from 'react';
import { Send, Sparkles, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

export default function QuestionInput({
  onRunScenario,
  onRunCustomQuery,
  isRunning,
  activeScenarioId,
  mode = 'demo',
  isGuidedTour = false
}) {
  const [customText, setCustomText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRunning) return;

    if (!customText.trim()) {
      setErrorMsg('Por favor, digite uma pergunta antes de enviar.');
      return;
    }

    setErrorMsg(null);
    onRunCustomQuery(customText.trim());
  };

  const handleSelectScenario = (scenario) => {
    if (isRunning) return;
    setErrorMsg(null);
    setCustomText(scenario.question);
    onRunScenario(scenario.id);
  };

  if (isGuidedTour) {
    return null; // O GuidedTourBar assume o rodapé durante o tour
  }

  return (
    <div className="glass-panel rounded-3xl p-4 shadow-liquid border border-white/80 space-y-2.5 w-full max-w-2xl mx-auto pointer-events-auto transition-all">
      {/* Botão de minimização e cabeçalho */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-sus-ink flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sus-primary" />
          <span>Cenários Demonstrativos SUS-DF:</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-sus-muted hidden sm:inline">
            {isCollapsed ? 'Clique para expandir' : 'Selecione para ver o percurso'}
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-xl text-sus-muted hover:text-sus-ink hover:bg-white/80 transition-colors"
            title={isCollapsed ? 'Expandir painel' : 'Recolher painel'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Cenários Pré-configurados */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_SCENARIOS.map((sc) => {
              const isSelected = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  disabled={isRunning}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-2.5 rounded-2xl text-left border transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-blue-50/90 border-sus-primary shadow-sm ring-2 ring-sus-primary/20'
                      : 'bg-white/80 border-sus-ice/80 hover:bg-white hover:border-blue-200'
                  } ${isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sc.type === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sc.type === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-sus-deep'
                      }`}
                    >
                      {sc.id.toUpperCase().replace('-', ' ')}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-sus-primary animate-ping" />
                    )}
                  </div>
                  <h4 className="text-[11px] font-semibold text-sus-ink leading-snug line-clamp-1">
                    {sc.title.split('—')[1]?.trim() || sc.title}
                  </h4>
                  <p className="text-[10px] text-sus-muted line-clamp-1 mt-0.5">
                    {sc.tag}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Formulário de Pergunta */}
          <form onSubmit={handleSubmit} className="space-y-2 pt-0.5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Digite uma dúvida sobre o SUS-DF (ex: 'Onde fica a UPA de Sobradinho?')..."
                disabled={isRunning}
                className="w-full pl-3.5 pr-28 py-2.5 rounded-2xl glass-input text-xs text-sus-ink placeholder-sus-muted/70 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />

              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="submit"
                  disabled={isRunning || !customText.trim()}
                  className="px-3.5 py-1.5 rounded-xl btn-sus-primary text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Consultar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 px-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
