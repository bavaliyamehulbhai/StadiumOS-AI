import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import toast from 'react-hot-toast';
import MatchTable from '@/components/match/MatchTable';
import MatchCard from '@/components/match/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); 
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/matches', {
        params: { search, status: statusFilter, stage: stageFilter, page, limit: 10 }
      });
      setMatches(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMatches();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, stageFilter, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/matches/${id}`);
      toast.success('Match deleted successfully');
      fetchMatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete match');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match Management</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and monitor all tournament matches.</p>
        </div>
        <Link to="/admin/matches/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Match
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search teams or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              className="h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </select>
            <select 
              className="h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">All Stages</option>
              <option value="Group Stage">Group Stage</option>
              <option value="Round of 16">Round of 16</option>
              <option value="Quarter Final">Quarter Final</option>
              <option value="Semi Final">Semi Final</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : viewMode === 'table' ? (
        <MatchTable matches={matches} onDelete={handleDelete} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard key={match._id} match={match} />
          ))}
          {matches.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No matches found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm font-medium text-gray-600">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default Matches;
