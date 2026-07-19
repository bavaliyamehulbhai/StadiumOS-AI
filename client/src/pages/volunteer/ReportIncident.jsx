import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, MapPin, AlignLeft, Info } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/context/AuthContext';

const INCIDENT_TYPES = ['Medical', 'Fire', 'Crowd', 'Security', 'Lost Child', 'Technical', 'Transport', 'Maintenance', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const ReportIncident = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incidentType: '',
    priority: '',
    location: '',
    stadium: ''
  });

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const { data } = await api.get('/stadiums');
        setStadiums(data.data || []);
      } catch (error) {
        toast.error('Failed to load stadiums');
      }
    };
    fetchStadiums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/incidents', formData);
      toast.success('Incident Reported Successfully. Organizers have been notified.', { duration: 5000 });
      
      if (user?.role === 'Admin') navigate('/admin/incidents');
      else if (user?.role === 'Organizer') navigate('/organizer/incidents');
      else if (user?.role === 'Volunteer') navigate('/volunteer/incidents');
      else navigate('/fan');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-0 ring-1 ring-gray-200">
        <CardHeader className="bg-red-50 border-b border-red-100 rounded-t-xl text-red-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Report an Incident</CardTitle>
              <CardDescription className="text-red-700/80 mt-1">
                Instantly alert the operations center about an issue.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Incident Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary (e.g., Blocked exit at Gate B)"
                required
                className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>

            {/* Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleChange}
                    required
                    className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <option value="">Select Category...</option>
                    {INCIDENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <option value="">Select Priority...</option>
                  {PRIORITIES.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stadium & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Stadium</label>
                <select
                  name="stadium"
                  value={formData.stadium}
                  onChange={handleChange}
                  required
                  className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <option value="">Select Stadium...</option>
                  {stadiums.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Exact Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Section 102, Row C"
                    required
                    className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide all necessary details..."
                  required
                  rows={4}
                  className="flex w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700">
              {loading ? 'Submitting Alert...' : 'Submit Incident Alert'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIncident;
