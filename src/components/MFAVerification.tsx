import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

interface MFAVerificationProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MFAVerification({ onSuccess, onCancel }: MFAVerificationProps) {
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const { verifyMFA, getMFAFactors, setMfaVerified } = useAuth();

  useEffect(() => {
    // Get the user's MFA factors when component mounts
    const getFactors = async () => {
      try {
        const factors = await getMFAFactors();
        if (factors && factors.length > 0) {
          // Find the first verified TOTP factor
          const totpFactor = factors.find(f => f.factor_type === 'totp' && f.status === 'verified');
          if (totpFactor) {
            setFactorId(totpFactor.id);
          } else {
            setError('No verified MFA factor found. Please set up MFA first.');
          }
        } else {
          setError('No MFA factors found. Please set up MFA first.');
        }
      } catch (error) {
        // Only log if it's not an expected auth error
        if (!(error && (error as any).__isAuthError && (error as any).name === 'AuthSessionMissingError')) {
          console.error('Error getting MFA factors:', error);
          setError('Failed to retrieve MFA factors. Please try again.');
        }
      }
    };

    getFactors();
  }, [getMFAFactors]);

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!factorId) {
      setError('No MFA factor found. Please set up MFA first.');
      setLoading(false);
      return;
    }

    try {
      // Make sure the code is exactly 6 digits
      const cleanCode = mfaCode.trim().replace(/\s/g, '');
      if (!/^\d{6}$/.test(cleanCode)) {
        setError('Please enter a valid 6-digit code');
        setLoading(false);
        return;
      }
      
      const verified = await verifyMFA(cleanCode, factorId);
      
      if (verified) {
        setSuccess('MFA verified successfully!');
        setMfaVerified(true);
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
          <Key className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the code from your authenticator app
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

      <form onSubmit={handleVerifyMFA}>
        <div className="mb-4">
          <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-1">
            Authentication Code
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
            autoFocus
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
              'Verify'
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
    </div>
  );
}
