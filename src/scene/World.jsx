import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import CityEnvironment from './CityEnvironment';
import Ground from './Ground';
import Station from './Station';
import DataPath from './DataPath';
import FlowParticle from './FlowParticle';
import CameraRig, { DEFAULT_CAMERA_POS } from './CameraRig';
import { STATIONS_METADATA } from '../data/demoScenarios';

export default function World({
  execution,
  selectedStationId,
  onSelectStation,
  cameraResetSignal,
  isGuidedTour = false,
  tourFocusTarget = null,
  isPaused = false,
  onStageAdvance,
  onComplete
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: DEFAULT_CAMERA_POS,
          fov: 34,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08
        }}
        onPointerMissed={() => {
          // Mantém seleção intencional sem deselecionar acidentalmente
        }}
      >
        {/* Céu diurno e neblina limpa da cidade */}
        <color attach="background" args={['#e6f0fa']} />
        <fog attach="fog" args={['#e6f0fa', 100, 260]} />

        {/* Iluminação diurna cinematográfica estilo jogo */}
        <ambientLight intensity={0.78} />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#cbd5e1"
          intensity={0.65}
        />
        {/* Sol diurno com sombras nítidas de alta definição */}
        <directionalLight
          position={[32, 45, 24]}
          intensity={1.45}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0001}
        />
        {/* Rim Light suave azul para destacar arestas dos edifícios */}
        <directionalLight
          position={[-24, 25, -20]}
          intensity={0.7}
          color="#93c5fd"
        />
        {/* Luz de preenchimento frontal */}
        <directionalLight
          position={[0, 16, 26]}
          intensity={0.35}
          color="#e0e7ff"
        />

        <Suspense fallback={null}>
          {/* Cidade 3D viva, diurna e procedural ao redor do campus */}
          <CityEnvironment />

          {/* Praça central do campus Susana AI */}
          <Ground />

          {/* Sombras de contato suaves no piso da esplanada */}
          <ContactShadows
            position={[0, 0.045, 0]}
            opacity={0.16}
            scale={36}
            blur={2.2}
            far={3.5}
            color="#1e3a8a"
          />

          {/* Dutos de dados elevados com trajetória contínua */}
          <DataPath execution={execution} />

          {/* Partícula com movimento matematicamente contínuo ao longo da curva */}
          <FlowParticle
            execution={execution}
            isPaused={isPaused}
            isGuidedTour={isGuidedTour}
            onStageAdvance={onStageAdvance}
            onComplete={onComplete}
          />

          {/* As 6 Estações Principais */}
          {STATIONS_METADATA.map((station) => {
            const stage = execution?.stages.find((s) => s.id === station.id);
            const status = stage ? stage.status : 'idle';
            const isActive = execution?.currentStageId === station.id && execution?.status === 'running';
            const isSelected = selectedStationId === station.id;

            return (
              <Station
                key={station.id}
                station={station}
                status={status}
                isActive={isActive}
                isSelected={isSelected}
                onClick={onSelectStation}
                execution={execution}
              />
            );
          })}

          {/* Controle de câmera: exploração livre e tour guiado desacoplados */}
          <CameraRig
            resetSignal={cameraResetSignal}
            focusTarget={tourFocusTarget}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
