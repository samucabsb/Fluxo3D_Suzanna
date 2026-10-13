import React, { useMemo } from 'react';
import { Sparkles, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * AmbientEnvironment — Lâmina Líquida Fotorrealista e Fundação SUS Digital
 * Integrada ao chão contínuo da esplanada de Brasília
 */
export default function AmbientEnvironment() {
  // Balizas das Regiões de Saúde do DF no horizonte da esplanada
  const dfHealthRegions = useMemo(() => [
    { name: 'Região Central (Plano Piloto)', pos: [0, -36] },
    { name: 'Região Oeste (Ceilândia/Taguatinga)', pos: [-36, -10] },
    { name: 'Região Norte (Sobradinho/Planaltina)', pos: [-30, 28] },
    { name: 'Região Sul (Gama/Santa Maria)', pos: [32, 26] },
    { name: 'Região Sudoeste (Samambaia/Recanto)', pos: [38, -10] },
    { name: 'Região Leste (Paranoá/São Sebastião)', pos: [26, -32] }
  ], []);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. ESPELHOS D'ÁGUA REFLEXIVOS EM TEMPO REAL NO PISO      */}
      {/* ========================================================= */}
      {/* Bacia Norte (Em frente ao Congresso Nacional e Catedral) */}
      <mesh
        receiveShadow
        position={[0, 0.012, -17.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[30.0, 6.0]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mirror={0.7}
          mixBlur={1.0}
          mixStrength={2.0}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#cbe2fe"
          metalness={0.3}
        />
      </mesh>

      {/* Bacia Sul (Em frente aos Jardins e Alvorada) */}
      <mesh
        receiveShadow
        position={[0, 0.012, 17.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[30.0, 6.0]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mirror={0.7}
          mixBlur={1.0}
          mixStrength={2.0}
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#cbe2fe"
          metalness={0.3}
        />
      </mesh>

      {/* ========================================================= */}
      {/* 2. BALIZAS CONECTADAS ÀS REGIÕES DE SAÚDE DO DF          */}
      {/* ========================================================= */}
      {dfHealthRegions.map((region, idx) => (
        <group key={idx} position={[region.pos[0], 0, region.pos[1]]}>
          {/* Base sobre o piso contínuo */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.7, 0.9, 0.5, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.35} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.6, 0.65, 0.08, 16]} />
            <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
          </mesh>
          {/* Mastro transmissor vertical */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.05, 0.09, 3.4, 12]} />
            <meshStandardMaterial color="#0a1b3d" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Anéis de ressonância no mastro */}
          {[1.4, 2.2, 3.0].map((ry, ri) => (
            <mesh key={ri} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18 - ri * 0.03, 0.02, 16, 24]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}
          {/* Ponto focal de sinal na extremidade */}
          <mesh position={[0, 3.95, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 3. PARTÍCULAS ATMOSFÉRICAS DE DADOS (SPARKLES SUS)        */}
      {/* ========================================================= */}
      <Sparkles
        count={70}
        scale={[42, 14, 36]}
        position={[0, 3.2, 0]}
        size={2.8}
        speed={0.25}
        opacity={0.65}
        color="#38bdf8"
      />
      <Sparkles
        count={50}
        scale={[36, 10, 30]}
        position={[0, 2.4, 0]}
        size={2.0}
        speed={0.18}
        opacity={0.5}
        color="#ffffff"
      />
      <Sparkles
        count={35}
        scale={[30, 8, 26]}
        position={[0, 2.0, 0]}
        size={2.2}
        speed={0.2}
        opacity={0.55}
        color="#34d399"
      />
    </group>
  );
}
