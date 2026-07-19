import React, { useState } from 'react';
import { ScanLine, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const OrganizerScanner = () => {
  const [scanPayload, setScanPayload] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (payload) => {
    if (!payload) return;
    
    setScanning(true);
    setResult(null);

    try {
      const res = await api.post('/tickets/scan', { payload });
      setResult({
        success: true,
        message: res.data.message,
        ticket: res.data.data
      });
      setScanPayload('');
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Invalid Ticket QR'
      });
    } finally {
      setScanning(false);
    }
  };

  const handleSimulateScan = () => {
    // Note: In a real app with react-qr-reader, this is triggered automatically
    handleScan(scanPayload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <DashboardHeader 
        title="Gate Scanner" 
        subtitle="Validate fan tickets for stadium entry." 
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Mock Camera Viewfinder */}
        <div className="bg-gray-900 h-64 relative flex items-center justify-center p-6">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
          
          <div className="relative w-48 h-48 border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center">
            {scanning ? (
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            ) : (
              <ScanLine className="w-10 h-10 text-blue-400 opacity-50" />
            )}
            
            {/* Animated scan line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Manual Scan (Simulation)</h3>
          <p className="text-sm text-gray-500 mb-4">
            For hackathon demo purposes, paste a QR payload string here to simulate scanning a phone.
          </p>
          <div className="flex gap-3">
            <Input 
              placeholder='{"ticketId":"...","matchId":"..."}'
              value={scanPayload}
              onChange={(e) => setScanPayload(e.target.value)}
              className="font-mono text-xs"
            />
            <Button onClick={handleSimulateScan} disabled={!scanPayload || scanning}>
              Simulate Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Result Panel */}
      {result && (
        <div className={`p-6 rounded-2xl border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} transition-all`}>
          <div className="flex items-start gap-4">
            {result.success ? (
              <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0 mt-1" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 shrink-0 mt-1" />
            )}
            
            <div className="w-full">
              <h3 className={`text-xl font-bold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? 'Entry Approved' : 'Entry Denied'}
              </h3>
              <p className={`mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>

              {result.success && result.ticket && (
                <div className="mt-4 bg-white/60 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-800/60 uppercase tracking-wider text-[10px] font-bold">Ticket Number</p>
                    <p className="font-mono font-medium text-green-900">{result.ticket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-green-800/60 uppercase tracking-wider text-[10px] font-bold">Seat</p>
                    <p className="font-bold text-green-900">{result.ticket.section} - {result.ticket.row} - {result.ticket.seatNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerScanner;
