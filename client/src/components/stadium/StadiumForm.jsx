import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';

const StadiumForm = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', city: '', country: '', address: '', capacity: '',
    parkingCapacity: '', gates: '', foodCourts: '', medicalRooms: '',
    emergencyExits: '', wheelchairAccess: false, status: 'Active',
    image: '', description: ''
  });

  useEffect(() => {
    if (isEdit && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/stadiums/${initialData._id}`, formData);
        toast.success('Stadium updated successfully');
      } else {
        await api.post('/stadiums', formData);
        toast.success('Stadium created successfully');
      }
      navigate('/admin/stadiums');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save stadium');
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Stadium Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input id="capacity" name="capacity" type="number" min="1001" value={formData.capacity} onChange={handleChange} required />
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Facilities</h3>
              <div className="space-y-2">
                <Label htmlFor="parkingCapacity">Parking Capacity *</Label>
                <Input id="parkingCapacity" name="parkingCapacity" type="number" min="0" value={formData.parkingCapacity} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gates">Number of Gates *</Label>
                <Input id="gates" name="gates" type="number" min="1" value={formData.gates} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foodCourts">Food Courts *</Label>
                <Input id="foodCourts" name="foodCourts" type="number" min="0" value={formData.foodCourts} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalRooms">Medical Rooms *</Label>
                <Input id="medicalRooms" name="medicalRooms" type="number" min="0" value={formData.medicalRooms} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyExits">Emergency Exits *</Label>
                <Input id="emergencyExits" name="emergencyExits" type="number" min="1" value={formData.emergencyExits} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select 
                  id="status" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <input 
                  type="checkbox" 
                  id="wheelchairAccess" 
                  name="wheelchairAccess" 
                  checked={formData.wheelchairAccess} 
                  onChange={handleChange} 
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="wheelchairAccess">Wheelchair Access Available</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://example.com/stadium.jpg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleChange} 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Brief description of the stadium..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/stadiums')}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : isEdit ? 'Update Stadium' : 'Save Stadium'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StadiumForm;
