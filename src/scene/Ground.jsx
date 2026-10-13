import React from 'react';
import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios';

/**
 * Campus arquitetônico SUS Digital: "Saúde pública, clara como água."
 * Superfícies de cerâmica técnica branca (#ffffff / #f8fafc),
 * molduras e chanfros em Azul Profundo (#1e40af),
 * grid tecnológico de precisão em Azul Gelo (#dbeafe),
 * e plintos elevados com iluminação perimetral embutida.
 */
export default function Ground() {
  const walkways = [
    { from: [-9.0, 3.8], to: [-4.6, 1.8] },      // Input -> Scope
    { from: [-4.6, 1.8], to: [-2.0, -4.2] },     // Scope -> Retrieval
    { from: [-2.0, -4.2], to: [2.4, -0.4] },     // Retrieval -> Generation
    { from: [2.4, -0.4], to: [6.0, -3.6] },      // Generation -> Evidence
    { from: [6.0, -3.6], to: [9.2, 2.6] },       // Evidence -> Output
    { from: [-4.6, 1.8], to: [9.2, 2.6], bypass: true } // Scope -> Output Bypass
  ];

  return (
    <group position={[0, -0.02, 0]}>
      {/* 1. Base estrutural do campus em porcelana técnica limpa */}
      <mesh receiveShadow position={[0, -0.45, 0]}>
        <boxGeometry args={[26, 0.8, 20]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.85}
          metalness={0.06}
        />
      </mesh>

      {/* 2. Moldura chanfrada de contenção em Azul Profundo SUS Digital (#1e40af) */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[26.4, 0.08, 20.4]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 3. Rodapé técnico inferior em Azul Gelo (#dbeafe) */}
      <mesh position={[0, -0.86, 0]}>
        <boxGeometry args={[26.8, 0.04, 20.8]} />
        <meshStandardMaterial
          color="#dbeafe"
          roughness={0.4}
          metalness={0.4}
        />
      </mesh>

      {/* 4. Grid arquitetônico milimétrico sutil impresso no piso */}
      <gridHelper
        args={[24, 24, '#bfdbfe', '#e2e8f0']}
        position={[0, -0.045, 0]}
      />

      {/* 5. Vias de circulação pavimentadas com guias laterais e marcadores */}
      {walkways.map((w, idx) => {
        const dx = w.to[0] - w.from[0];
        const dz = w.to[1] - w.from[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        const midX = (w.from[0] + w.to[0]) / 2;
        const midZ = (w.from[1] + w.to[1]) / 2;
        const width = w.bypass ? 0.75 : 0.95;

        return (
          <group key={idx} position={[midX, 0.015, midZ]} rotation={[0, -angle, 0]}>
            {/* Faixa pavimentada clara */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[length, 0.02, width]} />
              <meshStandardMaterial
                color={w.bypass ? '#fef3c7' : '#ffffff'}
                roughness={0.75}
                metalness={0.08}
              />
            </mesh>
            {/* Guias de contenção em Azul Gelo com reflexo */}
            <mesh position={[0, 0.02, width / 2]}>
              <boxGeometry args={[length, 0.018, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.02, -width / 2]}>
              <boxGeometry args={[length, 0.018, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Linha central guia de fluxo */}
            <mesh position={[0, 0.012, 0]}>
              <boxGeometry args={[length * 0.92, 0.005, 0.03]} />
              <meshBasicMaterial color={w.bypass ? '#d97706' : '#60a5fa'} opacity={0.7} transparent />
            </mesh>
          </group>
        );
      })}

      {/* 6. Plintos arquitetônicos e terraços dedicados para as 6 estações */}
      {STATIONS_METADATA.map((station) => {
        const [x, , z] = station.position;

        switch (station.id) {
          case 'input':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Plinto duplo escalonado */}
                <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
                  <boxGeometry args={[3.4, 0.1, 3.4]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.7, 0.02, 3.7]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Canal de luz perimetral */}
                <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.45, 1.55, 36]} />
                  <meshBasicMaterial color="#60a5fa" opacity={0.6} transparent />
                </mesh>
              </group>
            );

          case 'scope':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Base octogonal chanfrada */}
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[2.0, 2.15, 0.14, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[2.25, 2.25, 0.02, 8]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Anel indicador de perímetro seguro */}
                <mesh position={[0, 0.135, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.75, 1.88, 8]} />
                  <meshBasicMaterial color="#2563eb" opacity={0.5} transparent />
                </mesh>
              </group>
            );

          case 'retrieval':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Base monumental retangular */}
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <boxGeometry args={[3.8, 0.14, 3.8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[4.1, 0.02, 4.1]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Tablado elevado de acervo documental */}
                <mesh receiveShadow position={[0, 0.14, 0]}>
                  <boxGeometry args={[3.2, 0.04, 3.2]} />
                  <meshStandardMaterial color="#f0f6fc" roughness={0.5} metalness={0.15} />
                </mesh>
              </group>
            );

          case 'generation':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Plinto circular central do modelo */}
                <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[2.4, 2.6, 0.18, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.55} metalness={0.15} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[2.75, 2.75, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Anel de indução luminoso */}
                <mesh position={[0, 0.175, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.1, 2.25, 48]} />
                  <meshBasicMaterial color="#2563eb" opacity={0.5} transparent />
                </mesh>
              </group>
            );

          case 'evidence':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Base de auditoria */}
                <mesh receiveShadow castShadow position={[0, 0.07, 0]}>
                  <boxGeometry args={[3.4, 0.15, 3.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.7, 0.02, 3.5]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.35, 1.48, 32]} />
                  <meshBasicMaterial color="#16a34a" opacity={0.45} transparent />
                </mesh>
              </group>
            );

          case 'output':
          default:
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                {/* Base do terminal de resposta */}
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <boxGeometry args={[3.2, 0.12, 3.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.005, 0]}>
                  <boxGeometry args={[3.5, 0.02, 3.5]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.3, 1.42, 36]} />
                  <meshBasicMaterial color="#1e40af" opacity={0.45} transparent />
                </mesh>
              </group>
            );
        }
      })}
    </group>
  );
}
