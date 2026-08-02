'use client';

import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = "No data found", description = "Get started by adding items or generating a study plan.", actionButton }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 my-4">
      <div className="p-4 bg-blue-500/10 rounded-full text-blue-500 mb-3">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>
      {actionButton}
    </div>
  );
}
