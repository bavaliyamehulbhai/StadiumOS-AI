import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, DoorOpen, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const StadiumCard = ({ stadium }) => {
  return (
    <Link to={`/admin/stadiums/${stadium._id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all border-gray-100 group">
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          {stadium.image ? (
            <img 
              src={stadium.image} 
              alt={stadium.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
              <span className="font-bold text-4xl">{stadium.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md
              ${stadium.status === 'Active' ? 'bg-green-500/90 text-white' : 
                stadium.status === 'Maintenance' ? 'bg-amber-500/90 text-white' : 
                'bg-red-500/90 text-white'}
            `}>
              {stadium.status}
            </span>
          </div>
        </div>
        
        <CardContent className="p-5">
          <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{stadium.name}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span className="truncate">{stadium.city}, {stadium.country}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">{stadium.capacity.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Car className="w-4 h-4 mr-2 text-amber-500" />
              <span className="font-medium">{stadium.parkingCapacity.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DoorOpen className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="font-medium">{stadium.gates} Gates</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StadiumCard;
