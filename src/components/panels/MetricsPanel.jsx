import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

// Format helper
const formatPower = (watts) => {
  if (watts >= 1e9) return `${(watts / 1e9).toFixed(2)} GW`;
  if (watts >= 1e6) return `${(watts / 1e6).toFixed(2)} MW`;
  if (watts >= 1e3) return `${(watts / 1e3).toFixed(2)} kW`;
  return `${watts.toFixed(2)} W`;
};

const MetricCard = ({ label, valueStr, unit, isSimulating }) => (
  <div className="bg-dark/40 border border-white/10 p-3 rounded">
    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="flex items-baseline overflow-hidden">
      <div className={`text-xl font-mono font-bold truncate ${isSimulating ? 'text-neon-cyan text-shadow-neon' : 'text-white'}`}>
        {valueStr}
      </div>
      {unit && <div className="ml-1 text-xs text-gray-500">{unit}</div>}
    </div>
  </div>
);

export const MetricsPanel = () => {
  const { metrics, isSimulating, isPaused, frequencyGHz } = useSimulationStore();

  return (
    <div className="glass-panel p-6">
      <h2 className="text-lg font-bold text-neon-blue mb-4 flex items-center tracking-widest uppercase">
        <div className={`w-2 h-2 rounded-full mr-3 ${isSimulating ? (isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse shadow-[0_0_8px_#f00]') : 'bg-gray-500'}`}></div>
        Telemetry
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          label="Solar (PV)" 
          valueStr={formatPower(metrics.powerGeneratedWatts)} 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Received (RF)" 
          valueStr={formatPower(metrics.receivedPowerWatts)} 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Output (DC)" 
          valueStr={formatPower(metrics.finalPowerDcWatts)} 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Net Efficiency" 
          valueStr={(metrics.overallEfficiency * 100).toFixed(4)} 
          unit="%" 
          isSimulating={isSimulating} 
        />
      </div>
      
      <div className="mt-4 bg-dark/40 border border-white/10 p-3 rounded">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
            <span>Carrier Frequency</span>
            <span className="text-neon-cyan">{frequencyGHz.toFixed(2)} GHz</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2 overflow-hidden">
             <div className={`h-1 bg-neon-cyan rounded-full transition-all duration-300 ${isSimulating && !isPaused ? 'w-full origin-left animate-[pulse_1s_infinite]' : 'w-0'}`}></div>
          </div>
      </div>
    </div>
  );
};
