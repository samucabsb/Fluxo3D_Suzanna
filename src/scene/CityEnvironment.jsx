import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CityEnvironment — Cidade Tecnológica Estilo Jogo (SimCity / Digital Twin)
 * 
 * Uma cidade 3D viva, diurna, coesa e estilizada ao redor do Campus Central Susana AI:
 * 1. Malha Viária & Avenidas: Eixo Monumental e anéis viários com tráfego animado.
 * 2. Prédios & Arranha-Céus: Setor Hospitalar, torres de saúde e edifícios comerciais.
 * 3. Parques & Áreas Verdes: Superquadras arborizadas com árvores low-poly.
 * 4. Orla do Lago Paranoá: Canal de água integrado com calçadão de pedestres.
 * 5. Marcos Cívicos de Brasília: Congresso Nacional e Catedral integrados na malha urbana.
 */
export default function CityEnvironment() {
  const trafficVehiclesRef = useRef([]);

  // Geração determinística dos edifícios da cidade ao redor do campus central (raio > 20m)
  const buildings = useMemo(() => {
    const list = [];
    const seedRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    let id = 0;
    // Blocos urbanos distribuídos nos 4 quadrantes da cidade
    // O campus central fica no centro (x: -16 a 16, z: -14 a 14)
    for (let bx = -4; bx <= 4; bx++) {
      for (let bz = -4; bz <= 4; bz++) {
        // Deixa o centro livre para o campus do SUS
        if (Math.abs(bx) <= 1 && Math.abs(bz) <= 1) continue;

        const blockCenterX = bx * 14;
        const blockCenterZ = bz * 14;

        // Cada bloco urbano contém 2 a 4 edifícios
        const count = 2 + Math.floor(seedRandom(id * 13 + 7) * 3);
        for (let i = 0; i < count; i++) {
          const offsetX = (seedRandom(id * 17 + i) - 0.5) * 8;
          const offsetZ = (seedRandom(id * 23 + i) - 0.5) * 8;
          const posX = blockCenterX + offsetX;
          const posZ = blockCenterZ + offsetZ;

          // Variação de dimensões e tipologia
          const width = 2.2 + seedRandom(id * 31 + i) * 2.8;
          const depth = 2.2 + seedRandom(id * 37 + i) * 2.8;
          // Altura dos edifícios: mais altos ao fundo e nas alas comerciais
          const height = 4.0 + seedRandom(id * 43 + i) * (Math.abs(bz) >= 3 ? 14 : 7);

          // Tipologia visual: Hospital/Saúde (branco/azul/verde), Comercial (vidro/titânio)
          const isMedicalDistrict = bx < 0 && bz > 0;
          const baseColor = isMedicalDistrict
            ? (i % 2 === 0 ? '#ffffff' : '#f0fdf4')
            : (i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#f1f5f9' : '#e2e8f0');

          const accentColor = isMedicalDistrict ? '#10b981' : (i % 2 === 0 ? '#2563eb' : '#0284c7');

          list.push({
            id: `bld-${id++}`,
            posX,
            posZ,
            width,
            height,
            depth,
            baseColor,
            accentColor,
            hasAntenna: height > 10,
            hasHelipad: isMedicalDistrict && height > 8
          });
        }
      }
    }
    return list;
  }, []);

  // Árvores Low-Poly para as superquadras e parques urbanos
  const trees = useMemo(() => {
    const list = [];
    let tid = 0;
    const seedRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Parques laterais e canteiros ao longo das avenidas
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const radius = 22 + seedRandom(i * 19) * 28;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;

      // Pula se estiver no meio das bacias de água
      if (Math.abs(tx) < 18 && Math.abs(tz) < 16) continue;

      list.push({
        id: `tree-${tid++}`,
        x: tx,
        z: tz,
        scale: 0.8 + seedRandom(i * 31) * 0.6,
        color: i % 2 === 0 ? '#15803d' : '#16a34a'
      });
    }
    return list;
  }, []);

  // Vias de Tráfego de Dados / Veículos estilo Game (linhas de pulso móveis)
  const trafficRoads = useMemo(() => [
    { fromX: -70, toX: 70, z: -17, speed: 18, color: '#38bdf8' },
    { fromX: 70, toX: -70, z: -19, speed: 22, color: '#fbbf24' },
    { fromX: -70, toX: 70, z: 17, speed: 20, color: '#38bdf8' },
    { fromX: 70, toX: -70, z: 19, speed: 24, color: '#fbbf24' },
    { fromZ: -70, toZ: 70, x: -21, speed: 16, color: '#10b981' },
    { fromZ: 70, toZ: -70, x: 21, speed: 19, color: '#38bdf8' }
  ], []);

  // Animação de tráfego contínuo nos eixos urbanos
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    trafficVehiclesRef.current.forEach((veh, idx) => {
      if (!veh) return;
      const road = trafficRoads[idx % trafficRoads.length];
      const cycle = 8;
      const progress = ((t * (road.speed / 50) + idx * 0.3) % 1);

      if (road.fromX !== undefined) {
        veh.position.x = THREE.MathUtils.lerp(road.fromX, road.toX, progress);
        veh.position.z = road.z;
      } else {
        veh.position.z = THREE.MathUtils.lerp(road.fromZ, road.toZ, progress);
        veh.position.x = road.x;
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. TERRENO URBANO DIURNO (Asfalto claro / Calçadas)       */}
      {/* ========================================================= */}
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[350, 350]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* ========================================================= */}
      {/* 2. REDE DE AVENIDAS E RUAS DA CIDADE                      */}
      {/* ========================================================= */}
      {/* Grande Avenida Norte (Eixo Leste-Oeste) */}
      <mesh receiveShadow position={[0, -0.035, -18]}>
        <boxGeometry args={[140, 0.01, 5.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      {/* Faixas centrais pontilhadas */}
      <mesh position={[0, -0.03, -18]}>
        <boxGeometry args={[136, 0.005, 0.15]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Grande Avenida Sul (Eixo Leste-Oeste) */}
      <mesh receiveShadow position={[0, -0.035, 18]}>
        <boxGeometry args={[140, 0.01, 5.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.03, 18]}>
        <boxGeometry args={[136, 0.005, 0.15]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Avenida Radial Oeste (Setor Hospitalar) */}
      <mesh receiveShadow position={[-21, -0.035, 0]}>
        <boxGeometry args={[5.0, 0.01, 140]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Avenida Radial Leste (Setor Comercial) */}
      <mesh receiveShadow position={[21, -0.035, 0]}>
        <boxGeometry args={[5.0, 0.01, 140]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* ========================================================= */}
      {/* 3. TRÁFEGO DE VEÍCULOS / PULSOS DE DADOS ESTILO GAME      */}
      {/* ========================================================= */}
      {Array.from({ length: 18 }).map((_, i) => {
        const road = trafficRoads[i % trafficRoads.length];
        return (
          <group
            key={i}
            ref={(el) => (trafficVehiclesRef.current[i] = el)}
            position={[0, 0.08, 0]}
          >
            {/* Chassi do veículo estilizado em low-poly */}
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.35, 0.65]} />
              <meshStandardMaterial
                color={road.color}
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>
            {/* Faróis do veículo */}
            <mesh position={[0.62, 0.05, 0.2]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.62, 0.05, -0.2]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 4. EDIFÍCIOS E ARRANHA-CÉUS DA CIDADE (QUADRAS URBANAS)  */}
      {/* ========================================================= */}
      {buildings.map((b) => (
        <group key={b.id} position={[b.posX, 0, b.posZ]}>
          {/* Corpo principal do edifício com janelas em grid procedural */}
          <mesh castShadow receiveShadow position={[0, b.height / 2, 0]}>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color={b.baseColor}
              roughness={0.3}
              metalness={0.15}
            />
          </mesh>

          {/* Fachada com frisos horizontais de vidro */}
          {Array.from({ length: Math.floor(b.height / 1.8) }).map((_, floorIdx) => (
            <mesh
              key={floorIdx}
              position={[0, floorIdx * 1.8 + 1.2, 0]}
            >
              <boxGeometry args={[b.width + 0.04, 0.65, b.depth + 0.04]} />
              <meshStandardMaterial
                color="#bae6fd"
                roughness={0.15}
                metalness={0.5}
              />
            </mesh>
          ))}

          {/* Friso luminoso no topo do edifício */}
          <mesh position={[0, b.height + 0.06, 0]}>
            <boxGeometry args={[b.width + 0.08, 0.12, b.depth + 0.08]} />
            <meshStandardMaterial color={b.accentColor} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Detalhe de Rooftop: Antena transmissora */}
          {b.hasAntenna && (
            <group position={[0, b.height, 0]}>
              <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.03, 0.06, 2.4, 8]} />
                <meshStandardMaterial color="#0a1b3d" metalness={0.9} />
              </mesh>
              <mesh position={[0, 2.45, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial color={b.accentColor} />
              </mesh>
            </group>
          )}

          {/* Detalhe de Rooftop: Heliponto Hospitalar com 'H' estilizado */}
          {b.hasHelipad && (
            <group position={[0, b.height + 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh>
                <circleGeometry args={[1.1, 16]} />
                <meshStandardMaterial color="#1e40af" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[0.9, 1.0, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* ========================================================= */}
      {/* 5. ÁRVORES LOW-POLY E PRAÇAS VERDES                       */}
      {/* ========================================================= */}
      {trees.map((t) => (
        <group key={t.id} position={[t.x, 0, t.z]} scale={t.scale}>
          {/* Tronco da árvore */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.9, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Copa estilizada em cone escalonado */}
          <mesh castShadow position={[0, 1.3, 0]}>
            <coneGeometry args={[0.75, 1.3, 8]} />
            <meshStandardMaterial color={t.color} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 1.9, 0]}>
            <coneGeometry args={[0.55, 1.1, 8]} />
            <meshStandardMaterial color={t.color} roughness={0.55} />
          </mesh>
        </group>
      ))}

      {/* ========================================================= */}
      {/* 6. MARCOS CÍVICOS DE BRASÍLIA INTEGRADOS NA CIDADE        */}
      {/* ========================================================= */}
      {/* Congresso Nacional no final do Eixo Monumental Leste */}
      <group position={[38, 0, -32]}>
        <mesh receiveShadow position={[0, 0.75, 0]}>
          <boxGeometry args={[16, 1.5, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
        {/* Torres H gêmeas */}
        <mesh position={[-1.2, 5.0, 0]} castShadow>
          <boxGeometry args={[1.5, 7.5, 2.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.15} />
        </mesh>
        <mesh position={[1.2, 5.0, 0]} castShadow>
          <boxGeometry args={[1.5, 7.5, 2.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.15} />
        </mesh>
        {/* Passarela */}
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[0.9, 0.6, 1.6]} />
          <meshStandardMaterial color="#0a1b3d" />
        </mesh>
        {/* Cúpula Senado */}
        <mesh position={[-5.0, 1.5, 0]}>
          <sphereGeometry args={[2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Cúpula Câmara */}
        <group position={[5.0, 1.6, 0]} rotation={[Math.PI, 0, 0]}>
          <mesh position={[0, -1.8, 0]}>
            <sphereGeometry args={[2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Catedral Metropolitana de Brasília integrada no Setor Cívico */}
      <group position={[-38, 0, -32]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[5.5, 5.8, 0.16, 32]} />
          <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Núcleo de vitrais */}
        <mesh position={[0, 2.6, 0]}>
          <coneGeometry args={[2.4, 5.0, 24]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* 16 Colunas curvas em leque */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 3.0, 2.8, Math.sin(angle) * 3.0]}
              rotation={[0, -angle, 0.16]}
            >
              <boxGeometry args={[0.24, 5.6, 0.38]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          );
        })}
      </group>

      {/* Espelho d'água monumental canalizado */}
      <mesh receiveShadow position={[0, -0.03, -28]}>
        <boxGeometry args={[44, 0.02, 6.0]} />
        <meshStandardMaterial
          color="#93c5fd"
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
