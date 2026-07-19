import React from 'react';
import { Car, Navigation, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const ParkingCard = ({ parking, onReserve, isReserved }) => {
  const percentFull = Math.round((parking.occupied / parking.capacity) * 100);
  
  let statusColor = "bg-green-100 text-green-800";
  let progressColor = "bg-green-500";
  
  if (percentFull > 85) {
    statusColor = "bg-red-100 text-red-800";
    progressColor = "bg-red-500";
  } else if (percentFull > 60) {
    statusColor = "bg-yellow-100 text-yellow-800";
    progressColor = "bg-yellow-500";
  }

  const getTypeIcon = () => {
    switch(parking.type) {
      case 'VIP': return <Shield className="w-5 h-5 text-purple-500" />;
      case 'Accessible': return <Users className="w-5 h-5 text-blue-500" />;
      default: return <Car className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Zone {parking.zone}</h3>
            <p className="text-sm text-gray-500">{parking.type} Parking • {parking.walkingDistance} min walk</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {parking.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">Capacity</span>
          <span className="font-medium">{parking.occupied} / {parking.capacity}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`${progressColor} h-2 rounded-full transition-all duration-500`} 
            style={{ width: `${percentFull}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-lg font-bold text-gray-900">₹{parking.price}</div>
        {isReserved ? (
          <Button 
            disabled
            className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 opacity-100"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Reserved
          </Button>
        ) : (
          <Button 
            disabled={parking.status === 'Full' || parking.status === 'Closed'}
            onClick={() => onReserve(parking)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {parking.status === 'Full' ? 'Full' : 'Reserve Spot'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ParkingCard;
