'use client';

import { Shield, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/shared/layout';
import { useAuth } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    if (user) {
      router.push('/admin'); // Try admin portal first
    } else {
      router.push('/');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <PublicLayout className="flex items-center justify-center min-h-screen bg-gradient-bg">
      <Card className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>

          {user && (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
              <p>
                Current user: <strong>{user.username}</strong>
              </p>
              <p>
                Role: <strong>{user.user_type}</strong>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>

            {user && (
              <Button
                onClick={handleLogout}
                className="flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PublicLayout>
  );
}
