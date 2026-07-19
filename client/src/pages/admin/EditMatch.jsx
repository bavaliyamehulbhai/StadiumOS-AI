import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MatchForm from '@/components/match/MatchForm';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';
import toast from 'react-hot-toast';

const EditMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data } = await api.get(`/matches/${id}`);
        setMatch(data.data);
      } catch (error) {
        toast.error('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/matches">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Match</h1>
          <p className="text-sm text-gray-500 mt-1">Update match schedule or ticket pricing.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
        </div>
      ) : match ? (
        <MatchForm initialData={match} isEdit={true} />
      ) : (
        <div className="text-center py-12 text-gray-500">Match not found.</div>
      )}
    </div>
  );
};

export default EditMatch;
