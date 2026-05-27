import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import DiagramNode from './DiagramNode';
import ArrowLayer from './ArrowLayer';
import GroupBox from './GroupBox';

export default function DiagramCanvas({
  nodes, setNodes,
  arrows, setArrows,
  groups, setGroups,
  selectedId, setSelectedId,
  canvasMode, // 'select' | 'group'
}) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY, type }
  const [arrowFrom, setArrowFrom] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [groupDraw, setGroupDraw] = useState(null); // {startX, startY, x, y, w, h}

  const getCanvasPos = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left - pan.x, y: e.clientY - rect.top - pan.y };
  }, [pan]);

  // Drop from palette
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const serviceId = e.dataTransfer.getData('text/service-id');
    if (!serviceId || !SERVICE_LIBRARY[serviceId]) return;
    const pos = getCanvasPos(e);
    setNodes(prev => [...prev, {
      id: `n_${Date.now()}`,
      serviceId,
      x: pos.x - 55,
      y: pos.y - 60,
    }]);
  }, [getCanvasPos, setNodes]);

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };

  // Node dragging
  const handleNodeMouseDown = useCallback((e, nodeId) => {
    if (e.target.closest('[data-no-drag]')) return;
    if (arrowFrom) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const pos = getCanvasPos(e);
    setDragging({ id: nodeId, offsetX: pos.x - node.x, offsetY: pos.y - node.y, type: 'node' });
    setSelectedId(nodeId);
  }, [nodes, arrowFrom, getCanvasPos, setSelectedId]);

  // Group dragging
  const handleGroupMouseDown = useCallback((e, groupId) => {
    if (arrowFrom) return;
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const pos = getCanvasPos(e);
    setDragging({ id: groupId, offsetX: pos.x - grp.x, offsetY: pos.y - grp.y, type: 'group' });
    setSelectedId(groupId);
  }, [groups, arrowFrom, getCanvasPos, setSelectedId]);

  const handleMouseMove = useCallback((e) => {
    const pos = getCanvasPos(e);
    setMousePos(pos);

    if (dragging) {
      if (dragging.type === 'node') {
        setNodes(prev => prev.map(n =>
          n.id === dragging.id
            ? { ...n, x: pos.x - dragging.offsetX, y: pos.y - dragging.offsetY }
            : n
        ));
      } else if (dragging.type === 'group') {
        setGroups(prev => prev.map(g =>
          g.id === dragging.id
            ? { ...g, x: pos.x - dragging.offsetX, y: pos.y - dragging.offsetY }
            : g
        ));
      }
    }

    if (isPanning) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPan({ x: e.clientX - rect.left - panStart.x, y: e.clientY - rect.top - panStart.y });
    }

    if (canvasMode === 'group' && groupDraw) {
      const w = pos.x - groupDraw.startX;
      const h = pos.y - groupDraw.startY;
      setGroupDraw(prev => ({ ...prev, x: w < 0 ? pos.x : prev.startX, y: h < 0 ? pos.y : prev.startY, w: Math.abs(w), h: Math.abs(h) }));
    }
  }, [dragging, isPanning, panStart, canvasMode, groupDraw, getCanvasPos, setNodes, setGroups]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setIsPanning(false);
    if (canvasMode === 'group' && groupDraw && groupDraw.w > 40 && groupDraw.h > 40) {
      setGroups(prev => [...prev, {
        id: `g_${Date.now()}`,
        label: 'VPC / Gruppo',
        x: groupDraw.x,
        y: groupDraw.y,
        width: groupDraw.w,
        height: groupDraw.h,
        color: '#8B5CF6',
      }]);
    }
    setGroupDraw(null);
  }, [canvasMode, groupDraw, setGroups]);

  const handleCanvasMouseDown = useCallback((e) => {
    setSelectedId(null);
    if (arrowFrom) { setArrowFrom(null); return; }
    if (canvasMode === 'group') {
      const pos = getCanvasPos(e);
      setGroupDraw({ startX: pos.x, startY: pos.y, x: pos.x, y: pos.y, w: 0, h: 0 });
      return;
    }
    setPanStart({ x: e.clientX - pan.x - (canvasRef.current?.getBoundingClientRect().left || 0), y: e.clientY - pan.y - (canvasRef.current?.getBoundingClientRect().top || 0) });
    setIsPanning(true);
  }, [arrowFrom, canvasMode, getCanvasPos, pan, setSelectedId]);

  const handleStartArrow = useCallback((nodeId) => {
    setArrowFrom(nodeId);
    setSelectedId(null);
  }, [setSelectedId]);

  const handleArrowDrop = useCallback((targetId) => {
    if (arrowFrom && arrowFrom !== targetId) {
      const exists = arrows.some(a => a.from === arrowFrom && a.to === targetId);
      if (!exists) {
        setArrows(prev => [...prev, { id: `a_${Date.now()}`, from: arrowFrom, to: targetId }]);
      }
    }
    setArrowFrom(null);
  }, [arrowFrom, arrows, setArrows]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const removeNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setArrows(prev => prev.filter(a => a.from !== id && a.to !== id));
  }, [setNodes, setArrows]);

  const removeGroup = useCallback((id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  }, [setGroups]);

  const updateGroupLabel = useCallback((id, label) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, label } : g));
  }, [setGroups]);

  // Grid dot size
  const gs = 28;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: '#F5F0DC', // warm cream - matches AWS diagram style
        cursor: arrowFrom ? 'crosshair' : canvasMode === 'group' ? 'crosshair' : isPanning ? 'grabbing' : 'default',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseDown={handleCanvasMouseDown}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `translate(${pan.x % gs}px, ${pan.y % gs}px)` }}>
        <defs>
          <pattern id="dots" width={gs} height={gs} patternUnits="userSpaceOnUse">
            <circle cx={gs / 2} cy={gs / 2} r="1" fill="rgba(0,0,0,0.08)" />
          </pattern>
        </defs>
        <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#dots)" />
      </svg>

      {/* Pan layer */}
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }} className="absolute inset-0">
        {/* Groups */}
        {groups.map(g => (
          <div key={g.id} onMouseDown={(e) => handleGroupMouseDown(e, g.id)}>
            <GroupBox
              group={g}
              isSelected={selectedId === g.id}
              onSelect={setSelectedId}
              onRemove={removeGroup}
              onUpdateLabel={updateGroupLabel}
            />
          </div>
        ))}

        {/* Arrows */}
        <ArrowLayer
          arrows={arrows}
          nodes={nodes}
          tempArrow={arrowFrom}
          mousePos={mousePos}
        />

        {/* Nodes */}
        {nodes.map(node => (
          <div key={node.id} onMouseDown={(e) => handleNodeMouseDown(e, node.id)}>
            <DiagramNode
              node={node}
              isSelected={selectedId === node.id}
              onSelect={setSelectedId}
              onRemove={removeNode}
              onStartArrow={handleStartArrow}
              isArrowMode={!!arrowFrom && arrowFrom !== node.id}
              onArrowDrop={handleArrowDrop}
            />
          </div>
        ))}
      </div>

      {/* Group draw preview */}
      {groupDraw && groupDraw.w > 5 && (
        <div
          className="absolute pointer-events-none rounded-2xl"
          style={{
            left: groupDraw.x + pan.x,
            top: groupDraw.y + pan.y,
            width: groupDraw.w,
            height: groupDraw.h,
            border: '2px dashed rgba(139,92,246,0.7)',
            background: 'rgba(139,92,246,0.05)',
          }}
        />
      )}

      {/* Empty state */}
      {nodes.length === 0 && groups.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-slate-400">Trascina i servizi dalla palette</p>
            <p className="text-xs text-slate-500">Poi collega i blocchi con le frecce →</p>
          </div>
        </div>
      )}
    </div>
  );
}