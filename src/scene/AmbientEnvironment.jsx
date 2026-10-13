import React, { useMemo } from 'react';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * AmbientEnvironment — Contexto e Fundação SUS Digital
 * "Saúde pública, clara como água."
 * 
 * 1. Espelho d'água / lâmina líquida inferior com grid arquitetônico expandido.
 * 2. Pilares estruturais que ancoram a plataforma no leito do campus.
 * 3. Balizas de horizonte sutis que conectam a central à rede do DF.
 * 4. Partículas flutuantes de dados (Sparkles) que dão profundidade atmosférica.
 */
export default function AmbientEnvironment() {
  // Posições dos pilares de sustentação da plataforma principal (26 x 20)
  const pillarPositions = useMemo(() => [
    [-11.2, 8.4],
    [0, 8.4],
    [11.2, 8.4],
    [-11.2, -8.4],
    [0, -8.4],
    [11.2, -8.4]
  ], []);

  // Balizas perimétricas no horizonte (Regiões de Saúde conectadas)
  const perimeterBeacons = useMemo(() => [
    [-28, -22],
    [28, -22],
    [-28, 22],
    [28, 22]
  ], []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Lâmina d'água reflexiva inferior ("Clara como água") */}
      <mesh
        receiveShadow
        position={[0, -1.82, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#dbeafe"
          roughness={0.15}
          metalness={0.45}
        />
      </mesh>

      {/* 2. Grid arquitetônico milimétrico expandido sob a lâmina d'água */}
      <gridHelper
        args={[90, 45, '#93c5fd', '#dbeafe']}
        position={[0, -1.80, 0]}
      />

      {/* 3. Pilares estruturais de sustentação da plataforma */}
      {pillarPositions.map(([px, pz], idx) => (
        <group key={idx} position={[px, -1.34, pz]}>
          {/* Coluna principal de concreto técnico claro */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.44, 0.96, 24]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Colar superior de fixação da plataforma em Azul Profundo */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.48, 0.44, 0.08, 24]} />
            <meshStandardMaterial
              color="#1e40af"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Sapata submersa na linha da água */}
          <mesh position={[0, -0.44, 0]}>
            <cylinderGeometry args={[0.55, 0.58, 0.12, 24]} />
            <meshStandardMaterial
              color="#0a1b3d"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>

          {/* Anel luminoso na interface com a água */}
          <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.58, 0.68, 24]} />
            <meshBasicMaterial
              color="#60a5fa"
              opacity={0.4}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Balizas de horizonte conectadas (Regiões de Saúde SES-DF) */}
      {perimeterBeacons.map(([bx, bz], idx) => (
        <group key={idx} position={[bx, -1.8, bz]}>
          {/* Base cilíndrica baixa */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.6, 0.75, 0.5, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
          {/* Coluna transmissora fina que desvanece suavemente na neblina */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 2.6, 12]} />
            <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Ponto focal no topo */}
          <mesh position={[0, 3.15, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        </group>
      ))}

      {/* 5. Poeira de dados atmosférica (Sparkles) — sensação de tridimensionalidade viva */}
      <Sparkles
        count={50}
        scale={[34, 10, 28]}
        position={[0, 2.5, 0]}
        size={2.4}
        speed={0.25}
        opacity={0.55}
        color="#60a5fa"
      />
      <Sparkles
        count={35}
        scale={[30, 8, 24]}
        position={[0, 2.0, 0]}
        size={1.6}
        speed={0.15}
        opacity={0.35}
        color="#ffffff"
      />
    </group>
  );
}
