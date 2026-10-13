import React from 'react';
import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios';

/**
 * Ground — QG Tecnológico Susana AI (Centro da Cidade)
 * 
 * Praça central limpa em porcelana técnica com zero z-fighting,
 * perfeitamente conectada às avenidas da cidade ao redor.
 */
export default function Ground() {
  const walkways = [
    { from: [-12.0, 4.8], to: [-6.0, 2.2] },      // Input -> Scope
    { from: [-6.0, 2.2], to: [-2.5, -5.5] },     // Scope -> Retrieval
    { from: [-2.5, -5.5], to: [3.2, -0.5] },     // Retrieval -> Generation
    { from: [3.2, -0.5], to: [8.0, -4.8] },      // Generation -> Evidence
    { from: [8.0, -4.8], to: [12.5, 3.4] },      // Evidence -> Output
    { from: [-6.0, 2.2], to: [12.5, 3.4], bypass: true } // Scope -> Output Bypass
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. PRAÇA PRINCIPAL SUSANA AI (QG CENTRAL DA CIDADE)       */}
      {/* ========================================================= */}
      {/* Base sólida de porcelana branca polida */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[33.0, 0.16, 23.0]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* Chanfro perimetral em Azul Profundo SUS (#1e40af) */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[33.4, 0.08, 23.4]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Friso perimetral luminoso embutido */}
      <group position={[0, 0.125, 0]}>
        <mesh position={[0, 0, -11.45]}>
          <boxGeometry args={[32.8, 0.01, 0.05]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0, 11.45]}>
          <boxGeometry args={[32.8, 0.01, 0.05]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-16.45, 0, 0]}>
          <boxGeometry args={[0.05, 0.01, 22.8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[16.45, 0, 0]}>
          <boxGeometry args={[0.05, 0.01, 22.8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. CRUZ DA SAÚDE DO SUS (GRAVADA NO PISO)                 */}
      {/* ========================================================= */}
      <group position={[0.5, 0.125, -0.2]}>
        {/* Braço horizontal */}
        <mesh receiveShadow position={[0, 0.002, 0]}>
          <boxGeometry args={[8.4, 0.004, 2.0]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Braço vertical */}
        <mesh receiveShadow position={[0, 0.002, 0]}>
          <boxGeometry args={[2.0, 0.004, 8.4]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Linhas de bio-LED verde no centro da cruz */}
        <mesh position={[0, 0.006, 0]}>
          <boxGeometry args={[8.0, 0.004, 0.04]} />
          <meshBasicMaterial color="#10b981" opacity={0.8} transparent />
        </mesh>
        <mesh position={[0, 0.006, 0]}>
          <boxGeometry args={[0.04, 0.004, 8.0]} />
          <meshBasicMaterial color="#10b981" opacity={0.8} transparent />
        </mesh>
        {/* Anel de indução de saúde */}
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.45, 36]} />
          <meshBasicMaterial color="#0284c7" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 3. VIAS DE CIRCULAÇÃO PAVIMENTADAS E GUIAS LUMINOSAS      */}
      {/* ========================================================= */}
      {walkways.map((w, idx) => {
        const dx = w.to[0] - w.from[0];
        const dz = w.to[1] - w.from[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        const midX = (w.from[0] + w.to[0]) / 2;
        const midZ = (w.from[1] + w.to[1]) / 2;
        const width = w.bypass ? 0.75 : 0.95;

        return (
          <group key={idx} position={[midX, 0.125, midZ]} rotation={[0, -angle, 0]}>
            {/* Faixa pavimentada clara */}
            <mesh receiveShadow position={[0, 0.004, 0]}>
              <boxGeometry args={[length, 0.008, width]} />
              <meshStandardMaterial
                color={w.bypass ? '#fffbeb' : '#ffffff'}
                roughness={0.4}
                metalness={0.08}
              />
            </mesh>
            {/* Guias laterais em Azul Gelo com reflexo */}
            <mesh position={[0, 0.01, width / 2]}>
              <boxGeometry args={[length, 0.01, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.01, -width / 2]}>
              <boxGeometry args={[length, 0.01, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Linha central guia de fluxo */}
            <mesh position={[0, 0.012, 0]}>
              <boxGeometry args={[length * 0.94, 0.004, 0.04]} />
              <meshBasicMaterial color={w.bypass ? '#d97706' : '#38bdf8'} opacity={0.8} transparent />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 4. PLINTOS DAS 6 ESTAÇÕES                                 */}
      {/* ========================================================= */}
      {STATIONS_METADATA.map((station) => {
        const [x, , z] = station.position;

        switch (station.id) {
          case 'input':
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
                  <boxGeometry args={[3.2, 0.1, 3.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.5, 0.02, 3.5]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.4, 1.52, 36]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.7} transparent />
                </mesh>
              </group>
            );

          case 'scope':
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[1.9, 2.05, 0.12, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[2.2, 2.2, 0.02, 8]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.7, 1.82, 8]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
                </mesh>
              </group>
            );

          case 'retrieval':
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <boxGeometry args={[3.6, 0.12, 3.6]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.9, 0.02, 3.9]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
              </group>
            );

          case 'generation':
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.07, 0]}>
                  <cylinderGeometry args={[2.3, 2.5, 0.14, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.28} metalness={0.12} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[2.65, 2.65, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.0, 2.15, 48]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.7} transparent />
                </mesh>
              </group>
            );

          case 'evidence':
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <boxGeometry args={[3.2, 0.12, 3.0]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.5, 0.02, 3.3]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.35, 1.48, 32]} />
                  <meshBasicMaterial color="#10b981" opacity={0.65} transparent />
                </mesh>
              </group>
            );

          case 'output':
          default:
            return (
              <group key={station.id} position={[x, 0.12, z]}>
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[1.6, 1.75, 0.12, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[1.9, 1.9, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.35, 1.48, 36]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
                </mesh>
              </group>
            );
        }
      })}
    </group>
  );
}
