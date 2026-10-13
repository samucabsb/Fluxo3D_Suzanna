import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * BrasiliaArchitecture — Monumentos Icônicos do Distrito Federal
 * Arquitetura de Oscar Niemeyer e paisagismo de Burle Marx
 * 
 * 1. Colunata do Palácio da Alvorada: As famosas colunas ogivais biconvexas
 *    emoldurando a esplanada tecnológica sobre a lâmina d'água.
 * 2. Congresso Nacional: Torres gêmeas H com as cúpulas do Senado e da Câmara no horizonte.
 * 3. Catedral Metropolitana de Brasília: Coroa de colunas hiperbólicas convergentes.
 * 4. Ponte JK: Arcos parabólicos assimétricos cruzando a água no horizonte leste.
 * 5. Jardins de Burle Marx: Canteiros orgânicos sinuosos flutuando no espelho d'água.
 */

// Geometria procedural da Coluna do Palácio da Alvorada
function createAlvoradaColumnGeometry() {
  const shape = new THREE.Shape();
  // Silhueta externa ogival biconvexa de Niemeyer
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(-0.48, 1.1, -0.62, 2.3);
  shape.quadraticCurveTo(-0.48, 3.2, 0, 3.8);
  shape.quadraticCurveTo(0.48, 3.2, 0.62, 2.3);
  shape.quadraticCurveTo(0.48, 1.1, 0, 0);

  // Vão central vazado característico
  const hole = new THREE.Path();
  hole.moveTo(0, 0.45);
  hole.quadraticCurveTo(0.28, 1.4, 0.36, 2.2);
  hole.quadraticCurveTo(0.24, 3.0, 0, 3.35);
  hole.quadraticCurveTo(-0.24, 3.0, -0.36, 2.2);
  hole.quadraticCurveTo(-0.28, 1.4, 0, 0.45);
  shape.holes.push(hole);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  });
}

export default function BrasiliaArchitecture() {
  // Geometria única compartilhada para todas as colunas da Alvorada
  const alvoradaGeo = useMemo(() => createAlvoradaColumnGeometry(), []);

  // Posições da colunata da Alvorada ao longo do deque sul da esplanada
  const colonnadePositions = useMemo(() => {
    const list = [];
    // 7 colunas espaçadas de x = -10.5 até x = 10.5 na borda posterior (z = -9.6)
    for (let x = -10.5; x <= 10.5; x += 3.5) {
      list.push([x, -0.05, -9.6]);
    }
    return list;
  }, []);

  // Colunas da Catedral de Brasília (16 nervuras hiperbólicas)
  const cathedralRibs = useMemo(() => {
    const ribs = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      ribs.push(angle);
    }
    return ribs;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. COLUNATA DO PALÁCIO DA ALVORADA (Borda da Esplanada)  */}
      {/* ========================================================= */}
      <group position={[0, 0, 0]}>
        {/* Viga superior de cobertura em concreto branco puro */}
        <mesh position={[0, 3.75, -9.6]} receiveShadow castShadow>
          <boxGeometry args={[23.2, 0.22, 0.8]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.25}
            metalness={0.08}
          />
        </mesh>
        {/* Friso em LED Azul no topo da viga da Alvorada */}
        <mesh position={[0, 3.87, -9.21]}>
          <boxGeometry args={[22.8, 0.025, 0.04]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>

        {/* Colunas esculpidas da Alvorada com uplight embutido no piso */}
        {colonnadePositions.map(([cx, cy, cz], idx) => (
          <group key={idx} position={[cx, cy, cz]}>
            {/* Coluna Niemeyer */}
            <mesh
              geometry={alvoradaGeo}
              castShadow
              receiveShadow
              position={[0, 0, -0.06]}
            >
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.25}
                metalness={0.05}
              />
            </mesh>

            {/* Sapata de sustentação chanfrada */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.7, 0.08, 0.4]} />
              <meshStandardMaterial
                color="#1e40af"
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            {/* Projetor de luz uplight iluminando a coluna de baixo para cima */}
            <mesh position={[0, 0.06, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.07, 16]} />
              <meshBasicMaterial color="#93c5fd" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================= */}
      {/* 2. CONGRESSO NACIONAL (Silhueta Monumental no Horizonte)  */}
      {/* ========================================================= */}
      <group position={[18, -1.8, -38]}>
        {/* Base / Plinto monumental horizontal */}
        <mesh position={[0, 0.6, 0]} receiveShadow>
          <boxGeometry args={[14.0, 1.2, 5.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Linha de reflexo da lâmina d'água na base */}
        <mesh position={[0, 0.05, 2.52]}>
          <boxGeometry args={[13.8, 0.08, 0.05]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Torres Gêmeas (Anexo I e II do Congresso Nacional) */}
        <mesh position={[-0.8, 4.4, 0]} castShadow>
          <boxGeometry args={[1.3, 6.4, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.15} />
        </mesh>
        <mesh position={[0.8, 4.4, 0]} castShadow>
          <boxGeometry args={[1.3, 6.4, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.15} />
        </mesh>
        {/* Passarela suspensa conectando as duas torres */}
        <mesh position={[0, 5.2, 0]}>
          <boxGeometry args={[0.5, 0.5, 1.4]} />
          <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Faixa luminosa no topo das torres */}
        <mesh position={[-0.8, 7.62, 0]}>
          <boxGeometry args={[1.1, 0.06, 1.6]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <mesh position={[0.8, 7.62, 0]}>
          <boxGeometry args={[1.1, 0.06, 1.6]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>

        {/* Cúpula do Senado Federal (Semissfera convexa para cima) */}
        <mesh position={[-4.5, 1.2, 0]}>
          <sphereGeometry args={[2.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Cúpula da Câmara dos Deputados (Côncava tipo bacia voltada para o céu) */}
        <group position={[4.5, 1.3, 0]} rotation={[Math.PI, 0, 0]}>
          <mesh position={[0, -1.6, 0]}>
            <sphereGeometry args={[2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, -1.6, 0]}>
            <cylinderGeometry args={[2.38, 2.38, 0.05, 32]} />
            <meshStandardMaterial color="#0a1b3d" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 3. CATEDRAL METROPOLITANA (Escultura Hiperbólica ao Fundo)*/}
      {/* ========================================================= */}
      <group position={[-24, -1.8, -34]}>
        {/* Espelho d'água circular da Catedral */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[5.2, 5.5, 0.1, 36]} />
          <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Núcleo de vitrais azulados iluminados de dentro para fora */}
        <mesh position={[0, 2.4, 0]}>
          <coneGeometry args={[2.2, 4.6, 24]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.65}
            transmission={0.8}
            roughness={0.1}
            thickness={1.0}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* 16 Colunas Hiperbólicas de Niemeyer em leque */}
        {cathedralRibs.map((angle, idx) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <group key={idx} position={[cos * 2.8, 0.1, sin * 2.8]} rotation={[0, -angle, 0]}>
              {/* Nervura hiperbólica curvada ascendente */}
              <mesh position={[0, 2.6, 0]} rotation={[0, 0, 0.18]}>
                <boxGeometry args={[0.22, 5.2, 0.35]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.08} />
              </mesh>
            </group>
          );
        })}

        {/* Cruz da Catedral no topo */}
        <group position={[0, 5.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/* 4. PONTE JK (Arcos Parabólicos Esculturais no Horizonte)  */}
      {/* ========================================================= */}
      <group position={[32, -1.8, 8]} rotation={[0, -0.45, 0]}>
        {/* Pista sobre a água */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[18, 0.2, 2.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[18.2, 0.1, 2.4]} />
          <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* 3 Arcos parabólicos cruzados e assimétricos */}
        {[-5, 0, 5].map((archX, i) => (
          <group key={i} position={[archX, 0.5, 0]} rotation={[0.22 * (i % 2 === 0 ? 1 : -1), 0, 0]}>
            <mesh position={[0, 2.2, 0]}>
              <torusGeometry args={[3.2, 0.14, 16, 32, Math.PI]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Iluminação de arco na ponte */}
            <mesh position={[0, 2.2, 0]}>
              <torusGeometry args={[3.12, 0.03, 8, 32, Math.PI]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================= */}
      {/* 5. JARDINS DE BURLE MARX (Paisagismo Orgânico na Água)    */}
      {/* ========================================================= */}
      <group position={[0, -1.78, 0]}>
        {/* Canteiro Sinuoso 1 - Lateral Sudoeste */}
        <group position={[-16, 0, 11]}>
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <cylinderGeometry args={[3.5, 4.2, 0.08, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[2.8, 3.2, 0.04, 32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.7, 2.9, 32]} />
            <meshBasicMaterial color="#38bdf8" opacity={0.6} transparent />
          </mesh>
        </group>

        {/* Canteiro Sinuoso 2 - Lateral Sudeste */}
        <group position={[16, 0, 11]}>
          <mesh receiveShadow position={[0, 0.04, 0]}>
            <cylinderGeometry args={[3.2, 3.8, 0.08, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[2.4, 2.8, 0.04, 32]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.3, 2.5, 32]} />
            <meshBasicMaterial color="#34d399" opacity={0.6} transparent />
          </mesh>
        </group>
      </group>
    </group>
  );
}
