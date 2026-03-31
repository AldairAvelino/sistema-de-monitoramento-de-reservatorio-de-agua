import { useEffect } from 'react';
import { client } from '../lib/api';

export default function AuthCallback() {
  useEffect(() => {
    // client.auth.login();
    console.log('Authentication processing (mock)...');
    // For now, let's just simulate success and redirect
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
