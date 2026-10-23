import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { useSimulationStore, simulationRefs } from '../../store/simulationStore';
import { MicrowaveBeam } from './MicrowaveBeam.jsx';

export const Satellite = ({ targetCity }) => {
  const groupRef = useRef();
  const satelliteRef = useRef();
  const idleRotation = useRef(0);
  const { isSimulating, isPaused } = useSimulationStore();
  
  const orbitRadius = 14;

  useFrame((state, delta) => {
    if (!groupRef.current || !satelliteRef.current) return;

    if (!isPaused) {
      if (!isSimulating) {
        // IDLE STATE: smooth circular motion
        idleRotation.current += 0.2 * delta; 
        
        groupRef.current.rotation.y = idleRotation.current;
        groupRef.current.rotation.x = 0; // GEO orbit is equatorial aligned
        
        // Face the earth perfectly
        satelliteRef.current.rotation.x = Math.PI / 2;
      } else {
        // SIMULATION STATE: locked GEO behavior
        // Target Rotation logic based on selected city + Earth's continuous rotation
        const targetLng = (targetCity.lng * Math.PI) / 180 + Math.PI; 
        const targetLat = (targetCity.lat * Math.PI) / 180;

        // Add earth's current exact rotation so we stay aligned above the city
        const targetRotationY = targetLng + simulationRefs.earthRotation;
        const targetRotationX = targetLat;

        // Smoothly interpolate to the locked position
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
        
        // Face the earth perfectly
        satelliteRef.current.rotation.x = Math.PI / 2;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={satelliteRef} position={[0, 0, orbitRadius]}>
        
        {/* Core Body */}
        <Cylinder args={[0.3, 0.3, 0.8, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
        </Cylinder>
        
        {/* Gold Foil Wrapped Component */}
        <Box args={[0.4, 0.4, 0.4]} position={[0,0,-0.4]}>
            <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.4} />
        </Box>

        {/* Solar Panels (Blue Reflective) */}
        <Box args={[4, 0.05, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0033aa" metalness={0.8} roughness={0.1} emissive="#001155" />
          {/* Panel Grid Lines */}
          <lineSegments>
             <edgesGeometry args={[new THREE.BoxGeometry(4, 0.05, 0.8)]} />
             <lineBasicMaterial color="#aaaaaa" />
          </lineSegments>
        </Box>

        {/* Transmission Dish pointing towards Earth */}
        <group position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
            <Cylinder args={[0.4, 0.1, 0.2, 16]}>
              <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.4} />
            </Cylinder>
            <Sphere args={[0.1, 8, 8]} position={[0, -0.1, 0]}>
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" />
            </Sphere>
        </group>

        {/* Small glow marker on the orbit plane */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </Sphere>

        {/* Energy Beam Subsystem */}
        <MicrowaveBeam active={isSimulating} distance={orbitRadius - 8.4} paused={isPaused} />
      </group>
    </group>
  );
};
