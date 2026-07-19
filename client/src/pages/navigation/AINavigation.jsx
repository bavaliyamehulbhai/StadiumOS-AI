import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FloatingAIButton from '../../components/navigation-ai/FloatingAIButton';
import BottomSheet from '../../components/navigation-ai/BottomSheet';
import AIRecommendationCard from '../../components/navigation-ai/AIRecommendationCard';
import RouteComparison from '../../components/navigation-ai/RouteComparison';
import RouteSummaryPanel from '../../components/navigation-ai/RouteSummaryPanel';
import RouteWarningBanner from '../../components/navigation-ai/RouteWarningBanner';
import ParkingSuggestionCard from '../../components/navigation-ai/ParkingSuggestionCard';
import NavigationActionButtons from '../../components/navigation-ai/NavigationActionButtons';
import { toast } from 'react-hot-toast';
import { Map, Navigation2 } from 'lucide-react';
import api from '../../services/api'; // assuming standard api setup

const AINavigation = () => {
  const { user } = useAuth();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [destination, setDestination] = useState('');

  // Auto-fetch if destination is set
  const fetchNavigation = async (dest) => {
    setIsLoading(true);
    setSheetOpen(true);
    try {
      // Mock API call if real one isn't hooked up yet
      const response = await api.post('/ai/navigation', { destination: dest });
      if (response.data && response.data.success) {
        setAiResponse(response.data.data);
        const primaryRoute = response.data.data.recommendations?.find(r => r.isPrimary) || response.data.data.recommendations?.[0];
        setSelectedRoute(primaryRoute);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to get AI navigation. Showing mock data.');
      // Mock Data for MVP demo
      const mockData = {
        destination: dest || 'Gate C',
        recommendations: [
          { routeName: 'Blue Route (Fastest)', eta: '4 min', crowdLevel: 'Low', reason: 'Fastest and least crowded. Direct path to Gate C.', isPrimary: true, warnings: [] },
          { routeName: 'Red Route (Balanced)', eta: '6 min', crowdLevel: 'Medium', reason: 'Slightly longer, but avoids the main concourse.', isPrimary: false, warnings: ['Keep left near food court'] },
          { routeName: 'Accessible Route', eta: '8 min', crowdLevel: 'Low', reason: 'Uses ramps and avoids stairs.', isPrimary: false, warnings: [] },
        ]
      };
      setAiResponse(mockData);
      setSelectedRoute(mockData.recommendations[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleStartNav = () => {
    if (selectedRoute && aiResponse?.destination) {
      toast.success(`Starting navigation on ${selectedRoute.routeName}`);
      setSheetOpen(false);
      // Hook into Leaflet Map by redirecting to the map page with the AI destination
      navigate(`/map?search=${encodeURIComponent(aiResponse.destination)}`);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-100 flex flex-col">
      {/* 
        Ideally, you'd render your Leaflet Map here.
        For this component, we're focusing on the AI UI Overlay. 
      */}
      <div className="flex-1 flex items-center justify-center bg-blue-50/50">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-sm backdrop-blur-sm max-w-md">
          <Map size={48} className="mx-auto text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Stadium Map</h2>
          <p className="text-gray-500 mb-6">Map integration area. Select your destination below or click the AI button to get smart routing.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Gate C, Food Court..." 
              className="flex-1 p-3 border rounded-xl"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button 
              onClick={() => fetchNavigation(destination)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <FloatingAIButton onClick={() => fetchNavigation(destination)} />

      <BottomSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} title="AI Navigation Copilot">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium animate-pulse">AI is analyzing crowd & parking data...</p>
          </div>
        ) : aiResponse ? (
          <div>
            <RouteSummaryPanel destination={aiResponse.destination} />

            {/* If parking info exists in context, we could show it. Using mock for now */}
            {user?.role === 'Fan' && (
              <ParkingSuggestionCard lot="Lot P2" spot="B-42" />
            )}

            {aiResponse.generalWarnings && aiResponse.generalWarnings.length > 0 && (
              <RouteWarningBanner message={aiResponse.generalWarnings[0]} />
            )}

            <h3 className="text-lg font-semibold mb-3 mt-4">Recommended Route</h3>
            {aiResponse.recommendations?.filter(r => r.isPrimary).map((rec, i) => (
              <AIRecommendationCard key={i} recommendation={rec} onSelect={setSelectedRoute} />
            ))}

            <RouteComparison 
              recommendations={aiResponse.recommendations} 
              onSelectRoute={setSelectedRoute} 
            />

            <NavigationActionButtons 
              onStart={handleStartNav} 
              onCancel={() => setSheetOpen(false)} 
            />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Enter a destination to get AI recommendations.
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default AINavigation;
