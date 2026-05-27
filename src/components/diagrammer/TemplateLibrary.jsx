import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIAGRAM_TEMPLATES, PROVIDER_COLORS } from '@/lib/diagramTemplates';
import { X, LayoutTemplate, CheckCircle2 } from 'lucide-react';

export default function TemplateLibrary({ onApply, onClose }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#131720' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <LayoutTemplate className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/90">Template Predefiniti</p>
            <p className="text-[9px] text-slate-600">Carica e personalizza con il chatbot AI</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-2">
        {DIAGRAM_TEMPLATES.map(tpl => (
          <motion.div
            key={tpl.id}
            onMouseEnter={() => setHoveredId(tpl.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden cursor-pointer hover:border-slate-600 transition-all"
          >
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl leading-none mt-0.5">{tpl.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold text-white/90 leading-tight">{tpl.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{tpl.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border ${PROVIDER_COLORS[tpl.provider]}`}>
                        {tpl.provider}
                      </span>
                      <span className="text-[9px] text-slate-600">
                        {tpl.diagram.nodes.length} componenti · {tpl.diagram.arrows.length} connessioni
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {hoveredId === tpl.id && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => onApply(tpl.diagram, tpl.name)}
                    className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-semibold hover:bg-indigo-500/25 transition-all"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Carica nel diagramma
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}