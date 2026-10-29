/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FoodItem, FilterOptions, AvailabilityStatus } from './types/campus';
import { INITIAL_OUTLETS, INITIAL_FOOD_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { FoodCard } from './components/FoodCard';
import { OutletsView } from './components/OutletsView';
import { VendorDashboard } from './components/VendorDashboard';
import { QuickEditModal } from './components/QuickEditModal';
import { EmptyState } from './components/EmptyState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Footer } from './components/Footer';
import { Clock, Info, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'All',
  outletId: 'all',
  availability: 'all',
  dietary: 'all',
  sortBy: 'recommended',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'vendor' | 'outlets'>('student');
  const [outlets] = useState(INITIAL_OUTLETS);
  const [items, setItems] = useState<FoodItem[]>(() => {
    // Attempt to load from session storage if available, else initial
    try {
      const saved = sessionStorage.getItem('campus_bite_items_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_FOOD_ITEMS;
  });

  const [selectedVendorOutletId, setSelectedVendorOutletId] = useState<string>(outlets[0].id);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickEditItem, setQuickEditItem] = useState<FoodItem | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Sync to sessionStorage on changes
  const saveItems = (updated: FoodItem[]) => {
    setItems(updated);
    try {
      sessionStorage.setItem('campus_bite_items_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showNotification = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast(null);
    }, 3000);
  };

  // Handler for updating an item's status & stock
  const handleUpdateItemStatus = (
    itemId: string,
    availability: AvailabilityStatus,
    stockCount?: number
  ) => {
    const nowIso = new Date().toISOString();
    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          availability,
          stockCount: availability === 'unavailable' ? 0 : stockCount,
          lastUpdated: nowIso,
        };
      }
      return item;
    });
    saveItems(updated);
    showNotification('Item availability updated in real-time');
  };

  // Handler for adding a new item from vendor desk
  const handleAddNewItem = (newItemData: Omit<FoodItem, 'id' | 'lastUpdated'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    saveItems([newItem, ...items]);
  };

  // Reset demo data back to clean initial state
  const handleResetAllDemoData = () => {
    try {
      sessionStorage.removeItem('campus_bite_items_v1');
    } catch {
      // ignore
    }
    setItems(INITIAL_FOOD_ITEMS);
    setFilters(DEFAULT_FILTERS);
    showNotification('Reset all items to original demonstration dataset');
  };

  // Refresh simulation
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Availability data synced with campus outlets');
    }, 600);
  };

  // Filter & Search calculation
  const filteredAndSortedItems = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    const result = items.filter((item) => {
      // Search match
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesOutlet = item.outletName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesOutlet) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'All' && item.category !== filters.category) {
        return false;
      }

      // Outlet filter
      if (filters.outletId !== 'all' && item.outletId !== filters.outletId) {
        return false;
      }

      // Availability filter
      if (filters.availability !== 'all' && item.availability !== filters.availability) {
        return false;
      }

      // Dietary filter
      if (filters.dietary !== 'all' && item.dietary !== filters.dietary) {
        return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'availability': {
          const rank = { available: 1, limited: 2, unavailable: 3 };
          return rank[a.availability] - rank[b.availability];
        }
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'recently-updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'recommended':
        default: {
          // Available and limited items come first, then sort by recently updated
          if (a.availability === 'unavailable' && b.availability !== 'unavailable') return 1;
          if (a.availability !== 'unavailable' && b.availability === 'unavailable') return -1;
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
      }
    });
  }, [items, filters]);

  // Summary counts
  const availableCount = items.filter((i) => i.availability === 'available').length;
  const limitedCount = items.filter((i) => i.availability === 'limited').length;
  const unavailableCount = items.filter((i) => i.availability === 'unavailable').length;

  const selectedOutlet = outlets.find((o) => o.id === filters.outletId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-slate-800">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Top Banner: Demonstration Purpose Notice */}
      <aside aria-label="Demo notice" className="bg-emerald-950 text-emerald-200 text-xs px-4 py-2 border-b border-emerald-900/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>
              <strong>Campus Bite Prototype:</strong> Real-time food availability checking to prevent wasted break times.
            </span>
          </div>
          <span className="text-[11px] text-emerald-300/80">
            Sample demonstration data · Prepared for future Supabase DB integration
          </span>
        </div>
      </aside>

      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        activeOutletCount={outlets.length}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'vendor' ? (
          <VendorDashboard
            outlets={outlets}
            items={items}
            selectedOutletId={selectedVendorOutletId}
            onSelectOutlet={setSelectedVendorOutletId}
            onUpdateItemStatus={handleUpdateItemStatus}
            onAddItem={handleAddNewItem}
            onBackToStudentView={() => setCurrentView('student')}
          />
        ) : currentView === 'outlets' ? (
          <OutletsView
            outlets={outlets}
            items={items}
            onSelectOutletForMenu={(outletId) => {
              setFilters((prev) => ({ ...prev, outletId }));
              setCurrentView('student');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVendorDesk={(outletId) => {
              setSelectedVendorOutletId(outletId);
              setCurrentView('vendor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Student Live Menu View */
          <div>
            {/* Hero Banner with Search */}
            <HeroBanner
              searchQuery={filters.searchQuery}
              onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
              availableCount={availableCount}
              limitedCount={limitedCount}
              totalOutlets={outlets.length}
              selectedOutletName={selectedOutlet?.name}
              onResetOutlet={() => setFilters((prev) => ({ ...prev, outletId: 'all' }))}
            />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              outlets={outlets}
              totalResultsCount={filteredAndSortedItems.length}
            />

            {/* Quick Status Legend Strip (Accessibility: explicit icons and text explanation) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Availability States:</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-medium text-emerald-900">Available</span>
                    <span className="text-slate-400">· Ready to serve</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold text-amber-900">Limited Stock</span>
                    <span className="text-slate-400">· e.g., 3 left</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-slate-600 line-through">Sold Out</span>
                    <span className="text-slate-400">· Out of stock</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('vendor')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline ml-auto"
                >
                  <span>Vendor update controls</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Food Grid / Loading / Empty State */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {isRefreshing ? (
                <LoadingSkeleton />
              ) : filteredAndSortedItems.length === 0 ? (
                <EmptyState
                  searchQuery={filters.searchQuery}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredAndSortedItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      onSelectOutlet={(outletId) =>
                        setFilters((prev) => ({ ...prev, outletId }))
                      }
                      onQuickVendorEdit={(it) => setQuickEditItem(it)}
                      isVendorMode={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Quick Edit Modal */}
      <QuickEditModal
        item={quickEditItem}
        onClose={() => setQuickEditItem(null)}
        onSave={(itemId, availability, stockCount) => {
          handleUpdateItemStatus(itemId, availability, stockCount);
        }}
      />

      {/* Footer */}
      <Footer
        onSwitchToVendor={() => {
          setCurrentView('vendor');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetAllDemoData={handleResetAllDemoData}
      />
    </div>
  );
}
