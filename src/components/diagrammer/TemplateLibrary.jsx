import React from 'react';
import { motion } from 'framer-motion';
import { DIAGRAM_TEMPLATES, PROVIDER_COLORS } from '@/lib/diagramTemplates';
import { SERVICE_LIBRARY } from '@/lib/serviceLibrary';
import { X, LayoutTemplate, ArrowRight } from 'lucide-react';

function TemplateMiniPreview({ diagram }) {
  const W = 220, H = 110;
  if (!diagram.nodes.length) return null;

  // Normalize node positions to fit the preview box
  const xs = diagram.nodes.map(n => n.x);
  const ys = diagram.nodes.map(n => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const PAD = 18, NODE_R = 10;

  const toScreen = (x, y) => ({
    sx: PAD + ((x - minX) / rangeX) * (W - PAD * 2),
    sy: PAD + ((y - minY) / rangeY) * (H - PAD * 2),
  });

  // Build a map for arrow rendering
  const nodeMap = {};
  diagram.nodes.forEach(n => {
    const { sx, sy } = toScreen(n.x, n.y);
    nodeMap[n.id] = { sx, sy };
  });

  const providerColors = {
    aws: '#F97316', azure: '#3B82F6', gcp: '#22C55E',
  };

  return (
    <svg width={W} height={H} className="w-full rounded-lg" style={{ background: '#0d1117' }}>
      {/* Groups */}
      {diagram.groups.map(g => {
        const { sx: gx, sy: gy } = toScreen(g.x, g.y);
        const scaleX = (W - PAD * 2) / rangeX;
        const scaleY = (H - PAD * 2) / rangeY;
        return (
          <rect
            key={g.id}
            x={gx} y={gy}
            width={g.width * scaleX} height={g.height * scaleY}
            rx={6} fill="none"
            stroke={g.color || '#8B5CF6'} strokeWidth={1} strokeDasharray="4,3"
            opacity={0.5}
          />
        );
      })}
      {/* Arrows */}
      {diagram.arrows.map(a => {
        const from = nodeMap[a.from], to = nodeMap[a.to];
        if (!from || !to) return null;
        return (
          <line key={a.id}
            x1={from.sx} y1={from.sy} x2={to.sx} y2={to.sy}
            stroke="#475569" strokeWidth={1} markerEnd="url(#arr)"
          />
        );
      })}
      <defs>
        <marker id="arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#475569" />
        </marker>
      </defs>
      {/* Nodes */}
      {diagram.nodes.map(n => {
        const svc = SERVICE_LIBRARY[n.serviceId];
        const color = svc ? (providerColors[svc.provider] || '#6B7280') : '#6B7280';
        const { sx, sy } = nodeMap[n.id];
        return (
          <g key={n.id}>
            <circle cx={sx} cy={sy} r={NODE_R} fill={color} opacity={0.85} />
            {svc && (
              <text x={sx} y={sy + NODE_R + 7} textAnchor="middle"
                fontSize="5.5" fill="#94a3b8" fontFamily="sans-serif">
                {svc.name.length > 8 ? svc.name.slice(0, 7) + '…' : svc.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function TemplateLibrary({ onApply, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute inset-0 z-20 flex flex-col"
      style={{ background: '#131720' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <LayoutTemplate className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/90">Template Predefiniti</p>
            <p className="text-[9px] text-slate-500">Clicca per caricare nel diagramma</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {DIAGRAM_TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-600 transition-all group"
          >
            {/* Mini preview */}
            <div className="px-3 pt-3">
              <TemplateMiniPreview diagram={tpl.diagram} />
            </div>

            {/* Info + button */}
            <div className="p-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg leading-none mt-0.5">{tpl.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white/90 leading-tight">{tpl.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border ${PROVIDER_COLORS[tpl.provider]}`}>
                      {tpl.provider}
                    </span>
                    <span className="text-[9px] text-slate-600">
                      {tpl.diagram.nodes.length} nodi · {tpl.diagram.arrows.length} connessioni
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onApply(tpl.diagram, tpl.name)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold transition-all"
              >
                Carica nel diagramma
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}