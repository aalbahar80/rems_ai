'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { usePortalRouting } from '@/hooks/use-portal-routing';
import { Button } from '@/components/ui/button';
import { Input, FormField } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/shared/layout';
import type { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { navigateToDefaultPortal } = usePortalRouting();

  const [redirectTo, setRedirectTo] = useState('/admin');

  const [credentials, setCredentials] = useState<LoginCredentials>({
    credential: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.credential || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log('📝 Login page: Calling login function...');
      const success = await login(credentials);
      console.log('📝 Login page: Login function returned:', success);

      if (success) {
        console.log('✅ Login page: Success! Redirecting...');
        // Directly navigate to admin portal for admin users
        // This avoids the race condition with hook state updates
        console.log('🧭 Login page: Redirecting to:', redirectTo);
        router.push(redirectTo);
      } else {
        console.log('❌ Login page: Login returned false');
        setError('Invalid credential or password');
      }
    } catch (err) {
      console.error('💥 Login page: Exception caught:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleInputChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <PublicLayout className="flex items-center justify-center min-h-screen bg-gradient-bg">
      <div className="w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
              <Building2 className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">REMS</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/80">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">Sign In</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email/Username Field */}
              <FormField
                label="Email or Username"
                required
                className="text-gray-900"
              >
                <Input
                  type="text"
                  placeholder="Enter your email or username"
                  value={credentials.credential}
                  onChange={handleInputChange('credential')}
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                />
              </FormField>

              {/* Password Field */}
              <FormField label="Password" required className="text-gray-900">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </Link>

              <div className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Link */}
        <div className="text-center mt-6">
          <Link href="/demo" className="text-sm text-white/90 hover:text-white">
            Need a demo? Schedule one here →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
