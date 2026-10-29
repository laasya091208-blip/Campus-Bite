import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AvailabilityStatus } from '../types/campus';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  stockCount?: number;
  unitName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status,
  stockCount,
  unitName = 'left',
  size = 'md',
}) => {
  if (status === 'available') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-md text-emerald-800 bg-emerald-50 border border-emerald-200/80 ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        }`}
        title="Item is ready and available to order"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
        <span>Available</span>
      </span>
    );
  }

  if (status === 'limited') {
    const quantityText =
      typeof stockCount === 'number' && stockCount > 0
        ? `${stockCount} ${stockCount === 1 ? 'portion' : unitName} left`
        : 'Limited Stock';

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md text-amber-900 bg-amber-50 border border-amber-300 ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        }`}
        title="Stock is running low — may sell out soon"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
        <span>{quantityText}</span>
      </span>
    );
  }

  // Unavailable
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md text-slate-600 bg-slate-100 border border-slate-200 line-through decoration-slate-400 ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3 py-1.5 text-sm'
          : 'px-2.5 py-1 text-xs'
      }`}
      title="Currently sold out at this outlet"
    >
      <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 no-underline" aria-hidden="true" />
      <span className="no-underline">Sold Out</span>
    </span>
  );
};
