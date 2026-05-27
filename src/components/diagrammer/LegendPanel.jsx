import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import ServiceIcon from './ServiceIcon';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORY_LABELS = {
  compute: 'Compute',
  storage: 'Storage',
  database: 'Database',
  networking: 'Networking',
  security: 'Sicurezza',
  integration: 'Integrazione',
  analytics: 'Analytics',
  ai_ml: 'AI / ML',
  monitoring: 'Monitoring',
};

const CATEGORY_COLORS = {
  compute: '#F97316',
  storage: '#16A34A',
  database: '#2563EB',
  networking: '#8B5CF6',
  security: '#EF4444',
  integration: '#7C3AED',
  analytics: '#0891B2',
  ai_ml: '#0891B2',
  monitoring: '#EC4899',
};

export default function LegendPanel({ nodes }) {
  const [collapsed, setCollapsed] = useState({});

  // Deduplicate services present on canvas
  const uniqueServices = [];
  const seen = new Set();
  nodes.forEach(n => {
    if (!seen.has(n.serviceId) && SERVICE_LIBRARY[n.serviceId]) {
      seen.add(n.serviceId);
      uniqueServices.push(SERVICE_LIBRARY[n.serviceId]);
    }
  });

  // Group by category
  const grouped = uniqueServices.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 p-4 text-center">
        <BookOpen className="w-6 h-6 text-slate-700" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Trascina i servizi sul canvas per vedere la legenda
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-800 flex-shrink-0">
        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-[11px] font-semibold text-slate-400">Legenda</span>
        <span className="ml-auto text-[9px] bg-slate-800 text-slate-500 rounded-full px-1.5 py-0.5">
          {uniqueServices.length} servizi
        </span>
      </div>

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto py-1">
        {categories.map(cat => {
          const isOpen = !collapsed[cat];
          const color = CATEGORY_COLORS[cat] || '#6B7280';
          return (
            <div key={cat}>
              {/* Category header */}
              <button
                onClick={() => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex-1 text-left">
                  {CATEGORY_LABELS[cat] || cat}
                </span>
                {isOpen
                  ? <ChevronUp className="w-3 h-3 text-slate-700" />
                  : <ChevronDown className="w-3 h-3 text-slate-700" />
                }
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    {grouped[cat].map(svc => (
                      <div key={svc.id} className="flex items-start gap-2.5 px-3 py-2 border-b border-slate-800/50 last:border-0">
                        <div className="flex-shrink-0 mt-0.5">
                          <ServiceIcon service={svc} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-white/80 leading-tight">{svc.name}</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">{svc.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}