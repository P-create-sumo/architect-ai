import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, MessageSquare, Layers, X, Undo2, LayoutTemplate } from 'lucide-react';
import ServicePalette from '@/components/diagrammer/ServicePalette';
import DiagramCanvas from '@/components/diagrammer/DiagramCanvas';
import DiagramToolbar from '@/components/diagrammer/DiagramToolbar';
import InfoSidebar from '@/components/diagrammer/InfoSidebar';
import AIArchitectChat from '@/components/diagrammer/AIArchitectChat';
import TemplateLibrary from '@/components/diagrammer/TemplateLibrary';
import useVersioning from '@/hooks/useVersioning';

export default function Architect() {
  const [nodes, setNodes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasMode, setCanvasMode] = useState('select');
  const [rightPanel, setRightPanel] = useState('chat'); // 'chat' | 'info' | null
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [history, setHistory] = useState([]); // stack of {nodes, arrows, groups}
  const canvasRef = useRef(null);
  const { versions, saveVersion, restoreVersion, deleteVersion, renameVersion } = useVersioning(nodes, arrows, groups);

  const handleRestoreVersion = (versionId) => {
    const snap = restoreVersion(versionId);
    if (!snap) return;
    setHistory(prev => [...prev, { nodes, arrows, groups }]);
    setNodes(snap.nodes);
    setArrows(snap.arrows);
    setGroups(snap.groups);
    setSelectedId(null);
  };

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

  // When a node is selected, show info panel
  const handleSelectId = (id) => {
    setSelectedId(id);
    if (id) setRightPanel('info');
  };

  const handleApplyTemplate = (diagram, name) => {
    const ts = Date.now();
    // Remap template IDs to unique ones to avoid collisions on repeated loads
    const idMap = {};
    diagram.nodes.forEach((n, i) => { idMap[n.id] = `tpl_n${ts}_${i}`; });
    diagram.groups.forEach((g, i) => { idMap[g.id] = `tpl_g${ts}_${i}`; });

    const newNodes = diagram.nodes.map(n => ({ ...n, id: idMap[n.id] }));
    const newArrows = diagram.arrows.map((a, i) => ({
      ...a,
      id: `tpl_a${ts}_${i}`,
      from: idMap[a.from] || a.from,
      to: idMap[a.to] || a.to,
    }));
    const newGroups = diagram.groups.map(g => ({ ...g, id: idMap[g.id] }));

    setHistory(prev => [...prev, { nodes, arrows, groups }]);
    setNodes(newNodes);
    setArrows(newArrows);
    setGroups(newGroups);
    setSelectedId(null);
    setShowTemplates(false);
    setRightPanel('chat');
  };

  // Apply AI-generated diagram (save snapshot for undo)
  const handleApplyDiagram = ({ nodes: newNodes, arrows: newArrows, groups: newGroups }) => {
    setHistory(prev => [...prev, { nodes, arrows, groups }]);
    setNodes(newNodes);
    setArrows(newArrows);
    setGroups(newGroups);
    setSelectedId(null);
    setRightPanel(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setNodes(prev.nodes);
    setArrows(prev.arrows);
    setGroups(prev.groups);
    setSelectedId(null);
  };

  const hasSelected = selectedId && (
    nodes.some(n => n.id === selectedId) || groups.some(g => g.id === selectedId)
  );

  const showRightPanel = rightPanel === 'chat' || (rightPanel === 'info' && hasSelected);

  return (
    <div className="h-screen flex flex-col overflow-hidden font-inter" style={{ background: '#1a1f2e' }}>
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-4 py-2 border-b border-slate-800 flex-shrink-0"
        style={{ background: '#131720' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white/90 tracking-tight">Architect AI Diagrammer</h1>
            <p className="text-[10px] text-slate-600">Cloud Solution Design · AWS · Azure · GCP</p>
          </div>
        </div>

        {/* Right panel toggles */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800">
          <button
            onClick={() => setShowTemplates(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              showTemplates ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button
            onClick={() => setPaletteOpen(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              paletteOpen ? 'bg-slate-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Palette</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-amber-400 hover:bg-amber-500/10 transition-all"
              title="Annulla ultima operazione AI"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Annulla</span>
              <span className="text-[9px] bg-amber-500/20 rounded px-1">{history.length}</span>
            </button>
          )}
          <button
            onClick={() => setRightPanel(v => v === 'chat' ? null : 'chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              rightPanel === 'chat' ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Chat</span>
          </button>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <DiagramToolbar
        canvasMode={canvasMode}
        setCanvasMode={setCanvasMode}
        onClear={handleClear}
        nodeCount={nodes.length}
        arrowCount={arrows.length}
        nodes={nodes}
        arrows={arrows}
        groups={groups}
        canvasRef={canvasRef}
        versions={versions}
        onSaveVersion={saveVersion}
        onRestoreVersion={handleRestoreVersion}
        onDeleteVersion={deleteVersion}
        onRenameVersion={renameVersion}
      />

      {/* ── Body ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* Left palette */}
        <AnimatePresence initial={false}>
          {paletteOpen && (
            <motion.aside
              key="palette"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 border-r border-slate-800 overflow-hidden"
              style={{ background: '#131720' }}
            >
              <div className="w-[220px] h-full">
                <ServicePalette onDragStart={handleDragStart} nodes={nodes} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Canvas */}
        <main className="flex-1 min-w-0 relative">
          <DiagramCanvas
            ref={canvasRef}
            nodes={nodes} setNodes={setNodes}
            arrows={arrows} setArrows={setArrows}
            groups={groups} setGroups={setGroups}
            selectedId={selectedId} setSelectedId={handleSelectId}
            canvasMode={canvasMode}
          />
          {/* Template library overlay */}
          <AnimatePresence>
            {showTemplates && (
              <TemplateLibrary
                onApply={handleApplyTemplate}
                onClose={() => setShowTemplates(false)}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Right panel — AI Chat or Info */}
        <AnimatePresence initial={false}>
          {showRightPanel && (
            <motion.aside
              key="right-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 border-l border-slate-800 overflow-hidden"
              style={{ background: '#131720' }}
            >
              <div className="w-[320px] h-full flex flex-col">
                {/* Panel header with tabs */}
                {hasSelected && (
                  <div className="flex items-center border-b border-slate-800 flex-shrink-0" style={{ background: '#131720' }}>
                    <button
                      onClick={() => setRightPanel('chat')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
                        rightPanel === 'chat' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      AI Chat
                    </button>
                    <button
                      onClick={() => setRightPanel('info')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
                        rightPanel === 'info' ? 'text-white border-b-2 border-white/30' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Dettagli
                    </button>
                    <button
                      onClick={() => { setRightPanel(null); setSelectedId(null); }}
                      className="px-3 py-2.5 text-slate-700 hover:text-slate-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Panel content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  {rightPanel === 'chat' && (
                    <AIArchitectChat
                      onApplyDiagram={handleApplyDiagram}
                      onUndo={handleUndo}
                      historyCount={history.length}
                      currentNodes={nodes}
                      currentArrows={arrows}
                    />
                  )}
                  {rightPanel === 'info' && hasSelected && (
                    <InfoSidebar
                      selectedId={selectedId}
                      nodes={nodes}
                      arrows={arrows}
                      groups={groups}
                      onClose={() => { setRightPanel('chat'); setSelectedId(null); }}
                      inline
                    />
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}