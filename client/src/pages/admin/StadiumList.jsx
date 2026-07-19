import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import toast from 'react-hot-toast';
import StadiumTable from '@/components/stadium/StadiumTable';
import StadiumCard from '@/components/stadium/StadiumCard';
import { Skeleton } from '@/components/ui/skeleton';

const StadiumList = () => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStadiums = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stadiums', {
        params: { search, status: statusFilter, page, limit: 10 }
      });
      setStadiums(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch stadiums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStadiums();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/stadiums/${id}`);
      toast.success('Stadium deleted successfully');
      fetchStadiums();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete stadium');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stadium Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all tournament venues and facilities.</p>
        </div>
        <Link to="/admin/stadiums/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add Stadium
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search stadiums..." 
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
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
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

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : viewMode === 'table' ? (
        <StadiumTable stadiums={stadiums} onDelete={handleDelete} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map(stadium => (
            <StadiumCard key={stadium._id} stadium={stadium} />
          ))}
          {stadiums.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No stadiums found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button 
            variant="outline" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default StadiumList;
