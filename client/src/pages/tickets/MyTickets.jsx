import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon } from 'lucide-react';
import TicketCard from '@/components/ticket/TicketCard';
import PageLoader from '@/components/common/PageLoader';
import api from '@/services/api';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets/my');
        setTickets(res.data.data);
      } catch (error) {
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const upcomingTickets = tickets.filter(t => new Date(t.match?.matchDate) >= new Date() && t.status !== 'Cancelled');
  const pastTickets = tickets.filter(t => new Date(t.match?.matchDate) < new Date() || t.status === 'Cancelled');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <TicketIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500">Manage your digital event passes</p>
        </div>
      </div>

      {loading ? (
        <PageLoader text="Loading your tickets..." />
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h2>
          {upcomingTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {upcomingTickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 text-center mb-10 flex flex-col items-center">
              <span className="text-4xl mb-4">🎉</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No upcoming tickets</h3>
              <p className="text-gray-500 text-sm">You haven't booked any tickets yet. Check out upcoming matches!</p>
            </div>
          )}

          <h2 className="text-lg font-bold text-gray-900 mb-4">Past & Cancelled</h2>
          {pastTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastTickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8 text-center flex flex-col items-center">
              <span className="text-3xl mb-3 grayscale opacity-50">🎫</span>
              <p className="text-gray-400 text-sm">No past tickets found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTickets;
