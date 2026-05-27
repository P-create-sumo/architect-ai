import React from 'react';

function getNodeCenter(node) {
  return { x: node.x + 55, y: node.y + 60 };
}

function buildPath(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return '';
  const cp = Math.max(Math.abs(dx) * 0.45, 50);
  return `M ${from.x} ${from.y} C ${from.x + cp} ${from.y}, ${to.x - cp} ${to.y}, ${to.x} ${to.y}`;
}

export default function ArrowLayer({ arrows, nodes, tempArrow, mousePos }) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible', width: '100%', height: '100%', zIndex: 15 }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.5)" />
        </marker>
        <marker id="arrowhead-temp" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(99,102,241,0.7)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {arrows.map(arrow => {
        const fromNode = nodes.find(n => n.id === arrow.from);
        const toNode = nodes.find(n => n.id === arrow.to);
        if (!fromNode || !toNode) return null;
        const from = getNodeCenter(fromNode);
        const to = getNodeCenter(toNode);
        // Offset slightly so arrow doesn't overlap icon center
        const angleToEnd = Math.atan2(to.y - from.y, to.x - from.x);
        const startX = from.x + Math.cos(angleToEnd) * 30;
        const startY = from.y + Math.sin(angleToEnd) * 30;
        const endX = to.x - Math.cos(angleToEnd) * 30;
        const endY = to.y - Math.sin(angleToEnd) * 30;

        const path = buildPath({ x: startX, y: startY }, { x: endX, y: endY });

        return (
          <g key={arrow.id}>
            {/* Glow trail */}
            <path d={path} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />
            {/* Main arrow */}
            <path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            {/* Moving dot */}
            <circle r="2.5" fill="rgba(255,255,255,0.6)">
              <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
            </circle>
          </g>
        );
      })}

      {/* Temp arrow while drawing */}
      {tempArrow && mousePos && (() => {
        const fromNode = nodes.find(n => n.id === tempArrow);
        if (!fromNode) return null;
        const from = getNodeCenter(fromNode);
        const path = buildPath(
          { x: from.x + 30, y: from.y },
          { x: mousePos.x, y: mousePos.y }
        );
        return (
          <path
            d={path}
            fill="none"
            stroke="rgba(99,102,241,0.7)"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            markerEnd="url(#arrowhead-temp)"
          />
        );
      })()}
    </svg>
  );
}