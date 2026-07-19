import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { AlertCircle } from 'lucide-react';

const MatchForm = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '', teamA: '', teamB: '', stadium: '', matchDate: '',
    kickoffTime: '', endTime: '', stage: 'Group Stage', status: 'Upcoming',
    ticketPrice: '', totalSeats: '', bookedSeats: 0, referee: '',
    weather: '', description: ''
  });

  useEffect(() => {
    // Fetch active stadiums for the dropdown
    const fetchStadiums = async () => {
      try {
        const { data } = await api.get('/stadiums?status=Active');
        setStadiums(data.data);
      } catch (err) {
        toast.error('Failed to load stadiums');
      }
    };
    fetchStadiums();

    if (isEdit && Object.keys(initialData).length > 0) {
      setFormData({
        ...initialData,
        stadium: initialData.stadium?._id || initialData.stadium,
        matchDate: initialData.matchDate ? new Date(initialData.matchDate).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData, isEdit]);

  // Handle stadium change specifically to auto-populate max capacity
  const handleStadiumChange = (e) => {
    const selectedStadiumId = e.target.value;
    const selectedStadium = stadiums.find(s => s._id === selectedStadiumId);
    setFormData(prev => ({
      ...prev,
      stadium: selectedStadiumId,
      totalSeats: selectedStadium ? selectedStadium.capacity : prev.totalSeats
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/matches/${initialData._id}`, formData);
        toast.success('Match updated successfully');
      } else {
        await api.post('/matches', formData);
        toast.success('Match created successfully');
      }
      navigate('/admin/matches');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save match');
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const isLive = isEdit && initialData.status === 'Live';

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardContent className="p-6">
        
        {isLive && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-amber-800 font-bold text-sm">Live Match Locked</h4>
              <p className="text-amber-700 text-sm mt-1">
                Because this match is currently marked as <strong>Live</strong>, core details (teams, dates, stadium) cannot be edited to prevent data corruption. Only the Status can be changed.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Teams & Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Core Match Details</h3>
              <div className="space-y-2">
                <Label htmlFor="title">Match Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isLive} placeholder="e.g. World Cup Final 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamA">Team A *</Label>
                  <Input id="teamA" name="teamA" value={formData.teamA} onChange={handleChange} required disabled={isLive} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamB">Team B *</Label>
                  <Input id="teamB" name="teamB" value={formData.teamB} onChange={handleChange} required disabled={isLive} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Tournament Stage *</Label>
                <select 
                  id="stage" name="stage" value={formData.stage} onChange={handleChange} disabled={isLive}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                >
                  <option value="Group Stage">Group Stage</option>
                  <option value="Round of 16">Round of 16</option>
                  <option value="Quarter Final">Quarter Final</option>
                  <option value="Semi Final">Semi Final</option>
                  <option value="Third Place">Third Place</option>
                  <option value="Final">Final</option>
                </select>
              </div>
            </div>

            {/* Venue & Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Venue & Schedule</h3>
              <div className="space-y-2">
                <Label htmlFor="stadium">Stadium *</Label>
                <select 
                  id="stadium" name="stadium" value={formData.stadium} onChange={handleStadiumChange} required disabled={isLive}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                >
                  <option value="">Select a Stadium</option>
                  {stadiums.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.capacity.toLocaleString()} seats)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchDate">Date *</Label>
                <Input id="matchDate" name="matchDate" type="date" value={formData.matchDate} onChange={handleChange} required disabled={isLive} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kickoffTime">Kickoff Time *</Label>
                  <Input id="kickoffTime" name="kickoffTime" type="time" value={formData.kickoffTime} onChange={handleChange} required disabled={isLive} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} disabled={isLive} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ticketing & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Operations</h3>
              <div className="space-y-2">
                <Label htmlFor="status">Match Status *</Label>
                <select 
                  id="status" name="status" value={formData.status} onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live">Live</option>
                  <option value="Completed">Completed</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice">Ticket Price ($) *</Label>
                  <Input id="ticketPrice" name="ticketPrice" type="number" min="1" value={formData.ticketPrice} onChange={handleChange} required disabled={isLive} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats Allocated *</Label>
                  <Input id="totalSeats" name="totalSeats" type="number" min="1" value={formData.totalSeats} onChange={handleChange} required disabled={isLive} />
                </div>
              </div>
            </div>
            
            {/* Extras */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referee">Referee (Optional)</Label>
                  <Input id="referee" name="referee" value={formData.referee} onChange={handleChange} disabled={isLive} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weather">Weather (Optional)</Label>
                  <Input id="weather" name="weather" value={formData.weather} onChange={handleChange} disabled={isLive} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" name="description" value={formData.description} onChange={handleChange} disabled={isLive}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                  placeholder="Additional context about this match..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/matches')}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : isEdit ? 'Update Match' : 'Save Match'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MatchForm;
