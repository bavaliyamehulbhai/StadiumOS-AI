import React, { useState, useEffect } from 'react';
import { Ticket, Map, Bell, Car, Star, Navigation2, MapPin, Bot, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';
import SkeletonDashboard from '@/components/dashboard/SkeletonDashboard';
import { useFanDashboard } from '@/hooks/useDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { LineChartCard } from '@/components/dashboard/ChartCard';
import QuickAction from '@/components/dashboard/QuickAction';
import AccessibilityAssistantCard from '@/components/accessibility/AccessibilityAssistantCard';
import SmartCrowdRecommendations from '../../components/crowd/SmartCrowdRecommendations';

const crowdTrendData = [
  { time: '16:00', density: 20 },
  { time: '17:00', density: 35 },
  { time: '18:00', density: 60 },
  { time: '19:00', density: 85 },
  { time: '20:00', density: 95 }
];

const FanDashboard = () => {
  const { data: dashboardData, isLoading, isError, refetch } = useFanDashboard();
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [bestTransport, setBestTransport] = useState(null);

  useEffect(() => {
    if (dashboardData?.stats?.upcomingMatch !== 'No Upcoming Matches') {
      setUpcomingMatch({ stadium: { name: 'The Main Stadium' } });
      setBestTransport({ 
        routeName: 'Metro Line 4', 
        estimatedTime: 25, 
        fare: 45, 
        status: 'Optimal' 
      });
    }
  }, [dashboardData]);

  if (isLoading) return <SkeletonDashboard />;

  if (isError || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
        <button onClick={() => refetch()} className="text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  const { stats, aiSuggestions, recentNotifs } = dashboardData;

  const displayMatch = stats.upcomingMatch !== 'No Upcoming Matches' ? 'Real Madrid vs FCB' : 'No Match Today';
  const displayTime = stats.upcomingMatch !== 'No Upcoming Matches' ? 'Today at 8:00 PM • Gate 4' : '--';
  const displayTickets = stats.myTickets > 0 ? `${stats.myTickets} Active` : '0 Active';
  const displayNotifications = recentNotifs && recentNotifs.length > 0 ? `${recentNotifs.length} Unread` : '0 Unread';
  const displayLatestNotif = recentNotifs && recentNotifs.length > 0 ? `Latest: ${recentNotifs[0].title}` : 'No new updates';

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="" 
        subtitle="Here is what's happening at StadiumOS today." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Match Card */}
        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-blue-100">Upcoming Match</h3>
            <Ticket className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{displayMatch}</h2>
            <p className="text-sm text-blue-100">{displayTime}</p>
          </div>
        </div>

        {/* AI Smart Navigation Card */}
        <Link 
          to="/fan/navigation"
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-indigo-100">Smart Navigation</h3>
            <Map className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <p className="text-2xl font-bold">AI Route Finder</p>
            <p className="text-sm text-indigo-100 mt-1">Get the fastest context-aware route</p>
          </div>
        </Link>

        {/* My Tickets */}
        <div 
          onClick={() => window.location.href = '/tickets'}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-gray-600">My Tickets</h3>
            <Ticket className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{displayTickets}</p>
            <p className="text-sm text-gray-500 mt-1">Block A, Row 12, Seats 4-5</p>
          </div>
        </div>

        {/* Parking Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-gray-600">Parking Status</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{stats.parkingStatus}</p>
            <p className="text-sm text-gray-500 mt-1">P3 is currently at 85% capacity</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-gray-600">Notifications</h3>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{displayNotifications}</p>
            <p className="text-sm text-gray-500 mt-1 truncate">{displayLatestNotif}</p>
          </div>
        </div>
      </div>

      <AccessibilityAssistantCard />

      {/* TOP 400 TIP: Best Travel Option Widget */}
      <SmartCrowdRecommendations />
      
      {upcomingMatch && bestTransport && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-200 font-medium mb-4">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span>Smart Travel Recommendation</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Heading to {upcomingMatch.stadium?.name}?</h3>
            <p className="text-blue-100 mb-6 max-w-xl">
              Based on live traffic and match timings, here is the fastest way to reach your seat before kickoff.
            </p>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Recommended Mode</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Navigation2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{bestTransport.routeName}</p>
                    <p className="text-sm text-blue-100">{bestTransport.estimatedTime} mins ETA • ₹{bestTransport.fare}</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20"></div>
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-semibold">{bestTransport.status}</span>
                </div>
              </div>
              <Link 
                to="/fan/transport"
                className="w-full md:w-auto px-6 py-3 bg-white text-blue-900 text-center font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg block"
              >
                View Options
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction title="Find Food" icon={MapPin} to="/map?filter=Food" />
              <QuickAction title="View Tickets" icon={Ticket} to="/tickets" />
              <QuickAction title="Transport & Parking" icon={Car} to="/fan/transport" />
              <QuickAction title="Ask StadiumOS AI" icon={Bot} to="/assistant" />
            </div>
          </div>

          <LineChartCard 
            title="Estimated Gate Congestion"
            data={crowdTrendData}
            lines={[{ key: 'density', color: '#f59e0b' }]}
            xAxisKey="time"
          />
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Updates</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Food court 2 has shorter lines</p>
                <p className="text-sm text-gray-500 mt-1">Just now via AI Prediction</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Heavy traffic on Main Road</p>
                <p className="text-sm text-gray-500 mt-1">10 mins ago</p>
              </div>
            </div>
            {recentNotifs && recentNotifs.slice(0, 2).map((notif, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">{notif.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanDashboard;
