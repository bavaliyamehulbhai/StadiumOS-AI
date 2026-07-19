import React, { useState, useEffect } from 'react';
import { Star, LogIn, Coffee, MapPin, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const SmartCrowdRecommendations = () => {
  const [crowdData, setCrowdData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrowd = async () => {
      try {
        const res = await api.get('/crowd');
        setCrowdData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch crowd data for recommendations', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCrowd();
    const interval = setInterval(fetchCrowd, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || crowdData.length === 0) return null;

  // Process data for recommendations
  const gates = crowdData.filter(c => c.category === 'Gate');
  const food = crowdData.filter(c => c.category === 'Food');
  const parking = crowdData.filter(c => c.category === 'Parking');

  // Best Gate (lowest wait time)
  const bestGate = gates.reduce((prev, curr) => (prev.averageWaitTime < curr.averageWaitTime) ? prev : curr, gates[0]);
  
  // Worst Gate
  const worstGate = gates.reduce((prev, curr) => (prev.densityPercentage > curr.densityPercentage) ? prev : curr, gates[0]);

  // Least crowded food
  const bestFood = food.reduce((prev, curr) => (prev.densityPercentage < curr.densityPercentage) ? prev : curr, food[0]);

  // Best Parking
  const bestParking = parking.reduce((prev, curr) => (prev.densityPercentage < curr.densityPercentage) ? prev : curr, parking[0]);

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-6">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-200 font-medium mb-2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span>Smart Crowd Recommendations</span>
            </div>
            <h3 className="text-2xl font-bold">Beat the crowds.</h3>
            <p className="text-purple-100 max-w-xl mt-1 text-sm">
              AI-driven insights based on live stadium density.
            </p>
          </div>
          <Link to="/map" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            Live Map
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recommended Gate */}
          {bestGate && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-200">
                <LogIn className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Fastest Entry</span>
              </div>
              <p className="font-bold text-lg">{bestGate.zone}</p>
              <div className="flex justify-between items-center mt-auto pt-2">
                <span className="text-xs text-green-300">{bestGate.densityPercentage}% full</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">~{bestGate.averageWaitTime} min wait</span>
              </div>
            </div>
          )}

          {/* Recommended Food */}
          {bestFood && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-200">
                <Coffee className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Least Crowded Food</span>
              </div>
              <p className="font-bold text-lg">{bestFood.zone}</p>
              <div className="mt-auto pt-2">
                <span className="text-xs text-green-300">{bestFood.densityPercentage}% full</span>
              </div>
            </div>
          )}

          {/* Recommended Parking */}
          {bestParking && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-200">
                <MapPin className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Best Parking</span>
              </div>
              <p className="font-bold text-lg">{bestParking.zone}</p>
              <div className="mt-auto pt-2">
                <span className="text-xs text-green-300">{bestParking.densityPercentage}% occupied</span>
              </div>
            </div>
          )}

          {/* Avoid Warning */}
          {worstGate && worstGate.densityPercentage > 70 && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-200">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">Avoid High Traffic</span>
              </div>
              <p className="font-bold text-lg">{worstGate.zone}</p>
              <div className="flex justify-between items-center mt-auto pt-2">
                <span className="text-xs text-red-300">{worstGate.densityPercentage}% full</span>
                <span className="text-xs bg-red-900/40 text-red-200 px-2 py-1 rounded-full">~{worstGate.averageWaitTime} min wait</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartCrowdRecommendations;
