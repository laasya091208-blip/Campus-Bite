import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  ArrowLeft,
  Sliders,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { FoodItem, Outlet, AvailabilityStatus, FoodCategory, DietaryType } from '../types/campus';
import { formatINR, formatRelativeTime, formatExactDateTime } from '../utils/formatters';

interface VendorDashboardProps {
  outlets: Outlet[];
  items: FoodItem[];
  selectedOutletId: string;
  onSelectOutlet: (outletId: string) => void;
  onUpdateItemStatus: (
    itemId: string,
    availability: AvailabilityStatus,
    stockCount?: number
  ) => void;
  onAddItem: (newItem: Omit<FoodItem, 'id' | 'lastUpdated'>) => void;
  onBackToStudentView: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  outlets,
  items,
  selectedOutletId,
  onSelectOutlet,
  onUpdateItemStatus,
  onAddItem,
  onBackToStudentView,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Exclude<FoodCategory, 'All'>>('Snacks & Quick Bites');
  const [newItemPrice, setNewItemPrice] = useState<string>('50');
  const [newItemDietary, setNewItemDietary] = useState<DietaryType>('veg');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemAvailability, setNewItemAvailability] = useState<AvailabilityStatus>('available');
  const [newItemStock, setNewItemStock] = useState<string>('15');
  const [formError, setFormError] = useState<string | null>(null);

  const currentOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];
  const outletItems = items.filter((i) => i.outletId === currentOutlet.id);

  const filteredItems = outletItems.filter((i) =>
    i.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    i.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const availableCount = outletItems.filter((i) => i.availability === 'available').length;
  const limitedCount = outletItems.filter((i) => i.availability === 'limited').length;
  const unavailableCount = outletItems.filter((i) => i.availability === 'unavailable').length;

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2800);
  };

  const handleStatusChange = (item: FoodItem, newStatus: AvailabilityStatus) => {
    let newStock = item.stockCount;
    if (newStatus === 'limited') {
      newStock = item.stockCount && item.stockCount > 0 ? item.stockCount : 5;
    } else if (newStatus === 'unavailable') {
      newStock = 0;
    } else if (newStatus === 'available') {
      newStock = item.stockCount && item.stockCount > 5 ? item.stockCount : 25;
    }
    onUpdateItemStatus(item.id, newStatus, newStock);
    triggerToast(`Updated "${item.name}" to ${newStatus === 'limited' ? 'Limited Stock' : newStatus === 'available' ? 'Available' : 'Sold Out'}`);
  };

  const handleStockCountChange = (item: FoodItem, count: number) => {
    const safeCount = Math.max(0, count);
    const newStatus: AvailabilityStatus = safeCount === 0 ? 'unavailable' : safeCount <= 5 ? 'limited' : 'available';
    onUpdateItemStatus(item.id, newStatus, safeCount);
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      setFormError('Please enter a dish name.');
      return;
    }
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price in INR.');
      return;
    }

    const stockNum = parseInt(newItemStock, 10);
    if (newItemAvailability === 'limited' && (isNaN(stockNum) || stockNum <= 0)) {
      setFormError('Please enter a valid remaining stock count for limited items.');
      return;
    }

    onAddItem({
      name: newItemName.trim(),
      description: newItemDescription.trim() || 'Freshly prepared campus specialty.',
      price: priceNum,
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      category: newItemCategory,
      dietary: newItemDietary,
      availability: newItemAvailability,
      stockCount: newItemAvailability === 'unavailable' ? 0 : isNaN(stockNum) ? 20 : stockNum,
      unitName: 'portions',
    });

    setNewItemName('');
    setNewItemDescription('');
    setNewItemPrice('50');
    setNewItemStock('15');
    setFormError(null);
    setShowAddModal(false);
    triggerToast(`Added "${newItemName.trim()}" to ${currentOutlet.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-sm border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Breadcrumb & Outlet Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToStudentView}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Vendor Live Availability Manager
              </h1>
              <p className="text-xs text-slate-500">
                Manage stock counts, trigger sold-out flags, and keep students updated.
              </p>
            </div>
          </div>
        </div>

        {/* Outlet Switcher dropdown & Add Dish button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-400 pl-2">Outlet:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => onSelectOutlet(e.target.value)}
              className="text-xs font-bold text-emerald-950 bg-transparent pr-3 py-1.5 focus:outline-none"
            >
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner note */}
      <div className="my-4 bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Demonstration Session Mode:</span> Changes made here update immediately in the Student Menu for this browser session. Stock quantities and availability statuses are sample university demonstration data and designed for future Supabase real-time database schema sync.
        </div>
      </div>

      {/* Quick Outlet Inventory Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Total Menu Items
          </span>
          <span className="text-xl font-bold text-slate-900 font-mono">
            {outletItems.length}
          </span>
        </div>
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80">
          <span className="text-[11px] font-semibold text-emerald-800 block uppercase tracking-wider">
            Available Now
          </span>
          <span className="text-xl font-bold text-emerald-900 font-mono">
            {availableCount}
          </span>
        </div>
        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
          <span className="text-[11px] font-semibold text-amber-800 block uppercase tracking-wider">
            Limited Stock
          </span>
          <span className="text-xl font-bold text-amber-900 font-mono">
            {limitedCount}
          </span>
        </div>
        <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-600 block uppercase tracking-wider">
            Sold Out
          </span>
          <span className="text-xl font-bold text-slate-800 font-mono">
            {unavailableCount}
          </span>
        </div>
      </div>

      {/* Search & Bulk Controls Header */}
      <div className="bg-white rounded-t-xl border border-b-0 border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder={`Filter ${currentOutlet.name} items...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              outletItems.forEach((item) => {
                onUpdateItemStatus(item.id, 'available', 30);
              });
              triggerToast(`Marked all ${currentOutlet.name} dishes as Available`);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            Mark All Ready
          </button>
        </div>
      </div>

      {/* Table / Card List of Items */}
      <div className="bg-white rounded-b-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Dish Details</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability State</th>
                <th className="py-3 px-4">Remaining Count</th>
                <th className="py-3 px-4">Last Verified</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No items match "{searchFilter}" for this outlet.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Item info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {item.dietary === 'veg' && (
                            <span className="w-3.5 h-3.5 rounded-xs border border-emerald-600 flex items-center justify-center p-0.5 shrink-0" title="Veg">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                          )}
                          {item.dietary === 'non-veg' && (
                            <span className="w-3.5 h-3.5 rounded-xs border border-red-600 flex items-center justify-center p-0.5 shrink-0" title="Non-Veg">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            </span>
                          )}
                          {item.dietary === 'beverage' && (
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0 inline-block" title="Beverage" />
                          )}
                        </div>
                        <div>
                          <span className={`font-semibold text-slate-900 block ${item.availability === 'unavailable' ? 'line-through text-slate-500' : ''}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-950">
                      {formatINR(item.price)}
                    </td>

                    {/* Availability state segmented toggle */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                        <button
                          onClick={() => handleStatusChange(item, 'available')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                            item.availability === 'available'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Set Available"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Available</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(item, 'limited')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                            item.availability === 'limited'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Set Limited Stock"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Limited</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(item, 'unavailable')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                            item.availability === 'unavailable'
                              ? 'bg-slate-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Set Sold Out"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Sold Out</span>
                        </button>
                      </div>
                    </td>

                    {/* Stock Count stepper */}
                    <td className="py-3.5 px-4">
                      {item.availability === 'unavailable' ? (
                        <span className="text-slate-400 italic">0 (Sold Out)</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockCountChange(item, (item.stockCount || 1) - 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={item.stockCount ?? 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleStockCountChange(item, isNaN(val) ? 0 : val);
                            }}
                            className="w-12 text-center py-0.5 border border-slate-200 rounded font-mono font-semibold text-slate-800"
                          />
                          <button
                            onClick={() => handleStockCountChange(item, (item.stockCount || 0) + 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                            title="Increase quantity"
                          >
                            +
                          </button>
                          <span className="text-[11px] text-slate-400 ml-1">
                            {item.unitName || 'left'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Last verified */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatRelativeTime(item.lastUpdated)}</span>
                      </div>
                    </td>

                    {/* Quick action */}
                    <td className="py-3.5 px-4 text-right">
                      {item.availability !== 'unavailable' ? (
                        <button
                          onClick={() => handleStatusChange(item, 'unavailable')}
                          className="text-[11px] font-medium text-red-700 hover:text-red-900 hover:underline"
                        >
                          Mark Sold Out
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(item, 'available')}
                          className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 hover:underline"
                        >
                          Restock Fresh
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Add New Menu Item</h3>
                <span className="text-xs text-emerald-200">
                  Adding to {currentOutlet.name}
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-emerald-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa, Veg Grilled Sandwich"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Meals & Thali">Meals & Thali</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Rolls & Wraps">Rolls & Wraps</option>
                    <option value="Snacks & Quick Bites">Snacks & Quick Bites</option>
                    <option value="Sandwiches & Burgers">Sandwiches & Burgers</option>
                    <option value="Beverages & Shakes">Beverages & Shakes</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 60"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dietary Type</label>
                  <select
                    value={newItemDietary}
                    onChange={(e) => setNewItemDietary(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="veg">Pure Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Availability</label>
                  <select
                    value={newItemAvailability}
                    onChange={(e) => setNewItemAvailability(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited Stock</option>
                    <option value="unavailable">Sold Out / Unavailable</option>
                  </select>
                </div>
              </div>

              {newItemAvailability !== 'unavailable' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, serving size or preparation notes..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
