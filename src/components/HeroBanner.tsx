import React from 'react';
import { Search, X, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableCount: number;
  limitedCount: number;
  totalOutlets: number;
  selectedOutletName?: string;
  onResetOutlet?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  availableCount,
  limitedCount,
  totalOutlets,
  selectedOutletName,
  onResetOutlet,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Subtle organic background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-800/60 border border-emerald-700/50 px-3 py-1 rounded-full mb-3">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span>Zero Wasted Breaks · Real-Time Canteen Menus</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
            Know what’s cooking before you walk across campus.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-6 max-w-2xl text-pretty">
            Campus Bite lets university students check live dish availability, remaining portions, and last-updated timestamps across campus food outlets.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl shadow-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-emerald-700" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes (e.g. Masala Dosa, Kathi Roll, Cold Coffee, Maggi)..."
              className="w-full pl-11 pr-10 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-sm sm:text-base border-2 border-emerald-300/40 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Outlet filter breadcrumb if an outlet is selected */}
          {selectedOutletName && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
              <span>Filtering by outlet:</span>
              <span className="font-semibold text-white bg-emerald-800/80 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-300" />
                {selectedOutletName}
              </span>
              <button
                onClick={onResetOutlet}
                className="underline hover:text-white transition-colors text-emerald-300"
              >
                Show all outlets
              </button>
            </div>
          )}

          {/* Live snapshot strip */}
          <div className="mt-6 pt-5 border-t border-emerald-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white font-mono text-sm">{totalOutlets}</span>
              <span>Campus Outlets</span>
            </div>
            <span className="text-emerald-700" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-300 font-mono text-sm">{availableCount}</span>
              <span>Dishes Ready Now</span>
            </div>
            <span className="text-emerald-700" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-300 font-mono text-sm">{limitedCount}</span>
              <span>Running Low</span>
            </div>
            <span className="text-emerald-700" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Vendor Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
