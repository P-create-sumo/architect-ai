import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, RotateCcw, Trash2, Save, Pencil, Check, X, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

function VersionItem({ version, onRestore, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(version.name);

  const handleRename = () => {
    if (name.trim()) onRename(version.id, name.trim());
    setEditing(false);
  };

  const timeAgo = formatDistanceToNow(new Date(version.timestamp), { addSuffix: true, locale: it });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="group flex items-start gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-violet-500/60 mt-1.5 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
              className="flex-1 px-2 py-0.5 rounded-lg bg-slate-700 border border-slate-600 text-[11px] text-white outline-none focus:border-violet-500"
            />
            <button onClick={handleRename} className="text-emerald-400 hover:text-emerald-300"><Check className="w-3 h-3" /></button>
            <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-slate-300"><X className="w-3 h-3" /></button>
          </div>
        ) : (
          <p className="text-[11px] font-semibold text-slate-300 truncate leading-tight">{version.name}</p>
        )}
        <p className="text-[9px] text-slate-600 mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {timeAgo}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
          title="Rinomina"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => onRestore(version.id)}
          className="p-1 rounded-lg hover:bg-violet-500/20 text-violet-400/60 hover:text-violet-400 transition-colors"
          title="Ripristina"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(version.id)}
          className="p-1 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"
          title="Elimina"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default function VersionPanel({ versions, onSave, onRestore, onDelete, onRename, onClose }) {
  const [saveLabel, setSaveLabel] = useState('');

  const handleSave = () => {
    onSave(saveLabel.trim() || null);
    setSaveLabel('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute top-full right-0 mt-2 w-72 rounded-2xl border border-slate-700 shadow-2xl z-50 overflow-hidden"
      style={{ background: '#131720' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          <span className="text-[12px] font-bold text-white/90">Versioni</span>
          {versions.length > 0 && (
            <span className="text-[10px] bg-slate-700 text-slate-400 rounded-full px-1.5 py-0.5">{versions.length}</span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Save current */}
      <div className="px-3 py-2.5 border-b border-slate-800">
        <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1.5">Salva versione corrente</p>
        <div className="flex gap-2">
          <input
            value={saveLabel}
            onChange={e => setSaveLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            placeholder="Nome versione (opzionale)..."
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-violet-500/50"
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold transition-all"
          >
            <Save className="w-3 h-3" />
            Salva
          </button>
        </div>
      </div>

      {/* Version list */}
      <div className="max-h-72 overflow-y-auto py-1">
        {versions.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <History className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <p className="text-[11px] text-slate-600">Nessuna versione salvata</p>
            <p className="text-[9px] text-slate-700 mt-1">Salva una versione per poterla ripristinare</p>
          </div>
        ) : (
          <AnimatePresence>
            {versions.map(v => (
              <VersionItem
                key={v.id}
                version={v}
                onRestore={onRestore}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}