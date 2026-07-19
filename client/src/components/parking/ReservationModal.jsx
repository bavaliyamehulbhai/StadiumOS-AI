import React, { useState } from 'react';
import { X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReservationModal = ({ isOpen, onClose, parking, onConfirm }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !parking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) return;
    
    setLoading(true);
    await onConfirm(parking._id, vehicleNumber);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">Reserve Parking</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Zone {parking.zone}</p>
              <p className="text-sm text-gray-600">{parking.walkingDistance} min walk to stadium</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-blue-600">₹{parking.price}</p>
              <p className="text-xs text-gray-500">Total Fare</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle License Plate</label>
            <Input 
              placeholder="e.g. MH 01 AB 1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
              className="h-12 uppercase"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
            disabled={loading || !vehicleNumber.trim()}
          >
            {loading ? 'Processing...' : `Pay ₹${parking.price} & Reserve`}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
