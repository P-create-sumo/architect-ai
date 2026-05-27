import React, { useRef, useState } from 'react';
import { MousePointer2, Square, Trash2, Download, History } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';
import ExportPanel from './ExportPanel';
import VersionPanel from './VersionPanel';

export default function DiagramToolbar({
  canvasMode, setCanvasMode,
  onClear,
  nodeCount,
  arrowCount,
  nodes,
  arrows,
  groups,
  canvasRef,
  versions = [],
  onSaveVersion,
  onRestoreVersion,
  onDeleteVersion,
  onRenameVersion,
}) {
  const [showExport, setShowExport] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const exportBtnRef = useRef(null);
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Seleziona / Sposta (V)' },
    { id: 'group', icon: Square, label: 'Disegna Gruppo / VPC (G)' },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800" style={{ background: '#1a1f2e' }}>
        {/* Mode tools */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800">
          {tools.map(t => (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCanvasMode(t.id)}
                  className={`p-2 rounded-lg transition-all ${
                    canvasMode === t.id
                      ? 'bg-slate-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-700" />

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>{nodeCount} componenti</span>
          <span>·</span>
          <span>{arrowCount} connessioni</span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        {nodeCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset
              </button>
            </TooltipTrigger>
            <TooltipContent>Cancella tutto il diagramma</TooltipContent>
          </Tooltip>
        )}

        <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] text-slate-500 font-mono">
          Drag per connettere → porta laterale
        </div>

        {/* Versions button */}
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setShowVersions(v => !v); setShowExport(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  showVersions ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Versioni</span>
                {versions.length > 0 && (
                  <span className="text-[9px] bg-violet-500/30 text-violet-300 rounded-full px-1.5 py-0.5">{versions.length}</span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Gestisci versioni del diagramma</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {showVersions && (
              <VersionPanel
                versions={versions}
                onSave={(name) => { onSaveVersion(name); }}
                onRestore={(id) => { onRestoreVersion(id); setShowVersions(false); }}
                onDelete={onDeleteVersion}
                onRename={onRenameVersion}
                onClose={() => setShowVersions(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Export button */}
        <div className="relative" ref={exportBtnRef}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setShowExport(v => !v); setShowVersions(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  showExport ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Esporta</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Esporta come PNG o PDF</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {showExport && (
              <ExportPanel
                nodes={nodes}
                arrows={arrows}
                groups={groups}
                canvasRef={canvasRef}
                onClose={() => setShowExport(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}