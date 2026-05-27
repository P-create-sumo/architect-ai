import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, User, Bot, RefreshCw, CheckCircle2, ChevronDown, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import ReactMarkdown from 'react-markdown';

const EXAMPLE_PROMPTS = [
  'Architettura serverless per un\'app di analisi documenti con AI su AWS',
  'Pipeline di dati real-time con Kinesis, Lambda e DynamoDB',
  'Sistema RAG con Bedrock, S3 e API Gateway in VPC',
  'Microservizi su Azure con Event Hubs, Functions e Cosmos DB',
  'Backend scalabile su GCP con Pub/Sub, Cloud Run e Firestore',
];

// Build a compact map of available service IDs for the AI
const SERVICE_MAP_PROMPT = Object.values(SERVICE_LIBRARY).map(s =>
  `${s.id} = ${s.fullName} (${s.provider})`
).join('\n');

export default function AIArchitectChat({ onApplyDiagram, currentNodes, currentArrows }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ciao! Descrivi l\'architettura cloud che vuoi progettare e la costruirò direttamente nel diagramma.\n\nPuoi specificare il cloud provider (AWS, Azure, GCP), i requisiti funzionali e le componenti che ti interessano.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastDiagram, setLastDiagram] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build context from current diagram
    const currentContext = currentNodes.length > 0
      ? `\nIl diagramma attuale ha già questi componenti: ${currentNodes.map(n => SERVICE_LIBRARY[n.serviceId]?.fullName).filter(Boolean).join(', ')}.`
      : '';

    const prompt = `Sei un Cloud Solution Architect esperto. L'utente descrive i requisiti di un'architettura cloud.

Il tuo compito è:
1. Rispondere con una breve spiegazione dell'architettura (2-3 frasi)
2. Generare un JSON strutturato dell'architettura

SERVIZI DISPONIBILI (usa SOLO questi ID esatti):
${SERVICE_MAP_PROMPT}

${currentContext}

RICHIESTA UTENTE: "${text}"

Rispondi SEMPRE con questo formato esatto:

SPIEGAZIONE:
<spiegazione breve in italiano dell'architettura proposta>

ARCHITETTURA_JSON:
{
  "nodes": [
    {"serviceId": "<id_servizio>", "x": <numero>, "y": <numero>}
  ],
  "arrows": [
    {"from": 0, "to": 1}
  ],
  "groups": [
    {"label": "<nome gruppo es. VPC AWS>", "x": <numero>, "y": <numero>, "width": <numero>, "height": <numero>, "color": "<hex>"}
  ]
}

REGOLE per il JSON:
- Le coordinate x,y devono creare un layout orizzontale leggibile. Usa x da 60 a 1200, y da 80 a 600.
- Disponi i nodi da sinistra a destra seguendo il flusso dati.
- Per flussi lineari usa y simili (es. y=200) e x incrementale (ogni 200px circa).
- Per componenti paralleli usa y diverse (es. 150, 300, 450).
- Gli arrows usano gli indici dell'array nodes (0-based).
- I groups sono facoltativi (solo per VPC, subnet o raggruppamenti logici rilevanti).
- Usa SOLO serviceId che esistono nella lista sopra.
- Includi da 4 a 10 componenti tipicamente.`;

    const raw = await base44.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });

    // Parse response
    const explanationMatch = raw.match(/SPIEGAZIONE:\s*([\s\S]*?)(?=ARCHITETTURA_JSON:|$)/);
    const jsonMatch = raw.match(/ARCHITETTURA_JSON:\s*(\{[\s\S]*\})/);

    const explanation = explanationMatch?.[1]?.trim() || raw;
    let diagram = null;

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);

      // Convert arrow indices to node IDs (we'll assign IDs here)
      const nodeIds = parsed.nodes.map((_, i) => `ai_n_${Date.now()}_${i}`);
      const nodes = parsed.nodes.map((n, i) => ({
        id: nodeIds[i],
        serviceId: n.serviceId,
        x: n.x,
        y: n.y,
      })).filter(n => SERVICE_LIBRARY[n.serviceId]); // filter invalid

      const arrows = (parsed.arrows || []).map((a, i) => ({
        id: `ai_a_${Date.now()}_${i}`,
        from: nodeIds[a.from],
        to: nodeIds[a.to],
      })).filter(a => a.from && a.to);

      const groups = (parsed.groups || []).map((g, i) => ({
        id: `ai_g_${Date.now()}_${i}`,
        label: g.label,
        x: g.x,
        y: g.y,
        width: g.width,
        height: g.height,
        color: g.color || '#8B5CF6',
      }));

      diagram = { nodes, arrows, groups };
      setLastDiagram(diagram);
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: explanation,
      diagram,
    }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const applyDiagram = (diagram) => {
    onApplyDiagram(diagram);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#131720' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Wand2 className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white/90">AI Architect</p>
          <p className="text-[9px] text-slate-600">Descrivi → Genera → Modifica</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-3 py-2 rounded-2xl text-[11px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-600/30 text-white/90 rounded-tr-sm border border-violet-500/20'
                  : 'bg-slate-800 text-slate-300 rounded-tl-sm border border-slate-700'
              }`}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="my-0.5">{children}</p>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Apply diagram button */}
              {msg.diagram && (
                <button
                  onClick={() => applyDiagram(msg.diagram)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/25 transition-all"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Applica al diagramma ({msg.diagram.nodes.length} componenti)
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3 text-slate-400" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-slate-800 border border-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Example prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex-shrink-0">
          <p className="text-[9px] text-slate-700 uppercase tracking-wider mb-1.5 px-1">Esempi</p>
          <div className="space-y-1">
            {EXAMPLE_PROMPTS.map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all leading-relaxed"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-800 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descrivi la tua architettura..."
            rows={2}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-violet-500/50 resize-none leading-relaxed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg shadow-violet-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <p className="text-[9px] text-slate-700 mt-1.5 px-1">Invio per inviare · Shift+Invio per andare a capo</p>
      </div>
    </div>
  );
}