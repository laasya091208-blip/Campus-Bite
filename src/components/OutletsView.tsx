import React from 'react';
import { Store, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Outlet, FoodItem } from '../types/campus';
import { OutletCard } from './OutletCard';

interface OutletsViewProps {
  outlets: Outlet[];
  items: FoodItem[];
  onSelectOutletForMenu: (outletId: string) => void;
  onOpenVendorDesk: (outletId: string) => void;
}

export const OutletsView: React.FC<OutletsViewProps> = ({
  outlets,
  items,
  onSelectOutletForMenu,
  onOpenVendorDesk,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-2">
          <Store className="w-3.5 h-3.5" />
          <span>Campus Directory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Food Outlets & Canteens
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Check live opening hours, walking times from major campus landmarks, and active dish availability at each food spot.
        </p>
      </div>

      {/* Grid of Outlets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets.map((outlet) => {
          const outletItems = items.filter((i) => i.outletId === outlet.id);
          return (
            <OutletCard
              key={outlet.id}
              outlet={outlet}
              items={outletItems}
              onViewMenu={onSelectOutletForMenu}
              onManageOutlet={onOpenVendorDesk}
            />
          );
        })}
      </div>
    </div>
  );
};
