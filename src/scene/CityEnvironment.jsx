import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CityEnvironment — Cidade Tecnológica e Realista (Digital Twin / Jogo Diurno)
 * 
 * - Tráfego com velocidade realista (carros calmos, sem "levantar voo")
 * - Veículos detalhados: Sedans urbanos, Ambulâncias do SUS e Ônibus com faróis e lanternas
 * - Asfalto escuro realista com meio-fio, faixas duplas amarelas, tracejados brancos e faixas de pedestre
 * - Postes de iluminação pública elegantes ao longo das vias
 * - Edifícios com lobbies no térreo, esquadrias de vidro e infraestrutura de cobertura (HVAC/antenas)
 * - Marcos de Brasília (Congresso Nacional e Catedral) integrados à malha urbana
 */

// Modelos de Veículos Detalhados
function DetailedCar({ type = 'car', color = '#2563eb' }) {
  if (type === 'ambulance') {
    return (
      <group>
        {/* Chassi de Ambulância Van do SUS */}
        <mesh castShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[2.2, 0.72, 1.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.15} />
        </mesh>
        {/* Faixa lateral Azul SUS */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[2.22, 0.16, 1.06]} />
          <meshStandardMaterial color="#1e40af" roughness={0.3} />
        </mesh>
        {/* Faixa lateral Verde SUS */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[2.22, 0.08, 1.06]} />
          <meshStandardMaterial color="#16a34a" roughness={0.3} />
        </mesh>
        {/* Cruz Vermelha lateral */}
        {[-0.54, 0.54].map((z, i) => (
          <group key={i} position={[0.2, 0.56, z]}>
            <mesh>
              <boxGeometry args={[0.22, 0.07, 0.01]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
            <mesh>
              <boxGeometry args={[0.07, 0.22, 0.01]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        ))}
        {/* Para-brisa dianteiro inclinado */}
        <mesh position={[0.85, 0.52, 0]}>
          <boxGeometry args={[0.42, 0.38, 0.95]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Giroflex de emergência no teto */}
        <mesh position={[0.3, 0.83, -0.22]}>
          <boxGeometry args={[0.22, 0.1, 0.18]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
        <mesh position={[0.3, 0.83, 0.22]}>
          <boxGeometry args={[0.22, 0.1, 0.18]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        {/* Faróis Dianteiros Brancos */}
        <mesh position={[1.11, 0.3, 0.36]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        <mesh position={[1.11, 0.3, -0.36]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        {/* Lanternas Traseiras Vermelhas */}
        <mesh position={[-1.11, 0.38, 0.38]}>
          <boxGeometry args={[0.04, 0.25, 0.1]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-1.11, 0.38, -0.38]}>
          <boxGeometry args={[0.04, 0.25, 0.1]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* 4 Rodas pretas com calotas */}
        {[
          [0.65, 0.14, 0.54],
          [0.65, 0.14, -0.54],
          [-0.65, 0.14, 0.54],
          [-0.65, 0.14, -0.54]
        ].map(([wx, wy, wz], wi) => (
          <mesh key={wi} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'bus') {
    return (
      <group>
        {/* Ônibus Urbano Coletivo */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[3.2, 0.85, 1.1]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Faixa Branca Superior */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[3.22, 0.22, 1.12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Vidros Panorâmicos Laterais */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[2.8, 0.32, 1.14]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Faróis Dianteiros */}
        <mesh position={[1.61, 0.28, 0.38]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        <mesh position={[1.61, 0.28, -0.38]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        {/* Lanternas Traseiras */}
        <mesh position={[-1.61, 0.35, 0.4]}>
          <boxGeometry args={[0.04, 0.3, 0.12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-1.61, 0.35, -0.4]}>
          <boxGeometry args={[0.04, 0.3, 0.12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Rodas */}
        {[
          [1.0, 0.16, 0.56],
          [1.0, 0.16, -0.56],
          [-1.0, 0.16, 0.56],
          [-1.0, 0.16, -0.56]
        ].map(([wx, wy, wz], wi) => (
          <mesh key={wi} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  // Carro Urbano Sedan / Hatch
  return (
    <group>
      {/* Chassi inferior */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[1.7, 0.32, 0.82]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.65} />
      </mesh>
      {/* Cabine e Teto com Vidros */}
      <mesh position={[-0.08, 0.44, 0]}>
        <boxGeometry args={[0.9, 0.26, 0.72]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Teto pintado */}
      <mesh position={[-0.08, 0.58, 0]}>
        <boxGeometry args={[0.84, 0.04, 0.68]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.65} />
      </mesh>
      {/* Faróis Dianteiros Brancos */}
      <mesh position={[0.86, 0.22, 0.26]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fef9c3" />
      </mesh>
      <mesh position={[0.86, 0.22, -0.26]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fef9c3" />
      </mesh>
      {/* Lanternas Traseiras Vermelhas */}
      <mesh position={[-0.86, 0.24, 0.28]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.86, 0.24, -0.28]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* 4 Rodas */}
      {[
        [0.48, 0.12, 0.42],
        [0.48, 0.12, -0.42],
        [-0.48, 0.12, 0.42],
        [-0.48, 0.12, -0.42]
      ].map(([wx, wy, wz], wi) => (
        <mesh key={wi} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Poste de Iluminação Pública Realista
function StreetLamp({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base chumbada no concreto */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.09, 0.13, 0.2, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Poste vertical alto (3.4m) */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.045, 0.07, 3.4, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Braço curvo cantilever estendendo-se sobre a pista */}
      <mesh position={[0.4, 3.45, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.035, 0.045, 0.9, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Cabeça da luminária LED */}
      <mesh position={[0.78, 3.72, 0]}>
        <boxGeometry args={[0.34, 0.08, 0.14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Lente emissiva suave */}
      <mesh position={[0.78, 3.67, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.1]} />
        <meshBasicMaterial color="#fef9c3" />
      </mesh>
    </group>
  );
}

// Faixa de Pedestres Estilo Zebra
function Crosswalk({ position, rotation = [0, 0, 0], length = 4.8 }) {
  const stripeCount = 7;
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: stripeCount }).map((_, i) => {
        const offsetZ = (i - (stripeCount - 1) / 2) * 0.65;
        return (
          <mesh key={i} position={[0, 0.003, offsetZ]}>
            <boxGeometry args={[1.3, 0.003, 0.38]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function CityEnvironment() {
  const trafficVehiclesRef = useRef([]);

  // Geração determinística dos edifícios da cidade ao redor do campus central
  const buildings = useMemo(() => {
    const list = [];
    const seedRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    let id = 0;
    // Blocos urbanos distribuídos nos 4 quadrantes da cidade
    // O campus central fica no centro (x: -16.5 a 16.5, z: -11.5 a 11.5)
    for (let bx = -4; bx <= 4; bx++) {
      for (let bz = -4; bz <= 4; bz++) {
        // Deixa o centro livre para o campus do SUS
        if (Math.abs(bx) <= 1 && Math.abs(bz) <= 1) continue;

        const blockCenterX = bx * 14.5;
        const blockCenterZ = bz * 13.5;

        // Cada bloco urbano contém 2 a 4 edifícios
        const count = 2 + Math.floor(seedRandom(id * 13 + 7) * 3);
        for (let i = 0; i < count; i++) {
          const offsetX = (seedRandom(id * 17 + i) - 0.5) * 8.5;
          const offsetZ = (seedRandom(id * 23 + i) - 0.5) * 8.0;
          const posX = blockCenterX + offsetX;
          const posZ = blockCenterZ + offsetZ;

          // Variação de dimensões e tipologia
          const width = 2.4 + seedRandom(id * 31 + i) * 2.8;
          const depth = 2.4 + seedRandom(id * 37 + i) * 2.8;
          // Altura dos edifícios: arranha-céus ao fundo e no Setor Hospitalar/Comercial
          const height = 4.5 + seedRandom(id * 43 + i) * (Math.abs(bz) >= 3 ? 15 : 8);

          // Tipologia visual: Hospital/Saúde (branco/azul/verde), Comercial (vidro/titânio)
          const isMedicalDistrict = bx < 0 && bz > 0;
          const baseColor = isMedicalDistrict
            ? (i % 2 === 0 ? '#ffffff' : '#f0fdf4')
            : (i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#f8fafc' : '#e2e8f0');

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
            isMedicalDistrict,
            hasAntenna: height > 11,
            hasHelipad: isMedicalDistrict && height > 8.5
          });
        }
      }
    }
    return list;
  }, []);

  // Árvores Low-Poly para as superquadras e canteiros
  const trees = useMemo(() => {
    const list = [];
    let tid = 0;
    const seedRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Parques laterais e canteiros ao longo das avenidas
    for (let i = 0; i < 54; i++) {
      const angle = (i / 54) * Math.PI * 2;
      const radius = 23 + seedRandom(i * 19) * 32;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;

      // Deixa o campus central livre
      if (Math.abs(tx) < 18.5 && Math.abs(tz) < 13.5) continue;

      list.push({
        id: `tree-${tid++}`,
        x: tx,
        z: tz,
        scale: 0.85 + seedRandom(i * 31) * 0.55,
        color: i % 2 === 0 ? '#15803d' : '#16a34a'
      });
    }
    return list;
  }, []);

  // Vias de Tráfego com Velocidades Realistas Calmas (3.2 a 4.6 unidades/segundo)
  // Comprimento da pista: 160 unidades. Tempo de percurso: ~35 a 45 segundos (ritmo urbano calmo)
  const trafficRoads = useMemo(() => [
    // Avenida Norte (Leste-Oeste)
    { id: 'r1', fromX: -80, toX: 80, z: -15.2, speed: 4.2, rotY: 0, type: 'car', color: '#2563eb' },
    { id: 'r2', fromX: 80, toX: -80, z: -17.8, speed: 3.8, rotY: Math.PI, type: 'ambulance', color: '#ffffff' },
    { id: 'r3', fromX: -80, toX: 80, z: -15.2, speed: 4.4, rotY: 0, type: 'car', color: '#64748b' },
    { id: 'r4', fromX: 80, toX: -80, z: -17.8, speed: 3.6, rotY: Math.PI, type: 'bus', color: '#0284c7' },

    // Avenida Sul (Leste-Oeste)
    { id: 'r5', fromX: -80, toX: 80, z: 15.2, speed: 4.0, rotY: 0, type: 'bus', color: '#0284c7' },
    { id: 'r6', fromX: 80, toX: -80, z: 17.8, speed: 4.5, rotY: Math.PI, type: 'car', color: '#0284c7' },
    { id: 'r7', fromX: -80, toX: 80, z: 15.2, speed: 3.9, rotY: 0, type: 'ambulance', color: '#ffffff' },
    { id: 'r8', fromX: 80, toX: -80, z: 17.8, speed: 4.2, rotY: Math.PI, type: 'car', color: '#f59e0b' },

    // Avenida Radial Oeste (Norte-Sul)
    { id: 'r9', fromZ: -80, toZ: 80, x: -21.2, speed: 4.1, rotY: -Math.PI / 2, type: 'car', color: '#3b82f6' },
    { id: 'r10', fromZ: 80, toZ: -80, x: -23.8, speed: 3.8, rotY: Math.PI / 2, type: 'ambulance', color: '#ffffff' },
    { id: 'r11', fromZ: -80, toZ: 80, x: -21.2, speed: 4.3, rotY: -Math.PI / 2, type: 'car', color: '#10b981' },
    { id: 'r12', fromZ: 80, toZ: -80, x: -23.8, speed: 3.6, rotY: Math.PI / 2, type: 'bus', color: '#0284c7' },

    // Avenida Radial Leste (Norte-Sul)
    { id: 'r13', fromZ: -80, toZ: 80, x: 21.2, speed: 4.0, rotY: -Math.PI / 2, type: 'car', color: '#2563eb' },
    { id: 'r14', fromZ: 80, toZ: -80, x: 23.8, speed: 4.4, rotY: Math.PI / 2, type: 'car', color: '#e2e8f0' },
    { id: 'r15', fromZ: -80, toZ: 80, x: 21.2, speed: 3.7, rotY: -Math.PI / 2, type: 'car', color: '#0f766e' },
    { id: 'r16', fromZ: 80, toZ: -80, x: 23.8, speed: 4.2, rotY: Math.PI / 2, type: 'ambulance', color: '#ffffff' },
  ], []);

  // Animação de tráfego calmo e contínuo (cada carro leva ~35 a 45s para atravessar)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    trafficVehiclesRef.current.forEach((veh, idx) => {
      if (!veh) return;
      const road = trafficRoads[idx % trafficRoads.length];
      const spacingOffset = (idx * 0.28) % 1;
      // Velocidade calma: deslocamento de ~4 unidades/s em pista de 160 unidades
      const progress = ((t * (road.speed / 160) + spacingOffset) % 1);

      if (road.fromX !== undefined) {
        veh.position.x = THREE.MathUtils.lerp(road.fromX, road.toX, progress);
        veh.position.z = road.z;
      } else {
        veh.position.z = THREE.MathUtils.lerp(road.fromZ, road.toZ, progress);
        veh.position.x = road.x;
      }
      veh.rotation.y = road.rotY;
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================= */}
      {/* 1. TERRENO URBANO DIURNO (Piso Base Limpo)                */}
      {/* ========================================================= */}
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[360, 360]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* ========================================================= */}
      {/* 2. REDE DE AVENIDAS COM ASFALTO REALISTA E SINALIZAÇÃO     */}
      {/* ========================================================= */}

      {/* Grande Avenida Norte (Eixo Leste-Oeste, 2 pistas com canteiro) */}
      <group position={[0, -0.035, -16.5]}>
        {/* Asfalto Escuro */}
        <mesh receiveShadow>
          <boxGeometry args={[160, 0.015, 6.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Calçadas em concreto com meio-fio */}
        <mesh receiveShadow position={[0, 0.02, -3.4]}>
          <boxGeometry args={[160, 0.03, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh receiveShadow position={[0, 0.02, 3.4]}>
          <boxGeometry args={[160, 0.03, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        {/* Linha dupla amarela contínua divisória central */}
        <mesh position={[0, 0.009, -0.08]}>
          <boxGeometry args={[160, 0.002, 0.08]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 0.009, 0.08]}>
          <boxGeometry args={[160, 0.002, 0.08]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Faixas tracejadas brancas */}
        <mesh position={[0, 0.009, -1.6]}>
          <boxGeometry args={[158, 0.002, 0.12]} />
          <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
        <mesh position={[0, 0.009, 1.6]}>
          <boxGeometry args={[158, 0.002, 0.12]} />
          <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
      </group>

      {/* Grande Avenida Sul (Eixo Leste-Oeste, 2 pistas com canteiro) */}
      <group position={[0, -0.035, 16.5]}>
        {/* Asfalto Escuro */}
        <mesh receiveShadow>
          <boxGeometry args={[160, 0.015, 6.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Calçadas com meio-fio */}
        <mesh receiveShadow position={[0, 0.02, -3.4]}>
          <boxGeometry args={[160, 0.03, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh receiveShadow position={[0, 0.02, 3.4]}>
          <boxGeometry args={[160, 0.03, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        {/* Linha dupla amarela contínua divisória central */}
        <mesh position={[0, 0.009, -0.08]}>
          <boxGeometry args={[160, 0.002, 0.08]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, 0.009, 0.08]}>
          <boxGeometry args={[160, 0.002, 0.08]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Faixas tracejadas brancas */}
        <mesh position={[0, 0.009, -1.6]}>
          <boxGeometry args={[158, 0.002, 0.12]} />
          <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
        <mesh position={[0, 0.009, 1.6]}>
          <boxGeometry args={[158, 0.002, 0.12]} />
          <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
        </mesh>
      </group>

      {/* Avenida Radial Oeste (Norte-Sul, Setor Hospitalar) */}
      <group position={[-22.5, -0.035, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.2, 0.015, 160]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh receiveShadow position={[-3.4, 0.02, 0]}>
          <boxGeometry args={[0.8, 0.03, 160]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh receiveShadow position={[3.4, 0.02, 0]}>
          <boxGeometry args={[0.8, 0.03, 160]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        {/* Linha central amarela */}
        <mesh position={[-0.08, 0.009, 0]}>
          <boxGeometry args={[0.08, 0.002, 160]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0.08, 0.009, 0]}>
          <boxGeometry args={[0.08, 0.002, 160]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Avenida Radial Leste (Norte-Sul, Setor Comercial/Tecnológico) */}
      <group position={[22.5, -0.035, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[6.2, 0.015, 160]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh receiveShadow position={[-3.4, 0.02, 0]}>
          <boxGeometry args={[0.8, 0.03, 160]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh receiveShadow position={[3.4, 0.02, 0]}>
          <boxGeometry args={[0.8, 0.03, 160]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        {/* Linha central amarela */}
        <mesh position={[-0.08, 0.009, 0]}>
          <boxGeometry args={[0.08, 0.002, 160]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0.08, 0.009, 0]}>
          <boxGeometry args={[0.08, 0.002, 160]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 3. FAIXAS DE PEDESTRE NAS INTERSEÇÕES URBANAS              */}
      {/* ========================================================= */}
      <Crosswalk position={[-22.5, -0.02, -12.5]} rotation={[0, 0, 0]} />
      <Crosswalk position={[-22.5, -0.02, 12.5]} rotation={[0, 0, 0]} />
      <Crosswalk position={[22.5, -0.02, -12.5]} rotation={[0, 0, 0]} />
      <Crosswalk position={[22.5, -0.02, 12.5]} rotation={[0, 0, 0]} />
      <Crosswalk position={[-18.5, -0.02, -16.5]} rotation={[0, Math.PI / 2, 0]} />
      <Crosswalk position={[18.5, -0.02, -16.5]} rotation={[0, Math.PI / 2, 0]} />
      <Crosswalk position={[-18.5, -0.02, 16.5]} rotation={[0, Math.PI / 2, 0]} />
      <Crosswalk position={[18.5, -0.02, 16.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* ========================================================= */}
      {/* 4. POSTES DE ILUMINAÇÃO PÚBLICA AO LONGO DAS AVENIDAS      */}
      {/* ========================================================= */}
      {[-45, -30, -15, 0, 15, 30, 45].map((x, i) => (
        <React.Fragment key={i}>
          {/* Postes da Avenida Norte */}
          <StreetLamp position={[x, -0.02, -19.6]} rotation={[0, 0, 0]} />
          {/* Postes da Avenida Sul */}
          <StreetLamp position={[x, -0.02, 19.6]} rotation={[0, Math.PI, 0]} />
        </React.Fragment>
      ))}
      {[-40, -25, 0, 25, 40].map((z, i) => (
        <React.Fragment key={i}>
          {/* Postes da Avenida Oeste */}
          <StreetLamp position={[-25.6, -0.02, z]} rotation={[0, Math.PI / 2, 0]} />
          {/* Postes da Avenida Leste */}
          <StreetLamp position={[25.6, -0.02, z]} rotation={[0, -Math.PI / 2, 0]} />
        </React.Fragment>
      ))}

      {/* ========================================================= */}
      {/* 5. VEÍCULOS URBANOS REALISTAS EM MOVIMENTO CALMO          */}
      {/* ========================================================= */}
      {trafficRoads.map((road, i) => (
        <group
          key={road.id}
          ref={(el) => (trafficVehiclesRef.current[i] = el)}
          position={[0, 0.05, 0]}
        >
          <DetailedCar type={road.type} color={road.color} />
        </group>
      ))}

      {/* ========================================================= */}
      {/* 6. EDIFÍCIOS E ARRANHA-CÉUS DETALHADOS DA CIDADE          */}
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

          {/* Lobby do térreo iluminado */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[b.width + 0.06, 1.4, b.depth + 0.06]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[0, 0.6, b.depth / 2 + 0.04]}>
            <boxGeometry args={[b.width * 0.6, 1.0, 0.08]} />
            <meshBasicMaterial color="#bae6fd" opacity={0.8} transparent />
          </mesh>

          {/* Fachada com frisos horizontais de vidro */}
          {Array.from({ length: Math.floor(b.height / 1.8) }).map((_, floorIdx) => (
            <mesh
              key={floorIdx}
              position={[0, floorIdx * 1.8 + 1.8, 0]}
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

          {/* Detalhe de Rooftop: Casa de Máquinas / Chiller HVAC */}
          <mesh position={[0, b.height + 0.35, 0]}>
            <boxGeometry args={[b.width * 0.5, 0.6, b.depth * 0.5]} />
            <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.6} />
          </mesh>

          {/* Detalhe de Rooftop: Antena transmissora */}
          {b.hasAntenna && (
            <group position={[0, b.height + 0.65, 0]}>
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
            <group position={[0, b.height + 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
      {/* 7. ÁRVORES LOW-POLY E PRAÇAS VERDES                       */}
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
      {/* 8. MARCOS CÍVICOS DE BRASÍLIA INTEGRADOS NA CIDADE        */}
      {/* ========================================================= */}
      {/* Congresso Nacional no final do Eixo Monumental Leste */}
      <group position={[42, 0, -32]}>
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
      <group position={[-42, 0, -32]}>
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
