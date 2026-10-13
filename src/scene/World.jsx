import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Ground from './Ground';
import AmbientEnvironment from './AmbientEnvironment';
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
          toneMappingExposure: 1.06
        }}
        onPointerMissed={() => {
          // Mantém seleção intencional sem deselecionar acidentalmente
        }}
      >
        {/* Fundo e neblina alinhados com o token --bg do SUS Digital (#f5f9ff) */}
        <color attach="background" args={['#f5f9ff']} />
        <fog attach="fog" args={['#f5f9ff', 40, 85]} />

        {/* 1. Iluminação de estúdio profissional (Key, Fill, Rim & Ambient) */}
        <ambientLight intensity={0.7} />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#dbeafe"
          intensity={0.65}
        />
        {/* Key Light com sombras nítidas e suaves */}
        <directionalLight
          position={[16, 26, 14]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={70}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0001}
        />
        {/* Rim Light / Contra-luz azul-gelo para realçar chanfros e silhuetas */}
        <directionalLight
          position={[-16, 18, -14]}
          intensity={0.75}
          color="#93c5fd"
        />
        {/* Fill frontal suave */}
        <directionalLight
          position={[0, 12, 22]}
          intensity={0.35}
          color="#e0e7ff"
        />

        <Suspense fallback={null}>
          {/* Ambiente contextual: lâmina líquida, pilares e partículas de dados */}
          <AmbientEnvironment />

          {/* Piso arquitetônico e praças SUS Digital */}
          <Ground />

          {/* Sombras de contato suaves de alta qualidade */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.30}
            scale={28}
            blur={2.4}
            far={4}
            color="#0a1b3d"
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
