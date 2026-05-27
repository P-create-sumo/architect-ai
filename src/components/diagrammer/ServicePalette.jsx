import React, { useState } from 'react';
import { SERVICE_LIBRARY, CATEGORIES, PROVIDERS, getServicesByProvider } from '@/lib/serviceLibrary';
import ServiceIcon from './ServiceIcon';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicePalette({ onDragStart }) {
  const [search, setSearch] = useState('');
  const [activeProvider, setActiveProvider] = useState('aws');
  const [collapsed, setCollapsed] = useState({});

  const services = getServicesByProvider(activeProvider).filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = services.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  const toggleGroup = (cat) => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="flex flex-col h-full">
      {/* Provider tabs */}
      <div className="flex gap-1 p-2 border-b border-slate-800">
        {Object.entries(PROVIDERS).map(([id, p]) => (
          <button
            key={id}
            onClick={() => setActiveProvider(id)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              activeProvider === id
                ? 'bg-slate-700 text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca servizio..."
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-slate-500"
          />
        </div>
      </div>

      {/* Services grouped */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {Object.entries(grouped).map(([cat, svcs]) => {
          const catMeta = CATEGORIES[cat];
          const isOpen = !collapsed[cat];
          return (
            <div key={cat}>
              <button
                onClick={() => toggleGroup(cat)}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: catMeta?.color || '#888' }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {catMeta?.label || cat}
                  </span>
                  <span className="text-[9px] text-slate-600">({svcs.length})</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3 h-3 text-slate-600" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pb-1 space-y-0.5">
                      {svcs.map(svc => (
                        <div
                          key={svc.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, svc.id)}
                          className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors group"
                        >
                          <ServiceIcon service={svc} size="palette" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-slate-300 truncate">{svc.name}</p>
                            <p className="text-[9px] text-slate-600 truncate">{svc.fullName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}