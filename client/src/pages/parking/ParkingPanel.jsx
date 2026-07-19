import React, { useState, useEffect } from 'react';
import { Car, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';
import { useSocket } from '@/socket/hooks/useSocket';
import toast from 'react-hot-toast';

const ParkingPanel = () => {
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState('');
  const [parkingZones, setParkingZones] = useState([]);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await api.get('/maps/stadiums');
        setStadiums(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedStadium(res.data.data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load stadiums');
      }
    };
    fetchStadiums();
  }, []);

  const { socket } = useSocket();

  const fetchParking = async () => {
    try {
      const res = await api.get(`/parking/${selectedStadium}`);
      setParkingZones(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedStadium) return;
    fetchParking();
  }, [selectedStadium]);

  useEffect(() => {
    if (socket) {
      socket.on('parking:updated', (updatedZones) => {
        // Refetch for simplicity, or we could manually merge the zones.
        if (selectedStadium) {
          fetchParking();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('parking:updated');
      }
    };
  }, [socket, selectedStadium]);

  const totalCapacity = parkingZones.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalOccupied = parkingZones.reduce((acc, curr) => acc + curr.occupied, 0);
  const totalPercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parking Operations</h1>
          <p className="text-gray-500">Live monitoring of all parking facilities</p>
        </div>
        <select 
          className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm"
          value={selectedStadium}
          onChange={(e) => setSelectedStadium(e.target.value)}
        >
          {stadiums.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-gray-500 mb-1">Total Capacity</div>
          <div className="text-3xl font-bold">{totalCapacity.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-gray-500 mb-1">Total Occupied</div>
          <div className="text-3xl font-bold text-blue-600">{totalOccupied.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-gray-500 mb-1">Overall Occupancy</div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold">{totalPercent}%</div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${totalPercent > 85 ? 'bg-red-500' : totalPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${totalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Zone</th>
              <th className="px-6 py-4 font-medium text-gray-900">Type</th>
              <th className="px-6 py-4 font-medium text-gray-900">Occupancy</th>
              <th className="px-6 py-4 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {parkingZones.map(zone => {
              const percent = Math.round((zone.occupied / zone.capacity) * 100);
              return (
                <tr key={zone._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" /> {zone.zone}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{zone.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12">{percent}%</span>
                      <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                        <div 
                          className={`h-1.5 rounded-full ${percent > 85 ? 'bg-red-500' : percent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      zone.status === 'Full' || zone.status === 'Closed' ? 'bg-red-100 text-red-800' :
                      zone.status === 'Almost Full' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkingPanel;
