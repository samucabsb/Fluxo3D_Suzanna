import React from 'react';
import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios';

/**
 * Campus Arquitetônico SUS Digital: "Saúde pública, clara como água."
 * 
 * 1. Esplanada Superior em Porcelana Acetinada Pura (#ffffff / #f8fafc)
 * 2. Cruz da Saúde do SUS gravada no piso com iluminação de bio-LED (Esmeralda & Ciano)
 * 3. Molduras chanfradas em Azul Profundo (#1e40af) e friso perimetral luminoso (#38bdf8)
 * 4. Vias de circulação pavimentadas com canaletas de luz de dados
 * 5. Plintos dedicados de alta precisão para cada estação
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
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. ESPLANADA PRINCIPAL — PORCELANA TÉCNICA BRANCA PURA    */}
      {/* ========================================================= */}
      {/* Topo nivelado exatamente em y = 0.0 */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[26.0, 0.4, 20.0]} />
        <meshStandardMaterial
          color="#fcfdfd"
          roughness={0.28}
          metalness={0.04}
        />
      </mesh>

      {/* Moldura chanfrada intermediária em Azul Profundo SUS (#1e40af) */}
      <mesh position={[0, -0.24, 0]}>
        <boxGeometry args={[26.4, 0.1, 20.4]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Rodapé estrutural da esplanada em Titânio Escovado Ink (#0a1b3d) */}
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[26.8, 0.12, 20.8]} />
        <meshStandardMaterial
          color="#0a1b3d"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Friso perimetral contínuo em fita de LED Azul Ciano ao redor de toda a esplanada */}
      <group position={[0, 0.004, 0]}>
        {/* Borda Norte */}
        <mesh position={[0, 0, -9.96]}>
          <boxGeometry args={[25.8, 0.008, 0.06]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Borda Sul */}
        <mesh position={[0, 0, 9.96]}>
          <boxGeometry args={[25.8, 0.008, 0.06]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Borda Oeste */}
        <mesh position={[-12.96, 0, 0]}>
          <boxGeometry args={[0.06, 0.008, 19.8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Borda Leste */}
        <mesh position={[12.96, 0, 0]}>
          <boxGeometry args={[0.06, 0.008, 19.8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Grid arquitetônico milimétrico sutil impresso no piso de porcelana */}
      <gridHelper
        args={[25, 25, '#93c5fd', '#e2e8f0']}
        position={[0, 0.002, 0]}
      />

      {/* ========================================================= */}
      {/* 2. CRUZ DA SAÚDE DO SUS (GRAVADA NO PISO DA ESPLANADA)    */}
      {/* ========================================================= */}
      <group position={[0.5, 0.003, -0.2]}>
        {/* Braço horizontal da Cruz da Saúde em vidro jateado claro */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[8.8, 0.005, 2.2]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Braço vertical da Cruz da Saúde em vidro jateado claro */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.005, 8.8]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Fitas LED internas da Cruz em Verde Esmeralda da Saúde (#10b981) */}
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[8.4, 0.004, 0.04]} />
          <meshBasicMaterial color="#10b981" opacity={0.65} transparent />
        </mesh>
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[0.04, 0.004, 8.4]} />
          <meshBasicMaterial color="#10b981" opacity={0.65} transparent />
        </mesh>

        {/* Anel central de bio-energia com pulso de acolhimento SUS */}
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.48, 36]} />
          <meshBasicMaterial color="#0284c7" opacity={0.55} transparent />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.56, 1.64, 36]} />
          <meshBasicMaterial color="#10b981" opacity={0.4} transparent />
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
          <group key={idx} position={[midX, 0.015, midZ]} rotation={[0, -angle, 0]}>
            {/* Faixa pavimentada em porcelana clara */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[length, 0.015, width]} />
              <meshStandardMaterial
                color={w.bypass ? '#fffbeb' : '#ffffff'}
                roughness={0.5}
                metalness={0.08}
              />
            </mesh>
            {/* Guias laterais em Azul Gelo com reflexo */}
            <mesh position={[0, 0.012, width / 2]}>
              <boxGeometry args={[length, 0.014, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.012, -width / 2]}>
              <boxGeometry args={[length, 0.014, 0.04]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Linha central guia de fluxo */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[length * 0.92, 0.005, 0.04]} />
              <meshBasicMaterial color={w.bypass ? '#d97706' : '#38bdf8'} opacity={0.75} transparent />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 4. PLINTOS ARQUITETÔNICOS DAS 6 ESTAÇÕES                  */}
      {/* ========================================================= */}
      {STATIONS_METADATA.map((station) => {
        const [x, , z] = station.position;

        switch (station.id) {
          case 'input':
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.06, 0]}>
                  <boxGeometry args={[3.4, 0.12, 3.4]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[3.7, 0.02, 3.7]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.45, 1.55, 36]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.7} transparent />
                </mesh>
              </group>
            );

          case 'scope':
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.07, 0]}>
                  <cylinderGeometry args={[2.0, 2.15, 0.14, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[2.25, 2.25, 0.02, 8]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.75, 1.88, 8]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.6} transparent />
                </mesh>
              </group>
            );

          case 'retrieval':
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
                  <boxGeometry args={[3.8, 0.16, 3.8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[4.1, 0.02, 4.1]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh receiveShadow position={[0, 0.165, 0]}>
                  <boxGeometry args={[3.2, 0.03, 3.2]} />
                  <meshStandardMaterial color="#f0fdf4" roughness={0.4} metalness={0.1} />
                </mesh>
              </group>
            );

          case 'generation':
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.09, 0]}>
                  <cylinderGeometry args={[2.4, 2.6, 0.18, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.28} metalness={0.12} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[2.75, 2.75, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.185, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.1, 2.25, 48]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.65} transparent />
                </mesh>
              </group>
            );

          case 'evidence':
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
                  <boxGeometry args={[3.4, 0.16, 3.2]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[3.7, 0.02, 3.5]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.35, 1.48, 32]} />
                  <meshBasicMaterial color="#10b981" opacity={0.6} transparent />
                </mesh>
              </group>
            );

          case 'output':
          default:
            return (
              <group key={station.id} position={[x, 0.01, z]}>
                <mesh receiveShadow castShadow position={[0, 0.07, 0]}>
                  <cylinderGeometry args={[1.7, 1.85, 0.14, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[2.0, 2.0, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.4, 1.52, 36]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.6} transparent />
                </mesh>
              </group>
            );
        }
      })}
    </group>
  );
}
