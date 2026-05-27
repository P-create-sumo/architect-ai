import React, { useState } from 'react';
import { LOGICAL_PHASES, CLOUD_PROVIDERS, CLOUD_SERVICES, getDefaultService } from '@/lib/cloudComponents';
import { ArrowDownToLine, Cpu, Database, HardDrive, Activity, X, ChevronDown, Grip, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = { ArrowDownToLine, Cpu, Database, HardDrive, Activity };

export default function CanvasNode({
  node,
  isSelected,
  onSelect,
  onRemove,
  onUpdateNode,
  onStartConnection,
  onEndConnection,
  isConnecting,
  zoom,
}) {
  const [showProviderPicker, setShowProviderPicker] = useState(false);
  const phase = LOGICAL_PHASES[node.phase];
  const Icon = iconMap[phase.icon];
  const provider = node.provider ? CLOUD_PROVIDERS[node.provider] : null;
  const service = node.service;

  const handleProviderSelect = (providerId) => {
    const defaultService = getDefaultService(node.phase, providerId);
    onUpdateNode(node.id, {
      provider: providerId,
      service: defaultService,
    });
    setShowProviderPicker(false);
  };

  const handleServiceSelect = (svc) => {
    onUpdateNode(node.id, { service: svc });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute select-none"
      style={{ left: node.x, top: node.y, zIndex: isSelected ? 50 : 10 }}
    >
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        className={`
          relative w-[260px] rounded-2xl overflow-hidden
          border transition-all duration-200 cursor-pointer
          ${isSelected ? 'border-white/30 shadow-2xl shadow-black/40 ring-2 ring-white/10' : 'border-white/10 shadow-xl shadow-black/30 hover:border-white/20'}
        `}
        style={{ background: 'hsl(220 25% 14%)' }}
      >
        {/* Header */}
        <div className={`relative px-4 py-3 bg-gradient-to-r ${phase.color} bg-opacity-10`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} opacity-[0.08]`} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="cursor-grab active:cursor-grabbing p-0.5"
                onMouseDown={(e) => e.stopPropagation()}
                data-drag-handle
              >
                <Grip className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-md`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/90 uppercase tracking-wide">{phase.label}</p>
                <p className="text-[9px] text-white/40">{phase.subtitle}</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(node.id); }}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/40 hover:text-white/80" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {/* Provider selector */}
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowProviderPicker(!showProviderPicker); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/15 transition-all text-[11px]"
            >
              {provider ? (
                <span className={`font-semibold ${provider.color}`}>{provider.label}</span>
              ) : (
                <span className="text-white/40">Seleziona Provider...</span>
              )}
              <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${showProviderPicker ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProviderPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1">
                    {Object.values(CLOUD_PROVIDERS).map(p => (
                      <button
                        key={p.id}
                        onClick={(e) => { e.stopPropagation(); handleProviderSelect(p.id); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                          node.provider === p.id 
                            ? `${p.bgColor} ${p.color} border ${p.borderColor}`
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${p.accentColor}`} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service info */}
          {service && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <p className="text-[11px] font-semibold text-white/80 font-mono">{service.name}</p>
              <p className="text-[10px] text-white/35 mt-1 leading-relaxed">{service.description}</p>
            </motion.div>
          )}

          {/* Service picker */}
          {provider && (
            <div className="space-y-1">
              {CLOUD_SERVICES[node.phase]?.[node.provider]?.map(svc => (
                <button
                  key={svc.name}
                  onClick={(e) => { e.stopPropagation(); handleServiceSelect(svc); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[10px] transition-all ${
                    service?.name === svc.name
                      ? `${provider.bgColor} ${provider.color} font-semibold`
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  }`}
                >
                  {svc.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connection ports */}
        <div className="flex justify-between px-4 pb-3">
          <button
            onMouseUp={(e) => { e.stopPropagation(); onEndConnection(node.id); }}
            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
              ${isConnecting 
                ? 'border-emerald-400 bg-emerald-400/20 animate-pulse scale-125' 
                : 'border-white/20 bg-white/5 hover:border-white/40'}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </button>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onStartConnection(node.id); }}
            className="w-6 h-6 rounded-full border-2 border-white/20 bg-white/5 hover:border-white/40 transition-all flex items-center justify-center cursor-crosshair"
          >
            <Link2 className="w-3 h-3 text-white/30" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}