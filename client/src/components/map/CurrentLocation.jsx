import React from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurrentLocation = () => {
  return (
    <Button 
      variant="secondary" 
      size="icon"
      className="bg-white hover:bg-gray-50 shadow-md rounded-full w-10 h-10 border border-gray-200 text-blue-600"
      onClick={() => console.log('Locate user')}
      title="Find my location"
    >
      <Navigation className="w-4 h-4" />
    </Button>
  );
};

export default CurrentLocation;
