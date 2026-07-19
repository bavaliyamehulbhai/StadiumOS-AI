import React, { useState, useEffect } from 'react';
import { Bot, Map as MapIcon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';

import AIAnalysisPanel from '@/components/crowd-ai/AIAnalysisPanel';
import TrendChart from '@/components/crowd-ai/TrendChart';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Mock trend data for the Hackathon demo since we aren't storing time-series yet
const mockTrendData = [
  { time: '18:00', density: 10000 },
  { time: '18:15', density: 25000 },
  { time: '18:30', density: 38000 },
  { time: '18:45', density: 52000 },
  { time: '19:00', density: 63000 },
  { time: '19:15', density: 63452 }
];

const AICrowdDashboard = () => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAIAnalysis = async () => {
    try {
      setLoading(true);
      // Hardcoded fallback stadium ID for demo if needed, but the server handles defaults
      const res = await api.post('/ai/crowd/insights');
      setAiData(res.data.data);
    } catch (error) {
      toast.error('Failed to generate AI Crowd Analysis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <DashboardHeader 
          title="AI Crowd Operations Center" 
          subtitle="Proactive intelligence, congestion forecasting, and automated recommendations." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Logic & Cards */}
        <div className="lg:col-span-2 space-y-6">
          <AIAnalysisPanel 
            aiData={aiData} 
            loading={loading} 
            onRefresh={fetchAIAnalysis} 
          />
        </div>

        {/* Right Column: Graphs & Secondary Actions */}
        <div className="space-y-6">
          
          <TrendChart data={mockTrendData} />

          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
             <div className="relative z-10">
                <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md mb-4 border border-white/20">
                  <MapIcon className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">View Spatial Map</h3>
                <p className="text-blue-200 text-sm mb-6">
                  Overlay these AI predictions directly onto the physical stadium map to visualize the chokepoints.
                </p>
                <Link 
                  to="/map"
                  className="block w-full py-3 bg-white text-blue-900 font-bold text-center rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Open Live Map
                </Link>
             </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-2">AI Data Sources</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span>Gate Sensors</span>
                <span className="font-medium text-emerald-600">Online</span>
              </li>
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span>Ticket Scanners</span>
                <span className="font-medium text-emerald-600">Online</span>
              </li>
              <li className="flex justify-between border-b border-gray-50 pb-2">
                <span>Parking Systems</span>
                <span className="font-medium text-emerald-600">Online</span>
              </li>
              <li className="flex justify-between">
                <span>CCTV Computer Vision</span>
                <span className="font-medium text-amber-500">Processing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICrowdDashboard;
