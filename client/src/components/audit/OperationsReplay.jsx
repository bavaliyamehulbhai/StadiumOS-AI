import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const OperationsReplay = ({ logs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef(null);

  // Filter logs to only those that have location/map relevance (Incidents, Crowd, AI)
  const mapLogs = logs.filter(l => 
    l.module === 'Incident' || 
    l.module === 'Crowd' || 
    (l.module === 'AI Engine' && l.metadata?.recommendedActions)
  ).reverse(); // Oldest first for playback

  const currentEvent = mapLogs[currentIndex];
  
  // Accumulated events up to current index
  const activeEvents = mapLogs.slice(0, currentIndex + 1);

  useEffect(() => {
    if (isPlaying && currentIndex < mapLogs.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2000 / playbackSpeed);
    } else if (currentIndex >= mapLogs.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentIndex, playbackSpeed, mapLogs.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => { setIsPlaying(false); setCurrentIndex(0); };

  if (mapLogs.length === 0) {
    return <div className="p-8 text-center text-gray-500">No mappable events found for replay.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[500px]">
      
      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[25.3548, 51.1839]} // Lusail Stadium default
          zoom={16} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          {activeEvents.map((event, idx) => {
            // Very basic mock coordinates since AuditLogs don't store strict lat/long yet
            // In a real system, entityId would be populated with coordinates.
            const lat = 25.3548 + (Math.random() - 0.5) * 0.005;
            const lng = 51.1839 + (Math.random() - 0.5) * 0.005;

            return (
              <Circle
                key={event._id || idx}
                center={[lat, lng]}
                radius={30}
                pathOptions={{ 
                  color: event.severity === 'CRITICAL' ? 'red' : 'blue',
                  fillColor: event.severity === 'CRITICAL' ? 'red' : 'blue',
                  fillOpacity: idx === currentIndex ? 0.8 : 0.2 // Highlight current
                }}
              >
                <Popup>
                  <p className="font-bold text-xs">{event.action}</p>
                  <p className="text-[10px] text-gray-500">{new Date(event.createdAt).toLocaleTimeString()}</p>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>

        {/* Current Event Overlay */}
        {currentEvent && (
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-indigo-500 max-w-sm">
            <span className="text-xs font-bold text-indigo-600 mb-1 block">
              {new Date(currentEvent.createdAt).toLocaleTimeString()}
            </span>
            <h3 className="text-sm font-bold text-gray-900">{currentEvent.action}</h3>
            <p className="text-xs text-gray-600 mt-1">Module: {currentEvent.module}</p>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={reset} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
            <Rewind size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-md"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button 
            onClick={() => setPlaybackSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors font-bold text-xs flex items-center gap-1"
          >
            <FastForward size={16} /> {playbackSpeed}x
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 mx-6 relative flex items-center">
          <input 
            type="range" 
            min={0} 
            max={mapLogs.length - 1} 
            value={currentIndex}
            onChange={(e) => {
              setCurrentIndex(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
          {currentIndex + 1} / {mapLogs.length} Events
        </div>
      </div>
    </div>
  );
};

export default OperationsReplay;
