import React from 'react';
import LiveStatusStrip from './LiveStatusStrip';
import { Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6">
      <LiveStatusStrip />
      <div className="flex justify-between items-start mt-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {children}
          <Link to="/map">
            <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Map className="w-4 h-4 mr-2" />
              Open Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
