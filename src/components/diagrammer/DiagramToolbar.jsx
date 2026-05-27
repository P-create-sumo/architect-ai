import React from 'react';
import { MousePointer2, Square, Trash2, Download, Undo2, ZoomIn, ZoomOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function DiagramToolbar({
  canvasMode, setCanvasMode,
  onClear,
  nodeCount,
  arrowCount,
}) {
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
      </div>
    </TooltipProvider>
  );
}