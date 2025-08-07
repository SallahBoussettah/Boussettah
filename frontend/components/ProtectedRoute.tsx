"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      
      if (!loading) {
        if (!isAuthenticated) {
          // Try to check auth one more time
          const isValid = await checkAuth();
          if (!isValid) {
            router.push('/login');
            return;
          }
        }
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, loading, router, checkAuth]);

  if (loading || isChecking) {
    return (
      fallback || (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Verifying authentication...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  return <>{children}</>;
}