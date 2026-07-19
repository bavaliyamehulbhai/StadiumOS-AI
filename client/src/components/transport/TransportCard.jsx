import React, { useState } from 'react';
import { Bus, Train, Car, Navigation2, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const icons = {
  'Metro': <Train className="w-6 h-6 text-blue-500" />,
  'Bus': <Bus className="w-6 h-6 text-green-500" />,
  'Taxi': <Car className="w-6 h-6 text-yellow-500" />,
  'Ride Share': <Car className="w-6 h-6 text-purple-500" />,
  'Walking': <Navigation2 className="w-6 h-6 text-orange-500" />,
};

const TransportCard = ({ transport, isBooked, onAction }) => {
  const getActionText = () => {
    if (isBooked) return transport.type === 'Taxi' || transport.type === 'Ride Share' ? 'View Live Track' : 'View E-Ticket';
    if (transport.type === 'Walking') return 'Get Directions';
    if (transport.type === 'Metro' || transport.type === 'Bus') return 'Buy Ticket';
    return 'Book Ride';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {icons[transport.type] || <Bus className="w-5 h-5 text-gray-500" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{transport.routeName}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs">{transport.source} → {transport.destination}</p>
          </div>
        </div>
        
        {transport.recommendationTag && (
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full whitespace-nowrap">
            {transport.recommendationTag}
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Estimated Time
          </span>
          <span className="font-medium">{transport.estimatedTime} mins</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Live Status</span>
          <span className={`font-medium ${transport.status === 'Delayed' ? 'text-red-500' : 'text-green-500'}`}>
            {transport.status}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <div className="text-lg font-bold text-gray-900">{transport.fare > 0 ? `₹${transport.fare}` : 'Free'}</div>
        <Button 
          onClick={onAction}
          disabled={!isBooked && transport.status === 'Suspended'}
          variant={transport.type === 'Walking' ? 'outline' : 'default'}
          className={isBooked 
            ? "bg-green-500 hover:bg-green-600 text-white"
            : (transport.type !== 'Walking' ? "bg-blue-600 hover:bg-blue-700 text-white" : "")}
        >
          <span className="flex items-center gap-2">
            {isBooked && transport.type !== 'Taxi' && transport.type !== 'Ride Share' && <CheckCircle2 className="w-4 h-4 mr-1" />}
            {isBooked && (transport.type === 'Taxi' || transport.type === 'Ride Share') && <Navigation2 className="w-4 h-4 mr-1" />}
            {getActionText()}
            {!isBooked && transport.type !== 'Walking' && <ExternalLink className="w-4 h-4" />}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TransportCard;
