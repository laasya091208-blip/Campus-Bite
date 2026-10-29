import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-slate-200 p-0 overflow-hidden animate-pulse flex flex-col"
        >
          <div className="w-full aspect-16/10 bg-slate-200" />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-5 w-4/5 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-full bg-slate-100 rounded mb-1" />
              <div className="h-3 w-3/4 bg-slate-100 rounded mb-4" />
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
