import React from 'react';
import * as THREE from 'three';
import { STATIONS_METADATA } from '../data/demoScenarios';

/**
 * Ground — Esplanada Monumental Contínua do SUS Digital e Brasília
 * 
 * 1. Chão contínuo e infinito: Plano monumental que se estende por 600 metros,
 *    eliminando qualquer sensação de plataforma suspensa ou corte no vazio.
 * 2. Espelhos d'água integrados (Niemeyer): Bacias reflexivas rasas embutidas diretamente
 *    no piso da esplanada com bordas de mármore técnico branco puro e canais LED.
 * 3. Cruz da Saúde do SUS Monumental gravada no piso com bio-LED esmeralda e ciano.
 * 4. Vias de circulação pavimentadas de alta precisão entre as 6 estações.
 * 5. Plintos dedicados e imponentes para ancorar os modelos de grande escala.
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
      {/* 1. CHÃO CONTÍNUO E MONUMENTAL (600m x 600m)              */}
      {/* ========================================================= */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.32}
          metalness={0.05}
        />
      </mesh>

      {/* Grid arquitetônico de precisão milimétrica contínuo no piso */}
      <gridHelper
        args={[400, 100, '#bfdbfe', '#e2e8f0']}
        position={[0, 0.001, 0]}
      />

      {/* ========================================================= */}
      {/* 2. PRAÇA CENTRAL CÍVICA DO SUS (Área das Estações)       */}
      {/* ========================================================= */}
      {/* Tablado sutil de porcelana técnica polida com chanfro bisotado */}
      <mesh receiveShadow position={[0, 0.005, 0]}>
        <boxGeometry args={[32.0, 0.02, 24.0]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.22}
          metalness={0.06}
        />
      </mesh>
      {/* Moldura em Azul Profundo SUS (#1e40af) ao redor da praça central */}
      <mesh position={[0, 0.004, 0]}>
        <boxGeometry args={[32.4, 0.012, 24.4]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
      {/* Fita perimetral de LED Ciano contínua embutida no piso */}
      <group position={[0, 0.016, 0]}>
        <mesh position={[0, 0, -12.18]}>
          <boxGeometry args={[32.2, 0.008, 0.06]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0, 12.18]}>
          <boxGeometry args={[32.2, 0.008, 0.06]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-16.18, 0, 0]}>
          <boxGeometry args={[0.06, 0.008, 24.2]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[16.18, 0, 0]}>
          <boxGeometry args={[0.06, 0.008, 24.2]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 3. ESPELHOS D'ÁGUA INTEGRADORES (Embutidos no Piso)       */}
      {/* ========================================================= */}
      {/* Espelho d'Água Norte (Diante do Congresso e Catedral) */}
      <group position={[0, 0.008, -17.5]}>
        {/* Lâmina líquida */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[30.0, 0.015, 6.0]} />
          <meshStandardMaterial
            color="#cbe2fe"
            roughness={0.12}
            metalness={0.4}
          />
        </mesh>
        {/* Moldura de mármore branco em volta da água */}
        <mesh position={[0, 0.01, -3.05]}>
          <boxGeometry args={[30.4, 0.03, 0.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.01, 3.05]}>
          <boxGeometry args={[30.4, 0.03, 0.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Friso luminoso de LED azul na água */}
        <mesh position={[0, 0.018, 0]}>
          <boxGeometry args={[29.6, 0.005, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Espelho d'Água Sul (Fronteira com os Jardins) */}
      <group position={[0, 0.008, 17.5]}>
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[30.0, 0.015, 6.0]} />
          <meshStandardMaterial
            color="#cbe2fe"
            roughness={0.12}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.01, -3.05]}>
          <boxGeometry args={[30.4, 0.03, 0.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.01, 3.05]}>
          <boxGeometry args={[30.4, 0.03, 0.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.018, 0]}>
          <boxGeometry args={[29.6, 0.005, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 4. CRUZ DA SAÚDE DO SUS (GRAVADA NO CENTRO DA PRAÇA)     */}
      {/* ========================================================= */}
      <group position={[0.5, 0.018, -0.2]}>
        {/* Braço horizontal em vidro jateado */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[9.6, 0.006, 2.4]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
        {/* Braço vertical em vidro jateado */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.006, 9.6]} />
          <meshStandardMaterial
            color="#f0fdf4"
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        {/* Fitas LED internas em Verde Saúde (#10b981) */}
        <mesh position={[0, 0.004, 0]}>
          <boxGeometry args={[9.2, 0.004, 0.05]} />
          <meshBasicMaterial color="#10b981" opacity={0.75} transparent />
        </mesh>
        <mesh position={[0, 0.004, 0]}>
          <boxGeometry args={[0.05, 0.004, 9.2]} />
          <meshBasicMaterial color="#10b981" opacity={0.75} transparent />
        </mesh>

        {/* Anéis concêntricos de bio-acolhimento SUS */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.58, 36]} />
          <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.68, 1.76, 36]} />
          <meshBasicMaterial color="#10b981" opacity={0.5} transparent />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 5. VIAS DE CIRCULAÇÃO PAVIMENTADAS E GUIAS LUMINOSAS      */}
      {/* ========================================================= */}
      {walkways.map((w, idx) => {
        const dx = w.to[0] - w.from[0];
        const dz = w.to[1] - w.from[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        const midX = (w.from[0] + w.to[0]) / 2;
        const midZ = (w.from[1] + w.to[1]) / 2;
        const width = w.bypass ? 0.85 : 1.1;

        return (
          <group key={idx} position={[midX, 0.02, midZ]} rotation={[0, -angle, 0]}>
            {/* Faixa pavimentada clara */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[length, 0.015, width]} />
              <meshStandardMaterial
                color={w.bypass ? '#fffbeb' : '#ffffff'}
                roughness={0.4}
                metalness={0.08}
              />
            </mesh>
            {/* Guias laterais em Azul Gelo com reflexo */}
            <mesh position={[0, 0.012, width / 2]}>
              <boxGeometry args={[length, 0.014, 0.05]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.012, -width / 2]}>
              <boxGeometry args={[length, 0.014, 0.05]} />
              <meshStandardMaterial color="#93c5fd" roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Linha central guia de fluxo */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[length * 0.94, 0.005, 0.05]} />
              <meshBasicMaterial color={w.bypass ? '#d97706' : '#38bdf8'} opacity={0.8} transparent />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 6. PLINTOS IMPONENTES DAS 6 ESTAÇÕES                      */}
      {/* ========================================================= */}
      {STATIONS_METADATA.map((station) => {
        const [x, , z] = station.position;

        switch (station.id) {
          case 'input':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.07, 0]}>
                  <boxGeometry args={[3.8, 0.14, 3.8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[4.1, 0.02, 4.1]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.65, 1.78, 36]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.75} transparent />
                </mesh>
              </group>
            );

          case 'scope':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[2.3, 2.45, 0.16, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[2.55, 2.55, 0.02, 8]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.0, 2.15, 8]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
                </mesh>
              </group>
            );

          case 'retrieval':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.09, 0]}>
                  <boxGeometry args={[4.4, 0.18, 4.4]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[4.7, 0.02, 4.7]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh receiveShadow position={[0, 0.185, 0]}>
                  <boxGeometry args={[3.8, 0.03, 3.8]} />
                  <meshStandardMaterial color="#f0fdf4" roughness={0.35} metalness={0.1} />
                </mesh>
              </group>
            );

          case 'generation':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[2.8, 3.0, 0.2, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.12} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[3.2, 3.2, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.5, 2.68, 48]} />
                  <meshBasicMaterial color="#38bdf8" opacity={0.7} transparent />
                </mesh>
              </group>
            );

          case 'evidence':
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.09, 0]}>
                  <boxGeometry args={[4.0, 0.18, 3.8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <boxGeometry args={[4.3, 0.02, 4.1]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.185, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.6, 1.74, 32]} />
                  <meshBasicMaterial color="#10b981" opacity={0.65} transparent />
                </mesh>
              </group>
            );

          case 'output':
          default:
            return (
              <group key={station.id} position={[x, 0.02, z]}>
                <mesh receiveShadow castShadow position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[2.0, 2.2, 0.16, 36]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[2.35, 2.35, 0.02, 36]} />
                  <meshStandardMaterial color="#1e40af" roughness={0.25} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.7, 1.84, 36]} />
                  <meshBasicMaterial color="#0284c7" opacity={0.65} transparent />
                </mesh>
              </group>
            );
        }
      })}
    </group>
  );
}
