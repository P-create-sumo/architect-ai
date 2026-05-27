import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ServicePalette from '@/components/diagrammer/ServicePalette';
import DiagramCanvas from '@/components/diagrammer/DiagramCanvas';
import DiagramToolbar from '@/components/diagrammer/DiagramToolbar';
import InfoSidebar from '@/components/diagrammer/InfoSidebar';
import AIDescriptionPanel from '@/components/diagrammer/AIDescriptionPanel';

export default function Architect() {
  const [nodes, setNodes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasMode, setCanvasMode] = useState('select');

  const handleDragStart = (e, serviceId) => {
    e.dataTransfer.setData('text/service-id', serviceId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClear = () => {
    setNodes([]);
    setArrows([]);
    setGroups([]);
    setSelectedId(null);
  };

  const hasSelected = selectedId && (
    nodes.some(n => n.id === selectedId) || groups.some(g => g.id === selectedId)
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden font-inter" style={{ background: '#1a1f2e' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800 flex-shrink-0" style={{ background: '#131720' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white/90 tracking-tight">Architect AI Diagrammer</h1>
            <p className="text-[10px] text-slate-600">Cloud Solution Design · AWS · Azure · GCP</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-600">
          <span className="hidden md:block">Trascina i componenti → Connetti con la porta laterale → Raggruppa con <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">G</kbd></span>
        </div>
      </header>

      {/* Toolbar */}
      <DiagramToolbar
        canvasMode={canvasMode}
        setCanvasMode={setCanvasMode}
        onClear={handleClear}
        nodeCount={nodes.length}
        arrowCount={arrows.length}
      />

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Palette */}
        <aside
          className="w-56 flex-shrink-0 border-r border-slate-800 flex flex-col overflow-hidden"
          style={{ background: '#131720' }}
        >
          <div className="flex-1 overflow-hidden flex flex-col">
            <ServicePalette onDragStart={handleDragStart} />
          </div>
          <AIDescriptionPanel nodes={nodes} arrows={arrows} />
        </aside>

        {/* Canvas */}
        <main className="flex-1 min-w-0 relative">
          <DiagramCanvas
            nodes={nodes} setNodes={setNodes}
            arrows={arrows} setArrows={setArrows}
            groups={groups} setGroups={setGroups}
            selectedId={selectedId} setSelectedId={setSelectedId}
            canvasMode={canvasMode}
          />
        </main>

        {/* Info sidebar */}
        <AnimatePresence>
          {hasSelected && (
            <InfoSidebar
              selectedId={selectedId}
              nodes={nodes}
              arrows={arrows}
              groups={groups}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}