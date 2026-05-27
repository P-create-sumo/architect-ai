import React from 'react';
import { LOGICAL_PHASES, CLOUD_PROVIDERS, CLOUD_SERVICES } from '@/lib/cloudComponents';
import { ArrowDownToLine, Cpu, Database, HardDrive, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = { ArrowDownToLine, Cpu, Database, HardDrive, Activity };

export default function ComparisonView({ nodes }) {
  const phases = nodes.map(n => n.phase);
  const uniquePhases = [...new Set(phases)];

  if (uniquePhases.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-white/30">Aggiungi blocchi logici per visualizzare il confronto</p>
      </div>
    );
  }

  const providers = Object.values(CLOUD_PROVIDERS);

  return (
    <div className="p-6 h-full overflow-auto" style={{ background: 'hsl(220 25% 10%)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-white/80 mb-6">Confronto Multi-Cloud</h2>
        
        {/* Header */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="px-3 py-2">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Fase Logica</p>
          </div>
          {providers.map(p => (
            <div key={p.id} className={`px-3 py-2 rounded-lg ${p.bgColor} border ${p.borderColor}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${p.accentColor}`} />
                <p className={`text-[11px] font-bold ${p.color}`}>{p.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {uniquePhases.map((phaseId, i) => {
            const phase = LOGICAL_PHASES[phaseId];
            const Icon = iconMap[phase.icon];
            const node = nodes.find(n => n.phase === phaseId);

            return (
              <motion.div
                key={phaseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="grid grid-cols-4 gap-3"
              >
                {/* Phase */}
                <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white/80">{phase.label}</p>
                    <p className="text-[9px] text-white/35">{phase.subtitle}</p>
                  </div>
                </div>

                {/* Services per provider */}
                {providers.map(p => {
                  const service = CLOUD_SERVICES[phaseId]?.[p.id]?.[0];
                  const isSelected = node?.provider === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`px-3 py-3 rounded-xl transition-all ${
                        isSelected
                          ? `${p.bgColor} border ${p.borderColor}`
                          : 'bg-white/[0.02] border border-white/5'
                      }`}
                    >
                      {service && (
                        <>
                          <p className={`text-[11px] font-semibold font-mono ${isSelected ? p.color : 'text-white/50'}`}>
                            {service.name}
                          </p>
                          <p className="text-[9px] text-white/30 mt-1 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

        {/* Flow arrows */}
        {uniquePhases.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {uniquePhases.map((phaseId, i) => {
              const phase = LOGICAL_PHASES[phaseId];
              return (
                <React.Fragment key={phaseId}>
                  <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${phase.color} text-white text-[10px] font-semibold`}>
                    {phase.label}
                  </div>
                  {i < uniquePhases.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}