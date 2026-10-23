import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

const TraceSection = ({ title, traceLines }) => (
  <div className="mb-5 bg-dark/60 border border-white/10 rounded-lg p-4">
    <h3 className="text-neon-cyan text-sm font-bold uppercase tracking-wider mb-3 border-b border-neon-cyan/30 pb-2">{title}</h3>
    <div className="text-[13px] leading-relaxed font-mono text-gray-300 space-y-2">
      {traceLines.length > 0 ? traceLines.map((line, i) => (
        <div key={i} className="whitespace-nowrap overflow-x-auto custom-scrollbar bg-black/50 px-3 py-1.5 rounded">{line}</div>
      )) : (
        <div className="text-gray-600 italic">No trace available.</div>
      )}
    </div>
  </div>
);

export const EngineeringTracePanel = () => {
  const { backendTrace, isSimulating } = useSimulationStore();

  if (!isSimulating) return null;

  return (
    <div className="glass-panel p-6 mt-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
       <h2 className="text-xl font-bold text-neon-blue mb-4 uppercase tracking-widest flex items-center">
        <span className="mr-2 text-2xl">🔬</span> ENGINEERING TRACE
      </h2>
      <TraceSection title="1. Solar Equation" traceLines={backendTrace.solar} />
      <TraceSection title="2. RF Transmission (Friis)" traceLines={backendTrace.transmission} />
      <TraceSection title="3. Rectenna Conversion" traceLines={backendTrace.rectenna} />
    </div>
  );
};
