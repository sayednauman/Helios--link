import { create } from 'zustand';

export const simulationRefs = {
  earthRotation: 0,
  earthAngle: 0,
};

export const useSimulationStore = create((set, get) => ({
  isSimulating: false,
  isPaused: false,
  
  targetCity: { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  orbitType: 'GEO',
  
  // Physical parameters
  panelArea: 50000,
  solarEfficiency: 0.29,
  frequencyGHz: 2.45,
  distanceKm: 35786, // GEO
  txDiameterM: 50.0,
  rxDiameterM: 1000.0,
  rectennaEfficiency: 0.85,
  
  validationError: null,

  // Backend returned state
  metrics: {
    powerGeneratedWatts: 0,
    receivedPowerWatts: 0,
    finalPowerDcWatts: 0,
    overallEfficiency: 0,
  },
  
  linkBudget: {
    txPowerDbw: 0,
    txGainDb: 0,
    rxGainDb: 0,
    fsplDb: 0,
    lossesDb: 0,
    rxPowerDbw: 0
  },

  backendTrace: {
    solar: [],
    transmission: [],
    rectenna: []
  },
  
  backendAssumptions: [],
  backendLimitations: [],
  
  logs: [
    { time: new Date().toLocaleTimeString(), message: '[SYSTEM] Aerospace physics model initialized.' },
    { time: new Date().toLocaleTimeString(), message: '[SYSTEM] Awaiting parameters...' },
  ],

  // Setters
  setTargetCity: (city) => {
    set({ targetCity: city });
    if(get().isSimulating) get().updatePhysicsSimulation();
  },
  setOrbitType: (type) => {
    set({ 
      orbitType: type,
      distanceKm: type === 'GEO' ? 35786 : 500
    });
    if(get().isSimulating) get().updatePhysicsSimulation();
  },
  
  setParameter: (key, value) => {
    set({ [key]: value, validationError: null }); // Clear error on edit
    const isSim = get().isSimulating;
    const isPsd = get().isPaused;
    
    // Auto-update if simulating and valid, but we don't strictly validate partial edits immediately
    if (isSim && !isPsd) {
      if(get().validateInputs()) {
        get().updatePhysicsSimulation();
      } else {
        set({ isSimulating: false });
      }
    }
  },

  validateInputs: () => {
    const s = get();
    if (s.panelArea < 1000 || s.panelArea > 200000) { set({ validationError: "Solar panel area must be between 1000 and 200000 m²" }); return false; }
    if (s.solarEfficiency < 0.15 || s.solarEfficiency > 0.35) { set({ validationError: "Panel efficiency must be between 15% and 35%" }); return false; }
    if (s.frequencyGHz < 1 || s.frequencyGHz > 10) { set({ validationError: "Frequency must be between 1 and 10 GHz" }); return false; }
    if (s.txDiameterM < 10 || s.txDiameterM > 1000) { set({ validationError: "Tx Antenna Diameter must be between 10m and 1000m" }); return false; }
    if (s.rxDiameterM < 50 || s.rxDiameterM > 5000) { set({ validationError: "Rectenna Diameter must be between 50m and 5000m" }); return false; }
    if (s.rectennaEfficiency < 0.70 || s.rectennaEfficiency > 0.90) { set({ validationError: "Rectenna Efficiency must be between 70% and 90%" }); return false; }
    
    set({ validationError: null });
    return true;
  },

  updatePhysicsSimulation: async () => {
    const state = get();
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area_m2: state.panelArea,
          solar_efficiency: state.solarEfficiency,
          frequency_ghz: state.frequencyGHz,
          distance_km: state.distanceKm,
          tx_diameter_m: state.txDiameterM,
          rx_diameter_m: state.rxDiameterM,
          rectenna_efficiency: state.rectennaEfficiency
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.detail || "API Error");
      }

      const data = await response.json();
      
      set({
        metrics: {
          powerGeneratedWatts: data.summary.power_generated_w,
          receivedPowerWatts: data.summary.received_power_w,
          finalPowerDcWatts: data.summary.final_power_dc_w,
          overallEfficiency: data.summary.overall_efficiency
        },
        linkBudget: {
          txPowerDbw: data.transmission.tx_power_dbw,
          txGainDb: data.transmission.tx_gain_db,
          rxGainDb: data.transmission.rx_gain_db,
          fsplDb: data.transmission.fspl_db,
          lossesDb: data.transmission.losses_db,
          rxPowerDbw: data.transmission.rx_power_dbw
        },
        backendTrace: {
          solar: data.solar.trace,
          transmission: data.transmission.trace,
          rectenna: data.rectenna.trace
        },
        backendAssumptions: data.assumptions,
        backendLimitations: data.limitations
      });
      
    } catch (error) {
      get().addLog(`[ERROR] Physics Engine: ${error.message}`);
    }
  },

  startSimulation: async () => {
    if(!get().validateInputs()) {
       get().addLog(`[SYSTEM] Simulation blocked: Invalid inputs detected.`);
       return;
    }
    set({ isSimulating: true, isPaused: false });
    get().addLog(`[ORBITAL] Initiating lock on ${get().targetCity.name}...`);
    get().addLog('[SYSTEM] Engaging physics engine...');
    await get().updatePhysicsSimulation();
  },

  stopSimulation: () => {
    set({ isSimulating: false, isPaused: false });
    get().addLog('[SYSTEM] Simulation aborted.');
    set({
      metrics: {
        powerGeneratedWatts: 0,
        receivedPowerWatts: 0,
        finalPowerDcWatts: 0,
        overallEfficiency: 0,
      }
    });
  },

  pauseSimulation: () => {
    set({ isPaused: true });
    get().addLog('[SYSTEM] Simulation paused.');
  },

  resumeSimulation: () => {
    set({ isPaused: false });
    get().addLog('[SYSTEM] Simulation resumed.');
  },

  addLog: (message) => set((state) => ({
    logs: [...state.logs, { time: new Date().toLocaleTimeString(), message }]
  })),

}));
