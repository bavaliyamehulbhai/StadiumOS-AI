import React, { useEffect, useState } from 'react';
import { Bot, Users, Map, Car, UserCheck, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';

const AIOperationsCenterCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.post('/ai/crowd/insights');
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to load AI Operations Center data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 text-white shadow-lg animate-pulse flex flex-col justify-center items-center h-full min-h-[300px]">
        <Bot className="w-10 h-10 text-blue-400 mb-4 opacity-50" />
        <p className="text-blue-200 font-medium">AI is analyzing stadium telemetry...</p>
      </div>
    );
  }

  if (!data) return null;

  // Extract specific insights for the table based on actionTypes and zones
  const getInsight = (type) => {
    if (type === 'Crowd' && data.predictions?.length > 0) return `Zone: ${data.predictions[0].zone} will hit ${data.predictions[0].predictedDensity}% capacity soon.`;
    if (type === 'Gates') {
       const rec = data.recommendations?.find(r => r.actionType === 'Redirect Crowd' || r.actionType === 'Open Gate');
       return rec ? rec.description : 'All gates operating optimally.';
    }
    if (type === 'Parking') return 'Monitoring live capacities.';
    if (type === 'Volunteers') {
       const rec = data.recommendations?.find(r => r.actionType === 'Deploy Volunteers');
       return rec ? rec.description : 'No immediate deployments needed.';
    }
    return '';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl shadow-xl overflow-hidden flex flex-col h-full relative">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="font-bold tracking-wider text-xs uppercase">StadiumOS AI</span>
          </div>
          <h2 className="text-xl font-bold text-white">Operations Center</h2>
        </div>
        <Link 
          to="/organizer/crowd-ai" 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> Full Analysis
        </Link>
      </div>

      <div className="p-0 flex-1 relative z-10">
        <table className="w-full text-left text-sm text-blue-100">
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-800 rounded-lg"><Users className="w-4 h-4 text-blue-300" /></div> Crowd
              </td>
              <td className="p-4 font-medium text-blue-50">{getInsight('Crowd') || 'Normal density across all zones.'}</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-800 rounded-lg"><Map className="w-4 h-4 text-emerald-300" /></div> Gates
              </td>
              <td className="p-4 font-medium text-blue-50">{getInsight('Gates')}</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-orange-800 rounded-lg"><Car className="w-4 h-4 text-orange-300" /></div> Parking
              </td>
              <td className="p-4 font-medium text-blue-50">{getInsight('Parking')}</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-purple-800 rounded-lg"><UserCheck className="w-4 h-4 text-purple-300" /></div> Volunteers
              </td>
              <td className="p-4 font-medium text-blue-50">{getInsight('Volunteers')}</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-red-800 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-300" /></div> Risk Trend
              </td>
              <td className="p-4 font-medium">
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  data.overallRiskLevel === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  data.overallRiskLevel === 'High' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  data.overallRiskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {data.overallRiskLevel} Risk
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-black/20 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-blue-300 font-medium">Powered by Llama 3 • Live</span>
        <span className="text-xs font-bold text-white flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Confidence: {data.confidence}%
        </span>
      </div>
    </div>
  );
};

export default AIOperationsCenterCard;
