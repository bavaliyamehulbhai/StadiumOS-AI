import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MatchForm from '@/components/match/MatchForm';

const AddMatch = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/matches">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Match</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule a new match in the tournament.</p>
        </div>
      </div>
      <MatchForm isEdit={false} />
    </div>
  );
};

export default AddMatch;
