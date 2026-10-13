import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Estações Arquitetônicas SUS Digital — Padrão High-End / Overkill
 * Modelagem industrial e escultural inspirada em Oscar Niemeyer e hardware futurista:
 * - Camadas de porcelana técnica polida (#ffffff)
 * - Molduras em Titânio Azul Profundo (#1e40af) e Ink (#0a1b3d)
 * - Vidro óptico com refração e canaletas de luz LED
 * - Componentes mecânicos: aletas de dissipação, bobinas de levitação, anéis cardânicos
 * - Etiquetas contextuais com contraste total e legibilidade imediata
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
  const secondaryRotatorRef = useRef();

  useFrame((state, delta) => {
    // Rotação suave do elemento cinético principal
    if (innerRef.current) {
      const speed = isActive ? 1.8 : hovered ? 1.0 : 0.4;
      innerRef.current.rotation.y += delta * speed;
    }
    // Rotação contra-rotativa do anel secundário
    if (secondaryRotatorRef.current) {
      const secSpeed = isActive ? -2.2 : -0.6;
      secondaryRotatorRef.current.rotation.y += delta * secSpeed;
      secondaryRotatorRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
    // Oscilação do componente auxiliar
    if (auxiliaryRef.current) {
      const rate = isActive ? 2.6 : 1.2;
      auxiliaryRef.current.rotation.x = Math.sin(state.clock.elapsedTime * rate) * 0.2;
      auxiliaryRef.current.rotation.z = Math.cos(state.clock.elapsedTime * rate) * 0.2;
    }
    // Pulso no halo perimetral
    if (haloRef.current && (isActive || isSelected)) {
      haloRef.current.rotation.z += delta * 0.5;
    }
  });

  // Paleta cromática SUS Digital de alta precisão
  const stateColors = useMemo(() => {
    if (status === 'active' || isActive) {
      return {
        base: '#2563eb',          // Azul Primário
        glow: '#38bdf8',          // Azul Ciano Neon
        pillar: '#ffffff',        // Porcelana técnica
        accent: '#1e40af',        // Azul Profundo
        darkStructure: '#0a1b3d', // Ink
        glass: '#e0f2fe',         // Azul Gelo
        emissiveIntensity: 1.2
      };
    }
    if (status === 'completed') {
      const isSuccess = execution?.outputData?.status === 'answered';
      return {
        base: isSuccess ? '#16a34a' : '#2563eb',
        glow: isSuccess ? '#4ade80' : '#60a5fa',
        pillar: '#ffffff',
        accent: isSuccess ? '#15803d' : '#1e40af',
        darkStructure: '#0a1b3d',
        glass: isSuccess ? '#dcfce7' : '#dbeafe',
        emissiveIntensity: 0.8
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
        emissiveIntensity: 0.8
      };
    }
    if (status === 'skipped') {
      return {
        base: '#64748b',
        glow: '#94a3b8',
        pillar: '#f8fafc',
        accent: '#475569',
        darkStructure: '#334155',
        glass: '#f1f5f9',
        emissiveIntensity: 0.1
      };
    }
    // Idle
    return {
      base: '#2563eb',
      glow: '#38bdf8',
      pillar: '#ffffff',
      accent: '#1e40af',
      darkStructure: '#0a1b3d',
      glass: '#e0f2fe',
      emissiveIntensity: 0.35
    };
  }, [status, isActive, execution?.outputData?.status]);

  const labelHeight = useMemo(() => {
    switch (station.id) {
      case 'input': return 3.1;
      case 'scope': return 3.0;
      case 'retrieval': return 3.4;
      case 'generation': return 3.6;
      case 'evidence': return 3.1;
      case 'output': return 3.2;
      default: return 3.1;
    }
  }, [station.id]);

  // Modelagem tridimensional rica e detalhada das 6 estações
  const renderStationArchitecture = () => {
    switch (station.id) {
      case 'input':
        // 1. Entrada da Pergunta: Pórtico Monumental com console holográfico do cidadão
        return (
          <group position={[0, 0.12, 0]}>
            {/* Plinto de base escalonado de 3 níveis */}
            <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[1.3, 1.55, 0.4, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[1.2, 1.25, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>
            {/* Anel perimetral com dissipadores de calor em micro-aletas */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.35, 0.22, Math.sin(angle) * 1.35]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.04, 0.24, 0.12]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
                </mesh>
              );
            })}

            {/* Pórtico Escultural Niemeyer: Duas colunas aerodinâmicas curvas em titânio */}
            {[-0.85, 0.85].map((posX, i) => (
              <group key={i} position={[posX, 1.2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.18, 1.8, 0.28]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                {/* Friso embutido de fibra óptica azul nos pilares */}
                <mesh position={[posX > 0 ? -0.1 : 0.1, 0, 0]}>
                  <boxGeometry args={[0.03, 1.7, 0.06]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
                {/* Colar metálico de engaste */}
                <mesh position={[0, -0.85, 0]}>
                  <boxGeometry args={[0.26, 0.1, 0.34]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
                </mesh>
              </group>
            ))}

            {/* Viga de leitura superior com scanner óptico */}
            <mesh castShadow position={[0, 2.12, 0]}>
              <boxGeometry args={[1.95, 0.18, 0.32]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.02, 0]}>
              <boxGeometry args={[1.6, 0.03, 0.08]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* Console de interação com display de vidro curvo */}
            <group position={[0, 0.72, 0.5]}>
              {/* Pedestal do console */}
              <mesh castShadow position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.14, 0.22, 0.45, 16]} />
                <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.6} />
              </mesh>
              {/* Mesa de comando */}
              <mesh castShadow position={[0, 0.1, 0]} rotation={[-0.35, 0, 0]}>
                <boxGeometry args={[0.8, 0.45, 0.08]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Tela holográfica de toque */}
              <mesh position={[0, 0.11, 0.045]} rotation={[-0.35, 0, 0]}>
                <planeGeometry args={[0.72, 0.38]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.1}
                  transmission={0.75}
                  thickness={0.4}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              {/* Leitor de Cartão SUS / Biometria com LED verde */}
              <mesh position={[0.26, 0.12, 0.05]} rotation={[-0.35, 0, 0]}>
                <circleGeometry args={[0.045, 16]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
            </group>

            {/* Núcleo de Admissão de Dados Flutuante com duplo anel giroscópico */}
            <group ref={innerRef} position={[0, 1.35, 0]}>
              <mesh castShadow>
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.12}
                  metalness={0.9}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.45, 0.025, 16, 36]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.7} />
              </mesh>
              <mesh ref={secondaryRotatorRef} rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.38, 0.018, 16, 32]} />
                <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          </group>
        );

      case 'scope':
        // 2. Controle de Escopo: Anel Colisor de Biossegurança com Escudo Bioético
        return (
          <group position={[0, 0.14, 0]}>
            {/* Base octogonal chanfrada de precisão */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
              <cylinderGeometry args={[1.35, 1.6, 0.44, 8]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[1.28, 1.32, 0.08, 8]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* 4 Torres perimétricas de contenção diagnóstica */}
            {[-0.95, 0.95].map((posX, i) =>
              [-0.4, 0.4].map((posZ, j) => (
                <group key={`${i}-${j}`} position={[posX, 1.1, posZ]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.09, 0.12, 1.6, 16]} />
                    <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
                  </mesh>
                  {/* Fita de luz no fuste da torre */}
                  <mesh position={[posX > 0 ? -0.1 : 0.1, 0, 0]}>
                    <boxGeometry args={[0.02, 1.4, 0.03]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                  {/* Ponteira emissora de laser no topo */}
                  <mesh position={[0, 0.85, 0]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                </group>
              ))
            )}

            {/* Escudo Protetor Parabólico de Vidro Óptico */}
            <mesh castShadow position={[0, 1.15, -0.55]}>
              <cylinderGeometry args={[1.25, 1.25, 1.3, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                roughness={0.1}
                transmission={0.8}
                thickness={0.8}
                ior={1.45}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Cruz Médica Bioética em LED no centro do escudo */}
            <group position={[0, 1.15, -0.48]}>
              <mesh>
                <boxGeometry args={[0.5, 0.14, 0.02]} />
                <meshBasicMaterial
                  color={status === 'warning' ? '#fbbf24' : '#10b981'}
                  opacity={0.9}
                  transparent
                />
              </mesh>
              <mesh>
                <boxGeometry args={[0.14, 0.5, 0.02]} />
                <meshBasicMaterial
                  color={status === 'warning' ? '#fbbf24' : '#10b981'}
                  opacity={0.9}
                  transparent
                />
              </mesh>
            </group>

            {/* Núcleo Giroscópico de Triagem Tri-axial */}
            <group ref={innerRef} position={[0, 1.35, 0]}>
              {/* Anel Cardânico 1 */}
              <mesh castShadow>
                <torusGeometry args={[0.68, 0.06, 16, 40]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              {/* Anel Cardânico 2 */}
              <mesh ref={auxiliaryRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.52, 0.04, 16, 36]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Anel Cardânico 3 */}
              <mesh ref={secondaryRotatorRef} rotation={[0, Math.PI / 4, Math.PI / 4]}>
                <torusGeometry args={[0.38, 0.025, 16, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.95} />
              </mesh>
              {/* Esfera diagnóstica de plasma no centro */}
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial
                  color={stateColors.glow}
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 1.5 : 0.5}
                />
              </mesh>
            </group>
          </group>
        );

      case 'retrieval':
        // 3. Base RAG: Monumento de Hiper-Densidade de Dados com 3 Monólitos e Lâminas Ópticas
        return (
          <group position={[0, 0.16, 0]}>
            {/* Base retangular monumental em granito técnico com chanfros */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
              <boxGeometry args={[2.8, 0.44, 2.8]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <boxGeometry args={[3.0, 0.08, 3.0]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Monólito 1: Protocolos de Urgência & UPAs do DF (Altura 2.2m) */}
            <group position={[-0.8, 1.25, -0.65]}>
              <mesh castShadow>
                <boxGeometry args={[0.75, 1.8, 0.6]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Racks de aletas de refrigeração horizontais */}
              {[-0.6, -0.2, 0.2, 0.6].map((posY, idx) => (
                <mesh key={idx} position={[0, posY, 0.31]}>
                  <boxGeometry args={[0.65, 0.04, 0.03]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
            </group>

            {/* Monólito 2: Grande Arquivo Central SES-DF (Altura 2.7m) */}
            <group position={[0.8, 1.5, -0.6]}>
              <mesh castShadow>
                <boxGeometry args={[0.75, 2.3, 0.65]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.7} />
              </mesh>
              {/* Leitor óptico vertical de cartuchos de memória */}
              <mesh position={[0, 0, 0.34]}>
                <boxGeometry args={[0.5, 2.0, 0.04]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Indicadores LED de indexação semântica 768d */}
              {[-0.8, -0.4, 0, 0.4, 0.8].map((posY, i) => (
                <mesh key={i} position={[0, posY, 0.37]}>
                  <boxGeometry args={[0.42, 0.03, 0.02]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
            </group>

            {/* Monólito 3: Diretrizes Clínicas e Especialidades (Altura 1.7m) */}
            <group position={[-0.75, 1.05, 0.75]}>
              <mesh castShadow>
                <boxGeometry args={[0.75, 1.4, 0.6]} />
                <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} />
              </mesh>
              <mesh position={[0, 0, 0.31]}>
                <boxGeometry args={[0.6, 1.1, 0.03]} />
                <meshBasicMaterial color="#10b981" opacity={0.65} transparent />
              </mesh>
            </group>

            {/* Placas/Lâminas Translúcidas de Chunks Documentais (RAG) */}
            {[-0.22, 0.22].map((offZ, idx) => (
              <mesh key={idx} position={[0.8, 1.5, -0.6 + offZ]}>
                <boxGeometry args={[0.68, 2.1, 0.04]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.15}
                  transmission={0.7}
                  thickness={0.5}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            ))}

            {/* Módulo Vetorial Flutuante de Busca Semântica */}
            <group ref={innerRef} position={[0.2, isActive ? 1.7 : 1.35, 0.3]}>
              <mesh castShadow>
                <boxGeometry args={[0.6, 0.8, 0.2]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 1.1 : 0.4}
                  roughness={0.15}
                  metalness={0.85}
                />
              </mesh>
              <mesh position={[0, 0, 0.11]}>
                <planeGeometry args={[0.48, 0.65]} />
                <meshBasicMaterial color={stateColors.glow} wireframe />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[0.48, 0.02, 16, 28]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
              </mesh>
            </group>
          </group>
        );

      case 'generation':
        // 4. Núcleo LLM Susana: Reator Neural de Brasília com Cúpula de Niemeyer e Tensores
        return (
          <group position={[0, 0.2, 0]}>
            {/* Dais Monumental com 12 aletas radiais de refrigeração mecânica */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <cylinderGeometry args={[1.75, 2.0, 0.5, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[1.92, 1.96, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Aletas radiais mecânicas do reator */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.85, 0.25, Math.sin(angle) * 1.85]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.04, 0.36, 0.18]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
                </mesh>
              );
            })}

            {/* CÚPULA DE NIEMEYER (Inspirada no Museu Nacional e Catedral de Brasília) */}
            <mesh position={[0, 0.76, 0]}>
              <sphereGeometry args={[1.56, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.85}
                thickness={0.9}
                roughness={0.12}
                ior={1.48}
                transparent
                opacity={0.65}
              />
            </mesh>
            {/* Anel Equatorial em Titânio com LED integrado */}
            <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.58, 0.04, 16, 48]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.61, 0.018, 8, 48]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* 4 Colunas Magnéticas com Bobinas de Levitação */}
            {[-1.1, 1.1].map((px) =>
              [-1.1, 1.1].map((pz) => (
                <group key={`${px}-${pz}`} position={[px, 1.15, pz]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.09, 0.13, 1.6, 16]} />
                    <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.85} />
                  </mesh>
                  {/* Bobinas de indução em cobre/ouro */}
                  <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.35, 16]} />
                    <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.9} />
                  </mesh>
                  {/* Esfera focal no topo */}
                  <mesh position={[0, 0.85, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                </group>
              ))
            )}

            {/* REATOR NEURAL CENTRAL: Dodecaedro cristalino + Gaiola Icosaédrica de Atenção */}
            <group ref={innerRef} position={[0, 1.5, 0]}>
              {/* Núcleo interno emissor */}
              <mesh castShadow>
                <dodecahedronGeometry args={[0.58, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 1.3 : 0.45}
                  roughness={0.12}
                  metalness={0.88}
                />
              </mesh>
              {/* Gaiola de tensores neurais */}
              <mesh ref={auxiliaryRef}>
                <icosahedronGeometry args={[0.82, 0]} />
                <meshBasicMaterial
                  color={stateColors.glow}
                  wireframe
                  transparent
                  opacity={isActive ? 0.85 : 0.35}
                />
              </mesh>
              {/* Anéis orbitais de atenção Transformers */}
              <mesh ref={secondaryRotatorRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.95, 0.02, 16, 40]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
              </mesh>
              {/* Ponto de luz focal de processamento */}
              <pointLight
                color={stateColors.glow}
                intensity={isActive ? 3.2 : 0.8}
                distance={6.0}
              />
            </group>
          </group>
        );

      case 'evidence':
        // 5. Evidências: Câmara de Auditoria Pública com Prismas de Rastreamento e Selo
        return (
          <group position={[0, 0.15, 0]}>
            {/* Plinto chanfrado de inspeção governamental */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
              <boxGeometry args={[2.4, 0.44, 2.1]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <boxGeometry args={[2.6, 0.08, 2.3]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Colunas do pórtico de conferência em titânio polido */}
            <mesh castShadow position={[-0.8, 1.15, 0]}>
              <boxGeometry args={[0.22, 1.5, 1.3]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[0.8, 1.15, 0]}>
              <boxGeometry args={[0.22, 1.5, 1.3]} />
              <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Janela central de inspeção de evidências em vidro translúcido */}
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[1.2, 1.3, 0.05]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                roughness={0.1}
                transmission={0.75}
                thickness={0.6}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Selo circular governamental de integridade das fontes */}
            <mesh position={[0, 1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.42, 0.48, 36]} />
              <meshBasicMaterial color="#10b981" opacity={0.85} transparent />
            </mesh>
            <mesh position={[0, 1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.28, 0.34, 36]} />
              <meshBasicMaterial color="#10b981" opacity={0.5} transparent />
            </mesh>

            {/* Prisma hexagonal de auditoria de fontes com anel rotativo */}
            <group ref={innerRef} position={[0, 1.25, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.7, 6]} />
                <meshStandardMaterial
                  color={status === 'completed' ? stateColors.base : stateColors.base}
                  emissive={status === 'completed' ? stateColors.base : stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.18}
                  metalness={0.75}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.5, 0.03, 16, 28]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.7} />
              </mesh>
              <mesh ref={secondaryRotatorRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.42, 0.02, 16, 24]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.9} />
              </mesh>
            </group>
          </group>
        );

      case 'output':
      default:
        // 6. Saída: Terminal de Despacho Clínico com Console Cantilever e Beacon do DF
        return (
          <group position={[0, 0.14, 0]}>
            {/* Pedestal circular em porcelana branca pura */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
              <cylinderGeometry args={[1.4, 1.6, 0.44, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[1.68, 1.7, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Torre de Transmissão da Rede de Saúde do DF */}
            <group position={[0, 1.35, -0.65]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.06, 0.15, 2.0, 16]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.85} />
              </mesh>
              {/* 3 Anéis emissores de micro-ondas de dados */}
              {[0.3, 0.65, 0.95].map((posY, i) => (
                <mesh key={i} position={[0, posY, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.18 - i * 0.03, 0.02, 16, 24]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
              {/* Beacon esférico transmissor no topo */}
              <mesh position={[0, 1.08, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial color={stateColors.glow} />
              </mesh>
            </group>

            {/* Púlpito Tecnológico Cantilever com Display Panorâmico Curvo */}
            <group ref={innerRef} position={[0, 1.15, 0.3]}>
              {/* Braço articulado cantilever */}
              <mesh castShadow position={[0, -0.25, 0]}>
                <boxGeometry args={[0.22, 0.5, 0.22]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Moldura da tela curva em titânio escovado */}
              <mesh castShadow rotation={[-0.28, 0, 0]}>
                <boxGeometry args={[1.25, 0.8, 0.08]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.15} metalness={0.9} />
              </mesh>
              {/* Display holográfico de resposta */}
              <mesh position={[0, 0, 0.05]} rotation={[-0.28, 0, 0]}>
                <planeGeometry args={[1.12, 0.68]} />
                <meshStandardMaterial
                  color="#0a1b3d"
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 1.0 : 0.4}
                />
              </mesh>
              {/* Borda de vidro óptico anti-reflexo */}
              <mesh position={[0, 0, 0.055]} rotation={[-0.28, 0, 0]}>
                <planeGeometry args={[1.18, 0.74]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.08}
                  transmission={0.65}
                  thickness={0.3}
                  transparent
                  opacity={0.6}
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
            <ringGeometry args={[1.9, 2.08, 48]} />
            <meshBasicMaterial color="#2563eb" side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.14, 2.2, 48]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.6} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Halo de hover suave */}
      {hovered && !isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <ringGeometry args={[1.8, 1.94, 36]} />
          <meshBasicMaterial color="#38bdf8" opacity={0.7} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Arquitetura procedural da estação */}
      {renderStationArchitecture()}

      {/* ========================================================= */}
      {/* ETIQUETA CONTEXTUAL COM ALTO CONTRASTE E LEGIBILIDADE     */}
      {/* ========================================================= */}
      <Html
        position={[0, labelHeight, 0]}
        center
        distanceFactor={22}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        {isSelected || isActive ? (
          <div className="flex flex-col items-center gap-1 drop-shadow-xl select-none">
            {/* Pill de Alto Contraste: Fundo Ink Azul Profundo com Texto Branco Puro e LED Ciano */}
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-2xl border flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#0a1b3d] text-white border-[#38bdf8] ring-2 ring-[#38bdf8]/40'
                  : 'bg-[#1e40af] text-white border-[#60a5fa] animate-pulse'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-sm animate-ping" />
              <span className="tracking-wide text-white drop-shadow-sm">{station.name}</span>
            </div>
            {/* Subtítulo em Cartão Branco Nítido com Texto Escuro Legível */}
            <span className="text-[10px] font-bold text-[#0a1b3d] bg-white px-3 py-0.5 rounded-md border border-[#93c5fd] shadow-md">
              {station.subtitle}
            </span>
          </div>
        ) : hovered ? (
          <div className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xl border bg-[#0a1b3d] text-white border-[#60a5fa] transition-all flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            <span className="text-white drop-shadow-sm">{station.shortName || station.name.split('—')[0]}</span>
          </div>
        ) : (
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 transition-all duration-200 select-none ${
              status === 'completed'
                ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-500/50'
                : status === 'warning'
                ? 'bg-amber-500 text-white border-white ring-2 ring-amber-400/50'
                : status === 'skipped'
                ? 'bg-slate-400 text-white border-white opacity-70'
                : 'bg-[#0a1b3d] text-white border-[#38bdf8] shadow-md ring-1 ring-[#0a1b3d]/30'
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
