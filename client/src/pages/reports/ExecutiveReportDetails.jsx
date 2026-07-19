import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Download, RefreshCw, Activity, Users, AlertTriangle, ShieldAlert, Car, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const ExecutiveReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // In a real app we might set up a socket listener for report completion here
    const interval = setInterval(() => {
      if (report?.status === 'GENERATING_AI' || report?.status === 'COLLECTING_DATA') {
        fetchReport();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id, report?.status]);

  const handleRegenerateAI = async () => {
    setRegenerating(true);
    try {
      await api.post(`/reports/${id}/regenerate-ai`);
      fetchReport();
    } catch (error) {
      console.error(error);
      alert('Failed to trigger AI regeneration.');
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-12 text-center animate-pulse font-bold text-gray-500">Loading Report Details...</div>;
  if (!report) return <div className="p-12 text-center font-bold text-red-500">Failed to load report.</div>;

  const metrics = report.metricsSnapshot;
  const ai = report.aiAnalysis || {};

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto print:max-w-full print:m-0 print:p-0">
      
      {/* Header Actions - hidden when printing */}
      <div className="flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          {(report.status === 'FAILED' || report.aiMetadata?.status === 'FAILED') && (
            <button 
              onClick={handleRegenerateAI} 
              disabled={regenerating}
              className="px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-lg flex items-center gap-2 hover:bg-orange-200"
            >
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate AI Analysis
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Paper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 print:border-none print:shadow-none print:p-4">
        
        {/* Title Header */}
        <div className="border-b-4 border-gray-900 pb-8 mb-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">StadiumOS Executive Report</h1>
          <div className="flex justify-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <span>{report.stadiumId?.name}</span>
            <span>•</span>
            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>ID: {report.reportId}</span>
          </div>
        </div>

        {/* AI Warning if FAILED */}
        {report.aiMetadata?.status === 'FAILED' && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900">AI Analysis Unavailable</h3>
              <p className="text-sm text-orange-800 mt-1">
                The deterministic metrics snapshot was successfully captured, but the AI engine failed to generate the narrative (Reason: {report.aiMetadata.errorReason}). You can retry generating the AI sections using the button at the top.
              </p>
            </div>
          </div>
        )}

        {report.status === 'GENERATING_AI' && (
           <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
             <Activity className="w-6 h-6 text-purple-500 animate-pulse" />
             <span className="font-bold text-purple-900">AI is currently analyzing the metrics snapshot...</span>
           </div>
        )}

        {/* Executive Summary */}
        {ai.executiveSummary && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Executive Summary</h2>
            </div>
            <div className="prose max-w-none text-gray-600 leading-relaxed font-medium">
              {ai.executiveSummary.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
          </div>
        )}

        {/* Stadium Health Score */}
        <div className="mb-12 bg-gray-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Overall Stadium Health</h2>
            <p className="text-gray-500 font-medium">
              {ai.operationalAssessment || "Calculated based on crowd safety, incident resolution, and volunteer readiness."}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center w-32 h-32 rounded-full border-[8px] border-white shadow-sm relative bg-white">
            <svg className="w-full h-full absolute top-0 left-0 -rotate-90">
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100"></circle>
              <circle 
                cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="300" strokeDashoffset={300 - (300 * (report.healthScore || 0)) / 100}
                className={report.healthScore >= 90 ? "text-emerald-500" : report.healthScore >= 75 ? "text-orange-500" : "text-red-500"}
              ></circle>
            </svg>
            <span className="text-4xl font-black text-gray-900 relative z-10">{report.healthScore}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Crowd section */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500"/> Crowd Intelligence</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Attendance</span>
                <div className="text-2xl font-black text-gray-900">{metrics?.crowdMetrics?.totalAttendance?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Peak Density</span>
                <div className="text-2xl font-black text-gray-900">{metrics?.crowdMetrics?.peakDensity || 0}%</div>
              </div>
            </div>
            {ai.crowdAnalysis && <p className="text-sm text-gray-600 font-medium leading-relaxed">{ai.crowdAnalysis}</p>}
          </div>

          {/* Incident section */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500"/> Incident Operations</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
                <div className="text-2xl font-black text-gray-900">{metrics?.incidentMetrics?.total || 0}</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Critical</span>
                <div className="text-2xl font-black text-red-600">{metrics?.incidentMetrics?.critical || 0}</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Resolved</span>
                <div className="text-2xl font-black text-emerald-600">{metrics?.incidentMetrics?.resolved || 0}</div>
              </div>
            </div>
            {ai.incidentAnalysis && <p className="text-sm text-gray-600 font-medium leading-relaxed">{ai.incidentAnalysis}</p>}
          </div>

          {/* Volunteer section */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500"/> Volunteer Performance</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Active Staff</span>
                <div className="text-2xl font-black text-gray-900">{metrics?.volunteerMetrics?.activeVolunteers || 0}</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl">
                <span className="text-xs font-bold text-gray-400 uppercase">Completion Rate</span>
                <div className="text-2xl font-black text-gray-900">{metrics?.volunteerMetrics?.completionRate || 0}%</div>
              </div>
            </div>
            {ai.volunteerAnalysis && <p className="text-sm text-gray-600 font-medium leading-relaxed">{ai.volunteerAnalysis}</p>}
          </div>

          {/* AI Decision section */}
          <div>
             <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-purple-500"/> AI Decisions</h3>
             <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl mb-4">
                <span className="text-xs font-bold text-purple-500 uppercase">AI Triggers Recorded</span>
                <div className="text-2xl font-black text-purple-900">{metrics?.aiMetrics?.totalDecisions || 0}</div>
             </div>
             {ai.aiDecisionAnalysis && <p className="text-sm text-gray-600 font-medium leading-relaxed">{ai.aiDecisionAnalysis}</p>}
          </div>
        </div>

        {/* Risks & Successes */}
        {((report.keyRisks && report.keyRisks.length > 0) || (report.keySuccesses && report.keySuccesses.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-red-100 bg-red-50/30 p-6 rounded-2xl">
              <h3 className="text-lg font-black text-red-900 mb-4">Key Risks Identified</h3>
              <ul className="space-y-3">
                {report.keyRisks.map((risk, i) => (
                  <li key={i} className="flex gap-3 text-sm text-red-800 font-medium">
                    <span className="shrink-0 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-emerald-100 bg-emerald-50/30 p-6 rounded-2xl">
              <h3 className="text-lg font-black text-emerald-900 mb-4">Key Successes</h3>
              <ul className="space-y-3">
                {report.keySuccesses.map((success, i) => (
                  <li key={i} className="flex gap-3 text-sm text-emerald-800 font-medium">
                    <span className="shrink-0 mt-0.5 text-emerald-500">✓</span>
                    <span>{success}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Future Recommendations</h2>
            <div className="space-y-4">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`shrink-0 px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
                    rec.category === 'Immediate' ? 'bg-red-100 text-red-700' :
                    rec.category === 'Next Match' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {rec.category}
                  </div>
                  <p className="text-gray-800 font-medium text-sm leading-relaxed pt-0.5">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExecutiveReportDetails;
