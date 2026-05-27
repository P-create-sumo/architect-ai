import React, { useState } from 'react';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import { estimateCosts } from '@/lib/costEstimator';
import ServiceIcon from '@/components/diagrammer/ServiceIcon';
import { TrendingUp, Edit3, Check } from 'lucide-react';

const PROVIDER_COLORS = {
  aws: { label: 'AWS', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  azure: { label: 'Azure', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  gcp: { label: 'GCP', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

const fmt = (n) => n.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function ProjectCostPanel({ nodes, project, onUpdateBudget }) {
  const [editBudget, setEditBudget] = useState(false);
  const [budgetVal, setBudgetVal] = useState(project?.budget || '');

  const estimate = estimateCosts(nodes);
  const totalMin = Object.values(estimate).reduce((s, v) => s + v.min, 0);
  const totalMax = Object.values(estimate).reduce((s, v) => s + v.max, 0);
  const totalMid = Math.round((totalMin + totalMax) / 2);

  const budget = project?.budget;
  const diff = budget ? totalMid - budget : null;

  const uniqueServices = [...new Set(nodes.map(n => n.serviceId))].filter(id => SERVICE_LIBRARY[id]);

  const handleBudgetSave = () => {
    const val = parseFloat(budgetVal);
    if (!isNaN(val)) onUpdateBudget(val);
    setEditBudget(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Stima Costi</h2>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">Basata sui componenti nel diagramma</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Total */}
        <div className="rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] text-emerald-400/70 uppercase font-semibold tracking-wider mb-1">Stima Mensile</p>
          <p className="text-3xl font-bold text-white">€{fmt(totalMid)}</p>
          <p className="text-xs text-slate-500 mt-1">Range: €{fmt(totalMin)} – €{fmt(totalMax)}/mese</p>

          {/* Budget comparison */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Budget Cliente</span>
            {editBudget ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">€</span>
                <input
                  autoFocus
                  type="number"
                  value={budgetVal}
                  onChange={e => setBudgetVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleBudgetSave(); }}
                  className="w-20 bg-slate-800 border border-violet-500 rounded px-2 py-0.5 text-xs text-white outline-none"
                />
                <button onClick={handleBudgetSave}><Check className="w-3.5 h-3.5 text-violet-400" /></button>
              </div>
            ) : (
              <button onClick={() => { setBudgetVal(budget || ''); setEditBudget(true); }} className="flex items-center gap-1 group">
                <span className="text-sm font-bold text-white">{budget ? `€${fmt(budget)}` : '–'}</span>
                <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            )}
          </div>

          {diff !== null && (
            <div className={`mt-2 text-xs font-medium ${diff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {diff > 0 ? `⚠ €${fmt(diff)} sopra il budget` : `✓ €${fmt(Math.abs(diff))} sotto il budget`}
            </div>
          )}
        </div>

        {/* Annual */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 bg-slate-800/50 border border-slate-700">
            <p className="text-[10px] text-slate-500 mb-1">Annuale (min)</p>
            <p className="text-sm font-bold text-white">€{fmt(totalMin * 12)}</p>
          </div>
          <div className="rounded-xl p-3 bg-slate-800/50 border border-slate-700">
            <p className="text-[10px] text-slate-500 mb-1">Annuale (max)</p>
            <p className="text-sm font-bold text-white">€{fmt(totalMax * 12)}</p>
          </div>
        </div>

        {/* By provider */}
        {Object.entries(estimate).map(([provider, data]) => {
          const pc = PROVIDER_COLORS[provider];
          if (!pc || data.mid === 0) return null;
          const providerNodes = nodes.filter(n => SERVICE_LIBRARY[n.serviceId]?.provider === provider);
          return (
            <div key={provider} className={`rounded-xl p-3 border ${pc.border} ${pc.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold ${pc.text}`}>{pc.label}</span>
                <span className={`text-sm font-bold ${pc.text}`}>€{fmt(data.mid)}/mese</span>
              </div>
              <div className="space-y-1.5">
                {providerNodes.map(node => {
                  const svc = SERVICE_LIBRARY[node.serviceId];
                  if (!svc) return null;
                  return (
                    <div key={node.id} className="flex items-center gap-2">
                      <ServiceIcon service={svc} size="xs" />
                      <span className="text-[10px] text-slate-400 flex-1 truncate">{svc.fullName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">Aggiungi componenti al diagramma</p>
            <p className="text-slate-600 text-xs mt-1">La stima verrà calcolata automaticamente</p>
          </div>
        )}
      </div>
    </div>
  );
}