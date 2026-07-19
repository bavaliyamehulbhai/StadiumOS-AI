import React, { useState } from 'react';
import { ShieldAlert, Navigation, Stethoscope, Bot, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmergency } from '@/context/EmergencyContext';

const FanEmergencyWidget = () => {
  const [open, setOpen] = useState(false);
  const { activeBroadcasts = [] } = useEmergency();
  const hasCritical = activeBroadcasts.some(e => e.severity === 'CRITICAL' || e.severity === 'HIGH');

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-28 right-6 md:bottom-32 md:right-10 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 ${
          hasCritical
            ? 'bg-red-600 text-white animate-pulse shadow-red-500/40'
            : 'bg-gray-900 text-white shadow-gray-900/30'
        }`}
      >
        <ShieldAlert className="w-5 h-5" />
        {hasCritical ? 'EMERGENCY' : 'Emergency'}
      </button>

      {/* Bottom Sheet Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          <div className="relative bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 z-10">
            {/* Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full sm:hidden" />
            
            <div className="flex items-center justify-between mb-6 pt-2 sm:pt-0">
              <div>
                <h3 className="text-xl font-black text-gray-900">Emergency Help</h3>
                <p className="text-sm text-gray-500">
                  {hasCritical
                    ? `⚠ ${activeBroadcasts.length} active emergency alert`
                    : 'Stadium safety assistance'}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {hasCritical && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-bold text-red-800">
                  🚨 {activeBroadcasts[0]?.type} — {activeBroadcasts[0]?.zone}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Follow staff instructions and proceed to nearest exit calmly.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                to="/fan/navigation"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Find Safe Exit</p>
                  <p className="text-xs text-emerald-600">AI-guided route to nearest exit</p>
                </div>
              </Link>

              <Link
                to="/assistant"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-900">Ask AI for Help</p>
                  <p className="text-xs text-blue-600">Get personalized emergency guidance</p>
                </div>
              </Link>

              <a
                href="tel:112"
                className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                <div className="p-3 bg-rose-500 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-rose-900">Medical Emergency</p>
                  <p className="text-xs text-rose-600">Call 112 for immediate assistance</p>
                </div>
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Stay calm · Follow staff instructions · Do not run
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FanEmergencyWidget;
