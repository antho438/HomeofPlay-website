import { supabase } from './supabase';

export const trackActivity = async (action: string, details?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('user_activities').insert({
      user_id: user?.id || 'anonymous',
      action,
      details: details || {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Activity tracking failed:', error);
  }
};
