import React from 'react';
import { Bus, Train, Car, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socket } from '../../socket/socket';
import toast from 'react-hot-toast';

const Transport = () => {
  const handleEmergency = () => {
    toast.success('Emergency alert sent to nearest volunteers and medical team!');
    socket.emit('incident:create', {
      title: 'Fan Emergency Alert',
      priority: 'Critical',
      time: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transport & Emergency</h2>
          <p className="text-muted-foreground mt-1">Live parking statuses and SOS alerts.</p>
        </div>
        <button 
          onClick={handleEmergency}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-pulse"
        >
          SOS EMERGENCY
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex gap-2"><Car size={16}/> Parking A (North)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">Full</div>
            <p className="text-xs text-blue-600/80">0 spaces available</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex gap-2"><Car size={16}/> Parking B (East)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Available</div>
            <p className="text-xs text-green-600/80">452 spaces available</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex gap-2"><Train size={16}/> Metro Station</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">On Time</div>
            <p className="text-xs text-muted-foreground">Next train in 4 mins</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transport;
