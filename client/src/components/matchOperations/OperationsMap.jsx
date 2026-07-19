import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MapCore from '../map/MapCore';
import { Layers } from 'lucide-react';

const OperationsMap = ({ stadium, matchId }) => {
  const [liveData, setLiveData] = useState({
    incidents: [],
    volunteers: [],
    parking: [],
    heatmap: [] // You'd generate a heatmap from crowd metrics ideally
  });
  const [mode, setMode] = useState('All');

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [incRes, parkRes] = await Promise.all([
          api.get(`/incidents?stadium=${stadium._id}`),
          api.get(`/parking/${stadium._id}`)
        ]);

        setLiveData(prev => ({
          ...prev,
          incidents: incRes.data.data || [],
          parking: parkRes.data.data || [],
        }));
      } catch (error) {
        console.error("Failed to load map data", error);
      }
    };
    fetchLiveData();
    
    // In a real implementation we would listen to sockets here to update liveData points
  }, [matchId, stadium]);

  const center = stadium ? [stadium.latitude || 25.4206, stadium.longitude || 51.4904] : [25.4206, 51.4904];

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-[400] bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
         {['All', 'Incident', 'Crowd', 'Volunteer', 'Parking'].map(m => (
           <button 
             key={m}
             onClick={() => setMode(m)}
             className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${mode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
           >
             {m}
           </button>
         ))}
      </div>
      
      <MapCore 
        center={center} 
        zoom={16} 
        stadium={stadium} 
        liveData={liveData}
        operationsMode={mode}
      />
    </div>
  );
};

export default OperationsMap;
