import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * RAG Document Chunks recuperados da base vetorial do SUS-DF
 * Chunks reais representam trechos de documentos oficiais indexados com pgvector (768d)
 */
const RAG_CHUNKS_DATA = [
  { id: 'c1', title: 'UPA Samambaia Sul — QS 107', score: '0.941', x: -1.7, y: 1.2, z: 0.9, rotY: 0.35 },
  { id: 'c2', title: 'Protocolo Manchester SES-DF', score: '0.884', x: 1.7, y: 1.3, z: 0.9, rotY: -0.35 },
  { id: 'c3', title: 'Semob-DF Linhas 0.053/0.394', score: '0.851', x: 0.0, y: 2.2, z: 1.5, rotY: 0.0 },
  { id: 'c4', title: 'IgesDF Atendimento 24h', score: '0.912', x: -1.9, y: 1.9, z: -0.2, rotY: 0.65 },
  { id: 'c5', title: 'pgvector 768d nomic-embed', score: '0.975', x: 1.9, y: 2.0, z: -0.2, rotY: -0.65 },
  { id: 'c6', title: 'Portaria SES-DF nº 142/2024', score: '0.890', x: -1.4, y: 2.6, z: 0.7, rotY: 0.25 },
  { id: 'c7', title: 'Guia Rede Urgência DF', score: '0.933', x: 1.4, y: 2.7, z: 0.6, rotY: -0.25 },
  { id: 'c8', title: 'Central SAMU 192 DF', score: '0.865', x: -0.7, y: 2.9, z: 1.2, rotY: 0.15 },
  { id: 'c9', title: 'Hospital Regional Taguatinga', score: '0.842', x: 0.7, y: 3.0, z: 1.2, rotY: -0.15 },
  { id: 'c10', title: 'Farmácia de Alto Custo', score: '0.820', x: -1.9, y: 0.7, z: 0.5, rotY: 0.45 },
  { id: 'c11', title: 'UBS 1 Samambaia Sul', score: '0.878', x: 1.9, y: 0.8, z: 0.5, rotY: -0.45 },
  { id: 'c12', title: 'Triagem Clínica Preventiva', score: '0.905', x: 0.0, y: 0.7, z: 1.5, rotY: 0.0 },
  { id: 'c13', title: 'Classificação Risco Amarela', score: '0.925', x: -1.0, y: 1.7, z: 1.5, rotY: 0.2 },
  { id: 'c14', title: 'Central Regulação Leitos', score: '0.880', x: 1.0, y: 1.8, z: 1.5, rotY: -0.2 },
];

/**
 * Estações Arquitetônicas SUS Digital — Padrão High-End / Overkill
 * Modelos monumentais ampliados, rico detalhamento mecânico e matriz de chunks RAG em massa.
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
        emissiveIntensity: 1.3
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
        emissiveIntensity: 0.9
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
        emissiveIntensity: 0.9
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
      emissiveIntensity: 0.4
    };
  }, [status, isActive, execution?.outputData?.status]);

  // Altura calibrada das etiquetas acima dos modelos maiores
  const labelHeight = useMemo(() => {
    switch (station.id) {
      case 'input': return 3.6;
      case 'scope': return 3.5;
      case 'retrieval': return 4.3;
      case 'generation': return 4.6;
      case 'evidence': return 3.7;
      case 'output': return 4.1;
      default: return 3.6;
    }
  }, [station.id]);

  // Renderização arquitetônica ampliada e detalhada das 6 estações
  const renderStationArchitecture = () => {
    switch (station.id) {
      case 'input':
        // 1. Entrada da Pergunta: Grande Pórtico Monumental de Acolhimento
        return (
          <group position={[0, 0.12, 0]}>
            {/* Plinto de base escalonado amplo */}
            <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
              <cylinderGeometry args={[1.65, 1.95, 0.44, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[1.5, 1.55, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>
            {/* 16 aletas perimetrais de dissipação mecânica */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.7, 0.24, Math.sin(angle) * 1.7]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.04, 0.28, 0.15]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
                </mesh>
              );
            })}

            {/* Pórtico Escultural Ampliado: Arcos gêmeos de 3.2m de altura */}
            {[-1.15, 1.15].map((posX, i) => (
              <group key={i} position={[posX, 1.5, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.24, 2.6, 0.36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                {/* Canal de fibra óptica de LED vertical */}
                <mesh position={[posX > 0 ? -0.13 : 0.13, 0, 0]}>
                  <boxGeometry args={[0.035, 2.5, 0.08]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
                {/* Colar metálico de fixação na base */}
                <mesh position={[0, -1.2, 0]}>
                  <boxGeometry args={[0.34, 0.14, 0.44]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
                </mesh>
              </group>
            ))}

            {/* Viga transversal monumental com scanner volumétrico */}
            <mesh castShadow position={[0, 2.8, 0]}>
              <boxGeometry args={[2.6, 0.24, 0.42]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.66, 0]}>
              <boxGeometry args={[2.2, 0.04, 0.12]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* Console Tátil do Cidadão Ampliado */}
            <group position={[0, 0.85, 0.7]}>
              {/* Pedestal chanfrado */}
              <mesh castShadow position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.18, 0.3, 0.6, 16]} />
                <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.6} />
              </mesh>
              {/* Mesa de comando ampla */}
              <mesh castShadow position={[0, 0.12, 0]} rotation={[-0.35, 0, 0]}>
                <boxGeometry args={[1.2, 0.65, 0.1]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Display holográfico panorâmico */}
              <mesh position={[0, 0.13, 0.055]} rotation={[-0.35, 0, 0]}>
                <planeGeometry args={[1.08, 0.55]} />
                <meshPhysicalMaterial
                  color="#dbeafe"
                  roughness={0.1}
                  transmission={0.75}
                  thickness={0.4}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              {/* Leitor biométrico de Cartão SUS iluminado */}
              <mesh position={[0.42, 0.14, 0.06]} rotation={[-0.35, 0, 0]}>
                <circleGeometry args={[0.07, 16]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
            </group>

            {/* Núcleo de Admissão de Pergunta: Octaedro com anéis giroscópicos ampliados */}
            <group ref={innerRef} position={[0, 1.75, 0]}>
              <mesh castShadow>
                <octahedronGeometry args={[0.42, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.12}
                  metalness={0.9}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.62, 0.035, 16, 36]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.7} />
              </mesh>
              <mesh ref={secondaryRotatorRef} rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[0.52, 0.025, 16, 32]} />
                <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          </group>
        );

      case 'scope':
        // 2. Controle de Escopo: Câmara de Confinamento Octogonal & Escudo Bioético
        return (
          <group position={[0, 0.14, 0]}>
            {/* Base octogonal chanfrada de grande porte */}
            <mesh castShadow receiveShadow position={[0, 0.24, 0]}>
              <cylinderGeometry args={[1.75, 2.05, 0.48, 8]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[1.65, 1.7, 0.08, 8]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* 6 Torres perimétricas de contenção diagnóstica */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const px = Math.cos(angle) * 1.45;
              const pz = Math.sin(angle) * 1.45;
              return (
                <group key={i} position={[px, 1.35, pz]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.11, 0.15, 2.1, 16]} />
                    <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
                  </mesh>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.025, 1.8, 0.04]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                  <mesh position={[0, 1.1, 0]}>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                </group>
              );
            })}

            {/* Escudo Protetor Parabólico de Vidro Óptico Ampliado */}
            <mesh castShadow position={[0, 1.4, -0.65]}>
              <cylinderGeometry args={[1.65, 1.65, 1.7, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                roughness={0.1}
                transmission={0.8}
                thickness={0.9}
                ior={1.45}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Cruz Médica Bioética em LED Ampliada */}
            <group position={[0, 1.4, -0.56]}>
              <mesh>
                <boxGeometry args={[0.65, 0.18, 0.025]} />
                <meshBasicMaterial
                  color={status === 'warning' ? '#fbbf24' : '#10b981'}
                  opacity={0.95}
                  transparent
                />
              </mesh>
              <mesh>
                <boxGeometry args={[0.18, 0.65, 0.025]} />
                <meshBasicMaterial
                  color={status === 'warning' ? '#fbbf24' : '#10b981'}
                  opacity={0.95}
                  transparent
                />
              </mesh>
            </group>

            {/* Núcleo Giroscópico de Triagem Tri-axial Ampliado */}
            <group ref={innerRef} position={[0, 1.6, 0]}>
              {/* Anel Cardânico 1 */}
              <mesh castShadow>
                <torusGeometry args={[0.88, 0.075, 16, 40]} />
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
                <torusGeometry args={[0.68, 0.05, 16, 36]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Anel Cardânico 3 */}
              <mesh ref={secondaryRotatorRef} rotation={[0, Math.PI / 4, Math.PI / 4]}>
                <torusGeometry args={[0.48, 0.03, 16, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.95} />
              </mesh>
              {/* Esfera central de plasma */}
              <mesh>
                <sphereGeometry args={[0.24, 16, 16]} />
                <meshStandardMaterial
                  color={stateColors.glow}
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 1.6 : 0.6}
                />
              </mesh>
            </group>
          </group>
        );

      case 'retrieval':
        // 3. Base RAG: Monumento de Hiper-Densidade com 3 Monólitos + MATRIZ DE CHUNKS CARREGADAS
        return (
          <group position={[0, 0.16, 0]}>
            {/* Base retangular monumental em granito técnico com chanfros */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[3.6, 0.5, 3.6]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.28} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[3.85, 0.08, 3.85]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Monólito 1: Protocolos de Urgência & UPAs do DF (Altura 2.4m) */}
            <group position={[-1.0, 1.45, -0.85]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 2.2, 0.7]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Racks de dissipação térmica horizontais */}
              {[-0.8, -0.4, 0, 0.4, 0.8].map((posY, idx) => (
                <mesh key={idx} position={[0, posY, 0.36]}>
                  <boxGeometry args={[0.78, 0.045, 0.03]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
            </group>

            {/* Monólito 2: Grande Arquivo Central SES-DF (Altura 3.2m!) */}
            <group position={[1.0, 1.85, -0.8]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 3.0, 0.75]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.7} />
              </mesh>
              {/* Leitor óptico vertical de cartuchos de memória */}
              <mesh position={[0, 0, 0.39]}>
                <boxGeometry args={[0.65, 2.6, 0.04]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Indicadores LED de indexação semântica 768d */}
              {[-1.1, -0.7, -0.3, 0.1, 0.5, 0.9].map((posY, i) => (
                <mesh key={i} position={[0, posY, 0.42]}>
                  <boxGeometry args={[0.55, 0.035, 0.02]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
            </group>

            {/* Monólito 3: Diretrizes Clínicas e Especialidades (Altura 2.1m) */}
            <group position={[-0.95, 1.25, 0.95]}>
              <mesh castShadow>
                <boxGeometry args={[0.9, 1.8, 0.7]} />
                <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} />
              </mesh>
              <mesh position={[0, 0, 0.36]}>
                <boxGeometry args={[0.75, 1.4, 0.03]} />
                <meshBasicMaterial color="#10b981" opacity={0.7} transparent />
              </mesh>
            </group>

            {/* ========================================================= */}
            {/* MATRIZ DE CHUNKS CARREGADAS (14 Documentos RAG Flutuantes) */}
            {/* ========================================================= */}
            <group position={[0, 0, 0]}>
              {RAG_CHUNKS_DATA.map((chunk, idx) => {
                const isHighlight = status === 'completed' || isActive;
                const chunkColor = isHighlight ? (idx < 5 ? '#10b981' : '#38bdf8') : '#94a3b8';
                return (
                  <group
                    key={chunk.id}
                    position={[chunk.x, chunk.y, chunk.z]}
                    rotation={[0, chunk.rotY, 0]}
                  >
                    {/* Placa do Chunk de Documento em Vidro Óptico */}
                    <mesh castShadow>
                      <boxGeometry args={[0.78, 0.42, 0.025]} />
                      <meshPhysicalMaterial
                        color="#ffffff"
                        roughness={0.15}
                        transmission={0.75}
                        thickness={0.4}
                        transparent
                        opacity={0.85}
                      />
                    </mesh>

                    {/* Borda Iluminada de Indexação do Chunk */}
                    <mesh position={[0, 0, 0.014]}>
                      <boxGeometry args={[0.8, 0.44, 0.005]} />
                      <meshBasicMaterial
                        color={chunkColor}
                        wireframe
                        transparent
                        opacity={isHighlight ? 0.85 : 0.4}
                      />
                    </mesh>

                    {/* Linhas de texto codificadas simuladas no documento */}
                    {[-0.08, 0.0, 0.08].map((lineY, li) => (
                      <mesh key={li} position={[0, lineY, 0.016]}>
                        <boxGeometry args={[0.62 - li * 0.1, 0.02, 0.002]} />
                        <meshBasicMaterial color={chunkColor} opacity={0.75} transparent />
                      </mesh>
                    ))}

                    {/* Chip de Score de Similaridade na borda superior */}
                    <mesh position={[0.26, 0.16, 0.018]}>
                      <boxGeometry args={[0.18, 0.05, 0.004]} />
                      <meshBasicMaterial color={chunkColor} />
                    </mesh>

                    {/* Raio laser de conexão holográfica ligando ao núcleo de busca */}
                    {isHighlight && (
                      <mesh position={[-chunk.x * 0.4, -chunk.y * 0.3 + 0.5, -chunk.z * 0.4]}>
                        <boxGeometry args={[0.01, 0.01, 0.6]} />
                        <meshBasicMaterial color={chunkColor} opacity={0.3} transparent />
                      </mesh>
                    )}
                  </group>
                );
              })}
            </group>

            {/* Módulo Vetorial Central Flutuante com Feixe Laser de Busca */}
            <group ref={innerRef} position={[0.25, isActive ? 2.1 : 1.7, 0.4]}>
              <mesh castShadow>
                <boxGeometry args={[0.75, 1.0, 0.25]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 1.3 : 0.5}
                  roughness={0.15}
                  metalness={0.85}
                />
              </mesh>
              <mesh position={[0, 0, 0.14]}>
                <planeGeometry args={[0.6, 0.82]} />
                <meshBasicMaterial color={stateColors.glow} wireframe />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[0.65, 0.025, 16, 28]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
              </mesh>
            </group>
          </group>
        );

      case 'generation':
        // 4. Núcleo LLM Susana: Reator Neural Monumental com Cúpula de Niemeyer (Diâmetro 4.4m!)
        return (
          <group position={[0, 0.22, 0]}>
            {/* Dais Monumental com aletas radiais de refrigeração mecânica */}
            <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
              <cylinderGeometry args={[2.3, 2.65, 0.6, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[2.55, 2.6, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* 16 aletas radiais mecânicas do reator neural */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 2.45, 0.3, Math.sin(angle) * 2.45]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.05, 0.45, 0.24]} />
                  <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
                </mesh>
              );
            })}

            {/* Cúpula Translúcida do Reator Neural — Diâmetro 4.4m */}
            <mesh position={[0, 0.9, 0]}>
              <sphereGeometry args={[2.1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transmission={0.85}
                thickness={1.1}
                roughness={0.1}
                ior={1.48}
                transparent
                opacity={0.65}
              />
            </mesh>
            {/* Anel Equatorial em Titânio com LED integrado */}
            <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.12, 0.05, 16, 48]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.16, 0.02, 8, 48]} />
              <meshBasicMaterial color={stateColors.glow} />
            </mesh>

            {/* 4 Colunas Magnéticas de Levitação com Bobinas de Indução de Cobre */}
            {[-1.5, 1.5].map((px) =>
              [-1.5, 1.5].map((pz) => (
                <group key={`${px}-${pz}`} position={[px, 1.45, pz]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.12, 0.17, 2.3, 16]} />
                    <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.85} />
                  </mesh>
                  {/* Bobinas duplas de indução */}
                  <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
                    <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.9} />
                  </mesh>
                  <mesh position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
                    <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.9} />
                  </mesh>
                  {/* Esfera focal concentradora no topo */}
                  <mesh position={[0, 1.2, 0]}>
                    <sphereGeometry args={[0.11, 16, 16]} />
                    <meshBasicMaterial color={stateColors.glow} />
                  </mesh>
                </group>
              ))
            )}

            {/* REATOR NEURAL CENTRAL MONUMENTAL */}
            <group ref={innerRef} position={[0, 1.85, 0]}>
              {/* Dodecaedro cristalino interno */}
              <mesh castShadow>
                <dodecahedronGeometry args={[0.82, 0]} />
                <meshStandardMaterial
                  color={stateColors.base}
                  emissive={stateColors.base}
                  emissiveIntensity={isActive ? 1.4 : 0.5}
                  roughness={0.12}
                  metalness={0.88}
                />
              </mesh>
              {/* Gaiola de tensores neurais icosaédrica */}
              <mesh ref={auxiliaryRef}>
                <icosahedronGeometry args={[1.15, 0]} />
                <meshBasicMaterial
                  color={stateColors.glow}
                  wireframe
                  transparent
                  opacity={isActive ? 0.9 : 0.4}
                />
              </mesh>
              {/* Anéis orbitais de atenção Transformers duplos */}
              <mesh ref={secondaryRotatorRef} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1.35, 0.03, 16, 44]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
              </mesh>
              <mesh rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1.45, 0.02, 16, 44]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.4} />
              </mesh>
              {/* Luz focal volumétrica */}
              <pointLight
                color={stateColors.glow}
                intensity={isActive ? 3.8 : 1.0}
                distance={7.5}
              />
            </group>
          </group>
        );

      case 'evidence':
        // 5. Evidências: Grande Pavilhão de Auditoria e Transparência Governamental
        return (
          <group position={[0, 0.16, 0]}>
            {/* Plinto chanfrado amplo */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[3.2, 0.5, 2.8]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.3} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[3.45, 0.08, 3.05]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Colunas do pórtico de conferência em titânio polido */}
            <mesh castShadow position={[-1.1, 1.45, 0]}>
              <boxGeometry args={[0.28, 1.9, 1.7]} />
              <meshStandardMaterial color="#0a1b3d" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh castShadow position={[1.1, 1.45, 0]}>
              <boxGeometry args={[0.28, 1.9, 1.7]} />
              <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Janela central de inspeção em vidro translúcido */}
            <mesh position={[0, 1.45, 0]}>
              <boxGeometry args={[1.6, 1.65, 0.06]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                roughness={0.1}
                transmission={0.75}
                thickness={0.7}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Selo circular governamental de integridade oficial */}
            <mesh position={[0, 2.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.55, 0.64, 36]} />
              <meshBasicMaterial color="#10b981" opacity={0.9} transparent />
            </mesh>
            <mesh position={[0, 2.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.38, 0.46, 36]} />
              <meshBasicMaterial color="#10b981" opacity={0.6} transparent />
            </mesh>

            {/* Prisma hexagonal de auditoria de fontes com anéis duplos */}
            <group ref={innerRef} position={[0, 1.5, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.9, 6]} />
                <meshStandardMaterial
                  color={status === 'completed' ? stateColors.base : stateColors.base}
                  emissive={status === 'completed' ? stateColors.base : stateColors.base}
                  emissiveIntensity={stateColors.emissiveIntensity}
                  roughness={0.18}
                  metalness={0.75}
                />
              </mesh>
              <mesh ref={auxiliaryRef} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.65, 0.035, 16, 28]} />
                <meshBasicMaterial color={stateColors.glow} transparent opacity={0.75} />
              </mesh>
              <mesh ref={secondaryRotatorRef} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[0.55, 0.025, 16, 24]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.9} />
              </mesh>
            </group>
          </group>
        );

      case 'output':
      default:
        // 6. Saída: Terminal de Despacho Clínico com Grande Console Cantilever e Torre do DF
        return (
          <group position={[0, 0.14, 0]}>
            {/* Pedestal circular amplo em porcelana branca pura */}
            <mesh castShadow receiveShadow position={[0, 0.24, 0]}>
              <cylinderGeometry args={[1.8, 2.05, 0.48, 36]} />
              <meshStandardMaterial color={stateColors.pillar} roughness={0.25} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[2.1, 2.15, 0.08, 36]} />
              <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
            </mesh>

            {/* Torre de Transmissão da Rede de Saúde do DF (Altura 3.2m!) */}
            <group position={[0, 1.85, -0.85]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.2, 2.8, 16]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.85} />
              </mesh>
              {/* 4 Anéis emissores de micro-ondas de dados */}
              {[0.4, 0.9, 1.4, 1.9].map((posY, i) => (
                <mesh key={i} position={[0, posY, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.26 - i * 0.04, 0.025, 16, 24]} />
                  <meshBasicMaterial color={stateColors.glow} />
                </mesh>
              ))}
              {/* Beacon esférico transmissor no topo com luz pulsante */}
              <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshBasicMaterial color={stateColors.glow} />
              </mesh>
            </group>

            {/* Púlpito Tecnológico Cantilever com Display Panorâmico Curvo Ampliado */}
            <group ref={innerRef} position={[0, 1.45, 0.4]}>
              {/* Braço articulado cantilever */}
              <mesh castShadow position={[0, -0.35, 0]}>
                <boxGeometry args={[0.28, 0.7, 0.28]} />
                <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Moldura da tela curva ampla */}
              <mesh castShadow rotation={[-0.28, 0, 0]}>
                <boxGeometry args={[1.75, 1.05, 0.1]} />
                <meshStandardMaterial color="#0a1b3d" roughness={0.15} metalness={0.9} />
              </mesh>
              {/* Display holográfico de resposta */}
              <mesh position={[0, 0, 0.06]} rotation={[-0.28, 0, 0]}>
                <planeGeometry args={[1.6, 0.92]} />
                <meshStandardMaterial
                  color="#0a1b3d"
                  emissive={stateColors.glow}
                  emissiveIntensity={isActive ? 1.0 : 0.45}
                />
              </mesh>
              {/* Borda de acabamento de vidro óptico anti-reflexo */}
              <mesh position={[0, 0, 0.065]} rotation={[-0.28, 0, 0]}>
                <planeGeometry args={[1.68, 1.0]} />
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
      {/* Halo de seleção perimetral dinâmico ampliado */}
      {isSelected && (
        <group ref={haloRef} position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.4, 48]} />
            <meshBasicMaterial color="#2563eb" side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.46, 2.54, 48]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.6} transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Halo de hover suave ampliado */}
      {hovered && !isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <ringGeometry args={[2.1, 2.25, 36]} />
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
