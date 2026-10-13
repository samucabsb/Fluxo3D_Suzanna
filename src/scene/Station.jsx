import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Estações Arquitetônicas SUS Digital — Padrão High-End
 * Combinação de porcelana técnica, acrílico óptico/vidro fosco,
 * ligas de alumínio escovado e feixes luminosos de estado.
 */
export default function Station({
  station,
  status = 'idle',
  isActive = false,
  isSelected = false,
  onClick,
  execution
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const innerRef = useRef();
  const auxiliaryRef = useRef();
  const haloRef = useRef();

  useFrame((state, delta) => {
    // Rotação suave do elemento cinético principal da estação
    if (innerRef.current) {
      const speed = isActive ? 1.8 : hovered ? 0.9 : 0.35;
      innerRef.current.rotation.y += delta * speed;
    }
    // Oscilação do componente auxiliar
    if (auxiliaryRef.current) {
      const rate = isActive ? 2.5 : 1.2;
      auxiliaryRef.current.rotation.x = Math.sin(state.clock.elapsedTime * rate) * 0.18;
      auxiliaryRef.current.rotation.z = Math.cos(state.clock.elapsedTime * rate) * 0.18;
    }
    // Pulso no anel perimetral
    if (haloRef.current && (isActive || isSelected)) {
      haloRef.current.rotation.z += delta * 0.5;
    }
  });

  // Paleta SUS Digital por estado
  const stateColors = useMemo(() => {
    if (status === 'active' || isActive) {
      return {
        base: '#2563eb',          // Azul Primário
        glow: '#60a5fa',          // Azul Claro
        pillar: '#ffffff',        // Porcelana técnica
        accent: '#1e40af',        // Azul Profundo
        darkStructure: '#0a1b3d', // Ink
        glass: '#dbeafe',         // Azul Gelo
        emissiveIntensity: 0.95
      };
    }
    if (status === 'completed') {
      const isSuccess = execution?.outputData?.status === 'answered';
      return {
        base: isSuccess ? '#16a34a' : '#2563eb',
        glow: isSuccess ? '#4ade80' : '#93c5fd',
        pillar: '#ffffff',
        accent: isSuccess ? '#15803d' : '#1e40af',
        darkStructure: '#0a1b3d',
        glass: '#dbeafe',
        emissiveIntensity: 0.5
      };
    }
    if (status === 'warning') {
      return {
        base: '#d97706',
        glow: '#fbbf24',
        pillar: '#fffbeb',
        accent: '#b45309',
        darkStructure: '#0a1b3d',
        glass: '#fef3c7',
        emissiveIntensity: 0.5
      };
    }
    if (status === 'skipped') {
      return {
        base: '#94a3b8',
        glow: '#cbd5e1',
        pillar: '#f8fafc',
        accent: '#94a3b8',
        darkStructure: '#475569',
        glass: '#f1f5f9',
        emissiveIntensity: 0.05
      };
    }
    // Idle
    return {
      base: '#2563eb',
      glow: '#93c5fd',
      pillar: '#ffffff',
      accent: '#1e40af',
      darkStructure: '#0a1b3d',
      glass: '#dbeafe',
      emissiveIntensity: 0.2
    };
  }, [status, isActive, execution?.outputData?.status]);

  const labelHeight = useMemo(() => {
    switch (station.id) {
      case 'input': return 2.6;
      case 'scope': return 2.5;
      case 'retrieval': return 2.95;
      case 'generation': return 3.1;
      case 'evidence': return 2.65;
      case 'output': return 2.6;
      default: return 2.6;
    }
  }, [station.id]);

  // Renderização arquitetônica refinada de cada uma das 6 estações
  const renderStationArchitecture = () => {
    switch (station.id) {
      case 'input':
        // 1. Estação de Entrada: Terminal de recepção com console e tela holográfica
        return (
          <group position={[0, 0.12, 0]}>
            {/* Coluna cilíndrica de porcelana chanfrada */}
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[1.1, 1.35, 0.7, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[1.38, 1.4, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Portal duplo vertical com fita de luz */}
            <mesh castShadow position={[-0.75, 1.1, 0]}>
              <boxGeometry args={[0.16, 1.6, 0.22]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[0.75, 1.1, 0]}>
              <boxGeometry args={[0.16, 1.6, 0.22]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[0, 1.9, 0]}>
              <boxGeometry args={[1.72, 0.16, 0.24]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh position={[0, 1.82, 0]}>
              <boxGeometry args={[1.4, 0.03, 0.06]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* Console de interação com visor translúcido inclinado */}
            <group position={[0, 0.75, 0.35]}>
              <mesh castShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.65, 0.4, 0.35]} />
                <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.6} />
              </mesh>
              <mesh position={[0, 0.22, 0.02]} rotation={[-0.4, 0, 0]}>
                <boxGeometry args={[0.54, 0.32, 0.02]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.15}
                  transmission={0.65}
                  thickness={0.5}
                  ior={1.5}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              {/* Display de comando */}
              <mesh position={[0, 0.23, 0.025]} rotation={[-0.4, 0, 0]}>
                <planeGeometry args={[0.48, 0.26]} />
                <meshStandardMaterial
                  color="#0a1b3d"
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 0.9 : 0.3}
                  roughness={0.1}
                />
              </mesh>
            </group>

            {/* Núcleo de admissão de pergunta flutuante */}
            <group ref={innerRef} position={[0, 1.3, 0]}>
              <mesh castShadow>
                <octahedronGeometry args={[0.26, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.15}
                  metalness={0.85}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.38, 0.02, 16, 32]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.6} />
              </mesh>
            </group>
          </group>
        );

      case 'scope':
        // 2. Controle de Escopo: Portão de triagem diagnóstica com anéis de contenção
        return (
          <group position={[0, 0.16, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[1.2, 1.45, 0.7, 8]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[1.48, 1.5, 0.08, 8]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Pilares laterais de segurança */}
            {[-0.8, 0.8].map((posX, i) => (
              <group key={i} position={[posX, 1.05, -0.1]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.11, 0.13, 1.5, 16]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
                </mesh>
                <mesh position={[posX > 0 ? -0.12 : 0.12, 0, 0]}>
                  <boxGeometry args={[0.025, 1.3, 0.04]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              </group>
            ))}

            {/* Escudo protetor transparente posterior */}
            <mesh castShadow position={[0, 1.0, -0.65]}>
              <boxGeometry args={[1.35, 1.1, 0.08]} />
              <meshPhysicalMaterial
                color="#bfdbfe"
                roughness={0.1}
                transmission={0.75}
                thickness={0.8}
                ior={1.45}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Núcleo de triagem giroscópico */}
            <group ref={innerRef} position={[0, 1.25, 0]}>
              <mesh castShadow>
                <torusGeometry args={[0.62, 0.065, 16, 36]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.46, 0.04, 16, 32]} />
                <meshStandardMaterial
                  color="#1e40af"
                  roughness={0.2}
                  metalness={0.9}
                />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <octahedronGeometry args={[0.2, 0]} />
                <meshBasicMaterial color={stateColors.glow} wireframe />
              </mesh>
            </group>
          </group>
        );

      case 'retrieval':
        // 3. Base de Conhecimento RAG: Repositório monumental com placas de dados ópticas
        return (
          <group position={[0, 0.18, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <boxGeometry args={[2.6, 0.7, 2.6]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.35} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[2.85, 0.08, 2.85]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Três torres de arquivo vertical escalonadas */}
            <mesh castShadow position={[-0.75, 1.1, -0.7]}>
              <boxGeometry args={[0.7, 1.5, 0.55]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.7} />
            </mesh>
            <mesh castShadow position={[0.75, 1.35, -0.6]}>
              <boxGeometry args={[0.7, 2.0, 0.55]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>
            <mesh castShadow position={[-0.7, 0.95, 0.7]}>
              <boxGeometry args={[0.7, 1.2, 0.55]} />
              <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Placas/Lâminas translúcidas de dados (chunks RAG) */}
            {[-0.2, 0.2].map((offZ, idx) => (
              <mesh key={idx} position={[0.75, 1.35, -0.6 + offZ]}>
                <boxGeometry args={[0.62, 1.85, 0.04]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.2}
                  transmission={0.65}
                  thickness={0.4}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            ))}

            {/* Marcadores de indexação luminosos */}
            {[0.6, 0.95, 1.3, 1.65].map((posY, i) => (
              <mesh key={i} position={[0.75, posY, -0.31]}>
                <boxGeometry args={[0.6, 0.03, 0.02]} />
                <meshBasicMaterial color={stateColors.glow} />
              </mesh>
            ))}

            {/* Módulo flutuante de busca vetorial */}
            <group ref={innerRef} position={[0.25, isActive ? 1.55 : 1.25, 0.25]}>
              <mesh castShadow>
                <boxGeometry args={[0.55, 0.75, 0.14]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 0.95 : 0.35}
                  roughness={0.2}
                  metalness={0.75}
                />
              </mesh>
              <mesh position={[0, 0, 0.08]}>
                <planeGeometry args={[0.42, 0.6]} />
                <meshBasicMaterial color={stateColors.glow} wireframe />
              </mesh>
            </group>
          </group>
        );

      case 'generation':
        // 4. Núcleo de Linguagem: Reator central com anéis magnéticos de levitação
        return (
          <group position={[0, 0.22, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[1.6, 1.85, 0.7, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[1.9, 1.95, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.3, 0.07, 16, 48]} />
              <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* 4 Pilares de contenção quádruplos */}
            {[-1.0, 1.0].map((px) =>
              [-1.0, 1.0].map((pz) => (
                <group key={`${px}-${pz}`} position={[px, 1.1, pz]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.1, 0.14, 1.5, 16]} />
                    <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.78, 0]}>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                </group>
              ))
            )}

            {/* Núcleo do LLM: dodecaedro cristalino com gaiola icosaédrica */}
            <group ref={innerRef} position={[0, 1.45, 0]}>
              <mesh castShadow>
                <dodecahedronGeometry args={[0.55, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 1.0 : 0.35}
                  roughness={0.15}
                  metalness={0.85}
                />
              </mesh>
              <mesh ref={auxiliaryRef}>
                <icosahedronGeometry args={[0.78, 0]} />
                <meshBasicMaterial
                  color={stateColors.glow}
                  wireframe
                  transparent
                  opacity={isActive ? 0.75 : 0.3}
                />
              </mesh>
              {/* Ponto focal de iluminação suave */}
              <pointLight
                color={stateColors.glow}
                intensity={isActive ? 2.8 : 0.7}
                distance={5.0}
              />
            </group>
          </group>
        );

      case 'evidence':
        // 5. Evidências & Referências: Laboratório de auditoria com prismas de rastreamento
        return (
          <group position={[0, 0.16, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <boxGeometry args={[2.2, 0.7, 1.9]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[2.45, 0.08, 2.15]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Painéis laterais de conferência documental */}
            <mesh castShadow position={[-0.7, 1.05, 0]}>
              <boxGeometry args={[0.2, 1.4, 1.2]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.7} />
            </mesh>
            <mesh castShadow position={[0.7, 1.05, 0]}>
              <boxGeometry args={[0.2, 1.4, 1.2]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Janela central de inspeção em vidro translúcido */}
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[1.1, 1.2, 0.04]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                roughness={0.15}
                transmission={0.7}
                thickness={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Prisma hexagonal de auditoria de fontes */}
            <group ref={innerRef} position={[0, 1.15, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.6, 6]} />
                <meshStandardMaterial
                  color={status === 'completed' ? stateColors.base : stateColors.base}
                  emissive={status === 'completed' ? stateColors.base : stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.2}
                  metalness={0.7}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.45, 0.03, 16, 24]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.6} />
              </mesh>
            </group>
          </group>
        );

      case 'output':
      default:
        // 6. Saída da Resposta: Piattaforma de projeção com terminal cantilever e beacon
        return (
          <group position={[0, 0.14, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
              <cylinderGeometry args={[1.3, 1.5, 0.7, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[1.58, 1.6, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Coluna transmissora traseira */}
            <mesh castShadow position={[0, 1.25, -0.6]}>
              <cylinderGeometry args={[0.07, 0.14, 1.8, 16]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.18, -0.6]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* Painel de projeção de resposta frontal */}
            <group ref={innerRef} position={[0, 1.05, 0.25]}>
              <mesh castShadow rotation={[-0.25, 0, 0]}>
                <boxGeometry args={[1.1, 0.75, 0.08]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Placa de exibição translúcida */}
              <mesh position={[0, 0, 0.05]} rotation={[-0.25, 0, 0]}>
                <planeGeometry args={[0.96, 0.62]} />
                <meshStandardMaterial
                  color="#0a1b3d"
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 0.9 : 0.35}
                />
              </mesh>
              {/* Borda de vidro de acabamento */}
              <mesh position={[0, 0, 0.055]} rotation={[-0.25, 0, 0]}>
                <planeGeometry args={[1.02, 0.68]} />
                <meshPhysicalMaterial
                  color="#bfdbfe"
                  roughness={0.1}
                  transmission={0.6}
                  thickness={0.3}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          </group>
        );
    }
  };

  const [x, y, z] = station.position;

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(station.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Halo de seleção perimetral dinâmico */}
      {isSelected && (
        <group ref={haloRef} position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.85, 2.02, 48]} />
            <meshBasicMaterial color="#2563eb" side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.08, 2.14, 48]} />
            <meshBasicMaterial color="#60a5fa" opacity={0.5} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Halo de hover suave */}
      {hovered && !isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <ringGeometry args={[1.75, 1.88, 36]} />
          <meshBasicMaterial color="#60a5fa" opacity={0.65} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Arquitetura procedural da estação */}
      {renderStationArchitecture()}

      {/* ETIQUETA CONTEXTUAL INTELIGENTE (Identidade SUS Digital) */}
      <Html
        position={[0, labelHeight, 0]}
        center
        distanceFactor={22}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        {isSelected || isActive ? (
          <div className="flex flex-col items-center gap-0.5 animate-fadeIn">
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-liquid border transition-all duration-300 flex items-center gap-2 ${
                isSelected
                  ? 'bg-sus-deep text-white border-sus-light ring-2 ring-sus-primary/30'
                  : 'bg-sus-primary text-white border-sus-light animate-pulse'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sus-ice animate-ping" />
              <span>{station.name}</span>
            </div>
            <span className="text-[10px] font-medium text-sus-muted bg-white/95 px-2.5 py-0.5 rounded-md border border-sus-ice shadow-sm">
              {station.subtitle}
            </span>
          </div>
        ) : hovered ? (
          <div className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-liquid border bg-white/95 text-sus-ink border-sus-light transition-all flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sus-primary" />
            <span className="font-semibold">{station.shortName || station.name.split('—')[0]}</span>
          </div>
        ) : (
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm border transition-all duration-200 ${
              status === 'completed'
                ? 'bg-emerald-50 text-sus-success border-emerald-300'
                : status === 'warning'
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : status === 'skipped'
                ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                : 'bg-white/90 text-sus-ink border-sus-ice'
            }`}
            title={station.name}
          >
            {station.stepNumber || station.id.charAt(0).toUpperCase()}
          </div>
        )}
      </Html>
    </group>
  );
}
