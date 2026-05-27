import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Sparkles, FolderOpen, Clock, CheckCircle2, GitBranch } from 'lucide-react';
import NewProjectModal from '@/components/dashboard/NewProjectModal';

const STATUS_CONFIG = {
  draft:       { label: 'Bozza',        color: 'bg-slate-500/20 text-slate-400' },
  in_progress: { label: 'In Corso',     color: 'bg-blue-500/20 text-blue-400' },
  review:      { label: 'In Revisione', color: 'bg-amber-500/20 text-amber-400' },
  delivered:   { label: 'Consegnato',   color: 'bg-emerald-500/20 text-emerald-400' },
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Project.list('-created_date');
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    review: projects.filter(p => p.status === 'review').length,
    delivered: projects.filter(p => p.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen font-inter" style={{ background: '#0f1117' }}>
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between" style={{ background: '#131720' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white/90 tracking-tight">IT Architect Studio</h1>
            <p className="text-[10px] text-slate-600">Dashboard Progetti</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/architect"
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Diagrammer Libero
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuovo Progetto
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Totale', value: stats.total, icon: FolderOpen, color: 'text-slate-400' },
            { label: 'In Corso', value: stats.inProgress, icon: GitBranch, color: 'text-blue-400' },
            { label: 'In Revisione', value: stats.review, icon: Clock, color: 'text-amber-400' },
            { label: 'Consegnati', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 border border-slate-800" style={{ background: '#1a1f2e' }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-slate-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Projects list */}
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4">Progetti</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Nessun progetto ancora</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
            >
              Crea il primo progetto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(p => {
              const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
              const nodeCount = p.nodes?.length || 0;
              return (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="block rounded-2xl border border-slate-800 hover:border-slate-600 transition-all p-4 group"
                  style={{ background: '#1a1f2e' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                          {p.name}
                        </h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">{p.client_name}</p>
                      {p.description && (
                        <p className="text-[11px] text-slate-600 truncate max-w-lg">{p.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {p.budget > 0 && (
                        <p className="text-sm font-semibold text-emerald-400">€{p.budget.toLocaleString()}/mo</p>
                      )}
                      <p className="text-[10px] text-slate-600 mt-1">{nodeCount} componenti</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}