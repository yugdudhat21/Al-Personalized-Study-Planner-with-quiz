'use client';

import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full ${maxWidth} max-h-[85vh] flex flex-col glass-card bg-slate-900/95 rounded-3xl border border-slate-700/60 shadow-2xl p-6 transition-all transform scale-100`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <h3 className="text-xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable Body */}
        <div className="py-4 overflow-y-auto flex-1 pr-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
