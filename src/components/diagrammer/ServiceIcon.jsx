import React from 'react';

export default function ServiceIcon({ service, size = 'md' }) {
  const sizes = {
    xs: { outer: 'w-6 h-6', text: 'text-[8px] font-bold', emoji: 'text-xs' },
    sm: { outer: 'w-10 h-10', text: 'text-xs', emoji: 'text-lg' },
    md: { outer: 'w-14 h-14', text: 'text-sm font-bold', emoji: 'text-2xl' },
    lg: { outer: 'w-20 h-20', text: 'text-lg font-bold', emoji: 'text-4xl' },
    palette: { outer: 'w-9 h-9', text: 'text-[10px] font-bold', emoji: 'text-base' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`${s.outer} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${service.bg} 0%, ${service.color} 100%)` }}
    >
      {service.iconType === 'emoji' ? (
        <span className={s.emoji}>{service.icon}</span>
      ) : (
        <span className={`${s.text} text-white font-mono select-none leading-none`}>
          {service.icon}
        </span>
      )}
    </div>
  );
}