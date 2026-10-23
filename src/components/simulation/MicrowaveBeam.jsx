import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';

export const MicrowaveBeam = ({ active, distance, paused }) => {
  const simBeamRef = useRef();
  const idleBeamRef = useRef();
  const { metrics, linkBudget } = useSimulationStore();

  // Logarithmic Mapping
  // Tx Power typically around 30 to 80 dBW context.
  const mappedThicknessLog = useMemo(() => {
     if (linkBudget.rxPowerDbw === 0) return 1.0;
     // rxPowerDbw can be around -60 to +60 depending on parameters. Let's normalize it a bit for visual size.
     // Typically rxPower bounds: -100 to 100. Let's clamp and map to [0.1, 1.5]
     let val = linkBudget.rxPowerDbw;
     val = Math.max(-100, Math.min(100, val));
     const normalized = (val + 100) / 200; // 0 to 1
     return 0.1 + normalized * 1.5;
  }, [linkBudget.rxPowerDbw]);

  const mappedIntensityLog = useMemo(() => {
     if (linkBudget.txPowerDbw === 0) return 0.2;
     // Tx Power DBW context: let's map 0 dBW to 100 dBW -> opacity 0.1 to 0.8
     let val = linkBudget.txPowerDbw;
     val = Math.max(0, Math.min(100, val));
     const normalized = val / 100;
     return 0.1 + normalized * 0.7;
  }, [linkBudget.txPowerDbw]);

  // Color mapping based on efficiency (red = low, green/cyan = high)
  const mappedColor = useMemo(() => {
     const eff = metrics.overallEfficiency; // 0 to 1
     const h = 0 + (eff * 180); // Hue: 0 (red) to 180 (cyan)
     return `hsl(${h}, 100%, 50%)`;
  }, [metrics.overallEfficiency]);

  useFrame(({ clock }) => {
    if (!active && idleBeamRef.current && !paused) {
      idleBeamRef.current.material.opacity = 0.3 + Math.sin(clock.elapsedTime * 5) * 0.1;
    }

    if (active && simBeamRef.current && !paused) {
      const pulseScale = 1 + Math.sin(clock.elapsedTime * 25) * 0.1;
      simBeamRef.current.scale.x = mappedThicknessLog * pulseScale;
      simBeamRef.current.scale.z = mappedThicknessLog * pulseScale;
      
      const pulseBase = mappedIntensityLog * 0.5;
      simBeamRef.current.material.opacity = pulseBase + Math.sin(clock.elapsedTime * 15) * 0.1;
      simBeamRef.current.material.color.set(mappedColor);
    }
  });

  return (
    <group position={[0, -distance / 2 - 0.4, 0]}>
      {!active && (
        <Cylinder ref={idleBeamRef} args={[0.01, 0.05, 50, 8]} position={[-20, 10, -20]} rotation={[0, 0, Math.PI / 4]}>
          <meshBasicMaterial
            color="#ffffcc"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Cylinder>
      )}

      {active && (
        <group>
          {/* Main Visual Beam tied to log scaling */}
          <Cylinder ref={simBeamRef} args={[0.05, 0.4, distance, 32]}>
            <meshBasicMaterial
              color={mappedColor}
              transparent
              opacity={mappedIntensityLog}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </Cylinder>

          {/* White Core */}
          <Cylinder args={[0.01, 0.05 * mappedThicknessLog, distance, 16]}>
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.6 * mappedIntensityLog}
              blending={THREE.AdditiveBlending}
            />
          </Cylinder>
        </group>
      )}
    </group>
  );
};
