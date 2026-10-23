import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';

export const LinkBudgetPanel = () => {
  const { linkBudget, isSimulating } = useSimulationStore();

  if (!isSimulating) return null;

  return (
    <div className="glass-panel p-6 mt-6">
      <h2 className="text-lg font-bold text-neon-blue mb-4 uppercase tracking-widest flex items-center">
        <span className="mr-2">📡</span> Link Budget
      </h2>
      
      <div className="bg-dark/50 border border-white/10 rounded p-3 text-xs font-mono">
        
        <div className="flex justify-between items-center text-white mb-2 pb-1 border-b border-white/20">
          <span>Transmit Power (Pt)</span>
          <span className="font-bold">{linkBudget.txPowerDbw.toFixed(2)} dBW</span>
        </div>
        
        <div className="flex justify-between items-center text-green-400 mb-1">
          <span>+ Transmit Gain (Gt) <span className="text-[10px] text-gray-500 ml-1">(Derived)</span></span>
          <span>{linkBudget.txGainDb.toFixed(2)} dB</span>
        </div>
        
        <div className="flex justify-between items-center text-green-400 mb-1">
          <span>+ Receive Gain (Gr) <span className="text-[10px] text-gray-500 ml-1">(Derived)</span></span>
          <span>{linkBudget.rxGainDb.toFixed(2)} dB</span>
        </div>
        
        <div className="flex justify-between items-center text-red-400 mb-1">
          <span>− FSPL (Path Loss)</span>
          <span>-{linkBudget.fsplDb.toFixed(2)} dB</span>
        </div>
        
        <div className="flex justify-between items-center text-red-400 mb-2 pb-2 border-b border-white/20">
          <span>− Misc Losses</span>
          <span>-{linkBudget.lossesDb.toFixed(2)} dB</span>
        </div>
        
        <div className="flex justify-between items-center text-neon-cyan text-sm">
          <span className="font-bold">Received Power (Pr)</span>
          <span className="font-bold">{linkBudget.rxPowerDbw.toFixed(2)} dBW</span>
        </div>
        
      </div>
    </div>
  );
};
