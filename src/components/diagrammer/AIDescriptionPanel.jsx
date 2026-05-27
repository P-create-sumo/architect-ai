import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIDescriptionPanel({ nodes, arrows }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const generate = async () => {
    if (nodes.length === 0) return;
    setLoading(true);
    setOpen(true);

    const nodeList = nodes.map(n => {
      const s = SERVICE_LIBRARY[n.serviceId];
      return s ? `- ${s.fullName} (${s.provider.toUpperCase()}, ${s.category})` : '';
    }).filter(Boolean).join('\n');

    const connList = arrows.map(a => {
      const from = nodes.find(n => n.id === a.from);
      const to = nodes.find(n => n.id === a.to);
      const fs = from ? SERVICE_LIBRARY[from.serviceId]?.name : '?';
      const ts = to ? SERVICE_LIBRARY[to.serviceId]?.name : '?';
      return `- ${fs} → ${ts}`;
    }).join('\n');

    const prompt = `Sei un Cloud Solution Architect esperto. Analizza questa architettura cloud e genera una descrizione tecnica ma accessibile del flusso dati.

Componenti dell'architettura:
${nodeList}

Flusso (connessioni):
${connList || 'Nessuna connessione definita'}

Rispondi in italiano con:
1. Una descrizione del flusso end-to-end (3-4 frasi)
2. Il ruolo di ogni componente principale (1 riga ciascuno)
3. Un breve consiglio di ottimizzazione se rilevante

Usa un tono professionale ma chiaro.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setDescription(result);
    setLoading(false);
  };

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => { if (!description && !loading) generate(); else setOpen(!open); }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Descrizione AI del Flusso</span>
        </div>
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
        ) : open ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {loading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span className="text-[11px] text-slate-500">Analizzando l'architettura...</span>
                </div>
              ) : description ? (
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 max-h-48 overflow-y-auto">
                  <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-line">{description}</p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600 py-2">Aggiungi componenti per generare la descrizione.</p>
              )}
              {description && (
                <button
                  onClick={generate}
                  className="mt-2 text-[10px] text-violet-400/60 hover:text-violet-400 transition-colors"
                >
                  ↻ Rigenera
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}