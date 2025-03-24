import React, { useState, useCallback } from 'react';
import { supabase, deleteToyWithDependencies } from '../lib/supabase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';

interface DeleteToyProps {
  toyName: string;
  onComplete: () => void;
}

const DeleteToy: React.FC<DeleteToyProps> = ({ toyName, onComplete }) => {
  const { user, isAdmin } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteToy = useCallback(async () => {
    if (!user || !isAdmin) {
      setError('Only administrators can delete toys');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data: toys, error: findError } = await supabase
        .from('toys')
        .select('id')
        .ilike('name', toyName);
        
      if (findError) throw findError;
      if (!toys || toys.length === 0) throw new Error(`Toy "${toyName}" not found`);
      
      const toyId = toys[0].id;
      
      const { error: deleteError } = await deleteToyWithDependencies(toyId);
      
      if (deleteError) throw deleteError;
      
      setSuccess(true);
      setTimeout(() => {
        onComplete();
        setShowConfirmation(false);
      }, 2000);
    } catch (err: any) {
      console.error('Error deleting toy:', err);
      setError(err.message || 'Failed to delete toy');
    } finally {
      setLoading(false);
    }
  }, [toyName, user, isAdmin, onComplete]);

  return (
    <div>
      <Button variant="destructive" onClick={() => setShowConfirmation(true)}>
        Delete Toy
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this toy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">Toy deleted successfully!</div>}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteToy}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteToy;
