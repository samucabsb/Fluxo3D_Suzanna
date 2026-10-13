import React, { useMemo } from 'react';
import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios';

export const PIPELINE_SEGMENTS = [
  { from: 'input', to: 'scope', id: 'seg-input-scope' },
  { from: 'scope', to: 'retrieval', id: 'seg-scope-retrieval' },
  { from: 'retrieval', to: 'generation', id: 'seg-retrieval-generation' },
  { from: 'generation', to: 'evidence', id: 'seg-generation-evidence' },
  { from: 'evidence', to: 'output', id: 'seg-evidence-output' },
  // Desvio de segurança ética (quando fora do escopo - Cenário C)
  { from: 'scope', to: 'output', id: 'seg-scope-output-bypass', isBypass: true },
  // Segmento direto do modelo para a saída (quando sem evidências para auditar - Cenário B)
  { from: 'generation', to: 'output', id: 'seg-generation-output-direct', isDirect: true }
];

import {
  getStationPos,
  createSegmentCurve,
  buildScenarioRoute,
  usesBypass
} from './trajectory';

export { getStationPos, createSegmentCurve, buildScenarioRoute };

function HighTechConduit({ segment, isSegmentActive, isCompleted, isSuccess, isBypass, isWarning, isError }) {
  const curve = useMemo(() => {
    return createSegmentCurve(segment.from, segment.to, isBypass);
  }, [segment.from, segment.to, isBypass]);

  const midPoint = useMemo(() => {
    return curve.getPoint(0.5);
  }, [curve]);

  // Geometria estrutural do duto
  const outerTubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 36, isBypass ? 0.05 : 0.07, 12, false);
  }, [curve, isBypass]);

  // Núcleo luminoso interno
  const innerCoreGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 36, isBypass ? 0.025 : 0.035, 8, false);
  }, [curve, isBypass]);

  // Identidade cromática SUS Digital
  const { outerColor, coreColor, coreEmissive, opacity } = useMemo(() => {
    if (isError) {
      return { outerColor: '#dc2626', coreColor: '#fca5a5', coreEmissive: 1.2, opacity: 0.95 };
    }
    if (isBypass) {
      if (isSegmentActive) {
        return { outerColor: '#d97706', coreColor: '#fde047', coreEmissive: 1.4, opacity: 0.95 };
      }
      if (isCompleted) {
        return { outerColor: '#b45309', coreColor: '#fbbf24', coreEmissive: 0.8, opacity: 0.85 };
      }
      return { outerColor: '#dbeafe', coreColor: '#bfdbfe', coreEmissive: 0.1, opacity: 0.2 };
    }
    if (isSegmentActive) {
      // Azul Primário SUS Digital ativo
      return { outerColor: '#1e40af', coreColor: '#60a5fa', coreEmissive: 1.5, opacity: 0.95 };
    }
    if (isCompleted) {
      // Verde apenas quando a resposta foi de fato entregue; caso contrário azul de trecho percorrido
      return isSuccess
        ? { outerColor: '#15803d', coreColor: '#4ade80', coreEmissive: 0.8, opacity: 0.85 }
        : { outerColor: '#1e40af', coreColor: '#93c5fd', coreEmissive: 0.6, opacity: 0.85 };
    }
    if (isWarning) {
      return { outerColor: '#d97706', coreColor: '#fcd34d', coreEmissive: 0.8, opacity: 0.75 };
    }
    // Inativo / Disponível em azul-gelo translúcido
    return { outerColor: '#93c5fd', coreColor: '#dbeafe', coreEmissive: 0.1, opacity: 0.35 };
  }, [isBypass, isSegmentActive, isCompleted, isSuccess, isWarning, isError]);

  return (
    <group>
      {/* 1. Duto de proteção em vidro óptico translúcido SUS Digital */}
      <mesh geometry={outerTubeGeo} receiveShadow>
        <meshPhysicalMaterial
          color={outerColor}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          thickness={0.4}
          ior={1.45}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* 2. Núcleo óptico condutor de dados emissivo */}
      <mesh geometry={innerCoreGeo}>
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={coreEmissive}
          roughness={0.1}
        />
      </mesh>

      {/* 3. Suporte vertical estrutural no piso com anel metálico */}
      <group position={[midPoint.x, midPoint.y / 2, midPoint.z]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.065, midPoint.y, 16]} />
          <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, midPoint.y / 4, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 16]} />
          <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 4. Pulso de energia luminoso quando ativo */}
      {isSegmentActive && (
        <mesh geometry={outerTubeGeo}>
          <meshBasicMaterial
            color={coreColor}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      )}
    </group>
  );
}

export default function DataPath({ execution }) {
  const activeStageId = execution?.currentStageId;
  const targetStages = execution?.targetStages;
  const isOutOfScope = usesBypass(execution);
  const isRunning = execution?.status === 'running';
  const isCompleted = execution?.status === 'completed';
  const isError = execution?.status === 'error';
  const isWarning = execution?.outputData?.status === 'no_evidence';
  const isSuccess = execution?.outputData?.status === 'answered';

  // Identifica quais segmentos fazem parte da rota atual
  const activeRouteSegments = useMemo(() => {
    const list = [];
    const stages = targetStages || [];
    for (let i = 0; i < stages.length - 1; i++) {
      const from = stages[i];
      const to = stages[i + 1];
      const isBypass = isOutOfScope && from === 'scope' && to === 'output';
      list.push({ from, to, isBypass });
    }
    return list;
  }, [targetStages, isOutOfScope]);

  return (
    <group position={[0, 0, 0]}>
      {PIPELINE_SEGMENTS.map((seg) => {
        // Verifica se este segmento faz parte da rota do cenário atual
        const isInCurrentRoute = activeRouteSegments.some(
          (r) => r.from === seg.from && r.to === seg.to && (seg.isBypass ? r.isBypass : !r.isBypass)
        );

        // Se for rota de bypass (Cenário C)
        if (seg.isBypass) {
          const isBypassActive = isOutOfScope && isRunning && (activeStageId === 'output' || activeStageId === 'scope');
          const isBypassDone = isOutOfScope && isCompleted;

          return (
            <HighTechConduit
              key={seg.id}
              segment={seg}
              isSegmentActive={isBypassActive}
              isCompleted={isBypassDone}
              isBypass={true}
              isWarning={false}
              isError={false}
            />
          );
        }

        // Se for o segmento direto do Cenário B (sem evidências)
        if (seg.isDirect) {
          const isDirectInRoute = isInCurrentRoute;
          if (!isDirectInRoute && !isWarning) return null; // Só renderiza se fizer parte do fluxo

          const isDirectActive = isDirectInRoute && isRunning && activeStageId === 'output';
          return (
            <HighTechConduit
              key={seg.id}
              segment={seg}
              isSegmentActive={isDirectActive}
              isCompleted={isCompleted}
              isBypass={false}
              isWarning={isWarning}
              isError={isError}
            />
          );
        }

        // Segmento fora da rota desta execução: sempre inativo (não acende como "concluído")
        if (!isInCurrentRoute) {
          return (
            <HighTechConduit
              key={seg.id}
              segment={seg}
              isSegmentActive={false}
              isCompleted={false}
              isBypass={false}
              isWarning={false}
              isError={false}
            />
          );
        }

        // Segmento normal da rota
        const stages = targetStages || [];
        const isCurrentTransition = activeStageId === seg.to;
        const toIndex = stages.indexOf(seg.to);
        const currentIndex = stages.indexOf(activeStageId);
        const isSegmentDone = (currentIndex > toIndex && toIndex !== -1) || isCompleted;

        return (
          <HighTechConduit
            key={seg.id}
            segment={seg}
            isSegmentActive={isCurrentTransition && isRunning}
            isCompleted={isSegmentDone}
            isSuccess={isSuccess}
            isBypass={false}
            isWarning={isWarning && seg.to === 'output'}
            isError={isError && seg.to === 'output'}
          />
        );
      })}
    </group>
  );
}
