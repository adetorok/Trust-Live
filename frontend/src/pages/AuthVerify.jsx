import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { auth } from '../utils/auth';

const AuthVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      const destination = searchParams.get('dest') || '/';

      if (!token) {
        setError('No verification token provided');
        setStatus('error');
        return;
      }

      try {
        const response = await api.verifyToken(token);
        
        // Store session data
        auth.setSession({
          email: response.email,
          scope: response.scope,
          firstName: response.firstName,
          lastName: response.lastName,
          phone: response.phone,
          role: response.role
        });

        setStatus('success');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(destination);
        }, 2000);

      } catch (error) {
        console.error('Token verification failed:', error);
        setError(error.message || 'Token verification failed');
        setStatus('error');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Access</h2>
          <p className="text-slate-600">Please wait while we verify your access...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Verification Failed</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition-colors"
            >
              Go Home
            </button>
            <p className="text-sm text-slate-500">
              If you believe this is an error, please contact support or request a new proposal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Verified!</h2>
        <p className="text-slate-600 mb-6">
          Your access has been verified. You will be redirected to your proposal shortly.
        </p>
        <div className="animate-pulse">
          <div className="h-2 bg-teal-200 rounded-full">
            <div className="h-2 bg-teal-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthVerify;

