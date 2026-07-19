import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import api from '../../services/api';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../context/AuthContext';

const ExecutiveReportCenter = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState('');

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data.data);
    } catch (error) {
      console.error('Failed to load reports', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStadiums = async () => {
    try {
      const res = await api.get('/stadiums');
      setStadiums(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedStadium(res.data.data[0]._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReports();
    if (user.role === 'Admin') {
      fetchStadiums();
    }
  }, [user]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      // In a real app we might pop a modal to select Match. We'll default to current active Match for demo.
      const payload = { 
        type: 'MATCH_EXECUTIVE',
        stadiumId: user.role === 'Admin' ? selectedStadium : user.assignedStadium
      };
      
      const res = await api.post('/reports', payload);
      setReports(prev => [res.data.data, ...prev]);
      
      // Auto-refresh shortly as AI generation runs in background
      setTimeout(fetchReports, 5000);
    } catch (error) {
      console.error('Failed to generate report', error);
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Ready</span>;
      case 'FAILED': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Failed</span>;
      case 'GENERATING_AI': return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1"><Activity className="w-3 h-3 animate-pulse"/> AI Analysis...</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3 animate-spin"/> Processing</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-start">
        <DashboardHeader 
          title="AI Executive Reports" 
          subtitle="Generate and view immutable operational reports powered by AI." 
        />
        
        <div className="flex gap-3">
          {user.role === 'Admin' && stadiums.length > 0 && (
            <select 
              value={selectedStadium} 
              onChange={e => setSelectedStadium(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500"
            >
              {stadiums.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          )}
          <button 
            onClick={handleGenerateReport}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {generating ? <Clock className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Generate Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Reports Found</h3>
            <p className="text-sm text-gray-500 mb-4">Generate your first executive operations report.</p>
            <button onClick={handleGenerateReport} className="text-blue-600 font-bold hover:underline">
              Generate Now
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Report Details</th>
                <th className="px-6 py-4">Stadium</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Health Score</th>
                <th className="px-6 py-4">Generated By</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map(report => (
                <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{report.title}</div>
                        <div className="text-xs text-gray-500 font-medium">ID: {report.reportId} • {new Date(report.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {report.stadiumId?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4">
                    {report.healthScore !== undefined ? (
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${report.healthScore >= 90 ? 'text-emerald-600' : report.healthScore >= 75 ? 'text-orange-500' : 'text-red-600'}`}>
                          {report.healthScore}
                        </span>
                        <span className="text-xs text-gray-400 font-bold">/ 100</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {report.generatedBy?.name || 'System'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/${user.role.toLowerCase()}/reports/${report._id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg transition-colors inline-block"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExecutiveReportCenter;
