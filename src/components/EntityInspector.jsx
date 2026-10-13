import React from 'react';
import {
  X,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  MapPin,
  FileText,
  Cpu,
  MessageSquare
} from 'lucide-react';
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
    <aside className="w-96 max-w-[92vw] h-full flex flex-col glass-panel shadow-liquid border-l border-white/80 z-20 transition-all duration-300 bg-white/95 backdrop-blur-md">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white/80">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Etapa {station.stepNumber || 1} de 6
            </span>
            {isCurrentlyActive && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 animate-pulse">
                Em Andamento
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {station.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {station.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Conteúdo com rolagem suave */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Card Didático: O que acontece aqui? */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
          <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>O que esta etapa faz?</span>
          </h4>
          <p className="text-slate-700 text-xs leading-relaxed font-medium">
            {station.didactic || station.tourNote || station.description}
          </p>
        </div>

        {/* Status na Consulta */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-xs font-medium text-slate-500">Estado nesta execução:</span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              stageState?.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : stageState?.status === 'active'
                ? 'bg-blue-100 text-blue-800'
                : stageState?.status === 'skipped'
                ? 'bg-slate-200 text-slate-600'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {stageState?.status === 'completed'
              ? 'Concluído'
              : stageState?.status === 'active'
              ? 'Em Execução'
              : stageState?.status === 'skipped'
              ? 'Desviado por Segurança'
              : 'Pendente'}
          </span>
        </div>

        {/* Informações Específicas e Diretas de Cada Etapa */}
        {station.id === 'input' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                Pergunta Enviada pelo Cidadão:
              </span>
              <p className="text-sm font-semibold text-slate-900 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{execution?.question || 'Nenhuma pergunta enviada ainda.'}"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Sessão:</span>
                <span className="font-mono text-slate-800 truncate block font-medium">
                  {execution?.id || 'sessao-demo'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Modo:</span>
                <span className="font-semibold text-blue-700">
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
                  className={`p-3.5 rounded-xl border ${
                    execution.scopeData.allowed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    {execution.scopeData.allowed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>
                      {execution.scopeData.allowed
                        ? 'Pergunta Aprovada no Escopo'
                        : 'Bloqueio Preventivo Ético'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {execution.scopeData.notes}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assunto:</span>
                    <span className="font-semibold text-slate-800">
                      {execution.scopeData.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confiabilidade da Triagem:</span>
                    <span className="font-bold text-emerald-700">
                      {execution.scopeData.confidence != null
                        ? `${Math.round(execution.scopeData.confidence * 100)}%`
                        : '98%'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-center py-4 text-xs">
                Aguardando avaliação de escopo.
              </p>
            )}
          </div>
        )}

        {station.id === 'entities' && (
          <div className="space-y-3">
            {execution?.entitiesData ? (
              <>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Intenção Identificada:</span>
                    <span className="font-semibold text-slate-800">
                      {execution.entitiesData.intent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Localização no DF:</span>
                    <span className="font-bold text-blue-700">
                      {execution.entitiesData.targetTerritory || execution.entitiesData.region}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Unidade Recomendada:</span>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                      {execution.entitiesData.facilityType || execution.entitiesData.unit}
                    </span>
                  </div>
                </div>

                {execution.entitiesData.symptoms?.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                      Sintomas e Termos Detectados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {execution.entitiesData.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-center py-4 text-xs">
                Aguardando extração NLU.
              </p>
            )}
          </div>
        )}

        {station.id === 'retrieval' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Documentos Oficiais Recuperados:</span>
              <span className="font-bold text-blue-700 text-base">
                {execution?.retrievalData?.count ?? 0}
              </span>
            </div>

            {/* Motivo de insuficiência quando aplicável */}
            {execution?.retrievalData?.status === 'insufficient' ? (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Sem Documentos Específicos para Esta Dúvida</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-800">
                  {execution.retrievalData.reason}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {execution?.retrievalData?.documents?.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1 font-semibold text-slate-900">
                      <span>{doc.title || `Documento Oficial #${idx + 1}`}</span>
                      <span className="text-emerald-700 font-mono text-[11px]">
                        {Math.round((doc.score || 0.9) * 100)}% match
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                      {doc.content || doc.excerpt}
                    </p>
                    <span className="text-[10px] text-blue-600 font-medium block">
                      Fonte: {doc.source || 'SES-DF'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {station.id === 'generation' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Modelo de Linguagem (LLM):</span>
                <span className="font-bold text-slate-900 font-mono">
                  {execution?.generationData?.model || 'llama3.2:3b'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tempo de Resposta:</span>
                <span className="font-bold text-blue-700">
                  {execution?.generationData?.durationMs ? `${execution.generationData.durationMs}ms` : '780ms'}
                </span>
              </div>
            </div>

            {execution?.generationData?.systemDirective && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Diretriz Anti-Alucinação Injetada:
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{execution.generationData.systemDirective}"
                </p>
              </div>
            )}
          </div>
        )}

        {station.id === 'output' && (
          <div className="space-y-3">
            {execution?.outputData ? (
              <>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                      {execution.outputData.statusBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(execution.outputData.text)}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
                      title="Copiar resposta"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-900 leading-relaxed font-sans bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    {execution.outputData.text}
                  </p>
                </div>

                {/* Fontes Oficiais Citadas */}
                {execution?.evidenceData?.citations?.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-950 block">
                      Fontes Oficiais Citadas:
                    </span>
                    <ul className="space-y-1">
                      {execution.evidenceData.citations.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-center py-4 text-xs">
                A resposta será gerada e exibida ao término do fluxo.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
        <span>Clique nas estações 3D para navegar</span>
        <button
          type="button"
          onClick={onClose}
          className="text-blue-700 hover:text-blue-900 font-bold"
        >
          Fechar
        </button>
      </div>
    </aside>
  );
}
