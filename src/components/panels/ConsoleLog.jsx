import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const ConsoleLog = () => {
  const logs = useSimulationStore(state => state.logs);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (msg) => {
    if (msg.includes('[SYSTEM]')) return 'text-yellow-400';
    if (msg.includes('[ORBITAL]')) return 'text-purple-400';
    if (msg.includes('[TRANSMISSION]')) return 'text-neon-cyan';
    if (msg.includes('[RECTENNA]')) return 'text-green-400';
    if (msg.includes('abort') || msg.includes('Error')) return 'text-red-500';
    return 'text-gray-300';
  };

  return (
    <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
      <div className="text-xs text-gray-500 mb-2 font-mono uppercase border-b border-white/10 pb-2">
        Terminal / System Logs
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px]">
        {logs.map((log, i) => (
          <div key={i} className="flex">
            <span className="text-gray-500 mr-3 shrink-0">[{log.time}]</span>
            <span className={`break-words ${getColor(log.message)}`}>{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};
