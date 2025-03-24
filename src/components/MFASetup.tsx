import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertCircle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

interface MFASetupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MFASetup({ 
  onSuccess, 
  onCancel 
}: MFASetupProps) {
  const [mfaQrCode, setMfaQrCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [existingMFA, setExistingMFA] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { setupMFA, verifyMFA, getMFAFactors, unenrollMFA } = useAuth();

  useEffect(() => {
    // Initialize MFA setup when component mounts
    initMFASetup();
  }, []);

  const initMFASetup = async () => {
    try {
      setSetupLoading(true);
      setError('');
      
      // Check if there are any existing factors first
      const factors = await getMFAFactors();
      
      // Check for verified factors
      const verifiedFactor = factors.find(f => f.factor_type === 'totp' && f.status === 'verified');
      if (verifiedFactor) {
        setExistingMFA(true);
        setFactorId(verifiedFactor.id);
        setSetupLoading(false);
        return;
      }
      
      // Check for unverified factors (setup in progress)
      const unverifiedFactors = factors.filter(f => f.factor_type === 'totp' && f.status === 'unverified');
      
      // If there are any unverified factors, delete them all to avoid conflicts
      if (unverifiedFactors.length > 0) {
        for (const factor of unverifiedFactors) {
          try {
            await unenrollMFA(factor.id);
            console.log(`Removed unverified factor: ${factor.id}`);
          } catch (err) {
            console.error(`Failed to remove unverified factor ${factor.id}:`, err);
          }
        }
      }
      
      // Now create a new factor with a unique name
      try {
        const uniqueName = `totp-${Date.now()}`;
        const { url, secret, factorId: newFactorId } = await setupMFA(uniqueName);
        
        if (newFactorId) {
          setFactorId(newFactorId);
          setMfaQrCode(url);
          setMfaSecret(secret);
        } else {
          throw new Error("Failed to get factor ID from MFA setup");
        }
      } catch (setupError: any) {
        if (setupError?.code === 'mfa_factor_name_conflict') {
          setError('MFA setup is already in progress. Please try again in a few minutes.');
        } else {
          setError('Failed to set up MFA. Please try again.');
        }
        console.error('Error in MFA setup:', setupError);
      }
      
    } catch (error: any) {
      console.error('Error setting up MFA:', error);
      setError('Failed to initialize MFA setup. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!factorId) {
      setError('MFA setup not initialized properly. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const verified = await verifyMFA(mfaCode, factorId);
      
      if (verified) {
        setSuccess('MFA verified and enabled successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError('Invalid MFA code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying MFA:', error);
      setError('Failed to verify MFA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetMFA = async () => {
    if (!factorId) {
      setError('No MFA factor found to reset.');
      return;
    }

    try {
      setResetting(true);
      setError('');
      
      // Unenroll the existing factor
      await unenrollMFA(factorId);
      
      // Create a new factor with a unique name
      const uniqueName = `totp-${Date.now()}`;
      const { url, secret, factorId: newFactorId } = await setupMFA(uniqueName);
      
      if (newFactorId) {
        setFactorId(newFactorId);
        setMfaQrCode(url);
        setMfaSecret(secret);
      } else {
        throw new Error("Failed to get factor ID from MFA setup");
      }
      
      setExistingMFA(false);
      setSuccess('MFA has been reset. Please set up MFA again with your authenticator app.');
    } catch (error) {
      console.error('Error resetting MFA:', error);
      setError('Failed to reset MFA. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
          <Shield className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {existingMFA ? 'Manage Two-Factor Authentication' : 'Set Up Two-Factor Authentication'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {existingMFA 
            ? 'Your account is protected with 2FA' 
            : 'Enhance your account security with 2FA'}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center p-4 bg-red-50 rounded-md text-red-700">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center p-4 bg-green-50 rounded-md text-green-700">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {setupLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : existingMFA ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">MFA is Enabled</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Your account is protected with two-factor authentication.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reset MFA</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you need to set up MFA again (for example, if you got a new phone), you can reset your MFA configuration.
            </p>
            <button
              onClick={handleResetMFA}
              disabled={resetting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetting ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Resetting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset MFA
                </>
              )}
            </button>
          </div>
          
          {onCancel && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator)
            </p>
            
            {mfaQrCode && (
              <div className="flex justify-center mb-4">
                <img src={mfaQrCode} alt="MFA QR Code" className="h-48 w-48" />
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Or enter this code manually:</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                {mfaSecret}
              </div>
            </div>
          </div>

          <form onSubmit={handleVerifyMFA}>
            <div className="mb-4">
              <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="mfa-code"
                name="mfa-code"
                type="text"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                inputMode="numeric"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6 || !factorId}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify and Enable 2FA'
                )}
              </button>
              
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
