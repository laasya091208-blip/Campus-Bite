import React, { useState } from 'react';
import { MapPin, Clock, Utensils, AlertCircle } from 'lucide-react';
import { FoodItem } from '../types/campus';
import { AvailabilityBadge } from './AvailabilityBadge';
import { formatINR, formatRelativeTime, formatExactDateTime } from '../utils/formatters';

interface FoodCardProps {
  item: FoodItem;
  onSelectOutlet?: (outletId: string) => void;
  onQuickVendorEdit?: (item: FoodItem) => void;
  isVendorMode?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onSelectOutlet,
  onQuickVendorEdit,
  isVendorMode = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Status-dependent card dimming for unavailable items
  const isUnavailable = item.availability === 'unavailable';

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
        isUnavailable
          ? 'border-slate-200/90 bg-slate-50/50 opacity-80 hover:opacity-100'
          : 'border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Food image or styled resilient fallback container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        {item.imageUrl && !imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              isUnavailable ? 'grayscale-40 contrast-90' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/40 text-emerald-800">
            <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-2">
              <Utensils className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="text-xs font-semibold text-slate-700 text-center line-clamp-1">
              {item.category}
            </span>
            <span className="text-[11px] text-slate-400">Campus Bite Kitchen</span>
          </div>
        )}

        {/* Top Floating Badge Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Dietary Indicator */}
          <div className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs flex items-center gap-1.5">
            {item.dietary === 'veg' && (
              <span className="flex items-center gap-1" title="Pure Vegetarian">
                <span className="w-3 h-3 rounded-xs border border-emerald-600 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </span>
                <span className="text-[10px] font-bold text-emerald-800">VEG</span>
              </span>
            )}
            {item.dietary === 'non-veg' && (
              <span className="flex items-center gap-1" title="Non-Vegetarian">
                <span className="w-3 h-3 rounded-xs border border-red-600 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                </span>
                <span className="text-[10px] font-bold text-red-800">NON-VEG</span>
              </span>
            )}
            {item.dietary === 'beverage' && (
              <span className="flex items-center gap-1" title="Beverage / Refreshment">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-blue-800">BEVERAGE</span>
              </span>
            )}
          </div>

          {/* Availability Status Badge */}
          <AvailabilityBadge
            status={item.availability}
            stockCount={item.stockCount}
            unitName={item.unitName}
            size="sm"
          />
        </div>

        {/* Unavailable overlay stamp */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-md">
              Sold Out for Now
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata (Zero-pill discipline: unboxed text with · separators) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-emerald-800">{item.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <button
            onClick={() => onSelectOutlet?.(item.outletId)}
            className="hover:text-emerald-900 transition-colors flex items-center gap-1 truncate max-w-[170px]"
            title={`Filter by outlet: ${item.outletName}`}
          >
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.outletName}</span>
          </button>
        </div>

        {/* Title */}
        <h2 className={`text-base font-bold text-slate-900 leading-snug mb-1.5 ${isUnavailable ? 'line-through text-slate-600' : ''}`}>
          {item.name}
        </h2>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <span className="text-xs text-slate-400 block leading-none">Price</span>
            <span className="text-lg font-bold text-emerald-950 font-mono tabular-nums">
              {formatINR(item.price)}
            </span>
          </div>

          {/* Last updated timestamp */}
          <div
            className="text-right text-xs text-slate-500 cursor-help"
            title={`Last verified by outlet manager on ${formatExactDateTime(item.lastUpdated)}`}
          >
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
              Updated
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formatRelativeTime(item.lastUpdated)}</span>
            </span>
          </div>
        </div>

        {/* Vendor Mode Quick Toggle Trigger */}
        {isVendorMode && onQuickVendorEdit && (
          <div className="mt-3 pt-2.5 border-t border-dashed border-emerald-200">
            <button
              onClick={() => onQuickVendorEdit(item)}
              className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Update Stock & Status</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
