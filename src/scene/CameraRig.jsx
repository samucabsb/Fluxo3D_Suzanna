import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DEFAULT_CAMERA_POS = [22, 19, 22];
export const DEFAULT_TARGET_POS = [0, 0.5, 0];

/**
 * Único escritor da câmera. Dois modos:
 *  - livre: OrbitControls manda; nada aqui toca a câmera.
 *  - deslizando: só depois de um pedido explícito (foco do tour ou restaurar visão).
 *    Parte da pose atual, interpola com base no tempo e para ao chegar ou assim que o usuário interagir.
 */
export default function CameraRig({ resetSignal, focusTarget = null }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  const goalTarget = useRef(new THREE.Vector3(...DEFAULT_TARGET_POS));
  const goalPos = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POS));
  const gliding = useRef(false);
  const firstReset = useRef(true);

  // Enquadramento inicial (uma vez)
  useEffect(() => {
    controlsRef.current?.target.set(...DEFAULT_TARGET_POS);
    controlsRef.current?.update();
  }, []);

  // Tour guiado: destaca a estação atual. Sem foco => não faz nada (controle manual preservado).
  useEffect(() => {
    if (!focusTarget) return;
    const y = focusTarget[1] || 0.8;
    goalTarget.current.set(focusTarget[0], y, focusTarget[2]);
    goalPos.current.set(focusTarget[0] + 10, y + 9, focusTarget[2] + 10);
    gliding.current = true;
  }, [focusTarget]);

  // Restaurar visão: desliza suavemente até o enquadramento padrão
  useEffect(() => {
    if (firstReset.current) {
      firstReset.current = false;
      return;
    }
    goalTarget.current.set(...DEFAULT_TARGET_POS);
    goalPos.current.set(...DEFAULT_CAMERA_POS);
    gliding.current = true;
  }, [resetSignal]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!gliding.current || !controls) return;

    // Suavização calma e cinematográfica independente da taxa de quadros
    const k = 1 - Math.exp(-delta * 2.0);
    controls.target.lerp(goalTarget.current, k);
    camera.position.lerp(goalPos.current, k);
    controls.update();

    if (
      camera.position.distanceTo(goalPos.current) < 0.02 &&
      controls.target.distanceTo(goalTarget.current) < 0.02
    ) {
      gliding.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.15} // Não desce abaixo da plataforma
      minPolarAngle={Math.PI / 6}
      minDistance={10}
      maxDistance={55}
      onStart={() => {
        gliding.current = false; // usuário assumiu o controle: nada disputa a câmera
      }}
    />
  );
}
