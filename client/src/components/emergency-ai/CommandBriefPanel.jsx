import React from 'react';
import {
  Bot, ShieldAlert, Flame, MapPin, DoorOpen, Users, Clock,
  Zap, Map, UserCheck, FileText, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfidenceBadge from './ConfidenceBadge';
import SafeRouteCard from './SafeRouteCard';
import ResourceCard from './ResourceCard';
import EvacuationCard from './EvacuationCard';
import MedicalGuideCard from './MedicalGuideCard';

const RISK_STYLES = {
  Critical: { banner: 'from-red-900 to-rose-900', badge: 'bg-red-500', text: 'text-red-300' },
  High: { banner: 'from-orange-900 to-amber-900', badge: 'bg-orange-500', text: 'text-orange-300' },
  Medium: { banner: 'from-yellow-800 to-amber-800', badge: 'bg-yellow-500', text: 'text-yellow-300' },
  Low: { banner: 'from-blue-900 to-indigo-900', badge: 'bg-blue-500', text: 'text-blue-300' },
};

const BriefRow = ({ icon: Icon, label, value, highlight }) => (
  <div className={`flex items-start gap-4 px-6 py-4 border-b border-gray-100 last:border-0 ${highlight ? 'bg-red-50/40' : 'bg-white'}`}>
    <div className={`p-2 rounded-lg flex-shrink-0 border ${highlight ? 'bg-red-100 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
      <Icon className={`w-4 h-4 ${highlight ? 'text-red-600' : 'text-gray-500'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-bold leading-snug ${highlight ? 'text-red-700' : 'text-gray-900'}`}>{value || '—'}</p>
    </div>
  </div>
);

const CommandBriefPanel = ({ analysis, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative mb-6">
          <Bot className="w-14 h-14 text-red-500 animate-pulse relative z-10" />
          <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-30 animate-ping" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Generating Command Brief...</h3>
        <p className="text-gray-500 text-center max-w-xs text-sm">
          Analyzing crowd density, resource availability, and safe exit options.
        </p>
        <div className="mt-6 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full bg-red-400 animate-bounce`} style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
        <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Select an Emergency</h3>
        <p className="text-gray-500 text-sm">Click an active emergency and press "Analyze with AI" to generate an AI Command Brief.</p>
      </div>
    );
  }

  const riskStyle = RISK_STYLES[analysis.overallRisk] || RISK_STYLES.Medium;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${riskStyle.banner} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white opacity-5 rounded-full blur-xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`${riskStyle.badge} p-2.5 rounded-xl`}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">StadiumOS AI</p>
                <h2 className="text-xl font-black">AI Command Brief</h2>
              </div>
            </div>
            <button onClick={onRefresh} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <ConfidenceBadge confidence={analysis.confidence} aiModel={analysis.aiModel} />
          </div>

          <p className="text-white/90 text-sm leading-relaxed bg-black/20 rounded-xl p-4 border border-white/10">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* ⭐ Top 400 Tip: Structured Command Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-gray-900">Operational Command Summary</h3>
        </div>

        <BriefRow icon={Flame} label="Emergency Type" value={analysis.emergencyType} highlight={analysis.overallRisk === 'Critical'} />
        <BriefRow icon={AlertTriangle} label="Severity & Risk" value={`${analysis.severity} severity · ${analysis.overallRisk} risk`} highlight={analysis.overallRisk === 'Critical'} />
        <BriefRow icon={MapPin} label="Affected Zone" value={analysis.affectedZone} />
        <BriefRow icon={DoorOpen} label="Primary Safe Exit" value={analysis.safeExits?.[0] ? `${analysis.safeExits[0].exit} · ${analysis.safeExits[0].crowdLevel} crowd · ~${analysis.safeExits[0].walkingTimeMinutes} min walk` : 'Calculating...'} />
        <BriefRow icon={Users} label="Resources Required" value={analysis.resources?.slice(0, 3).map(r => `${r.team} ×${r.count}`).join('  ·  ')} />
        <BriefRow icon={Clock} label="Est. Resolution" value={`${analysis.estimatedResolutionMinutes}–${analysis.estimatedResolutionMinutes + 5} minutes`} />

        {analysis.immediateActions?.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100 bg-red-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-red-100 rounded-lg border border-red-200">
                <Zap className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Immediate Actions</p>
            </div>
            <ul className="space-y-1.5">
              {analysis.immediateActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-red-800">
                  <span className="text-red-400 font-black mt-0.5">→</span> {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.warnings?.length > 0 && (
          <div className="px-6 py-4 bg-amber-50/30 border-b border-amber-100">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">⚠ Warnings</p>
            <ul className="space-y-1">
              {analysis.warnings.map((w, i) => (
                <li key={i} className="text-sm text-amber-800 font-medium">{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 flex flex-wrap gap-3 bg-gray-50">
          <Link
            to="/map"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Map className="w-4 h-4" /> Open Map
          </Link>
          <Link
            to="/organizer/tasks/assign"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <UserCheck className="w-4 h-4" /> Assign Teams
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SafeRouteCard safeExits={analysis.safeExits} />
        <MedicalGuideCard medicalGuidance={analysis.medicalGuidance} safeExits={analysis.safeExits} />
      </div>
      <ResourceCard resources={analysis.resources} />
      <EvacuationCard evacuationSteps={analysis.evacuationSteps} estimatedResolutionMinutes={analysis.estimatedResolutionMinutes} />
    </div>
  );
};

export default CommandBriefPanel;
