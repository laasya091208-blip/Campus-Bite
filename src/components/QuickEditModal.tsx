import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { FoodItem, AvailabilityStatus } from '../types/campus';
import { formatINR } from '../utils/formatters';

interface QuickEditModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onSave: (itemId: string, availability: AvailabilityStatus, stockCount?: number) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({ item, onClose, onSave }) => {
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [stockCount, setStockCount] = useState<number>(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setAvailability(item.availability);
      setStockCount(item.stockCount ?? (item.availability === 'limited' ? 3 : 20));
      setValidationError(null);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (availability === 'limited' && stockCount <= 0) {
      setValidationError('Limited stock requires at least 1 remaining portion.');
      return;
    }

    const finalStock = availability === 'unavailable' ? 0 : stockCount;
    onSave(item.id, availability, finalStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight">Quick Status Update</h3>
            <span className="text-xs text-emerald-200">{item.outletName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {validationError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {validationError}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-400 block uppercase font-semibold">
              Selected Item
            </span>
            <span className="font-bold text-sm text-slate-900 block">{item.name}</span>
            <span className="text-emerald-900 font-mono font-bold mt-0.5 block">
              {formatINR(item.price)}
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Current Availability State
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAvailability('available');
                  setValidationError(null);
                  if (stockCount <= 0) setStockCount(20);
                }}
                className={`py-2 px-2.5 rounded-lg border font-semibold flex flex-col items-center gap-1 transition-all ${
                  availability === 'available'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Available</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvailability('limited');
                  setValidationError(null);
                  if (stockCount <= 0 || stockCount > 10) setStockCount(4);
                }}
                className={`py-2 px-2.5 rounded-lg border font-semibold flex flex-col items-center gap-1 transition-all ${
                  availability === 'limited'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Limited</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvailability('unavailable');
                  setValidationError(null);
                }}
                className={`py-2 px-2.5 rounded-lg border font-semibold flex flex-col items-center gap-1 transition-all ${
                  availability === 'unavailable'
                    ? 'bg-slate-100 border-slate-600 text-slate-900 ring-2 ring-slate-600/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-slate-600" />
                <span>Sold Out</span>
              </button>
            </div>
          </div>

          {availability === 'limited' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
              <label className="font-semibold text-amber-950 block mb-1.5">
                Portions Remaining (e.g. 3 left) *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStockCount((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-300 text-amber-950 font-bold flex items-center justify-center hover:bg-amber-100 text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={stockCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setStockCount(isNaN(val) ? 1 : Math.max(1, val));
                  }}
                  className="flex-1 text-center py-1.5 px-3 bg-white border border-amber-300 rounded-lg font-mono font-bold text-amber-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setStockCount((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-300 text-amber-950 font-bold flex items-center justify-center hover:bg-amber-100 text-sm"
                >
                  +
                </button>
                <span className="text-amber-800 font-medium">left</span>
              </div>
            </div>
          )}

          {availability === 'available' && (
            <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Timestamp will be updated to "Just now" for students.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              Save Availability
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
