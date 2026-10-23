import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const ModelInfoPanel = () => {
  const { backendAssumptions, backendLimitations, isSimulating } = useSimulationStore();

  if (!isSimulating) return null;

  return (
    <div className="glass-panel p-6 mt-6">
      <h2 className="text-lg font-bold text-neon-blue mb-4 uppercase tracking-widest flex items-center">
        <span className="mr-2">ℹ️</span> Context
      </h2>
      
      <div className="mb-4">
        <h3 className="text-neon-cyan text-xs font-bold uppercase tracking-wider mb-2 border-b border-neon-cyan/20 pb-1">Model Assumptions</h3>
        <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
          {backendAssumptions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border-b border-red-400/20 pb-1">Model Limitations</h3>
        <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
          {backendLimitations.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
