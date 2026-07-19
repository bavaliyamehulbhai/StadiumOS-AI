import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Share2, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TicketStatusBadge from '@/components/ticket/TicketStatusBadge';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data.data);
      } catch (error) {
        toast.error('Failed to load ticket details');
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></div>;
  }

  if (!ticket) return null;

  const isPast = new Date(ticket.match?.matchDate) < new Date();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/tickets')} className="-ml-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><Share2 className="w-5 h-5 text-gray-600" /></Button>
            <Button variant="ghost" size="icon"><Download className="w-5 h-5 text-gray-600" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Ticket Digital Pass */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
          
          {/* Top Section */}
          <div className="bg-blue-900 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="text-blue-200 text-sm font-medium tracking-widest uppercase mb-2">{ticket.stadium?.name}</p>
            <h2 className="text-3xl font-bold mb-4 leading-tight">{ticket.match?.title}</h2>
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-mono text-xl">
              {format(new Date(ticket.match?.matchDate), 'MMM dd')} • {ticket.match?.kickoffTime}
            </div>
          </div>

          {/* Cutout Dividers */}
          <div className="h-8 bg-white relative flex justify-between items-center px-0">
            <div className="w-6 h-6 bg-gray-50 rounded-full -ml-3 shadow-inner"></div>
            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-3"></div>
            <div className="w-6 h-6 bg-gray-50 rounded-full -mr-3 shadow-inner"></div>
          </div>

          {/* Middle Section (QR) */}
          <div className="px-8 pb-6 text-center">
            {ticket.qrCode ? (
              <div className="inline-block p-2 bg-white rounded-xl shadow-sm border border-gray-100 mt-2 mb-4">
                <img src={ticket.qrCode} alt="Ticket QR" className="w-48 h-48 mx-auto" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mt-2 mb-4 flex items-center justify-center">
                <p className="text-gray-400">QR Unavailable</p>
              </div>
            )}
            <p className="font-mono text-gray-500 tracking-[0.2em]">{ticket.ticketNumber}</p>
            
            {ticket.status === 'Checked-In' && (
              <p className="text-green-600 font-medium mt-2">Scanned • Entry Granted</p>
            )}
          </div>

          {/* Bottom Section (Seat Info) */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gate</p>
              <p className="font-bold text-xl text-gray-900">{ticket.gate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Section</p>
              <p className="font-bold text-xl text-gray-900">{ticket.section}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seat</p>
              <p className="font-bold text-xl text-gray-900">{ticket.seatNumber}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg shadow-md"
            onClick={() => navigate(`/map/stadium/${ticket.stadium?._id}?search=${ticket.gate}`)}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Navigate to Gate
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 border-gray-200">
              Buy Parking
            </Button>
            <Button variant="outline" className="h-12 border-red-200 text-red-600 hover:bg-red-50">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Help
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TicketDetails;
