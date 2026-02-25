'use client';

import { ReactNode } from 'react';

interface OSWindowProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function OSWindow({ title, onClose, children, className = '' }: OSWindowProps) {
  return (
    <div
      className={`os-window w-full h-full overflow-hidden flex flex-col bg-[#0c0c0f] border-2 border-gray-700 shadow-os-window ${className}`}
      role="dialog"
      aria-label={title}
    >
      <div className="os-window-title flex items-center justify-between flex-shrink-0 px-3 py-2 border-b-2 border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <span className="text-[10px] text-white font-bold tracking-wider truncate">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="os-window-close flex-shrink-0 w-6 h-5 flex items-center justify-center border-2 border-gray-600 bg-gray-700 text-gray-300 hover:bg-red-900/80 hover:border-red-600 hover:text-white transition-colors text-[10px]"
          aria-label={`Close ${title}`}
        >
          ✕
        </button>
      </div>
      <div className="os-window-body flex-1 overflow-auto p-3 min-h-0">
        {children}
      </div>
    </div>
  );
}
