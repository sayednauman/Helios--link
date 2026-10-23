import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, CameraControls, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Sun } from './Sun.jsx';
import { Earth } from './Earth.jsx';
import { Satellite } from './Satellite.jsx';
import { useSimulationStore, simulationRefs } from '../../store/simulationStore';

const SceneContent = () => {
  const { isSimulating, isPaused, targetCity } = useSimulationStore();
  const cameraControlRef = useRef();
  const earthSystemRef = useRef();

  const wasSimulating = useRef(isSimulating);
  const lastEarthPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const transitionTime = useRef(0);

  useEffect(() => {
    if (cameraControlRef.current) {
        cameraControlRef.current.setLookAt(35, 10, 45, -5, 0, 0, false);
    }
  }, []);

  useFrame((state, delta) => {
    // 1. Orbital Physics
    if (!isPaused) {
       simulationRefs.earthAngle += 0.02 * delta; // adjustable orbit speed
    }
    const R = 120;
    const angle = simulationRefs.earthAngle;
    const targetX = -120 + R * Math.cos(angle);
    const targetZ = R * Math.sin(angle);
    const newPos = new THREE.Vector3(targetX, 0, targetZ);

    if (earthSystemRef.current) {
       earthSystemRef.current.position.copy(newPos);
    }

    // 2. Camera Tracking
    if (cameraControlRef.current) {
        const diff = newPos.clone().sub(lastEarthPos.current);
        lastEarthPos.current.copy(newPos);
        
        // Follow Earth passively without disrupting user drag or cinematic zooms
        if (state.clock.elapsedTime > 0.1 && state.clock.elapsedTime > transitionTime.current) {
            const cam = cameraControlRef.current.camera;
            cam.position.add(diff);
            cameraControlRef.current.getTarget(targetVec);
            targetVec.add(diff);
            cameraControlRef.current.setTarget(targetVec.x, targetVec.y, targetVec.z, false);
        }

        // Cinematic Transitions
        if (isSimulating !== wasSimulating.current) {
           wasSimulating.current = isSimulating;
           transitionTime.current = state.clock.elapsedTime + 1.2; // Halt manual tracking while API animates
           
           if (isSimulating) {
              cameraControlRef.current.setLookAt(
                targetX, 5, targetZ + 25, 
                targetX, 0, targetZ, 
                true
              );
           } else {
              cameraControlRef.current.setLookAt(
                targetX + 35, 10, targetZ + 45, 
                targetX - 5, 0, targetZ, 
                true
              );
           }
        }
    }
  });

  return (
    <>
      <CameraControls 
         ref={cameraControlRef} 
         maxDistance={1500} // Unrestricted zoom out
         minDistance={8.5} // Extremely close zoom in
         dollySpeed={1.5}
         truckSpeed={2.0} // Figma-like fast panning
      />
      
      {/* Low ambient light for cinematic shadows */}
      <ambientLight intensity={0.02} />
      
      {/* Dense starfield with parallax */}
      <Stars radius={150} depth={100} count={10000} factor={6} saturation={0} fade speed={1.5} />
      
      {/* The Sun acts as our main directional light source */}
      <Sun position={[-120, 0, 0]} />
      
      {/* Solar System Orbit Ring for Earth */}
      <Ring args={[119.8, 120.2, 256]} position={[-120, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
         />
      </Ring>

      {/* Earth System tracking along the orbit path */}
      <group ref={earthSystemRef}>
        {/* GEO Orbit Ring Visualization */}
        <Ring args={[13.98, 14.02, 128]} rotation={[Math.PI / 2, 0, 0]}>
           <meshBasicMaterial 
              color="#00ffff" 
              transparent 
              opacity={0.3} 
              blending={THREE.AdditiveBlending} 
              side={THREE.DoubleSide} 
           />
        </Ring>

        {/* The Earth */}
        <Earth />
        
        {/* Satellite Platform */}
        <Satellite targetCity={targetCity} />
      </group>
    </>
  );
};

export const EarthScene = () => {
  return (
    <Canvas 
      camera={{ position: [35, 10, 45], fov: 40 }}
      gl={{ antialias: true, alpha: false, logarithmicDepthBuffer: true }}
    >
      <color attach="background" args={['#020204']} />
      <fog attach="fog" args={['#020204', 80, 250]} />
      
      <SceneContent />
      
      {/* Realism Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};
