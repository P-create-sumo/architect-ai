import React from 'react';
import { Layers, GitCompare, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProviderTabs from './ProviderTabs';

export default function Toolbar({
  activeProvider,
  setActiveProvider,
  viewMode,
  setViewMode,
  onClearCanvas,
  nodeCount,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5" style={{ background: 'hsl(220 25% 12%)' }}>
      <div className="flex items-center gap-4">
        <ProviderTabs activeProvider={activeProvider} setActiveProvider={setActiveProvider} />
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('canvas')}
                className={`h-8 px-3 rounded-lg text-[11px] ${viewMode === 'canvas' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Canvas
              </Button>
            </TooltipTrigger>
            <TooltipContent>Vista Canvas</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('comparison')}
                className={`h-8 px-3 rounded-lg text-[11px] ${viewMode === 'comparison' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                <GitCompare className="w-3.5 h-3.5 mr-1.5" />
                Confronta
              </Button>
            </TooltipTrigger>
            <TooltipContent>Confronto Multi-Cloud</TooltipContent>
          </Tooltip>

          {nodeCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearCanvas}
                  className="h-8 px-3 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Pulisci
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pulisci tutto il canvas</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>

        <div className="ml-2 px-2 py-1 rounded-md bg-white/5 text-[10px] text-white/30 font-mono">
          {nodeCount} nodi
        </div>
      </div>
    </div>
  );
}