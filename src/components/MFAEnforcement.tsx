import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MFASetup from './MFASetup';
import MFAVerification from './MFAVerification';
import { Shield, AlertCircle, Lock, Key } from 'lucide-react';

export default function MFAEnforcement() {
  const { user, isAdmin, isSuperAdmin, requiresMFA, mfaVerified, checkMFARequirement, getMFAFactors, signOut } = useAuth();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasMFA, setHasMFA] = useState(false);
  
  useEffect(() => {
    // Check if the user requires MFA or needs to verify MFA
    const checkMFA = async () => {
      if (user && (isAdmin || isSuperAdmin)) {
        try {
          // Check if the user has MFA set up
          const factors = await getMFAFactors();
          const hasSetupMFA = factors.some(f => f.factor_type === 'totp' && f.status === 'verified');
          setHasMFA(hasSetupMFA);
          
          // If the user has MFA set up but hasn't verified it for this session
          if (hasSetupMFA && !mfaVerified) {
            setShowMFAVerification(true);
            setShowModal(true);
            return;
          }
          
          // If the user doesn't have MFA set up and is an admin
          const needsMFA = await checkMFARequirement();
          if (needsMFA) {
            setShowMFASetup(true);
            setShowModal(true);
            return;
          }
          
          // If neither condition is met, don't show the modal
          setShowModal(false);
        } catch (error) {
          console.error('Error checking MFA status:', error);
        }
      } else {
        // Not an admin user, don't show the modal
        setShowModal(false);
      }
    };
    
    checkMFA();
  }, [user, isAdmin, isSuperAdmin, mfaVerified, checkMFARequirement, getMFAFactors]);
  
  // If the user doesn't require MFA, don't show anything
  if (!user || !showModal) {
    return null;
  }
  
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hasMFA ? 'MFA Verification Required' : 'MFA Setup Required'}
          </h2>
          <p className="mt-2 text-gray-600">
            {hasMFA 
              ? 'As an administrator, you must verify your identity with two-factor authentication.' 
              : 'As an administrator, you must set up Multi-Factor Authentication to continue.'}
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Security Requirement:</strong> All administrator accounts must use Multi-Factor Authentication.
                {hasMFA 
                  ? ' Please verify your identity to continue.' 
                  : ' Please set up MFA now to continue using your account.'}
              </p>
            </div>
          </div>
        </div>
        
        {!showMFASetup && !showMFAVerification && (
          <div className="space-y-4">
            <button
              onClick={() => hasMFA ? setShowMFAVerification(true) : setShowMFASetup(true)}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {hasMFA ? (
                <>
                  <Key className="h-5 w-5 mr-2" />
                  Verify with MFA
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Set Up MFA Now
                </>
              )}
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign Out
            </button>
          </div>
        )}
        
        {showMFASetup && (
          <div className="mt-6">
            <MFASetup 
              onSuccess={() => {
                setShowMFASetup(false);
                setShowModal(false);
              }}
              onCancel={() => {
                setShowMFASetup(false);
                // We still keep the main modal open to enforce MFA
              }}
            />
          </div>
        )}
        
        {showMFAVerification && (
          <div className="mt-6">
            <MFAVerification 
              onSuccess={() => {
                setShowMFAVerification(false);
                setShowModal(false);
              }}
              onCancel={() => {
                setShowMFAVerification(false);
                // We still keep the main modal open to enforce MFA
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
