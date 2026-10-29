import React from 'react';
import { MapPin, Clock, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Phone } from 'lucide-react';
import { Outlet, FoodItem } from '../types/campus';

interface OutletCardProps {
  outlet: Outlet;
  items: FoodItem[];
  onViewMenu: (outletId: string) => void;
  onManageOutlet?: (outletId: string) => void;
}

export const OutletCard: React.FC<OutletCardProps> = ({
  outlet,
  items,
  onViewMenu,
  onManageOutlet,
}) => {
  const availableCount = items.filter((i) => i.availability === 'available').length;
  const limitedCount = items.filter((i) => i.availability === 'limited').length;
  const unavailableCount = items.filter((i) => i.availability === 'unavailable').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  outlet.isOpen ? 'bg-emerald-600' : 'bg-slate-400'
                }`}
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {outlet.isOpen ? 'Open Now' : 'Closed'} · {outlet.distanceMinutes} min walk
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
              {outlet.name}
            </h3>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
          {outlet.tagline}
        </p>

        {/* Location & Hours metadata */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="text-slate-700">{outlet.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Hours: {outlet.hours}</span>
          </div>
          {outlet.contactNumber && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Desk: {outlet.contactNumber}</span>
            </div>
          )}
        </div>

        {/* Live Inventory Status Breakdown */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-100 text-center mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span className="font-mono text-sm">{availableCount}</span>
            </div>
            <span className="text-[10px] text-slate-500">Ready</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100">
            <div className="flex items-center gap-1 text-amber-700 text-xs font-semibold">
              <AlertTriangle className="w-3 h-3" />
              <span className="font-mono text-sm">{limitedCount}</span>
            </div>
            <span className="text-[10px] text-slate-500">Limited</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
              <XCircle className="w-3 h-3" />
              <span className="font-mono text-sm">{unavailableCount}</span>
            </div>
            <span className="text-[10px] text-slate-500">Sold out</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onViewMenu(outlet.id)}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View Menu ({items.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onManageOutlet && (
          <button
            onClick={() => onManageOutlet(outlet.id)}
            className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Open Vendor Management for this outlet"
          >
            Manage
          </button>
        )}
      </div>
    </div>
  );
};
