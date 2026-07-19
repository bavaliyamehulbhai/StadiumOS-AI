import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Ticket, Cloud, Flag, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MatchStatusBadge from '@/components/match/MatchStatusBadge';
import api from '@/services/api';
import toast from 'react-hot-toast';

const ViewMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data } = await api.get(`/matches/${id}`);
        setMatch(data.data);
      } catch (error) {
        toast.error('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(`/matches/${id}/status`, { status: newStatus });
      setMatch(data.data);
      toast.success(`Match status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!match) return <div className="text-center py-12 text-gray-500">Match not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link to="/admin/matches">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Matches
          </Button>
        </Link>
        <div className="flex gap-2">
          {match.status !== 'Live' && (
            <Link to={`/admin/matches/edit/${match._id}`}>
              <Button variant="outline">Edit Match</Button>
            </Link>
          )}
          {/* Quick Status Toggles for Admin */}
          {match.status === 'Upcoming' && (
            <Button onClick={() => handleStatusChange('Live')} disabled={updating} className="bg-green-600 hover:bg-green-700">Start Match</Button>
          )}
          {match.status === 'Live' && (
            <Button onClick={() => handleStatusChange('Completed')} disabled={updating} className="bg-gray-800 hover:bg-gray-900 text-white">End Match</Button>
          )}
        </div>
      </div>

      {/* Hero Scoreboard */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-md flex flex-col items-center justify-center border-b-4 border-blue-600">
        <div className="absolute top-4 left-4">
          <MatchStatusBadge status={match.status} />
        </div>
        <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/40 px-3 py-1 rounded-full backdrop-blur-sm">
          {match.stage}
        </div>
        
        <div className="text-gray-400 text-sm mb-4 uppercase tracking-widest">{match.title}</div>
        
        <div className="flex items-center justify-center gap-6 md:gap-12 w-full px-4 relative z-10">
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 text-2xl md:text-4xl shadow-inner border border-white/20">
              🛡️
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center">{match.teamA}</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-gray-500 font-serif italic text-xl md:text-3xl mb-4">VS</div>
            {match.status === 'Live' && (
              <span className="animate-pulse bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold">LIVE</span>
            )}
          </div>
          
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 text-2xl md:text-4xl shadow-inner border border-white/20">
              🛡️
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center">{match.teamB}</h2>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/60 to-slate-900 -z-10 pointer-events-none" />
      </div>

      {/* TOP 400 TIP: Match Timeline */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-blue-50/50 px-6 py-4 border-b border-gray-100 flex items-center">
          <h3 className="font-bold text-gray-900 text-lg">Match Timeline (Operations)</h3>
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden md:block z-0" />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 relative z-10">
              
              <TimelineStep 
                title="Scheduled" 
                time={new Date(match.matchDate).toLocaleDateString()} 
                active={true} 
                color="bg-blue-500" 
              />
              <TimelineStep 
                title="Gates Open" 
                time="2 hrs before" 
                active={match.status !== 'Upcoming'} 
                color="bg-amber-500" 
              />
              <TimelineStep 
                title="Kickoff" 
                time={match.kickoffTime} 
                active={match.status === 'Live' || match.status === 'Completed'} 
                color="bg-green-500" 
                pulse={match.status === 'Live'}
              />
              <TimelineStep 
                title="Halftime" 
                time="TBD" 
                active={match.status === 'Completed'} 
                color="bg-purple-500" 
              />
              <TimelineStep 
                title="Full Time" 
                time={match.endTime || 'TBD'} 
                active={match.status === 'Completed'} 
                color="bg-gray-800" 
              />
              
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logistics */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Logistics & Ticketing</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{match.stadium?.name || 'TBD'}</p>
                  <p className="text-xs text-gray-500">{match.stadium?.address}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Ticket className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Price: ${match.ticketPrice}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Booked: {match.bookedSeats?.toLocaleString()} / {match.totalSeats?.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(match.bookedSeats / match.totalSeats) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extras */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Additional Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Flag className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700"><strong>Referee:</strong> {match.referee || 'Not Assigned'}</span>
              </div>
              <div className="flex items-center">
                <Cloud className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700"><strong>Weather:</strong> {match.weather || 'Unknown'}</span>
              </div>
              {match.description && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 italic">
                  "{match.description}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TimelineStep = ({ title, time, active, color, pulse }) => (
  <div className={`flex flex-col items-center text-center transition-opacity ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className="bg-white p-1 rounded-full relative z-10 mb-2 md:mb-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${color} ${pulse ? 'animate-pulse ring-4 ring-green-100' : ''}`}>
        {active ? '✓' : '•'}
      </div>
    </div>
    <div className="font-bold text-sm text-gray-900">{title}</div>
    <div className="text-xs text-gray-500 font-medium mt-0.5">{time}</div>
  </div>
);

export default ViewMatch;
