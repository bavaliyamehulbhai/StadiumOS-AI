import React, { useState, useEffect } from 'react';
import { X, Car, Train, Bus, MapPin, CheckCircle2, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TransportBookingModal = ({ isOpen, onClose, transport, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!isOpen || !transport) return null;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Success step
    }, 1500);
  };

  const renderRideShareUI = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 h-32 rounded-xl flex items-center justify-center relative overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=25.276987,51.520008&zoom=13&size=400x150&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0xc8d7d4&client=google-maps-api')] bg-cover bg-center"></div>
        <div className="relative bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-medium flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600" />
          Driver is 3 mins away
        </div>
      </div>
      
      <div className="flex items-center gap-4 bg-white p-4 border rounded-xl shadow-sm">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
           <User className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">Ahmed M.</h4>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" /> 4.9 • White Toyota Camry
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg tracking-wider">B 4921</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm pt-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Pickup</span>
          <span className="font-medium">{transport.source}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Drop-off</span>
          <span className="font-medium">{transport.destination}</span>
        </div>
        <div className="flex justify-between pt-2 border-t font-bold">
          <span>Total Fare</span>
          <span>₹{transport.fare}</span>
        </div>
      </div>
    </div>
  );

  const renderTransitUI = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          {transport.type === 'Metro' ? <Train className="w-24 h-24" /> : <Bus className="w-24 h-24" />}
        </div>
        <h3 className="text-xl font-bold mb-1">{transport.routeName} Pass</h3>
        <p className="text-blue-200 text-sm mb-6">Valid for one-way trip today</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          <div>
            <p className="text-blue-200 text-xs">From</p>
            <p className="font-medium truncate">{transport.source}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">To</p>
            <p className="font-medium truncate">{transport.destination}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-2 px-1 text-sm font-bold border-b pb-4">
        <span className="text-gray-600">Total Fare</span>
        <span className="text-xl">₹{transport.fare}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 1 ? (transport.type === 'Taxi' || transport.type === 'Ride Share' ? 'Confirm Ride' : 'Purchase Ticket') : 'Success'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          {step === 1 ? (
            <>
              {transport.type === 'Taxi' || transport.type === 'Ride Share' ? renderRideShareUI() : renderTransitUI()}
              <div className="mt-6">
                <Button 
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-md"
                >
                  {loading ? 'Processing Payment...' : 'Confirm & Pay'}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {transport.type === 'Taxi' || transport.type === 'Ride Share' ? 'Driver Confirmed!' : 'Ticket Active!'}
              </h3>
              <p className="text-gray-500">
                {transport.type === 'Taxi' || transport.type === 'Ride Share' 
                  ? 'Your driver is on the way. You can track them in the partner app.' 
                  : 'Your digital pass is now active. Scan it at the turnstile.'}
              </p>
              <Button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="mt-4 bg-gray-900 hover:bg-gray-800 w-full"
              >
                Close & Return
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportBookingModal;
