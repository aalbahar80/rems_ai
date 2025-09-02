'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  LogOut,
  Settings,
  Building2,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth, useCurrentFirm } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { user, logout, switchFirm, firms } = useAuth();
  const currentFirm = useCurrentFirm();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFirmSelector, setShowFirmSelector] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleFirmSwitch = (firmId: number) => {
    switchFirm(firmId);
    setShowFirmSelector(false);
    // Refresh the page to update portal access
    window.location.reload();
  };

  if (!user) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">REMS</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Firm Selector */}
          {firms && firms.length > 1 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFirmSelector(!showFirmSelector)}
                className="min-w-[200px] justify-between"
              >
                <span className="truncate">{currentFirm?.firm_name}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              {showFirmSelector && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                      Switch Organization
                    </div>
                    {firms.map((firm) => (
                      <button
                        key={firm.firm_id}
                        onClick={() => handleFirmSwitch(firm.firm_id)}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between',
                          firm.firm_id === currentFirm?.firm_id && 'bg-accent'
                        )}
                      >
                        <div>
                          <div className="font-medium">{firm.firm_name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {firm.role}
                            {firm.is_primary && ' • Primary'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden lg:block">{user.username}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-3 py-2 text-sm border-b">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-red-600 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="px-4 py-2 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 py-2">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Firm Selector */}
            {currentFirm && (
              <div className="py-2 border-t">
                <div className="text-sm font-medium mb-2">
                  Current Organization
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentFirm.firm_name}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="border-t pt-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Click outside handler
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-dropdown]')) {
      // Close dropdowns when clicking outside
    }
  });
}
