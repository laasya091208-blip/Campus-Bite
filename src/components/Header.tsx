import React from 'react';
import { UtensilsCrossed, Store, RefreshCw, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  currentView: 'student' | 'vendor' | 'outlets';
  onViewChange: (view: 'student' | 'vendor' | 'outlets') => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  activeOutletCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onRefreshData,
  isRefreshing = false,
  activeOutletCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onViewChange('student')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg"
              title="Campus Bite Home"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-900 transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-emerald-950 block leading-none">
                  Campus Bite
                </span>
                <span className="text-[11px] font-medium text-emerald-800/80 block mt-0.5">
                  Live Food Availability
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => onViewChange('student')}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentView === 'student'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                  : 'hover:text-emerald-950 hover:bg-slate-50'
              }`}
            >
              Live Menu Items
            </button>
            <button
              onClick={() => onViewChange('outlets')}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentView === 'outlets'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                  : 'hover:text-emerald-950 hover:bg-slate-50'
              }`}
            >
              <span>Campus Outlets</span>
              <span className="text-xs bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full font-mono">
                {activeOutletCount}
              </span>
            </button>
            <button
              onClick={() => onViewChange('vendor')}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentView === 'vendor'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                  : 'hover:text-emerald-950 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Vendor Desk</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Mode Switch */}
          <div className="flex items-center gap-2 shrink-0">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-emerald-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                title="Refresh live availability timestamps"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-700' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">{isRefreshing ? 'Updating...' : 'Sync Stock'}</span>
              </button>
            )}

            {currentView === 'vendor' ? (
              <button
                onClick={() => onViewChange('student')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-lg transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>
            ) : (
              <button
                onClick={() => onViewChange('vendor')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-navigation strip */}
      <div className="md:hidden border-t border-slate-200/80 bg-slate-50/90 px-3 py-1.5 flex items-center justify-around text-xs font-medium text-slate-600">
        <button
          onClick={() => onViewChange('student')}
          className={`py-1.5 px-3 rounded-md transition-colors ${
            currentView === 'student' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : ''
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => onViewChange('outlets')}
          className={`py-1.5 px-3 rounded-md transition-colors ${
            currentView === 'outlets' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : ''
          }`}
        >
          Outlets ({activeOutletCount})
        </button>
        <button
          onClick={() => onViewChange('vendor')}
          className={`py-1.5 px-3 rounded-md transition-colors flex items-center gap-1 ${
            currentView === 'vendor' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : ''
          }`}
        >
          <Store className="w-3.5 h-3.5 text-emerald-800" />
          <span>Vendor Desk</span>
        </button>
      </div>
    </header>
  );
};
