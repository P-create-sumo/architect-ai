import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PanelLeftClose, PanelLeft } from 'lucide-react';
import BlockPalette from '@/components/architect/BlockPalette';
import CanvasArea from '@/components/architect/CanvasArea';
import ComparisonView from '@/components/architect/ComparisonView';
import AIPanel from '@/components/architect/AIPanel';
import Toolbar from '@/components/architect/Toolbar';
import { checkCoherence, LOGICAL_PHASES, CLOUD_SERVICES } from '@/lib/cloudComponents';
import { base44 } from '@/api/base44Client';

export default function Architect() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [viewMode, setViewMode] = useState('canvas');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flowDescription, setFlowDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const warnings = useMemo(() => checkCoherence(nodes, connections), [nodes, connections]);

  const handleDragStart = useCallback((e, phaseId) => {
    e.dataTransfer.setData('text/phase', phaseId);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleClearCanvas = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    setFlowDescription('');
  }, []);

  const handleGenerateDescription = useCallback(async () => {
    if (nodes.length === 0) return;
    setIsGenerating(true);

    const diagramDescription = nodes.map(n => {
      const phase = LOGICAL_PHASES[n.phase];
      const serviceName = n.service?.name || 'non assegnato';
      const provider = n.provider || 'nessun provider';
      return `- ${phase.label} (${phase.subtitle}): ${serviceName} [${provider.toUpperCase()}]`;
    }).join('\n');

    const connectionsDesc = connections.map(c => {
      const from = nodes.find(n => n.id === c.from);
      const to = nodes.find(n => n.id === c.to);
      if (!from || !to) return '';
      return `- ${from.service?.name || LOGICAL_PHASES[from.phase].label} → ${to.service?.name || LOGICAL_PHASES[to.phase].label}`;
    }).filter(Boolean).join('\n');

    const prompt = `Sei un Solution Architect esperto. Analizza questa architettura cloud e genera una descrizione chiara e concisa del flusso dati end-to-end, spiegando come i componenti interagiscono tra loro. Usa un linguaggio semplice e accessibile.

Componenti dell'architettura:
${diagramDescription}

Connessioni (flusso dati):
${connectionsDesc || 'Nessuna connessione definita'}

Genera una descrizione del flusso dati in italiano, massimo 200 parole, spiegando passo per passo come i dati fluiscono attraverso l'architettura. Includi suggerimenti per migliorare se necessario.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setFlowDescription(result);
    setIsGenerating(false);
  }, [nodes, connections]);

  return (
    <div className="h-screen flex flex-col overflow-hidden font-inter" style={{ background: 'hsl(220 25% 8%)' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/5" style={{ background: 'hsl(220 25% 10%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white/90 tracking-tight">Architect AI Diagrammer</h1>
            <p className="text-[10px] text-white/30">Solution Design · Multi-Cloud</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-white/40" />
          ) : (
            <PanelLeft className="w-4 h-4 text-white/40" />
          )}
        </button>
      </header>

      {/* Toolbar */}
      <Toolbar
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onClearCanvas={handleClearCanvas}
        nodeCount={nodes.length}
      />

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar */}
        <motion.aside
          animate={{ width: sidebarOpen ? 220 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 overflow-hidden border-r border-white/5"
          style={{ background: 'hsl(220 25% 11%)' }}
        >
          <div className="w-[220px] h-full flex flex-col">
            <div className="flex-1 p-3 overflow-y-auto">
              <BlockPalette onDragStart={handleDragStart} />
            </div>
            <div className="p-3 border-t border-white/5">
              <AIPanel
                warnings={warnings}
                onGenerateDescription={handleGenerateDescription}
                flowDescription={flowDescription}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </motion.aside>

        {/* Canvas / Comparison View */}
        <main className="flex-1 min-w-0">
          {viewMode === 'canvas' ? (
            <CanvasArea
              nodes={nodes}
              setNodes={setNodes}
              connections={connections}
              setConnections={setConnections}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              activeProvider={activeProvider}
            />
          ) : (
            <ComparisonView nodes={nodes} />
          )}
        </main>
      </div>
    </div>
  );
}