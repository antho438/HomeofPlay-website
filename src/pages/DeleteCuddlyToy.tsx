import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteToy from '../components/DeleteToy';

export default function DeleteCuddlyToy() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleComplete = () => {
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Delete Cuddly Toy</h1>
      
      {!isDeleting ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">
            Are you sure you want to delete "Cuddly Toy" from the database? This action cannot be undone.
          </p>
          <p className="mb-6 text-gray-600">
            Note: If this toy has any active rentals, they will be marked as returned.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Cuddly Toy
            </button>
            
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <DeleteToy toyName="Cuddly Toy" onComplete={handleComplete} />
      )}
    </div>
  );
}
