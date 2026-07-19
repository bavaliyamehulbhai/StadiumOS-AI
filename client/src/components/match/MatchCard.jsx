import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchStatusBadge from './MatchStatusBadge';

const MatchCard = ({ match }) => {
  return (
    <Link to={`/admin/matches/${match._id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all border-gray-100 group">
        <div className="bg-slate-900 p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <MatchStatusBadge status={match.status} />
          </div>
          
          <div className="text-center pt-4 pb-2 relative z-10">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">{match.stage}</span>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="text-xl font-bold w-1/3 text-right truncate">{match.teamA}</div>
              <div className="text-gray-500 font-serif italic text-sm">vs</div>
              <div className="text-xl font-bold w-1/3 text-left truncate">{match.teamB}</div>
            </div>
            <div className="text-gray-400 text-xs mt-3">{match.title}</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
        </div>
        
        <CardContent className="p-4 bg-white">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>{new Date(match.matchDate).toLocaleDateString()} &bull; {match.kickoffTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-amber-500" />
              <span className="truncate">{match.stadium?.name || 'Venue TBD'}</span>
            </div>
            <div className="flex items-center mt-2 pt-2 border-t border-gray-50">
              <Users className="w-4 h-4 mr-2 text-emerald-500" />
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span>Booked: {match.bookedSeats?.toLocaleString()}</span>
                  <span>Total: {match.totalSeats?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${(match.bookedSeats / match.totalSeats) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;
