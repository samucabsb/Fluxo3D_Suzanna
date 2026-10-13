import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios.js';

// Velocidade visual (unidades de mundo por segundo). Didática: não representa tempo real de processamento.
export const PARTICLE_SPEED = 3.6;
// Velocidade calma específica para a visita guiada (permite leitura e assimilação de cada etapa)
export const GUIDED_TOUR_SPEED = 1.4;
// Velocidade de "alcance" quando a execução já terminou mas a partícula ainda não chegou ao fim.
export const CATCH_UP_SPEED = 18;

export function getStationPos(id) {
  const st = STATIONS_METADATA.find((s) => s.id === id);
  return st ? [...st.position] : [0, 0, 0];
}

/**
 * Rota alternativa (desvio de segurança) só existe em cenários de demonstração.
 * No modo ao vivo a rota é fixa: o backend só informa o escopo no final, e trocar a
 * curva no meio do percurso causaria teletransporte.
 */
export function usesBypass(execution) {
  return execution?.mode !== 'live' && execution?.scopeData?.allowed === false;
}

/**
 * Cria a curva matemática exata (QuadraticBezierCurve3) entre duas estações
 */
export function createSegmentCurve(fromId, toId, isBypass = false) {
  const fromPos = getStationPos(fromId);
  const toPos = getStationPos(toId);

  const p1 = new THREE.Vector3(fromPos[0], 0.26, fromPos[2]);
  const p2 = new THREE.Vector3(toPos[0], 0.26, toPos[2]);

  const midX = (p1.x + p2.x) / 2;
  const midZ = (p1.z + p2.z) / 2;
  const offsetZ = isBypass ? 3.8 : 0.5;
  const midY = isBypass ? 0.42 : 0.32;
  const mid = new THREE.Vector3(midX, midY, midZ + offsetZ);

  return new THREE.QuadraticBezierCurve3(p1, mid, p2);
}

/**
 * Constrói uma trajetória contínua (CurvePath) para a rota completa da execução
 */
export function buildScenarioRoute(stages, isOutOfScope = false) {
  const path = new THREE.CurvePath();
  if (!stages || stages.length < 2) return path;

  for (let i = 0; i < stages.length - 1; i++) {
    const from = stages[i];
    const to = stages[i + 1];
    const bypass = isOutOfScope && from === 'scope' && to === 'output';
    path.add(createSegmentCurve(from, to, bypass));
  }

  return path;
}

/**
 * Multiplicador cinemático de velocidade por nó:
 * Desacelera suavemente nas estações (leitura/processamento de dados)
 * e acelera ao disparar pelos dutos inter-estações.
 */
export function getLocalSpeedMultiplier(progress, thresholds) {
  if (!thresholds || thresholds.length === 0) return 1;
  let start = 0;
  for (let i = 0; i < thresholds.length; i++) {
    const end = thresholds[i];
    if (progress <= end || i === thresholds.length - 1) {
      const span = Math.max(end - start, 1e-5);
      const uLocal = Math.min(Math.max((progress - start) / span, 0), 1);
      return 0.35 + 0.65 * Math.sin(Math.PI * uLocal);
    }
    start = end;
  }
  return 1;
}

/**
 * Avança o progresso geométrico (0..1). Depende de delta, velocidade e comprimento da rota.
 * Quando thresholds é passado, aplica easing cinemático entre estações.
 */
export function stepProgress(progress, delta, routeLength, { running, speed = PARTICLE_SPEED, cap = 1, thresholds = null }) {
  if (!running || routeLength <= 0) return progress;
  const mult = thresholds ? getLocalSpeedMultiplier(progress, thresholds) : 1;
  return Math.min(progress + (delta * speed * mult) / routeLength, cap);
}

/**
 * Etapa lógica derivada da posição: quantas fronteiras de estação já foram cruzadas.
 * `thresholds` = comprimentos acumulados normalizados de cada curva (getCurveLengths / total).
 */
export function stageIndexAt(progress, thresholds) {
  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (progress >= thresholds[i] - 1e-9) idx = i + 1;
  }
  return idx;
}
