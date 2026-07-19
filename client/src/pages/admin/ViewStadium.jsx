import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Car, DoorOpen, Coffee, Cross, Search, Accessibility } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';
import toast from 'react-hot-toast';

const ViewStadium = () => {
  const { id } = useParams();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const { data } = await api.get(`/stadiums/${id}`);
        setStadium(data.data);
      } catch (error) {
        toast.error('Failed to load stadium details');
      } finally {
        setLoading(false);
      }
    };
    fetchStadium();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full col-span-2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!stadium) {
    return <div className="text-center py-12 text-gray-500">Stadium not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link to="/admin/stadiums">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Stadiums
          </Button>
        </Link>
        <Link to={`/admin/stadiums/edit/${stadium._id}`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Edit Stadium
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
        {stadium.image ? (
          <img src={stadium.image} alt={stadium.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${stadium.status === 'Active' ? 'bg-green-500 text-white' : 
                stadium.status === 'Maintenance' ? 'bg-amber-500 text-white' : 
                'bg-red-500 text-white'}
            `}>
              {stadium.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{stadium.name}</h1>
          <div className="flex items-center text-gray-300 text-sm md:text-base">
            <MapPin className="w-4 h-4 mr-1.5" />
            {stadium.address}, {stadium.city}, {stadium.country}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Description */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stadium Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                {stadium.description || 'No description provided for this stadium. Please edit the stadium to add details about its history, architecture, or significance to the tournament.'}
              </p>
            </CardContent>
          </Card>

          <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">Key Facilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FacilityStat icon={<Users />} label="Capacity" value={stadium.capacity.toLocaleString()} color="text-blue-600" bg="bg-blue-50" />
            <FacilityStat icon={<Car />} label="Parking" value={stadium.parkingCapacity.toLocaleString()} color="text-amber-600" bg="bg-amber-50" />
            <FacilityStat icon={<DoorOpen />} label="Gates" value={stadium.gates} color="text-emerald-600" bg="bg-emerald-50" />
            <FacilityStat icon={<Coffee />} label="Food Courts" value={stadium.foodCourts} color="text-orange-600" bg="bg-orange-50" />
            <FacilityStat icon={<Cross />} label="Medical Rooms" value={stadium.medicalRooms} color="text-red-600" bg="bg-red-50" />
            <FacilityStat icon={<Accessibility />} label="Accessibility" value={stadium.wheelchairAccess ? 'Yes' : 'No'} color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>

        {/* Right Column: Upcoming Matches (Mocked for now) */}
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-100 h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Matches</h3>
              
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Match integration pending.</p>
                <p className="text-xs text-gray-400 mt-1">Will display matches assigned to this venue.</p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

const FacilityStat = ({ icon, label, value, color, bg }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
    <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center mb-2`}>
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <span className="text-xl font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
  </div>
);

export default ViewStadium;
