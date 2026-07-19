import React, { useState } from 'react';
import { Edit2, Eye, Trash2, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MatchStatusBadge from './MatchStatusBadge';
import DeleteMatchModal from './DeleteMatchModal';

const MatchTable = ({ matches, onDelete }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (match) => {
    setMatchToDelete(match);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;
    setIsDeleting(true);
    await onDelete(matchToDelete._id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setMatchToDelete(null);
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">No matches found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Match Details</th>
                <th className="px-6 py-4 font-medium">Schedule & Venue</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{match.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{match.teamA} vs {match.teamB}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700 mb-1">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {new Date(match.matchDate).toLocaleDateString()} at {match.kickoffTime}
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {match.stadium?.name || 'TBD'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {match.stage}
                  </td>
                  <td className="px-6 py-4">
                    <MatchStatusBadge status={match.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/matches/${match._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/matches/edit/${match._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-amber-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={match.status === 'Live'}
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                        onClick={() => handleDeleteClick(match)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteMatchModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        matchTitle={matchToDelete?.title || 'this match'}
        loading={isDeleting}
      />
    </>
  );
};

export default MatchTable;
