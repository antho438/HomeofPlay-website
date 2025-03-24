import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConnected = () => {
  return !!supabaseUrl && !!supabaseKey;
};

export const deleteToyWithDependencies = async (toyId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify toy exists
    const { data: toyData, error: toyError } = await supabase
      .from('toys')
      .select('name')
      .eq('id', toyId)
      .single();

    if (toyError) throw toyError;

    // Check for active rentals
    const { data: activeRentals, error: rentalError } = await supabase
      .from('rentals')
      .select('id')
      .eq('toy_id', toyId)
      .eq('returned', false);

    if (rentalError) throw rentalError;
    if (activeRentals && activeRentals.length > 0) {
      throw new Error('Cannot delete toy with active rentals');
    }

    // Log the deletion
    const { error: logError } = await supabase
      .from('toy_deletion_logs')
      .insert({
        toy_id: toyId,
        toy_name: toyData.name,
        admin_id: user.id,
        deleted_at: new Date().toISOString(),
        status: 'success'
      });

    if (logError) throw logError;

    // Delete the toy (cascading deletes will handle related records)
    const { error: deleteError } = await supabase
      .from('toys')
      .delete()
      .eq('id', toyId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error('Error in deleteToyWithDependencies:', error);

    // Log the failure
    await supabase
      .from('toy_deletion_logs')
      .insert({
        toy_id: toyId,
        toy_name: 'Unknown',
        admin_id: '00000000-0000-0000-0000-000000000000',
        deleted_at: new Date().toISOString(),
        status: 'failed',
        error_message: error.message
      });

    throw error;
  }
};
