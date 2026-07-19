import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, MapPin, Users, Clock, AlertTriangle, Zap, CheckCircle, ChevronRight, Cpu } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const severityConfig = {
  Critical: {
    headerBg: 'from-red-600 to-red-700',
    stripBg: 'bg-red-50 border-red-100',
    badge: 'bg-red-100 text-red-700 border-red-200',
    accentText: 'text-red-600',
    accentBg: 'bg-red-600',
    actionsBg: 'bg-red-50 border-red-100',
    actionsText: 'text-red-700',
    dot: 'bg-red-500',
    pulse: true,
  },
  High: {
    headerBg: 'from-orange-500 to-orange-600',
    stripBg: 'bg-orange-50 border-orange-100',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    accentText: 'text-orange-600',
    accentBg: 'bg-orange-500',
    actionsBg: 'bg-orange-50 border-orange-100',
    actionsText: 'text-orange-700',
    dot: 'bg-orange-500',
    pulse: false,
  },
  Medium: {
    headerBg: 'from-yellow-500 to-amber-500',
    stripBg: 'bg-yellow-50 border-yellow-100',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    accentText: 'text-yellow-600',
    accentBg: 'bg-yellow-500',
    actionsBg: 'bg-yellow-50 border-yellow-100',
    actionsText: 'text-yellow-700',
    dot: 'bg-yellow-500',
    pulse: false,
  },
  Low: {
    headerBg: 'from-emerald-500 to-green-600',
    stripBg: 'bg-emerald-50 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
    actionsBg: 'bg-emerald-50 border-emerald-100',
    actionsText: 'text-emerald-700',
    dot: 'bg-emerald-500',
    pulse: false,
  },
};

const LoadingState = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
      <div className="h-4 w-48 rounded bg-white/20 animate-pulse" />
    </div>
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Cpu className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="text-indigo-600 text-sm font-medium">AI is analyzing the incident...</span>
      </div>
      {[1, 0.8, 0.6].map((w, i) => (
        <div key={i} className="h-3 rounded-full bg-gray-100 animate-pulse" style={{ width: `${w * 100}%` }} />
      ))}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-28 rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-28 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
);

const AIAnalysisPanel = ({ incidentId, incidentLocation }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const navigate = useNavigate();

  const fetchAnalysis = async (forceRegenerate = false) => {
    if (forceRegenerate) setRegenerating(true);
    else setLoading(true);
    try {
      if (forceRegenerate) {
        const { data } = await api.post(`/ai/incidents/${incidentId}/analyze?regenerate=true`);
        setAnalysis(data.data);
        toast.success('AI Analysis Regenerated');
      } else {
        try {
          const { data } = await api.get(`/ai/incidents/${incidentId}`);
          setAnalysis(data.data);
        } catch (err) {
          if (err.response?.status === 404) {
            const { data } = await api.post(`/ai/incidents/${incidentId}/analyze`);
            setAnalysis(data.data);
          } else throw err;
        }
      }
    } catch {
      toast.error('Failed to process AI Analysis');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => { if (incidentId) fetchAnalysis(); }, [incidentId]);

  if (loading) return <LoadingState />;
  if (!analysis) return null;

  const cfg = severityConfig[analysis.severity] || severityConfig.Medium;

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">

      {/* Header */}
      <div className={`bg-gradient-to-r ${cfg.headerBg} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ${cfg.pulse ? 'animate-pulse' : ''}`}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">StadiumOS AI</p>
            <h3 className="text-white font-bold text-sm leading-tight">Operations Brief</h3>
          </div>
        </div>
        <button
          onClick={() => fetchAnalysis(true)}
          disabled={regenerating}
          className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all text-white"
          title="Regenerate Analysis"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Severity Strip */}
      <div className={`${cfg.stripBg} border-b px-5 py-3 flex flex-wrap items-center gap-3`}>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${cfg.badge} ${cfg.pulse ? 'animate-pulse' : ''}`}>
          ⚠ {analysis.severity}
        </span>
        <div className="w-px h-4 bg-gray-300" />
        <div className={`flex items-center gap-1.5 ${cfg.accentText} text-xs font-semibold`}>
          <Zap className="w-3.5 h-3.5" />
          {analysis.confidence}% Confidence
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          Risk: <span className={`font-semibold ${cfg.accentText}`}>{analysis.riskLevel}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-gray-500 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          ETA: <span className="font-semibold text-gray-700">{analysis.estimatedResolution}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Executive Summary */}
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Executive Summary</p>
          <p className="text-gray-800 text-sm leading-relaxed font-medium bg-gray-50 rounded-xl p-4 border border-gray-100">
            {analysis.summary}
          </p>
        </div>

        {/* AI Reasoning */}
        {analysis.reasoning && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">AI Reasoning</p>
            <p className="text-blue-700 text-xs italic leading-relaxed">{analysis.reasoning}</p>
          </div>
        )}

        {/* Resources & Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Required Resources */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-3">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Resources</p>
            </div>
            <ul className="space-y-2">
              {analysis.requiredResources.map((res, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className={`${cfg.actionsBg} rounded-xl p-4 border`}>
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle className={`w-3.5 h-3.5 ${cfg.accentText}`} />
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Actions</p>
            </div>
            <ul className="space-y-2">
              {analysis.recommendedActions.map((action, i) => (
                <li key={i} className={`flex items-start gap-2 text-xs font-semibold ${cfg.actionsText}`}>
                  <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/map?search=${encodeURIComponent(incidentLocation)}`)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${cfg.accentBg} hover:opacity-90 transition-opacity text-white text-sm font-semibold shadow-sm`}
        >
          <MapPin className="w-4 h-4" />
          Open Affected Zone on Map
        </button>

      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center gap-2 border-t border-gray-100 pt-3">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
        <span className="text-gray-400 text-[10px]">Powered by Llama 3.3 · StadiumOS AI Intelligence</span>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
