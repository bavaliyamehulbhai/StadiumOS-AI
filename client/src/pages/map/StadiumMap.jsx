import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MapCore from '@/components/map/MapCore';
import SearchBar from '@/components/map/SearchBar';
import FilterPanel from '@/components/map/FilterPanel';
import MapLegend from '@/components/map/Legend';
import CurrentLocation from '@/components/map/CurrentLocation';
import RoutePanel from '@/components/navigation/RoutePanel';
import RouteInstructions from '@/components/navigation/RouteInstructions';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useEmergency } from '@/context/EmergencyContext';
import { useSocket } from '@/socket/hooks/useSocket';
import { Layers, Map as MapIcon, Users, AlertTriangle, ShieldCheck, Car, Bot } from 'lucide-react';

const StadiumMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCrisisMode, crisisData } = useEmergency();
  const { socket } = useSocket();
  
  const [stadium, setStadium] = useState(null);
  const [pois, setPois] = useState([]);
  const [liveData, setLiveData] = useState(null);
  const [operationsMode, setOperationsMode] = useState('All');
  
  // Initialize filter from URL if present (e.g., ?filter=FoodCourt)
  const [activeFilters, setActiveFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    return filter ? [filter] : [];
  });
  const [loading, setLoading] = useState(true);

  // Navigation State
  const [navigationDest, setNavigationDest] = useState(null);
  const [navigationRoutes, setNavigationRoutes] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState('Fastest');
  const [isNavigating, setIsNavigating] = useState(false);

  // Default coordinate if no stadium selected (center of Qatar)
  const defaultCenter = [25.3548, 51.1839];
  const center = stadium?.latitude && stadium?.longitude 
    ? [stadium.latitude, stadium.longitude] 
    : defaultCenter;

  const zoom = stadium?.zoom || 11;

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        if (id) {
          // Fetch specific stadium and its POIs
          const [stadiumRes, poiRes] = await Promise.all([
            api.get(`/maps/stadium/${id}`),
            api.get(`/maps/stadium/${id}/pois`)
          ]);
          setStadium(stadiumRes.data.data);
          setPois(poiRes.data.data);
        } else {
          // General map view (just all stadiums)
          const res = await api.get('/maps/stadiums');
          // For a general view, we can treat stadiums as the main points
          setPois(res.data.data.map(s => ({
            ...s,
            type: 'Stadium',
            icon: '🏟',
            status: s.status
          })));
        }
      } catch (error) {
        toast.error('Failed to load map data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, [id]);

  // Live Map Socket Engine (Phase 7)
  useEffect(() => {
    if (socket) {
      socket.on('map:live:updated', (data) => {
        // console.log('Received map:live:updated payload:', data);
        setLiveData(prev => {
          // If we have orchestrated AI overlays, preserve them
          const preservedOverlays = prev?.orchestratedAiOverlays || [];
          return {
            ...data,
            orchestratedAiOverlays: preservedOverlays,
            aiOverlays: [...(data.aiOverlays || []), ...preservedOverlays]
          };
        });
      });

      // Phase 8: Listen for proactive Orchestrator recommendations
      socket.on('ai:recommendation', (insight) => {
        if (insight.type === 'Crowd' || insight.type === 'Incident') {
          // Convert insight to an overlay marker
          const newOverlay = {
            id: `orchestrated-${Date.now()}`,
            latitude: insight.location?.coordinates?.[1] || 25.3548 + (Math.random() - 0.5) * 0.01,
            longitude: insight.location?.coordinates?.[0] || 51.1839 + (Math.random() - 0.5) * 0.01,
            type: insight.type,
            message: insight.recommendation || insight.summary,
            priority: insight.severity || 'High'
          };
          
          setLiveData(prev => {
            if (!prev) return prev;
            const updatedOrchestrated = [newOverlay, ...(prev.orchestratedAiOverlays || [])].slice(0, 5); // Keep last 5
            return {
              ...prev,
              orchestratedAiOverlays: updatedOrchestrated,
              aiOverlays: [...(prev.aiOverlays || []), ...updatedOrchestrated]
            };
          });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('map:live:updated');
        socket.off('ai:recommendation');
      }
    };
  }, [socket]);

  const handleFilterChange = (type) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredPois = pois.filter(poi => 
    activeFilters.length === 0 || activeFilters.includes(poi.type)
  );

  const handleNavigate = async (destinationPoi) => {
    try {
      setIsNavigating(true);
      setNavigationDest(destinationPoi);
      
      // Close leaflet popups to declutter UI during navigation
      const closeBtn = document.querySelector('.leaflet-popup-close-button');
      if (closeBtn) closeBtn.click();
      
      // For the demo, we spawn the user 300 meters away from the destination
      // so it simulates an indoor/stadium walk instead of a cross-country walk!
      const mockUserLat = destinationPoi.latitude - 0.002;
      const mockUserLng = destinationPoi.longitude - 0.002;

      const res = await api.get(`/navigation/options?startLat=${mockUserLat}&startLng=${mockUserLng}&poiId=${destinationPoi._id}`);
      
      setNavigationRoutes(res.data.data.routes);
      setActiveRouteType('Fastest');
    } catch (error) {
      toast.error('Failed to generate routes');
      setNavigationDest(null);
    } finally {
      setIsNavigating(false);
    }
  };

  // Auto-navigate effect based on URL ?search= param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTarget = params.get('search');
    
    if (searchTarget && pois.length > 0 && !navigationRoutes && !isNavigating) {
      const targetPoi = pois.find(p => p.name.toLowerCase().includes(searchTarget.toLowerCase()));
      if (targetPoi) {
        handleNavigate(targetPoi);
      }
    }
  }, [location.search, pois, navigationRoutes, isNavigating]);

  // Emergency Mode Override
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('emergency') === 'true' && crisisData && !isNavigating) {
      const fetchEmergencyRoute = async () => {
        try {
          setIsNavigating(true);
          // Fake starting coordinates for demo
          const startLat = 25.4200;
          const startLng = 51.4900;
          
          const destType = crisisData.type === 'Medical' ? 'Medical' : 'Exit';

          const res = await api.get(`/emergency/route?startLat=${startLat}&startLng=${startLng}&emergencyLat=${crisisData.location.latitude}&emergencyLng=${crisisData.location.longitude}&destinationType=${destType}`);
          
          const safeRouteData = res.data.data;
          
          setNavigationRoutes({
            Fastest: {
              type: 'Emergency',
              duration: safeRouteData.eta,
              distance: safeRouteData.distance,
              steps: [
                { instruction: `Proceed safely to ${safeRouteData.destination}`, distance: safeRouteData.distance }
              ],
              path: safeRouteData.route.map(pt => [pt.lat, pt.lng])
            }
          });
          setActiveRouteType('Fastest');
          setNavigationDest({ 
            name: safeRouteData.destination, 
            type: 'Emergency Point',
            latitude: safeRouteData.route[safeRouteData.route.length - 1].lat,
            longitude: safeRouteData.route[safeRouteData.route.length - 1].lng 
          });
        } catch (error) {
          toast.error('Failed to plot emergency route.');
        } finally {
          setIsNavigating(false);
        }
      };
      fetchEmergencyRoute();
    }
  }, [location.search, crisisData]);

  const activeRoute = navigationRoutes ? navigationRoutes[activeRouteType] : null;

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-100 flex flex-col">
      {/* Header bar on top of map */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex gap-3 flex-col sm:flex-row w-full max-w-md">
          {id && (
            <Button 
              variant="default"
              className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <SearchBar onSelect={(poi) => console.log('Selected:', poi)} />
        </div>
        
        <div className="pointer-events-auto flex flex-col items-end gap-3 hidden md:flex">
          <CurrentLocation />
          
          {/* Operations Mode Selector (Top Right, inside header for guaranteed z-index) */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden pointer-events-auto mt-2">
            {[
              { id: 'All', icon: <Layers size={18} />, label: 'All Layers' },
              { id: 'Crowd', icon: <Users size={18} />, label: 'Crowd' },
              { id: 'Incident', icon: <AlertTriangle size={18} />, label: 'Incidents' },
              { id: 'Volunteer', icon: <ShieldCheck size={18} />, label: 'Volunteers' },
              { id: 'Parking', icon: <Car size={18} />, label: 'Parking' },
              { id: 'AI', icon: <Bot size={18} />, label: 'AI' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setOperationsMode(mode.id)}
                className={`flex items-center gap-2 p-3 w-40 transition-colors border-b last:border-b-0 ${operationsMode === mode.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {mode.icon}
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Component */}
      <div className="flex-1 w-full h-full relative z-0">
        {!loading && (
          <>
          <MapCore 
            center={center} 
            zoom={zoom} 
            stadium={stadium} 
            pois={filteredPois} 
            route={activeRoute}
            onNavigate={handleNavigate}
            liveData={liveData}
            operationsMode={operationsMode}
          />
          </>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-[500]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Bottom Floating Panels */}
      <div className="absolute bottom-6 left-4 z-[400] pointer-events-auto">
        <FilterPanel 
          activeFilters={activeFilters} 
          onChange={handleFilterChange} 
        />
      </div>

      <div className="absolute bottom-6 right-4 z-[400] pointer-events-auto hidden md:block">
        <MapLegend />
      </div>

      {/* Navigation Overlay */}
      {navigationDest && navigationRoutes && (
        <div className="absolute top-20 right-4 z-[500] pointer-events-auto flex flex-col items-end">
          <RoutePanel 
            destination={navigationDest}
            routes={navigationRoutes}
            activeRouteType={activeRouteType}
            onSelectRoute={setActiveRouteType}
            onClose={() => {
              setNavigationDest(null);
              setNavigationRoutes(null);
            }}
          />
          <RouteInstructions activeRoute={activeRoute} />
        </div>
      )}
    </div>
  );
};

export default StadiumMap;
