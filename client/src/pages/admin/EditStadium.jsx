import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StadiumForm from '@/components/stadium/StadiumForm';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';
import toast from 'react-hot-toast';

const EditStadium = () => {
  const { id } = useParams();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const { data } = await api.get(`/stadiums/${id}`);
        setStadium(data.data);
      } catch (error) {
        toast.error('Failed to load stadium details');
      } finally {
        setLoading(false);
      }
    };
    fetchStadium();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/stadiums">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Stadium</h1>
          <p className="text-sm text-gray-500 mt-1">Update stadium information and facilities.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full max-w-4xl mx-auto" />
        </div>
      ) : stadium ? (
        <StadiumForm initialData={stadium} isEdit={true} />
      ) : (
        <div className="text-center py-12 text-gray-500">Stadium not found.</div>
      )}
    </div>
  );
};

export default EditStadium;
