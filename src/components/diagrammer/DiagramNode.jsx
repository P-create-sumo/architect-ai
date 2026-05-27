import React, { useState, useRef } from 'react';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import ServiceIcon from './ServiceIcon';
import { X, Info } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export default function DiagramNode({
  node,
  isSelected,
  onSelect,
  onRemove,
  onStartArrow,
  isArrowMode,
  onArrowDrop,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const service = SERVICE_LIBRARY[node.serviceId];
  if (!service) return null;

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, zIndex: isSelected ? 100 : 20 }}
    >
      <div
        className={`
          relative flex flex-col items-center gap-2 px-3 py-3 cursor-pointer select-none
          rounded-2xl transition-all duration-150 group
          ${isArrowMode ? 'ring-2 ring-indigo-500/60 ring-offset-1 ring-offset-transparent' : ''}
          ${isSelected ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-transparent' : ''}
        `}
        style={{ width: 110 }}
      >
        {/* Delete button */}
        <button
          data-no-drag
          onClick={(e) => { e.stopPropagation(); onRemove(node.id); }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 hover:bg-red-500 border border-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          style={{ opacity: isSelected ? 1 : undefined }}
        >
          <X className="w-3 h-3 text-white" />
        </button>

        {/* Info / tooltip trigger — always visible on hover */}
        <button
          data-no-drag
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
        >
          <Info className="w-3 h-3 text-slate-400" />
        </button>

        {/* Icon */}
        <div className="relative">
          <ServiceIcon service={service} size="md" />
          {/* Arrow start port */}
          <button
            data-no-drag
            onMouseDown={(e) => { e.stopPropagation(); onStartArrow(node.id); }}
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/10 border border-white/20 hover:bg-indigo-500/60 hover:border-indigo-400 transition-all cursor-crosshair z-20"
          />
        </div>

        {/* Label */}
        <span className="text-[11px] font-semibold text-white/90 text-center leading-tight max-w-full break-words">
          {service.fullName}
        </span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[200] pointer-events-none"
            style={{ width: 220 }}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ServiceIcon service={service} size="sm" />
                <div>
                  <p className="text-[11px] font-bold text-white">{service.fullName}</p>
                  <p className="text-[9px] text-slate-500 font-mono uppercase">{service.provider} · {service.category}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{service.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}