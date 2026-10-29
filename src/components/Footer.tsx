import React from 'react';
import { UtensilsCrossed, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface FooterProps {
  onSwitchToVendor: () => void;
  onResetAllDemoData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSwitchToVendor, onResetAllDemoData }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Campus Bite
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Helping university students check food availability at campus canteens and kiosks before visiting them. Built to eliminate wasted break time and avoid sold-out disappointments.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Saves an estimated 15–20 minutes of break time per student each day.</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Portal Access
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onSwitchToVendor}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Vendor Management Desk
                </button>
              </li>
              <li>
                <button
                  onClick={onResetAllDemoData}
                  className="hover:text-amber-300 transition-colors text-slate-400"
                >
                  Reset Demo Stock Values
                </button>
              </li>
              <li>
                <span className="text-slate-500">Supabase DB Sync (Upcoming v2)</span>
              </li>
            </ul>
          </div>

          {/* Demonstration Disclaimer */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Prototype Notice
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Demonstration Data</span>
              </div>
              <p>
                Stock numbers and availability updates are sample campus items for testing. Updates take effect client-side in your current session.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <span>© 2026 Campus Bite · University Food Availability System</span>
          <span>Designed with deep green aesthetic for high-legibility campus utility</span>
        </div>
      </div>
    </footer>
  );
};
