import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleInstagramCallback } from '../lib/instagram';
import { Instagram, CheckCircle, AlertCircle } from 'lucide-react';

export default function InstagramCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your Instagram authentication...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('Instagram callback page loaded');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorReason = urlParams.get('error_reason');
        const errorDescription = urlParams.get('error_description');
        
        console.log('URL parameters:', { 
          code: code ? `${code.substring(0, 5)}...` : null, 
          state,
          error,
          errorReason,
          errorDescription
        });
        
        if (error) {
          setStatus('error');
          setMessage(`Instagram authentication failed: ${errorDescription || error}`);
          setErrorDetails(`Error: ${error}, Reason: ${errorReason || 'Unknown'}`);
          return;
        }
        
        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authentication parameters. Please try again.');
          setErrorDetails(`Code: ${code ? 'present' : 'missing'}, State: ${state ? 'present' : 'missing'}`);
          return;
        }
        
        // Process the Instagram callback
        console.log('Processing Instagram callback...');
        await handleInstagramCallback(code, state);
        
        setStatus('success');
        setMessage('Successfully connected to Instagram!');
        
        // Redirect back to home after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error: any) {
        console.error('Error processing Instagram callback:', error);
        setStatus('error');
        setMessage('Failed to connect to Instagram. Please try again.');
        setErrorDetails(error.message || 'Unknown error occurred');
      }
    };
    
    processCallback();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Instagram className="h-16 w-16 text-pink-500" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Instagram Connection
          </h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-600 text-center">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-gray-600 text-center">{message}</p>
              <p className="text-gray-500 text-sm mt-2">Redirecting you back to the home page...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-gray-600 text-center">{message}</p>
              {errorDetails && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-800 max-w-full overflow-auto">
                  <p className="font-medium">Error details:</p>
                  <p className="mt-1 font-mono text-xs">{errorDetails}</p>
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
