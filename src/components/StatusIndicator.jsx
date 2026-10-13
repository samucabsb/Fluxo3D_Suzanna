import React from 'react';
import { getExecutionStatusBadge } from '../features/flow/flowSelectors';

export default function StatusIndicator({ status, className = '' }) {
  const badge = getExecutionStatusBadge(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'running'
            ? 'bg-amber-500 animate-ping'
            : status === 'completed'
            ? 'bg-emerald-500'
            : status === 'error'
            ? 'bg-rose-500'
            : 'bg-slate-400'
        }`}
      />
      <span>{badge.label}</span>
    </div>
  );
}
