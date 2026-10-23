import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore, simulationRefs } from '../../store/simulationStore';

export const Earth = () => {
  const earthGroup = useRef();

  // Load high quality NASA textures
  const [colorMap, normalMap, specMap, cloudsMap, nightMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png'
  ]);

  const { isPaused } = useSimulationStore();

  useFrame((state, delta) => {
    if (earthGroup.current && !isPaused) {
      // Realistic slow earth rotation using delta for pause reliability
      simulationRefs.earthRotation += 0.05 * delta;
      earthGroup.current.rotation.y = simulationRefs.earthRotation;
    }
  });

  return (
    <group ref={earthGroup} rotation={[0.4, 0, 0]}>
      
      {/* Base Earth Sphere - Day Side with Specular oceans and Normal terrain */}
      <Sphere args={[8, 128, 128]}>
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specMap}
          metalnessMap={specMap}
          metalness={0.4}
          roughness={0.7}
          // Night lights as emissive trick. Won't look perfect on day side but adds city lights effect generally.
          emissiveMap={nightMap}
          emissive={new THREE.Color(0xffffaa)}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere args={[8.05, 64, 64]}>
        <meshStandardMaterial 
          map={cloudsMap}
          transparent
          opacity={0.8}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmospheric blue halo using BackSide */}
      <Sphere args={[8.4, 64, 64]}>
        <meshBasicMaterial 
          color="#2266ff" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
      
    </group>
  );
};
