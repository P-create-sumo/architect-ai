import React from 'react';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import ServiceIcon from './ServiceIcon';
import { X, ArrowRight, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoSidebar({ selectedId, nodes, arrows, groups, onClose }) {
  const node = nodes.find(n => n.id === selectedId);
  const group = groups.find(g => g.id === selectedId);

  if (!node && !group) return null;

  if (group) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-64 border-l border-slate-800 flex flex-col"
        style={{ background: '#1a1f2e' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <p className="text-sm font-semibold text-white/80">Gruppo</p>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500">{group.label}</p>
          <p className="text-[11px] text-slate-600 mt-2">Doppio click sul nome per modificarlo.</p>
        </div>
      </motion.div>
    );
  }

  const service = SERVICE_LIBRARY[node.serviceId];
  if (!service) return null;

  const outgoing = arrows.filter(a => a.from === node.id);
  const incoming = arrows.filter(a => a.to === node.id);

  return (
    <motion.div
      key={selectedId}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-64 border-l border-slate-800 flex flex-col overflow-y-auto"
      style={{ background: '#1a1f2e' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dettaglio Servizio</p>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-700"><X className="w-4 h-4 text-slate-500" /></button>
      </div>

      {/* Service info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <ServiceIcon service={service} size="md" />
          <div>
            <p className="text-sm font-bold text-white leading-tight">{service.fullName}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
              {service.provider} · {service.category}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-[11px] text-slate-400 leading-relaxed">{service.description}</p>
        </div>

        {/* Connections */}
        {(outgoing.length > 0 || incoming.length > 0) && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Connessioni</p>
            <div className="space-y-1.5">
              {incoming.map(a => {
                const src = nodes.find(n => n.id === a.from);
                const srcSvc = src ? SERVICE_LIBRARY[src.serviceId] : null;
                if (!srcSvc) return null;
                return (
                  <div key={a.id} className="flex items-center gap-2 text-[10px] text-slate-500">
                    <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: srcSvc.bg }} />
                    <span className="truncate">{srcSvc.name}</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 text-slate-600" />
                    <span className="text-slate-400 font-medium">Tu</span>
                  </div>
                );
              })}
              {outgoing.map(a => {
                const dst = nodes.find(n => n.id === a.to);
                const dstSvc = dst ? SERVICE_LIBRARY[dst.serviceId] : null;
                if (!dstSvc) return null;
                return (
                  <div key={a.id} className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="text-slate-400 font-medium">Tu</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 text-slate-600" />
                    <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: dstSvc.bg }} />
                    <span className="truncate">{dstSvc.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}