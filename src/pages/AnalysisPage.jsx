import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { LinkBudgetPanel } from '../components/panels/LinkBudgetPanel';
import { EngineeringTracePanel } from '../components/panels/EngineeringTracePanel';
import { ConsoleLog } from '../components/panels/ConsoleLog';

export const AnalysisPage = () => {
  const { isSimulating } = useSimulationStore();

  return (
    <div className="w-full h-full overflow-y-auto p-8 bg-[#020204]">
       <div className="max-w-3xl mx-auto flex flex-col gap-8">
           <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
              Physics Trace Analysis
           </h1>

           {!isSimulating ? (
               <div className="bg-dark/50 border border-white/10 rounded p-12 text-center">
                  <p className="text-gray-400 text-lg font-mono">
                     ⚠️ Please start the simulation first to view physics metrics and traces.
                  </p>
               </div>
           ) : (
               <>
                  <LinkBudgetPanel />
                  <EngineeringTracePanel />
                  <div className="h-64">
                    <ConsoleLog />
                  </div>
               </>
           )}
       </div>
    </div>
  );
};
