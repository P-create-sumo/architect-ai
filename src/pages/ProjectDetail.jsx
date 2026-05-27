import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Save, FileText, BarChart3, Layers, Edit3, Check } from 'lucide-react';
import DiagramCanvas from '@/components/diagrammer/DiagramCanvas';
import DiagramToolbar from '@/components/diagrammer/DiagramToolbar';
import ServicePalette from '@/components/diagrammer/ServicePalette';
import AIArchitectChat from '@/components/diagrammer/AIArchitectChat';
import ProjectCostPanel from '@/components/project/ProjectCostPanel';
import ProjectReportPanel from '@/components/project/ProjectReportPanel';
import useVersioning from '@/hooks/useVersioning';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  draft:       { label: 'Bozza',        color: 'bg-slate-500/20 text-slate-400' },
  in_progress: { label: 'In Corso',     color: 'bg-blue-500/20 text-blue-400' },
  review:      { label: 'In Revisione', color: 'bg-amber-500/20 text-amber-400' },
  delivered:   { label: 'Consegnato',   color: 'bg-emerald-500/20 text-emerald-400' },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasMode, setCanvasMode] = useState('select');
  const [rightPanel, setRightPanel] = useState(null); // 'chat' | 'costs' | 'report'
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const canvasRef = useRef(null);
  const { versions, saveVersion, restoreVersion, deleteVersion, renameVersion } = useVersioning(nodes, arrows, groups);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await base44.entities.Project.filter({ id });
      if (p?.[0]) {
        const proj = p[0];
        setProject(proj);
        setNameVal(proj.name);
        setNodes(proj.nodes || []);
        setArrows(proj.arrows || []);
        setGroups(proj.groups || []);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    await base44.entities.Project.update(project.id, { nodes, arrows, groups });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStatusChange = async (status) => {
    await base44.entities.Project.update(project.id, { status });
    setProject(p => ({ ...p, status }));
  };

  const handleRenameSave = async () => {
    if (!nameVal.trim()) return;
    await base44.entities.Project.update(project.id, { name: nameVal });
    setProject(p => ({ ...p, name: nameVal }));
    setEditingName(false);
  };

  const handleApplyDiagram = ({ nodes: n, arrows: a, groups: g }) => {
    setHistory(prev => [...prev, { nodes, arrows, groups }]);
    setNodes(n); setArrows(a); setGroups(g);
    setSelectedId(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setNodes(prev.nodes); setArrows(prev.arrows); setGroups(prev.groups);
  };

  const handleRestoreVersion = (versionId) => {
    const snap = restoreVersion(versionId);
    if (!snap) return;
    setHistory(prev => [...prev, { nodes, arrows, groups }]);
    setNodes(snap.nodes); setArrows(snap.arrows); setGroups(snap.groups);
    setSelectedId(null);
  };

  const handleDragStart = (e, serviceId) => {
    e.dataTransfer.setData('text/service-id', serviceId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f1117' }}>
        <div className="w-6 h-6 border-2 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;

  return (
    <div className="h-screen flex flex-col overflow-hidden font-inter" style={{ background: '#1a1f2e' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 flex-shrink-0" style={{ background: '#131720' }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex items-center gap-2">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(); if (e.key === 'Escape') setEditingName(false); }}
                  className="bg-slate-800 border border-violet-500 rounded-lg px-2 py-1 text-sm text-white outline-none w-48"
                />
                <button onClick={handleRenameSave} className="text-violet-400 hover:text-violet-300"><Check className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)} className="flex items-center gap-1.5 group">
                <h1 className="text-sm font-bold text-white/90 truncate max-w-[200px]">{project.name}</h1>
                <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            )}
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-xs text-slate-500 truncate">{project.client_name}</span>
            <select
              value={project.status}
              onChange={e => handleStatusChange(e.target.value)}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${sc.color}`}
              style={{ background: 'transparent' }}
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k} style={{ background: '#1a1f2e', color: '#fff' }}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800">
            <button
              onClick={() => setPaletteOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${paletteOpen ? 'bg-slate-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Palette</span>
            </button>
            <button
              onClick={() => setRightPanel(v => v === 'chat' ? null : 'chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${rightPanel === 'chat' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI</span>
            </button>
            <button
              onClick={() => setRightPanel(v => v === 'costs' ? null : 'costs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${rightPanel === 'costs' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Costi</span>
            </button>
            <button
              onClick={() => setRightPanel(v => v === 'report' ? null : 'report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${rightPanel === 'report' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
              saved ? 'bg-emerald-600/20 text-emerald-400' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Salvo...' : saved ? 'Salvato!' : 'Salva'}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <DiagramToolbar
        canvasMode={canvasMode}
        setCanvasMode={setCanvasMode}
        onClear={() => { setNodes([]); setArrows([]); setGroups([]); setSelectedId(null); }}
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

      {/* Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Palette */}
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
            selectedId={selectedId} setSelectedId={setSelectedId}
            canvasMode={canvasMode}
          />
        </main>

        {/* Right panel */}
        <AnimatePresence initial={false}>
          {rightPanel && (
            <motion.aside
              key="right"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 border-l border-slate-800 overflow-hidden"
              style={{ background: '#131720' }}
            >
              <div className="w-[320px] h-full flex flex-col">
                {rightPanel === 'chat' && (
                  <AIArchitectChat
                    onApplyDiagram={handleApplyDiagram}
                    onUndo={handleUndo}
                    historyCount={history.length}
                    currentNodes={nodes}
                    currentArrows={arrows}
                  />
                )}
                {rightPanel === 'costs' && (
                  <ProjectCostPanel nodes={nodes} project={project} onUpdateBudget={async (b) => {
                    await base44.entities.Project.update(project.id, { budget: b });
                    setProject(p => ({ ...p, budget: b }));
                  }} />
                )}
                {rightPanel === 'report' && (
                  <ProjectReportPanel project={project} nodes={nodes} arrows={arrows} groups={groups} canvasRef={canvasRef} />
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}