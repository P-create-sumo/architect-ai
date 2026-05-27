import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, ShieldAlert, Info, ChevronDown, ChevronUp, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIPanel({ warnings, onGenerateDescription, flowDescription, isGenerating }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  const severityConfig = {
    high: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    medium: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    low: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  };

  return (
    <div className="space-y-3">
      {/* AI Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-1"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
            Architect AI
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-white/30" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/30" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3"
          >
            {/* Warnings */}
            {warnings.length > 0 ? (
              <div className="space-y-2">
                {warnings.map((w, i) => {
                  const config = severityConfig[w.severity] || severityConfig.low;
                  const WarnIcon = config.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-xl ${config.bg} border ${config.border}`}
                    >
                      <div className="flex items-start gap-2">
                        <WarnIcon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${config.color}`} />
                        <div>
                          <p className="text-[10px] text-white/70 leading-relaxed">{w.message}</p>
                          {w.suggestion && (
                            <p className="text-[10px] text-white/40 mt-1.5 italic">💡 {w.suggestion}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] text-emerald-400/70 text-center">✓ Nessun problema rilevato</p>
              </div>
            )}

            {/* Generate description button */}
            <Button
              onClick={() => { setShowDescription(true); onGenerateDescription(); }}
              disabled={isGenerating}
              className="w-full h-8 text-[11px] font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border-0 text-white rounded-xl shadow-lg shadow-violet-500/20"
            >
              {isGenerating ? (
                <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Generando...</>
              ) : (
                <><FileText className="w-3 h-3 mr-1.5" /> Genera Descrizione Flusso</>
              )}
            </Button>

            {/* Flow description */}
            <AnimatePresence>
              {showDescription && flowDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <p className="text-[10px] text-white/50 leading-relaxed whitespace-pre-line">{flowDescription}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}