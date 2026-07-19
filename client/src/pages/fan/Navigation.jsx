import React from 'react';
import StadiumMap from '../../components/map/StadiumMap';

const Navigation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interactive Stadium Map</h2>
        <p className="text-muted-foreground mt-1">Live routing and gate statuses.</p>
      </div>
      <StadiumMap />
    </div>
  );
};

export default Navigation;
