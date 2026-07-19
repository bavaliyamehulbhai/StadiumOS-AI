import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportGenerator = ({ analyticsData, matchId, stadiumId }) => {
  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Total,Active/Completed,Critical/InProgress\n"
        + `Incidents,${analyticsData?.incidents?.total || 0},${analyticsData?.incidents?.active || 0},${analyticsData?.incidents?.critical || 0}\n`
        + `Volunteers,${analyticsData?.volunteers?.total || 0},${analyticsData?.volunteers?.completed || 0},${analyticsData?.volunteers?.inProgress || 0}\n`
        + `Emergencies,${analyticsData?.emergencies?.total || 0},${analyticsData?.emergencies?.active || 0},0\n`
        + `Stadium Health Score,${analyticsData?.healthScore || 0},,`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Exported successfully!");
    } catch (e) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportPDF = () => {
    // For hackathon: simple window print with styled CSS print rules
    window.print();
    toast.success("Opening print dialog for PDF export...");
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={handleExportCSV} className="gap-2 bg-white hidden sm:flex">
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
      <Button onClick={handleExportPDF} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
        <FileText className="w-4 h-4" />
        Generate PDF
      </Button>
    </div>
  );
};

export default ReportGenerator;
