import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle, AlertTriangle, ShieldCheck, Trash2, MapPin, Calendar } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import PriorityBadge from '@/components/incident/PriorityBadge';
import StatusBadge from '@/components/incident/StatusBadge';
import IncidentTimeline from '@/components/incident/IncidentTimeline';
import AssignVolunteerModal from '@/components/incident/AssignVolunteerModal';
import AIAnalysisPanel from '@/components/incident-ai/AIAnalysisPanel';
import { useSocket } from '@/socket/hooks/useSocket';
import { SOCKET_EVENTS } from '@/socket/utils/socketEvents';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchIncident = async () => {
    try {
      const { data } = await api.get(`/incidents/${id}`);
      setIncident(data.data);
    } catch (error) {
      toast.error('Failed to load incident details');
      navigate('/admin/incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncident(); }, [id]);

  // Real-time socket updates for this specific incident
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket || !incident) return;

    const handleUpdate = (updatedIncident) => {
      if (updatedIncident._id === incident._id) {
        setIncident(updatedIncident);
        // Optional: show a mini toast if it wasn't triggered by this user
      }
    };

    socket.on(SOCKET_EVENTS.INCIDENT_UPDATED, handleUpdate);
    socket.on(SOCKET_EVENTS.INCIDENT_RESOLVED, handleUpdate);
    socket.on(SOCKET_EVENTS.INCIDENT_CLOSED, handleUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.INCIDENT_UPDATED, handleUpdate);
      socket.off(SOCKET_EVENTS.INCIDENT_RESOLVED, handleUpdate);
      socket.off(SOCKET_EVENTS.INCIDENT_CLOSED, handleUpdate);
    };
  }, [socket, incident]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(`/incidents/${id}/status`, { status: newStatus });
      setIncident(data.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this incident? This action cannot be undone.')) return;
    setUpdating(true);
    try {
      await api.delete(`/incidents/${id}`);
      toast.success('Incident deleted successfully');
      if (user?.role === 'Admin') navigate('/admin/incidents');
      else if (user?.role === 'Organizer') navigate('/organizer/incidents');
      else if (user?.role === 'Volunteer') navigate('/volunteer/incidents');
      else navigate('/fan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete incident');
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-96 bg-gray-200 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
  if (!incident) return null;

  const isOrganizer = user?.role === 'Organizer' || user?.role === 'Admin';
  const isVolunteer = user?.role === 'Volunteer';
  const isAssignedToMe = isVolunteer && incident.assignedVolunteer?._id === user._id;

  const priorityHero = {
    Critical: 'bg-red-50 border-red-200',
    High: 'bg-orange-50 border-orange-200',
    Medium: 'bg-yellow-50 border-yellow-200',
    Low: 'bg-gray-50 border-gray-200',
  }[incident.priority] || 'bg-gray-50 border-gray-200';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={isVolunteer ? '/volunteer/incidents' : '/admin/incidents'}>
              <button className="p-2 rounded-xl bg-white hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Incident Command</h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {incident._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(incident.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Hero Incident Card */}
        <div className={`${priorityHero} rounded-2xl border p-6 shadow-sm`}>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <PriorityBadge priority={incident.priority} />
                <StatusBadge status={incident.status} />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 shadow-sm">
                  {incident.incidentType}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{incident.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Reported by {incident.reportedBy?.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {incident.location} · {incident.stadium?.name}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {isOrganizer && incident.status === 'Reported' && (
                <button onClick={() => setAssignModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
                  <UserPlus className="w-4 h-4" /> Assign Volunteer
                </button>
              )}
              {isOrganizer && incident.status === 'Resolved' && (
                <button onClick={() => handleStatusChange('Closed')} disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm">
                  <ShieldCheck className="w-4 h-4" /> Verify & Close
                </button>
              )}
              {isAssignedToMe && incident.status === 'Assigned' && (
                <button onClick={() => handleStatusChange('Accepted')} disabled={updating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm">
                  Accept Assignment
                </button>
              )}
              {isAssignedToMe && incident.status === 'Accepted' && (
                <button onClick={() => handleStatusChange('In Progress')} disabled={updating}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm">
                  Start Work
                </button>
              )}
              {isAssignedToMe && incident.status === 'In Progress' && (
                <button onClick={() => handleStatusChange('Resolved')} disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm">
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
              )}
              {(isOrganizer || user?._id === incident.reportedBy?._id) && (
                <button onClick={handleDelete} disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-600 text-sm font-semibold transition-all disabled:opacity-50 shadow-sm">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left: Description + Details (2/5) */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Incident Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{incident.description}</p>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Location Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stadium</span>
                  <span className="text-gray-800 font-semibold">{incident.stadium?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Exact Zone</span>
                  <span className="text-gray-800 font-semibold">{incident.location}</span>
                </div>
                {incident.assignedVolunteer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Assigned To</span>
                    <span className="text-emerald-600 font-semibold">{incident.assignedVolunteer.name}</span>
                  </div>
                )}
                {incident.match && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Match</span>
                    <span className="text-gray-800 font-semibold text-right">{incident.match?.homeTeam} vs {incident.match?.awayTeam}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Timeline</h3>
              <IncidentTimeline incident={incident} />
            </div>

          </div>

          {/* Right: AI Operations Brief (3/5) */}
          <div className="lg:col-span-3">
            {isOrganizer ? (
              <AIAnalysisPanel incidentId={incident._id} incidentLocation={incident.location} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center text-gray-400 text-sm">
                AI Analysis is only available to Organizers and Admins.
              </div>
            )}
          </div>

        </div>
      </div>

      <AssignVolunteerModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        incidentId={incident._id}
        onAssigned={fetchIncident}
      />
    </div>
  );
};

export default IncidentDetails;
