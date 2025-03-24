import React from 'react';
import { isSupabaseConnected } from '../lib/supabase';
import { Database, AlertCircle } from 'lucide-react';

export default function SupabaseConnectionStatus() {
  const connected = isSupabaseConnected();

  if (connected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Supabase Not Connected</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your project is not connected to Supabase. Some features like authentication and data storage will not work.
            </p>
            <p className="mt-2">
              Please click the "Connect to Supabase" button in the top right corner to enable full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
