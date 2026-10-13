/**
 * Seletores e funções utilitárias para extração de estado do fluxo
 */
import { STATIONS_METADATA } from '../../data/demoScenarios.js';

export function getStationById(id) {
  return STATIONS_METADATA.find((s) => s.id === id) || STATIONS_METADATA[0];
}

export function getStationStatus(execution, stationId) {
  if (!execution) return 'idle';
  const stage = execution.stages.find((st) => st.id === stationId);
  return stage ? stage.status : 'idle';
}

export function isStationActive(execution, stationId) {
  return execution?.currentStageId === stationId && execution?.status === 'running';
}

export function isStationCompleted(execution, stationId) {
  const stage = execution?.stages.find((st) => st.id === stationId);
  return stage?.status === 'completed';
}

export function getExecutionStatusBadge(status) {
  switch (status) {
    case 'running':
      return { label: 'Processando Percurso', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'completed':
      return { label: 'Concluído com Sucesso', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'no_evidence':
      return { label: 'Evidências Insuficientes', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'out_of_scope':
      return { label: 'Fora do Escopo Clínico', color: 'bg-sky-100 text-sky-800 border-sky-300' };
    case 'error':
      return { label: 'Falha Técnica', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 'idle':
    default:
      return { label: 'Pronto / Ocioso', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  }
}
