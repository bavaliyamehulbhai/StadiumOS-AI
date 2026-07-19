import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';

const AIExecutiveSummary = ({ analyticsData }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    if (!analyticsData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/analytics/executive-summary', { analyticsData });
      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
      setError('AI Executive Summary is temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate on load if analytics data exists
  useEffect(() => {
    if (analyticsData && !summary && !isLoading && !error) {
      generateSummary();
    }
  }, [analyticsData]); // intentionally missing dependencies to avoid infinite loops on re-renders, wait we'll keep it manual if it spams

  return (
    <Card className="border-indigo-100 shadow-md bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI Executive Insights
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateSummary}
          disabled={isLoading || !analyticsData}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-100"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Regenerate'}
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : summary ? (
          <div className="prose prose-indigo max-w-none text-sm text-gray-700">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Generating insights...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIExecutiveSummary;
