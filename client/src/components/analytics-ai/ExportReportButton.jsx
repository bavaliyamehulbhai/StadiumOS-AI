import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ExportReportButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    toast.loading('Generating AI PDF Report...', { id: 'report' });
    
    // Simulate generation delay
    setTimeout(() => {
      toast.success('Report generated successfully!', { id: 'report' });
      setLoading(false);
      window.print(); // Simple way to trigger a PDF save dialogue for the hackathon
    }, 1500);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50"
    >
      {loading ? <Download className="w-4 h-4 animate-bounce" /> : <FileText className="w-4 h-4" />}
      {loading ? 'Generating...' : 'Export Report'}
    </button>
  );
};

export default ExportReportButton;
