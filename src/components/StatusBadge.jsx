import React from 'react';

export default function StatusBadge({ status, type }) {
  if (type) {
    const isLost = type.toLowerCase() === 'lost';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
          isLost
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            isLost ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />
        {type}
      </span>
    );
  }

  const normalized = (status || 'open').toLowerCase();

  const styles = {
    open: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-100',
    claimed: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100',
    returned: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
  };

  const badgeClass =
    styles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-100';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status || 'Unknown'}
    </span>
  );
}