import React, { useState } from 'react';
import api from '../../services/api';
import { Play, Square, ShieldAlert } from 'lucide-react';

const MatchLifecycleControls = ({ match, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (endpoint) => {
    if (endpoint === 'end' && !window.confirm('Are you sure you want to end match operations?')) return;
    setLoading(true);
    try {
      await api.post(`/match-operations/${match._id}/${endpoint}`);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const isLive = match.status === 'Live';
  const isEmergency = match.commandMode === 'EMERGENCY';
  const isCompleted = match.status === 'Completed';

  if (isCompleted) {
    return (
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg opacity-50 cursor-not-allowed">Operations Ended</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isEmergency ? (
        <button 
          onClick={() => handleAction('resolve-emergency')}
          disabled={loading}
          className="px-4 py-2 bg-white text-red-600 font-black rounded-lg shadow-sm hover:bg-red-50 flex items-center gap-2"
        >
          Resolve Emergency
        </button>
      ) : (
        <button 
          onClick={() => handleAction('emergency')}
          disabled={loading || !isLive}
          className="px-4 py-2 bg-red-600 text-white font-black rounded-lg shadow-sm hover:bg-red-700 flex items-center gap-2 border border-red-500 disabled:opacity-50"
        >
          <ShieldAlert className="w-4 h-4" />
          Activate Emergency
        </button>
      )}

      {!isLive ? (
        <button 
          onClick={() => handleAction('start')}
          disabled={loading}
          className="px-5 py-2 bg-green-500 text-white font-black rounded-lg shadow-sm hover:bg-green-600 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Operations
        </button>
      ) : (
        <button 
          onClick={() => handleAction('end')}
          disabled={loading || isEmergency}
          className="px-5 py-2 bg-gray-700 text-white font-black rounded-lg shadow-sm hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50"
        >
          <Square className="w-4 h-4" />
          End Operations
        </button>
      )}
    </div>
  );
};

export default MatchLifecycleControls;
