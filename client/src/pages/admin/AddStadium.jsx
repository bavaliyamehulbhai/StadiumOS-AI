import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StadiumForm from '@/components/stadium/StadiumForm';

const AddStadium = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/stadiums">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Stadium</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new tournament venue into StadiumOS.</p>
        </div>
      </div>

      <StadiumForm isEdit={false} />
    </div>
  );
};

export default AddStadium;
