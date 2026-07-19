import React from 'react';
import { Stethoscope, Navigation, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicalGuideCard = ({ medicalGuidance, safeExits }) => {
  const nearestExit = safeExits?.[0];

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-rose-100 flex items-center gap-2">
        <div className="p-1.5 bg-red-100 rounded-lg border border-red-200">
          <Stethoscope className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="font-bold text-rose-900">Medical Response Guidance</h3>
      </div>

      <div className="p-5 space-y-4">
        {medicalGuidance && (
          <div className="bg-white/70 rounded-xl p-4 border border-rose-100 backdrop-blur-sm">
            <p className="text-sm text-rose-900 leading-relaxed font-medium">
              {medicalGuidance}
            </p>
          </div>
        )}

        {nearestExit && (
          <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3 border border-rose-100">
            <div className="p-2 bg-rose-100 rounded-lg flex-shrink-0">
              <Navigation className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-rose-600 font-semibold uppercase tracking-wide">Nearest Safe Exit</p>
              <p className="text-sm font-bold text-rose-900">{nearestExit.exit}</p>
              <p className="text-xs text-rose-600">~{nearestExit.walkingTimeMinutes} min walk · {nearestExit.crowdLevel} crowd</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/fan/navigation"
            className="flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" /> Navigate
          </Link>
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 py-2.5 bg-white text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm border border-rose-200"
          >
            <Phone className="w-3.5 h-3.5" /> Call 112
          </a>
        </div>
      </div>
    </div>
  );
};

export default MedicalGuideCard;
