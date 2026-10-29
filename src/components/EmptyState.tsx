import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onReset }) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-800">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        No campus food items found
      </h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        {searchQuery
          ? `We couldn't find any dishes matching "${searchQuery}" with the active filters.`
          : 'No food items match the current outlet and category filters.'}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Search & Filters</span>
      </button>
    </div>
  );
};
