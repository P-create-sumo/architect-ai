import React from 'react';
import { CLOUD_PROVIDERS } from '@/lib/cloudComponents';
import { motion } from 'framer-motion';

export default function ProviderTabs({ activeProvider, setActiveProvider }) {
  const providers = [
    { id: null, label: 'Tutti', color: 'text-white/60', bg: 'bg-white/5', activeBg: 'bg-white/10', activeBorder: 'border-white/20' },
    ...Object.values(CLOUD_PROVIDERS).map(p => ({
      id: p.id,
      label: p.label,
      color: p.color,
      bg: p.bgColor,
      activeBg: p.bgColor,
      activeBorder: p.borderColor,
      dot: p.accentColor,
    })),
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5">
      {providers.map(p => {
        const isActive = activeProvider === p.id;
        return (
          <button
            key={p.id || 'all'}
            onClick={() => setActiveProvider(p.id)}
            className={`
              relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
              transition-all duration-200
              ${isActive ? `${p.activeBg} ${p.color} border ${p.activeBorder}` : 'text-white/40 hover:text-white/60 border border-transparent'}
            `}
          >
            {p.dot && <div className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />}
            {p.label}
            {isActive && (
              <motion.div
                layoutId="provider-indicator"
                className="absolute inset-0 rounded-lg bg-white/[0.03]"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}