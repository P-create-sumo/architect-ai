import React, { useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';

export default function GroupBox({ group, isSelected, onSelect, onRemove, onUpdateLabel }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(group.label);

  return (
    <div
      className="absolute"
      style={{ left: group.x, top: group.y, width: group.width, height: group.height, zIndex: 5 }}
      onClick={(e) => { e.stopPropagation(); onSelect(group.id); }}
    >
      <div
        className={`w-full h-full rounded-2xl transition-all ${
          isSelected ? 'ring-2 ring-violet-400/60' : ''
        }`}
        style={{
          border: `2px dashed ${group.color || '#8B5CF6'}55`,
          background: `${group.color || '#8B5CF6'}08`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5">
          <div
            className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-default"
            style={{ background: `${group.color || '#8B5CF6'}22` }}
          >
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
              <span className="text-[8px]">☁</span>
            </div>
            {editing ? (
              <input
                autoFocus
                value={label}
                onChange={e => setLabel(e.target.value)}
                onBlur={() => { setEditing(false); onUpdateLabel(group.id, label); }}
                onKeyDown={e => { if (e.key === 'Enter') { setEditing(false); onUpdateLabel(group.id, label); } }}
                className="text-[11px] font-semibold bg-transparent border-b border-white/30 text-white outline-none w-32"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-[11px] font-semibold text-white/80 cursor-pointer"
                onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
              >
                {group.label}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(group.id); }}
            className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ opacity: isSelected ? 0.8 : undefined }}
          >
            <X className="w-3 h-3 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}