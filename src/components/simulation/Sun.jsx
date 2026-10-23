import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Sun = ({ position }) => {
  const sunRef = useRef();
  const aura1Ref = useRef();
  const aura2Ref = useRef();

  // Load the NASA realistic equirectangular sun map that was just downloaded
  const colorMap = useTexture('/sun.jpg');

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    // Counter-rotating the corona layers creates a dynamic, swirling plasma effect
    if (aura1Ref.current) {
      aura1Ref.current.rotation.y = t * 0.01;
      aura1Ref.current.rotation.x = t * 0.005;
      aura1Ref.current.scale.setScalar(1 + Math.sin(t * 3) * 0.015);
    }
    if (aura2Ref.current) {
      aura2Ref.current.rotation.y = -t * 0.015;
      aura2Ref.current.rotation.z = t * 0.01;
      aura2Ref.current.scale.setScalar(1 + Math.cos(t * 2) * 0.02);
    }
  });

  return (
    <group position={position}>
      <pointLight 
        intensity={6.0} 
        decay={0}
        color="#fff5e6" 
        castShadow 
      />
      
      {/* Core Plasma Surface */}
      <Sphere ref={sunRef} args={[20, 128, 128]}>
        <meshStandardMaterial 
          map={colorMap}
          emissiveMap={colorMap}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </Sphere>

      {/* Corona Layer 1 - Simulating surface ejections and flares */}
      <Sphere ref={aura1Ref} args={[20.4, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          emissiveMap={colorMap}
          emissive={new THREE.Color('#ff5500')}
          emissiveIntensity={3.0}
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </Sphere>

      {/* Corona Layer 2 - Larger fiery swirly glow outside the core */}
      <Sphere ref={aura2Ref} args={[21.2, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          emissiveMap={colorMap}
          emissive={new THREE.Color('#ff2200')}
          emissiveIntensity={2.0}
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </Sphere>

      {/* Outer Atmosphere Glare */}
      <Sphere args={[26, 64, 64]}>
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Extreme Outer Halo spreading far into space */}
      <Sphere args={[45, 64, 64]}>
        <meshBasicMaterial 
          color="#ff1100" 
          transparent 
          opacity={0.05} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
};
