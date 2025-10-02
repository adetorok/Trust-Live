import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';

const Protected = ({ children, requiredScope }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = auth.getSession();
    
    if (!session) {
      // No session, redirect to home
      navigate('/');
      return;
    }

    if (requiredScope && !auth.hasAccess(requiredScope)) {
      // Wrong scope, redirect to appropriate landing page
      const userScope = auth.getUserScope();
      if (userScope === 'sponsor') {
        navigate('/sponsor');
      } else if (userScope === 'site') {
        navigate('/site');
      } else {
        navigate('/');
      }
      return;
    }
  }, [navigate, requiredScope]);

  const session = auth.getSession();
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (requiredScope && !auth.hasAccess(requiredScope)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default Protected;

