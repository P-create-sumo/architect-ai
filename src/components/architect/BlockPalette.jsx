import React from 'react';
import { LOGICAL_PHASES } from '@/lib/cloudComponents';
import { ArrowDownToLine, Cpu, Database, HardDrive, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  ArrowDownToLine,
  Cpu,
  Database,
  HardDrive,
  Activity,
};

export default function BlockPalette({ onDragStart }) {
  const phases = Object.values(LOGICAL_PHASES);

  return (
    <div className="space-y-2">
      <div className="px-1 mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Blocchi Logici
        </h3>
      </div>
      {phases.map((phase, i) => {
        const Icon = iconMap[phase.icon];
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            draggable
            onDragStart={(e) => onDragStart(e, phase.id)}
            className="group cursor-grab active:cursor-grabbing"
          >
            <div className={`
              relative overflow-hidden rounded-xl border border-white/5 
              bg-gradient-to-r ${phase.color} bg-opacity-5
              p-3 transition-all duration-300
              hover:border-white/20 hover:shadow-lg hover:shadow-black/20
              hover:scale-[1.02] active:scale-[0.98]
            `}
            style={{ background: 'hsl(220 25% 14%)' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity`} />
              <div className="relative flex items-center gap-3">
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90 truncate">{phase.label}</p>
                  <p className="text-[10px] text-white/40 truncate">{phase.subtitle}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="mt-4 px-1">
        <p className="text-[10px] text-white/30 leading-relaxed">
          Trascina un blocco nell'area di lavoro per iniziare a costruire la tua architettura.
        </p>
      </div>
    </div>
  );
}