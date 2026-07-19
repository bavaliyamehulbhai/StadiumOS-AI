import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import api from '@/services/api';

const CATEGORIES = ['Medical', 'Crowd', 'Parking', 'Security', 'Maintenance', 'Navigation', 'Transport', 'Cleaning', 'Emergency', 'VIP', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const TaskForm = ({ initialData, onSubmit, loading, buttonText = "Create Task" }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Medium',
    location: '',
    stadium: '',
    assignedVolunteer: '',
    dueTime: ''
  });
  const [stadiums, setStadiums] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
    
    // Fetch Stadiums and Volunteers
    const fetchSelectData = async () => {
      try {
        const [stadiumsRes, usersRes] = await Promise.all([
          api.get('/stadiums'),
          api.get('/auth/users?role=Volunteer')
        ]);
        setStadiums(stadiumsRes.data.data || []);
        setVolunteers(usersRes.data.data || []);
        
        // Auto select first stadium if none selected
        if (!initialData?.stadium && stadiumsRes.data.data?.length > 0) {
          setFormData(prev => ({ ...prev, stadium: stadiumsRes.data.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load form data');
      }
    };
    fetchSelectData();
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.assignedVolunteer) {
      delete submitData.assignedVolunteer;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Broken seat in Sector 4"
            required
            minLength={5}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Provide detailed instructions for the volunteer..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Stadium</label>
          <select
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            required
          >
            <option value="">Select Stadium</option>
            {stadiums.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Exact Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Gate B, Level 2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Assign Volunteer (Optional)</label>
          <select
            name="assignedVolunteer"
            value={formData.assignedVolunteer}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
          >
            <option value="">Leave as Pending / Unassigned</option>
            {volunteers.map(v => (
              <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Leave empty to create a Pending task.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Due Time</label>
          <input
            type="datetime-local"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
