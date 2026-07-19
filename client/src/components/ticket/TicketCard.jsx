import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TicketStatusBadge from './TicketStatusBadge';
import { format } from 'date-fns';

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  
  if (!ticket || !ticket.match) return null;

  const isPast = new Date(ticket.match.matchDate) < new Date();
  
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 group ${isPast ? 'opacity-70' : ''}`}
      onClick={() => navigate(`/tickets/${ticket._id}`)}
    >
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 text-white flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg truncate w-48">{ticket.match.title}</h3>
          <p className="text-blue-200 text-sm">{ticket.stadium?.name}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>
      
      <div className="p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-gray-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {format(new Date(ticket.match.matchDate), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {ticket.match.kickoffTime}
          </div>
        </div>
        
        <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Gate</p>
            <p className="font-bold text-gray-900">{ticket.gate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Section</p>
            <p className="font-bold text-gray-900">{ticket.section}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Seat</p>
            <p className="font-bold text-gray-900">{ticket.seatNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
