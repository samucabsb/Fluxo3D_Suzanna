import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import BrasiliaArchitecture from './BrasiliaArchitecture';
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
          toneMappingExposure: 1.08
        }}
        onPointerMissed={() => {
          // Mantém seleção intencional sem deselecionar acidentalmente
        }}
      >
        {/* Fundo e neblina do Lago Paranoá / Cerrado tecnológico */}
        <color attach="background" args={['#f4f8fe']} />
        <fog attach="fog" args={['#f4f8fe', 42, 95]} />

        {/* 1. Iluminação de estúdio profissional (Key, Fill, Rim & Ambient) */}
        <ambientLight intensity={0.72} />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#dbeafe"
          intensity={0.65}
        />
        {/* Key Light com sombras nítidas e suaves */}
        <directionalLight
          position={[16, 26, 14]}
          intensity={1.4}
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
        {/* Rim Light / Contra-luz azul-gelo para realçar colunas e chanfros */}
        <directionalLight
          position={[-16, 18, -14]}
          intensity={0.8}
          color="#93c5fd"
        />
        {/* Fill frontal suave */}
        <directionalLight
          position={[0, 12, 22]}
          intensity={0.35}
          color="#e0e7ff"
        />

        <Suspense fallback={null}>
          {/* Ambiente contextual: lâmina líquida reflexiva, pilares e partículas */}
          <AmbientEnvironment />

          {/* Monumentos de Brasília: Colunata Alvorada, Congresso, Catedral, Ponte JK e Burle Marx */}
          <BrasiliaArchitecture />

          {/* Piso arquitetônico e praça com Cruz da Saúde SUS Digital */}
          <Ground />

          {/* Sombras de contato suaves no piso da esplanada */}
          <ContactShadows
            position={[0, 0.015, 0]}
            opacity={0.16}
            scale={25}
            blur={2.0}
            far={3}
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
