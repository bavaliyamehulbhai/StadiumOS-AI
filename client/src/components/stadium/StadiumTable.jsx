import React, { useState } from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DeleteModal from './DeleteModal';

const StadiumTable = ({ stadiums, onDelete }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stadiumToDelete, setStadiumToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (stadium) => {
    setStadiumToDelete(stadium);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!stadiumToDelete) return;
    setIsDeleting(true);
    await onDelete(stadiumToDelete._id);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setStadiumToDelete(null);
  };

  if (!stadiums || stadiums.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">No stadiums found matching your criteria.</p>
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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stadiums.map((stadium) => (
                <tr key={stadium._id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{stadium.name}</td>
                  <td className="px-6 py-4 text-gray-600">{stadium.city}, {stadium.country}</td>
                  <td className="px-6 py-4 text-gray-600">{stadium.capacity.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${stadium.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        stadium.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'}
                    `}>
                      {stadium.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/stadiums/${stadium._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/stadiums/edit/${stadium._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-amber-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(stadium)}
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

      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={stadiumToDelete?.name || 'Stadium'}
        loading={isDeleting}
      />
    </>
  );
};

export default StadiumTable;
