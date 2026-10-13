import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  buildScenarioRoute,
  usesBypass,
  stepProgress,
  stageIndexAt,
  PARTICLE_SPEED,
  GUIDED_TOUR_SPEED,
  CATCH_UP_SPEED
} from './trajectory';

const DEFAULT_STAGES = ['input', 'scope', 'retrieval', 'generation', 'evidence', 'output'];
const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function FlowParticle({
  execution,
  isPaused = false,
  isGuidedTour = false,
  onStageAdvance,
  onComplete
}) {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const auraRef = useRef();

  // Progresso geométrico único (0..1) da execução. Só useFrame escreve aqui.
  const progressRef = useRef(0);
  const execIdRef = useRef(execution?.id);
  const lastStageIndexRef = useRef(0);

  const targetStages = execution?.targetStages || DEFAULT_STAGES;
  const isBypass = usesBypass(execution);
  const routeKey = targetStages.join(',');

  // Rota estável: só muda quando a lista de etapas ou o desvio mudam (nova execução)
  const { route, length, thresholds, liveHoldAt } = useMemo(() => {
    const r = buildScenarioRoute(targetStages, isBypass);
    if (r.curves.length === 0) return { route: null, length: 0, thresholds: [], liveHoldAt: 1 };

    const lengths = r.getCurveLengths();
    const total = lengths[lengths.length - 1] || 1;
    const thresh = lengths.map((l) => l / total);
    // Modo ao vivo: a API não emite eventos intermediários; a partícula espera na geração.
    const genIdx = targetStages.indexOf('generation');
    return { route: r, length: total, thresholds: thresh, liveHoldAt: genIdx > 0 ? thresh[genIdx - 1] : 1 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, isBypass]);

  useFrame((state, delta) => {
    if (!groupRef.current || !route) return;

    // Reinício explícito: nova execução => volta ao início. Qualquer outra mudança preserva o progresso.
    if (execution?.id !== execIdRef.current) {
      execIdRef.current = execution?.id;
      progressRef.current = 0;
      lastStageIndexRef.current = 0;
    }

    const status = execution?.status;
    const isRunning = status === 'running' && !isPaused;
    const isLiveWaiting = execution?.mode === 'live' && status === 'running';

    if (isRunning) {
      const activeSpeed = isGuidedTour ? GUIDED_TOUR_SPEED : PARTICLE_SPEED;
      progressRef.current = stepProgress(progressRef.current, delta, length, {
        running: true,
        speed: activeSpeed,
        cap: isLiveWaiting ? liveHoldAt : 1
      });

      // Etapa lógica derivada da posição
      const idx = stageIndexAt(progressRef.current, thresholds);
      if (idx !== lastStageIndexRef.current && idx < targetStages.length) {
        lastStageIndexRef.current = idx;
        onStageAdvance?.(targetStages[idx]);
      }

      if (progressRef.current >= 1) onComplete?.();
    } else if (status === 'completed' && progressRef.current < 1) {
      // Execução terminou (ex.: resposta da API chegou): continua pela rota, sem salto.
      progressRef.current = stepProgress(progressRef.current, delta, length, {
        running: true,
        speed: CATCH_UP_SPEED
      });
    }

    const p = route.getPointAt(progressRef.current);
    const idle = !isRunning && !REDUCED_MOTION;
    const hoverOffset = idle ? Math.sin(state.clock.elapsedTime * 2.5) * 0.04 : 0;
    groupRef.current.position.set(p.x, p.y + 0.38 + hoverOffset, p.z);

    if (!REDUCED_MOTION) {
      if (innerMeshRef.current) {
        innerMeshRef.current.rotation.y += delta * 2.5;
        innerMeshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      }
      if (auraRef.current) {
        auraRef.current.rotation.z += delta * 1.2;
        auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.08);
      }
    }
  });

  // Cor: verde só para resposta realmente entregue; âmbar para desfechos sem resposta; vermelho para erro
  const particleColor = useMemo(() => {
    if (execution?.status === 'error') return '#dc2626';
    if (execution?.scopeData?.allowed === false) return '#d97706';
    if (execution?.status === 'completed') {
      return execution?.outputData?.status === 'answered' ? '#16a34a' : '#d97706';
    }
    return '#2563eb';
  }, [execution?.status, execution?.scopeData?.allowed, execution?.outputData?.status]);

  return (
    <group ref={groupRef} position={[-9.0, 0.64, 3.8]}>
      {/* 1. Núcleo cristalino em formato de octaedro com alta refração */}
      <mesh ref={innerMeshRef} castShadow>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={particleColor}
          emissive={particleColor}
          emissiveIntensity={1.4}
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* 2. Duplo anel giroscópico de contenção de dados clínicos */}
      <mesh ref={auraRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.4, 0.02, 16, 36]} />
        <meshBasicMaterial
          color={particleColor}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.34, 0.015, 16, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 3. Aura esférica de bio-energia de saúde */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={particleColor}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* 4. Luz pontual contextual de iluminação do duto */}
      <pointLight
        color={particleColor}
        intensity={2.4}
        distance={3.6}
      />
    </group>
  );
}
