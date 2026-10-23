import React, { useState, useEffect } from 'react';
import { EarthScene } from '../components/simulation/EarthScene.jsx';
import { InputPanel } from '../components/panels/InputPanel.jsx';
import { MetricsPanel } from '../components/panels/MetricsPanel.jsx';
import { ModelInfoPanel } from '../components/panels/ModelInfoPanel.jsx';
import { LinkBudgetPanel } from '../components/panels/LinkBudgetPanel.jsx';
import { EngineeringTracePanel } from '../components/panels/EngineeringTracePanel.jsx';
import { ConsoleLog } from '../components/panels/ConsoleLog.jsx';
import { useSimulationStore } from '../store/simulationStore.js';

export const Simulation = () => {
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [rightTab, setRightTab] = useState('telemetry'); // 'telemetry' or 'diagnostics'
  const { isSimulating } = useSimulationStore();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fallback fullscreen: ${err.message}`);
      });
      setIsUIHidden(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsUIHidden(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsUIHidden(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#020204]">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <EarthScene />
      </div>

      {/* Cinematic Mode Toggle Button */}
      <div
        className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-opacity duration-500 delay-100 ${
          isUIHidden ? 'opacity-20 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <button
          onClick={toggleFullScreen}
          className="bg-black/40 border border-neon-cyan/40 text-neon-cyan px-4 py-1.5 rounded shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all backdrop-blur-md font-mono text-xs uppercase tracking-wider flex items-center gap-2"
        >
          {isUIHidden ? (
            <>
              <span>↙</span> Exit Cinematic
            </>
          ) : (
            <>
              <span>⛶</span> Cinematic Mode
            </>
          )}
        </button>
      </div>

      {/* UI Overlay */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none flex p-6 gap-6 h-full transition-all duration-700 ${
          isUIHidden ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Left Column: Inputs & Model Info */}
        <div className="w-[380px] flex flex-col pointer-events-auto h-full overflow-hidden pb-12">
          <div className="mb-4 flex-shrink-0 pt-4">
            <h1 className="text-2xl font-bold text-white tracking-widest flex items-center">
              <span className="text-neon-cyan mr-2">⚡</span> HELIOS-LINK
            </h1>
            <p className="text-xs font-mono text-gray-400">Physics-Based SBSP Engine (V3.0)</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-2">
            <InputPanel />
            <ModelInfoPanel />
          </div>
        </div>

        {/* Center: Open Space for 3D View */}
        <div className="flex-1"></div>

        {/* Right Column: Dynamic Tabs (Metrics OR Diagnostics) */}
        <div className="w-[420px] flex flex-col gap-6 pointer-events-auto h-full overflow-hidden pb-12">
          
          {/* Tab Navigation */}
          <div className="flex gap-2 pt-4 flex-shrink-0">
             <button 
                onClick={() => setRightTab('telemetry')}
                className={`flex-1 py-1.5 rounded font-mono text-xs uppercase tracking-widest transition-all ${rightTab === 'telemetry' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan text-shadow-neon' : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-dark/60'}`}
             >
                Telemetry
             </button>
             <button 
                onClick={() => setRightTab('diagnostics')}
                className={`flex-1 py-1.5 rounded font-mono text-xs uppercase tracking-widest transition-all ${rightTab === 'diagnostics' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan text-shadow-neon' : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-dark/60'}`}
             >
                Diagnostics
             </button>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-2 mb-4">
             {rightTab === 'telemetry' && (
                <>
                  <MetricsPanel />
                  <div className="h-64 mt-2">
                     <ConsoleLog />
                  </div>
                </>
             )}
             {rightTab === 'diagnostics' && (
                !isSimulating ? (
                   <div className="bg-dark/50 border border-white/10 rounded p-6 text-center mt-4 glass-panel">
                       <p className="text-gray-400 text-sm font-mono uppercase tracking-widest">
                         ⚠️ Please start simulation first
                       </p>
                   </div>
                ) : (
                   <>
                     <LinkBudgetPanel />
                     <EngineeringTracePanel />
                   </>
                )
             )}
          </div>
        </div>
      </div>

      {/* Scrollbar hide styling inline for convenience */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3); 
          border-radius: 4px;
        }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
};
