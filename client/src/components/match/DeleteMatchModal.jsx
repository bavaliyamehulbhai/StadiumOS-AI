import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const DeleteMatchModal = ({ isOpen, onClose, onConfirm, matchTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Cancel Match?</h2>
          <p className="text-center text-gray-500 text-sm">
            Are you sure you want to delete <strong>{matchTitle}</strong>? This action cannot be undone. Live matches cannot be deleted.
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
            {loading ? 'Deleting...' : 'Delete Match'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMatchModal;
