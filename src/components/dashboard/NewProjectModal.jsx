import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

export default function NewProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', client_name: '', description: '', budget: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const project = await base44.entities.Project.create({
      ...form,
      budget: form.budget ? parseFloat(form.budget) : null,
      nodes: [],
      arrows: [],
      groups: [],
    });
    onCreated(project);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl" style={{ background: '#1a1f2e' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">Nuovo Progetto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Nome Progetto *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="es. Migrazione Cloud AWS"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Cliente *</label>
            <input
              required
              value={form.client_name}
              onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
              placeholder="es. Acme S.p.A."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Descrizione</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Breve descrizione dell'architettura..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Budget Mensile Stimato (€)</label>
            <input
              type="number"
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              placeholder="es. 2500"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-all">
              Annulla
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? 'Creazione...' : 'Crea Progetto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}