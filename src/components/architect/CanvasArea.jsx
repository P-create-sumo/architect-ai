import React, { useState, useRef, useCallback, useEffect } from 'react';
import CanvasNode from './CanvasNode';
import ConnectionLine from './ConnectionLine';
import { LOGICAL_PHASES, getDefaultService } from '@/lib/cloudComponents';

export default function CanvasArea({
  nodes,
  setNodes,
  connections,
  setConnections,
  selectedNode,
  setSelectedNode,
  activeProvider,
}) {
  const canvasRef = useRef(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const phaseId = e.dataTransfer.getData('text/phase');
    if (!phaseId || !LOGICAL_PHASES[phaseId]) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - pan.x - 130;
    const y = e.clientY - rect.top - pan.y - 40;

    const defaultService = activeProvider ? getDefaultService(phaseId, activeProvider) : null;

    const newNode = {
      id: `node_${Date.now()}`,
      phase: phaseId,
      x,
      y,
      provider: activeProvider || null,
      service: defaultService,
      label: LOGICAL_PHASES[phaseId].label,
    };

    setNodes(prev => [...prev, newNode]);
  }, [pan, activeProvider, setNodes]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleNodeMouseDown = useCallback((e, nodeId) => {
    if (e.target.closest('[data-drag-handle]')) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - pan.x - node.x,
        y: e.clientY - rect.top - pan.y - node.y,
      });
      setDraggingNode(nodeId);
    }
  }, [nodes, pan]);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const currentX = e.clientX - rect.left - pan.x;
    const currentY = e.clientY - rect.top - pan.y;

    if (draggingNode) {
      setNodes(prev => prev.map(n =>
        n.id === draggingNode
          ? { ...n, x: currentX - dragOffset.x, y: currentY - dragOffset.y }
          : n
      ));
    }

    if (connectingFrom) {
      setMousePos({ x: currentX, y: currentY });
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [draggingNode, dragOffset, connectingFrom, isPanning, panStart, pan, setNodes]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    if (connectingFrom) {
      setConnectingFrom(null);
    }
    setIsPanning(false);
  }, [connectingFrom]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg') {
      setSelectedNode(null);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setIsPanning(true);
    }
  }, [pan, setSelectedNode]);

  const handleStartConnection = useCallback((nodeId) => {
    setConnectingFrom(nodeId);
  }, []);

  const handleEndConnection = useCallback((nodeId) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      const exists = connections.some(c => c.from === connectingFrom && c.to === nodeId);
      if (!exists) {
        setConnections(prev => [...prev, {
          id: `conn_${Date.now()}`,
          from: connectingFrom,
          to: nodeId,
        }]);
      }
    }
    setConnectingFrom(null);
  }, [connectingFrom, connections, setConnections]);

  const handleRemoveNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  }, [selectedNode, setNodes, setConnections, setSelectedNode]);

  const handleUpdateNode = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  }, [setNodes]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const gridSize = 24;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden cursor-default"
      style={{ background: 'hsl(220 25% 10%)' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseDown={handleCanvasMouseDown}
    >
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `translate(${pan.x % gridSize}px, ${pan.y % gridSize}px)` }}>
        <defs>
          <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <circle cx={gridSize / 2} cy={gridSize / 2} r="0.5" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#grid)" />
      </svg>

      {/* Content layer */}
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }} className="absolute inset-0">
        {/* Connections SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <ConnectionLine
                key={conn.id}
                fromNode={fromNode}
                toNode={toNode}
              />
            );
          })}
          {connectingFrom && (
            <ConnectionLine
              fromNode={nodes.find(n => n.id === connectingFrom)}
              toNode={null}
              isTemp
              mousePos={mousePos}
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
          >
            <CanvasNode
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={setSelectedNode}
              onRemove={handleRemoveNode}
              onUpdateNode={handleUpdateNode}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
              isConnecting={!!connectingFrom}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/30">Trascina qui i blocchi logici</p>
              <p className="text-xs text-white/15 mt-1">Costruisci la tua architettura cloud</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}