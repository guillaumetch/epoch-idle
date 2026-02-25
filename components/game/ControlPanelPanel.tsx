'use client';

import { ReactNode } from 'react';

interface ControlPanelPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ControlPanelPanel({ title, children, className = '' }: ControlPanelPanelProps) {
  return (
    <div
      className={`control-panel-panel overflow-hidden flex flex-col bg-[#0c0c0f] border-2 border-gray-700 ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="flex-shrink-0 px-3 py-2 border-b-2 border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <span className="text-[10px] text-white font-bold tracking-wider truncate block">
          {title}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-3 min-h-0">
        {children}
      </div>
    </div>
  );
}
