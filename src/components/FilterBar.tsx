import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FilterOptions, FoodCategory, Outlet } from '../types/campus';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  outlets: Outlet[];
  totalResultsCount: number;
}

const CATEGORIES: FoodCategory[] = [
  'All',
  'Meals & Thali',
  'South Indian',
  'Rolls & Wraps',
  'Snacks & Quick Bites',
  'Sandwiches & Burgers',
  'Beverages & Shakes',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  outlets,
  totalResultsCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.outletId !== 'all' ||
    filters.availability !== 'all' ||
    filters.dietary !== 'all';

  return (
    <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Category horizontal scroll bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                filters.category === cat
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Second row: Outlet, Availability, Dietary, and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Outlet selector */}
            <div className="flex items-center gap-1">
              <label htmlFor="outlet-select" className="text-slate-500 font-medium sr-only">
                Outlet
              </label>
              <select
                id="outlet-select"
                value={filters.outletId}
                onChange={(e) => onFilterChange({ outletId: e.target.value })}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Campus Outlets ({outlets.length})</option>
                {outlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability filter */}
            <div className="flex items-center gap-1">
              <label htmlFor="availability-select" className="text-slate-500 font-medium sr-only">
                Availability
              </label>
              <select
                id="availability-select"
                value={filters.availability}
                onChange={(e) =>
                  onFilterChange({ availability: e.target.value as FilterOptions['availability'] })
                }
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">Any Availability</option>
                <option value="available">✓ Available Now</option>
                <option value="limited">⚠ Limited Stock Only</option>
                <option value="unavailable">✕ Unavailable (Sold Out)</option>
              </select>
            </div>

            {/* Dietary filter */}
            <div className="flex items-center gap-1">
              <label htmlFor="dietary-select" className="text-slate-500 font-medium sr-only">
                Dietary Preference
              </label>
              <select
                id="dietary-select"
                value={filters.dietary}
                onChange={(e) =>
                  onFilterChange({ dietary: e.target.value as FilterOptions['dietary'] })
                }
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Dietary Types</option>
                <option value="veg">Pure Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="beverage">Beverages & Shakes</option>
              </select>
            </div>

            {/* Reset button if filters active */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
                title="Reset all search & filter controls"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right side: Count and Sort */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800 font-mono">{totalResultsCount}</span> {totalResultsCount === 1 ? 'item' : 'items'}
            </span>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })
                }
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="recommended">Recommended</option>
                <option value="availability">Availability First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="recently-updated">Recently Updated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
