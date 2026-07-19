import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import TransportCard from '@/components/transport/TransportCard';
import TransportBookingModal from '@/components/transport/TransportBookingModal';
import ParkingCard from '@/components/parking/ParkingCard';
import ReservationModal from '@/components/parking/ReservationModal';
import api from '@/services/api';
import toast from 'react-hot-toast';

const Transportation = () => {
  const [activeTab, setActiveTab] = useState('transport'); // 'transport' or 'parking'
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState('');
  
  const [transportOptions, setTransportOptions] = useState([]);
  const [parkingZones, setParkingZones] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);

  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [bookedTransports, setBookedTransports] = useState({});

  // Load stadiums on mount
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

  // Load data when stadium changes
  useEffect(() => {
    if (!selectedStadium) return;

    const fetchData = async () => {
      try {
        const [transRes, parkRes, resRes] = await Promise.all([
          api.get(`/transport/recommendations/${selectedStadium}`),
          api.get(`/parking/${selectedStadium}`),
          api.get(`/parking/my-reservations`)
        ]);
        
        setTransportOptions(transRes.data.data);
        setParkingZones(parkRes.data.data);
        setMyReservations(resRes.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedStadium]);

  const handleReserve = async (parkingId, vehicleNumber) => {
    try {
      await api.post('/parking/reserve', {
        parkingZoneId: parkingId,
        vehicleNumber
      });
      toast.success('Parking Spot Reserved!');
      setIsModalOpen(false);
      
      // Refresh parking data
      const [parkRes, resRes] = await Promise.all([
        api.get(`/parking/${selectedStadium}`),
        api.get(`/parking/my-reservations`)
      ]);
      setParkingZones(parkRes.data.data);
      setMyReservations(resRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reserve parking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mobility & Parking</h1>
          <p className="text-gray-500 mt-1">Find the best way to reach your destination</p>
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

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('transport')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'transport' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Public Transport
        </button>
        <button
          onClick={() => setActiveTab('parking')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'parking' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Parking Zones
        </button>
      </div>

      {activeTab === 'transport' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Smart Route Recommendations</h2>
          {transportOptions.map(t => (
            <TransportCard 
              key={t._id} 
              transport={t} 
              isBooked={bookedTransports[t._id]}
              onAction={() => {
                const isBooked = bookedTransports[t._id];
                if (t.type === 'Walking') {
                  window.location.href = '/map';
                } else if (isBooked && (t.type === 'Taxi' || t.type === 'Ride Share')) {
                  window.location.href = `/map?track=${t._id}`;
                } else if (isBooked) {
                  toast.success('Your E-Ticket is active. Scan it at the station!');
                } else {
                  setSelectedTransport(t);
                  setIsTransportModalOpen(true);
                }
              }}
            />
          ))}
        </div>
      )}

      {activeTab === 'parking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {parkingZones.map(p => {
            const isReserved = myReservations.some(r => r.parkingZone._id === p._id && r.status === 'Reserved');
            return (
              <ParkingCard 
                key={p._id} 
                parking={p} 
                isReserved={isReserved}
                onReserve={(parking) => {
                  setSelectedParking(parking);
                  setIsModalOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parking={selectedParking}
        onConfirm={handleReserve}
      />

      <TransportBookingModal 
        isOpen={isTransportModalOpen}
        onClose={() => setIsTransportModalOpen(false)}
        transport={selectedTransport}
        onConfirm={() => {
          setBookedTransports(prev => ({...prev, [selectedTransport._id]: true}));
        }}
      />
    </div>
  );
};

export default Transportation;
