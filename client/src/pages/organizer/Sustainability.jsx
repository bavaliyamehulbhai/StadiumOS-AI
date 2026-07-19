import React from 'react';
import { Leaf, Droplets, Zap, Wind, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SustainabilityDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-green-800">Sustainability & ESG</h2>
        <p className="text-muted-foreground mt-1">Live environmental impact monitoring for FIFA carbon-neutral goals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Carbon Footprint</CardTitle>
            <Wind className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">12.4t</div>
            <p className="text-xs text-green-600/80 mt-1">↓ 15% from last match</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Water Recycled</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">4,200L</div>
            <p className="text-xs text-blue-600/80 mt-1">Pitch irrigation system active</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Energy Source</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">68%</div>
            <p className="text-xs text-amber-600/80 mt-1">Running on Solar Grid</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Waste Diverted</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">82%</div>
            <p className="text-xs text-emerald-600/80 mt-1">Recycled or composted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={18} className="text-green-600"/> 
            AI Green Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-medium">Dim Concourse Lighting</p>
                <p className="text-xs text-muted-foreground">Natural daylight is sufficient in the East Concourse. Dimming lights will save 450 kWh.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-medium">Activate Smart Sprinklers</p>
                <p className="text-xs text-muted-foreground">Soil moisture is optimal. Delaying scheduled irrigation by 2 hours will conserve water.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityDashboard;
