import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Play, Square, Pause, PlayCircle } from 'lucide-react';

const cities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 }
];

export const InputPanel = () => {
  const { 
    isSimulating, isPaused, targetCity, orbitType, 
    panelArea, solarEfficiency, frequencyGHz, txDiameterM, rxDiameterM, rectennaEfficiency,
    validationError,
    setTargetCity, setOrbitType, setParameter,
    startSimulation, stopSimulation, pauseSimulation, resumeSimulation 
  } = useSimulationStore();

  const handleCityChange = (e) => {
    const city = cities.find(c => c.name === e.target.value);
    if(city) setTargetCity(city);
  };

  return (
    <div className="glass-panel p-6 flex-1 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-neon-blue mb-4">Mission Parameters</h2>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 tracking-wider uppercase">Target Receiver City</label>
          <select 
            className="w-full bg-black/60 border border-white/20 rounded px-2 py-1.5 text-sm text-white focus:border-neon-cyan focus:outline-none font-mono"
            value={targetCity.name}
            onChange={handleCityChange}
            disabled={isSimulating}
          >
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 tracking-wider uppercase">Orbit Profile</label>
          <select 
            className="w-full bg-black/60 border border-white/20 rounded px-2 py-1.5 text-sm text-white focus:border-neon-cyan focus:outline-none font-mono"
            value={orbitType}
            onChange={(e) => setOrbitType(e.target.value)}
            disabled={isSimulating}
          >
            <option value="GEO">Geostationary (GEO)</option>
            <option value="LEO">Low Earth Orbit (LEO)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-mono text-neon-cyan mb-1 tracking-wider uppercase">Space Segment</label>
          
          <div className="space-y-3 mt-2">
              <div>
                  <label className={`block text-xs mb-1 ${panelArea < 1000 || panelArea > 200000 ? 'text-red-400' : 'text-gray-400'}`}>Solar Array Area (m²) [1k - 200k]</label>
                  <input 
                    type="number"
                    placeholder="e.g. 50000"
                    className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${panelArea < 1000 || panelArea > 200000 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                    value={panelArea === '' ? '' : panelArea}
                    onChange={(e) => setParameter('panelArea', e.target.value === '' ? '' : Number(e.target.value))}
                  />
              </div>

              <div>
                  <label className={`block text-xs mb-1 ${solarEfficiency < 0.15 || solarEfficiency > 0.35 ? 'text-red-400' : 'text-gray-400'}`}>PV Efficiency (%) [15.0 - 35.0]</label>
                  <input 
                    type="number" step="0.1"
                    placeholder="e.g. 29.0"
                    className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${solarEfficiency < 0.15 || solarEfficiency > 0.35 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                    value={solarEfficiency === '' ? '' : Math.round(solarEfficiency * 1000)/10}
                    onChange={(e) => setParameter('solarEfficiency', e.target.value === '' ? '' : Number(e.target.value) / 100)}
                  />
              </div>

              <div>
                  <label className={`block text-xs mb-1 ${txDiameterM < 10 || txDiameterM > 1000 ? 'text-red-400' : 'text-gray-400'}`}>Tx Antenna Diameter (m) [10 - 1000]</label>
                  <input 
                    type="number" step="1"
                    placeholder="e.g. 50"
                    className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${txDiameterM < 10 || txDiameterM > 1000 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                    value={txDiameterM === '' ? '' : txDiameterM}
                    onChange={(e) => setParameter('txDiameterM', e.target.value === '' ? '' : Number(e.target.value))}
                  />
              </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-mono text-neon-cyan mb-1 tracking-wider uppercase">Link / Frequency</label>
          <div>
              <label className={`block text-xs mb-1 ${frequencyGHz < 1 || frequencyGHz > 10 ? 'text-red-400' : 'text-gray-400'}`}>RF Frequency (GHz) [1.0 - 10.0]</label>
              <input 
                type="number" step="0.05"
                placeholder="e.g. 2.45"
                className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${frequencyGHz < 1 || frequencyGHz > 10 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                value={frequencyGHz === '' ? '' : frequencyGHz}
                onChange={(e) => setParameter('frequencyGHz', e.target.value === '' ? '' : Number(e.target.value))}
              />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-mono text-neon-cyan mb-1 tracking-wider uppercase">Ground Segment</label>
           
           <div className="space-y-3 mt-2">
              <div>
                  <label className={`block text-xs mb-1 ${rxDiameterM < 50 || rxDiameterM > 5000 ? 'text-red-400' : 'text-gray-400'}`}>Rectenna Diameter (m) [50 - 5000]</label>
                  <input 
                    type="number" step="1"
                    placeholder="e.g. 1000"
                    className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${rxDiameterM < 50 || rxDiameterM > 5000 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                    value={rxDiameterM === '' ? '' : rxDiameterM}
                    onChange={(e) => setParameter('rxDiameterM', e.target.value === '' ? '' : Number(e.target.value))}
                  />
              </div>

              <div>
                  <label className={`block text-xs mb-1 ${rectennaEfficiency < 0.70 || rectennaEfficiency > 0.90 ? 'text-red-400' : 'text-gray-400'}`}>Rectenna Efficiency (%) [70.0 - 90.0]</label>
                  <input 
                    type="number" step="0.1"
                    placeholder="e.g. 85.0"
                    className={`w-full bg-black/60 border rounded px-2 py-1.5 text-sm text-white focus:outline-none font-mono placeholder:text-gray-600 ${rectennaEfficiency < 0.70 || rectennaEfficiency > 0.90 ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-neon-cyan'}`}
                    value={rectennaEfficiency === '' ? '' : Math.round(rectennaEfficiency * 1000)/10}
                    onChange={(e) => setParameter('rectennaEfficiency', e.target.value === '' ? '' : Number(e.target.value) / 100)}
                  />
              </div>
          </div>
        </div>

      </div>

      <div className="mt-6 space-y-2">
        {validationError && !isSimulating && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-2 rounded text-xs mb-2">
            ⚠️ {validationError}
          </div>
        )}
        {!isSimulating ? (
          <button 
            onClick={startSimulation}
            disabled={!!validationError}
            className={`w-full py-2 rounded flex items-center justify-center font-bold text-sm transition-all uppercase tracking-wider ${validationError ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-transparent' : 'bg-neon-blue/20 hover:bg-neon-blue/40 border-neon-blue border text-white shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]'}`}
          >
            <Play className="mr-2 h-4 w-4" /> Start Simulation
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button 
                onClick={pauseSimulation}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500 text-white py-2 rounded flex items-center justify-center font-bold text-sm transition-all uppercase tracking-wider"
              >
                <Pause className="mr-2 h-4 w-4" /> Pause
              </button>
            ) : (
              <button 
                onClick={resumeSimulation}
                className="w-full bg-green-500/20 hover:bg-green-500/40 border border-green-500 text-white py-2 rounded flex items-center justify-center font-bold text-sm transition-all uppercase tracking-wider"
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Resume
              </button>
            )}
            <button 
              onClick={stopSimulation}
              className="w-full bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-white py-2 rounded flex items-center justify-center font-bold text-sm transition-all uppercase tracking-wider"
            >
              <Square className="mr-2 h-4 w-4" /> Abort
            </button>
          </>
        )}
      </div>
    </div>
  );
};
