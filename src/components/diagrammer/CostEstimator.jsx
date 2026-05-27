import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { estimateCosts } from '@/lib/costEstimator';
import { SERVICE_LIBRARY, PROVIDERS } from '@/lib/serviceLibrary';

const PROVIDER_STYLE = {
  aws:   { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  azure: { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  gcp:   { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  dot: 'bg-green-400' },
};

function fmt(n) {
  return n === 0 ? 'Free' : `$${n}`;
}

export default function CostEstimator({ nodes }) {
  const [expanded, setExpanded] = useState({});

  const costData = estimateCosts(nodes);
  const providers = Object.keys(costData);
  const grandTotal = providers.reduce((s, p) => s + costData[p].total, 0);

  if (providers.length === 0) return null;

  const toggleProvider = (p) => setExpanded(prev => ({ ...prev, [p]: !prev[p] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-2 mb-2 rounded-xl border border-slate-700 overflow-hidden"
      style={{ background: '#1a1f2e' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/60">
        <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
          <DollarSign className="w-3 h-3 text-emerald-400" />
        </div>
        <span className="text-[11px] font-semibold text-slate-300 flex-1">Stima Costo Mensile</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-[13px] font-bold text-emerald-400">${grandTotal}<span className="text-[10px] font-normal text-slate-500">/mo</span></span>
        </div>
      </div>

      {/* Per-provider breakdown */}
      <div className="divide-y divide-slate-800">
        {providers.map(p => {
          const d = costData[p];
          const style = PROVIDER_STYLE[p] || PROVIDER_STYLE.aws;
          const isOpen = expanded[p];
          return (
            <div key={p}>
              <button
                onClick={() => toggleProvider(p)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800/40 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                <span className={`text-[11px] font-semibold flex-1 text-left ${style.text}`}>
                  {PROVIDERS[p]?.label || p.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold text-white/80">${d.total}<span className="text-[10px] text-slate-500">/mo</span></span>
                {isOpen ? <ChevronUp className="w-3 h-3 text-slate-600" /> : <ChevronDown className="w-3 h-3 text-slate-600" />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2 space-y-1">
                      {d.items.map((item, i) => {
                        const svc = SERVICE_LIBRARY[item.serviceId];
                        return (
                          <div key={i} className="flex items-start gap-2 py-0.5">
                            <span className="text-[10px] text-slate-400 flex-1 leading-tight">
                              {svc?.name || item.serviceId}
                              <span className="block text-slate-600 text-[9px]">{item.label}</span>
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono flex-shrink-0">
                              {fmt(item.min)}–{fmt(item.max)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-1.5 text-[9px] text-slate-700 border-t border-slate-800">
        * Stime indicative basate su utilizzo medio. I costi reali variano.
      </div>
    </motion.div>
  );
}