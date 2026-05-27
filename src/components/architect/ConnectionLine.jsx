import React from 'react';

export default function ConnectionLine({ fromNode, toNode, isTemp, mousePos }) {
  const fromX = fromNode.x + 260;
  const fromY = fromNode.y + 80;
  let toX, toY;

  if (isTemp && mousePos) {
    toX = mousePos.x;
    toY = mousePos.y;
  } else if (toNode) {
    toX = toNode.x;
    toY = toNode.y + 80;
  } else {
    return null;
  }

  const midX = (fromX + toX) / 2;
  const dx = Math.abs(toX - fromX);
  const cpOffset = Math.max(dx * 0.4, 60);

  const path = `M ${fromX} ${fromY} C ${fromX + cpOffset} ${fromY}, ${toX - cpOffset} ${toY}, ${toX} ${toY}`;

  return (
    <g>
      {/* Glow effect */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke={isTemp ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'}
        strokeWidth="2"
        strokeDasharray={isTemp ? '6 4' : 'none'}
        strokeLinecap="round"
      />
      {/* Animated dot */}
      {!isTemp && (
        <>
          <circle r="3" fill="rgba(255,255,255,0.5)">
            <animateMotion dur="3s" repeatCount="indefinite" path={path} />
          </circle>
          {/* Arrow at end */}
          <circle cx={toX} cy={toY} r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </>
      )}
    </g>
  );
}