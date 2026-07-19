import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Activity, ArrowRight, Play, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../context/AuthContext';

const MatchOperationsSelect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        let endpoint = '/matches';
        if (user.role === 'Organizer' && user.assignedStadium) {
          endpoint = `/matches?stadium=${user.assignedStadium}`;
        }
        const res = await api.get(endpoint);
        // Prioritize Live matches
        const sorted = res.data.data.sort((a, b) => {
          if (a.status === 'Live' && b.status !== 'Live') return -1;
          if (b.status === 'Live' && a.status !== 'Live') return 1;
          return new Date(a.matchDate) - new Date(b.matchDate);
        });
        setMatches(sorted);
      } catch (error) {
        console.error('Failed to load matches', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Live': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 animate-pulse"/> LIVE</span>;
      case 'Upcoming': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> UPCOMING</span>;
      case 'Completed': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> COMPLETED</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        title="Match Operations Center" 
        subtitle="Select a match to enter the live command and control workspace." 
      />

      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-500 font-bold animate-pulse">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.length === 0 ? (
            <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 font-medium">
              No matches found.
            </div>
          ) : (
            matches.map(match => (
              <div key={match._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-6">
                  {getStatusBadge(match.status)}
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(match.matchDate).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-1">{match.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-6 flex-grow">{match.stadium?.name || 'Unknown Stadium'}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-50">
                   <div>
                     <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kickoff</div>
                     <div className="font-bold text-gray-900">{match.kickoffTime || '--:--'}</div>
                   </div>
                   <div>
                     <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Stage</div>
                     <div className="font-bold text-gray-900">{match.stage || 'Group Stage'}</div>
                   </div>
                </div>

                <button 
                  onClick={() => navigate(`/${user.role.toLowerCase()}/operations/${match._id}`)}
                  className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${
                    match.status === 'Live' ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' : 
                    match.status === 'Upcoming' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' :
                    'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {match.status === 'Completed' ? 'View Operations Replay' : 'Enter Command Center'}
                  {match.status === 'Live' ? <Activity className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MatchOperationsSelect;
