import React, { useMemo } from 'react';
import { Sparkles, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * AmbientEnvironment — Lâmina Líquida Fotorrealista e Fundação SUS Digital
 * "Saúde pública, clara como água."
 * 
 * 1. Espelho d'água com MeshReflectorMaterial em tempo real refletindo a arquitetura
 * 2. Pilares estruturais que ancoram a esplanada flutuante no leito do Lago Paranoá
 * 3. Grid de precisão subaquático em Azul Gelo
 * 4. Balizas no horizonte conectando as 7 Regiões de Saúde do Distrito Federal
 * 5. Partículas atmosféricas de dados em suspensão
 */
export default function AmbientEnvironment() {
  // Posições dos pilares de sustentação da esplanada (26 x 20)
  const pillarPositions = useMemo(() => [
    [-11.2, 8.4],
    [0, 8.4],
    [11.2, 8.4],
    [-11.2, -8.4],
    [0, -8.4],
    [11.2, -8.4]
  ], []);

  // Balizas das Regiões de Saúde do DF no horizonte
  const dfHealthRegions = useMemo(() => [
    { name: 'Região Central (Plano Piloto)', pos: [0, -32] },
    { name: 'Região Oeste (Ceilândia/Taguatinga)', pos: [-30, -10] },
    { name: 'Região Norte (Sobradinho/Planaltina)', pos: [-24, 24] },
    { name: 'Região Sul (Gama/Santa Maria)', pos: [26, 22] },
    { name: 'Região Sudoeste (Samambaia/Recanto)', pos: [32, -8] },
    { name: 'Região Leste (Paranoá/São Sebastião)', pos: [22, -26] }
  ], []);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. LÂMINA D'ÁGUA REFLEXIVA EM TEMPO REAL ("CLARA COMO ÁGUA")*/}
      {/* ========================================================= */}
      <mesh
        receiveShadow
        position={[0, -1.82, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[800, 800]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mirror={0.65}
          mixBlur={1.0}
          mixStrength={1.8}
          roughness={0.18}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#cbe2fe"
          metalness={0.35}
        />
      </mesh>

      {/* Grid arquitetônico de precisão subaquático expandido até dissolver no horizonte */}
      <gridHelper
        args={[500, 125, '#93c5fd', '#dbeafe']}
        position={[0, -1.80, 0]}
      />

      {/* ========================================================= */}
      {/* 2. PILARES ESTRUTURAIS DE ANCORAGEM NO LEITO DO LAGO      */}
      {/* ========================================================= */}
      {pillarPositions.map(([px, pz], idx) => (
        <group key={idx} position={[px, -1.1, pz]}>
          {/* Fuste principal da coluna em concreto polido branco */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.44, 1.44, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.4}
              metalness={0.08}
            />
          </mesh>

          {/* Colar superior de engaste na esplanada em Azul Profundo */}
          <mesh position={[0, 0.68, 0]}>
            <cylinderGeometry args={[0.5, 0.46, 0.1, 24]} />
            <meshStandardMaterial
              color="#1e40af"
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>

          {/* Sapata subaquática na lâmina d'água */}
          <mesh position={[0, -0.68, 0]}>
            <cylinderGeometry args={[0.58, 0.62, 0.14, 24]} />
            <meshStandardMaterial
              color="#0a1b3d"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Anel de luz aquático de interface */}
          <mesh position={[0, -0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, 0.74, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              opacity={0.65}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 3. BALIZAS CONECTADAS ÀS REGIÕES DE SAÚDE DO DF          */}
      {/* ========================================================= */}
      {dfHealthRegions.map((region, idx) => (
        <group key={idx} position={[region.pos[0], -1.8, region.pos[1]]}>
          {/* Base sobre a água */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 0.5, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Haste transmissora que desvanece suavemente no horizonte */}
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 3.0, 12]} />
            <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Ponto focal de sinal na extremidade */}
          <mesh position={[0, 3.55, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 4. PARTÍCULAS ATMOSFÉRICAS DE DADOS (SPARKLES SUS)        */}
      {/* ========================================================= */}
      <Sparkles
        count={60}
        scale={[38, 12, 32]}
        position={[0, 3.0, 0]}
        size={2.6}
        speed={0.25}
        opacity={0.6}
        color="#38bdf8"
      />
      <Sparkles
        count={40}
        scale={[32, 8, 26]}
        position={[0, 2.2, 0]}
        size={1.8}
        speed={0.18}
        opacity={0.45}
        color="#ffffff"
      />
      <Sparkles
        count={25}
        scale={[28, 6, 22]}
        position={[0, 1.8, 0]}
        size={2.0}
        speed={0.2}
        opacity={0.5}
        color="#34d399"
      />
    </group>
  );
}
