'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  Home,
  Briefcase,
  UserCheck,
  Receipt,
  Wrench,
  Bell,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePermissions } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PortalType } from '@/types/auth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: {
    resource: string;
    action: string;
  };
  badge?: string | number;
}

interface SidebarProps {
  portal: PortalType;
  className?: string;
}

export function Sidebar({ portal, className }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavigationItems = (portalType: PortalType): NavigationItem[] => {
    switch (portalType) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: Home },
          { name: 'Firms', href: '/admin/firms', icon: Building2 },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
          {
            name: 'Integrations',
            href: '/admin/integrations',
            icon: Briefcase,
          },
          { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
          { name: 'Help', href: '/admin/help', icon: HelpCircle },
        ];

      case 'accountant':
        return [
          { name: 'Dashboard', href: '/accountant', icon: Home },
          {
            name: 'Properties',
            href: '/accountant/properties',
            icon: Building2,
          },
          { name: 'Tenants', href: '/accountant/tenants', icon: Users },
          { name: 'Contracts', href: '/accountant/contracts', icon: FileText },
          { name: 'Invoices', href: '/accountant/invoices', icon: Receipt },
          { name: 'Expenses', href: '/accountant/expenses', icon: Receipt },
          {
            name: 'Maintenance',
            href: '/accountant/maintenance',
            icon: Wrench,
          },
          { name: 'Reports', href: '/accountant/reports', icon: BarChart3 },
          { name: 'Help', href: '/accountant/help', icon: HelpCircle },
        ];

      case 'owner':
        return [
          { name: 'Dashboard', href: '/owner', icon: Home },
          { name: 'Properties', href: '/owner/properties', icon: Building2 },
          { name: 'Financials', href: '/owner/financials', icon: BarChart3 },
          { name: 'Expenses', href: '/owner/expenses', icon: Receipt },
          { name: 'Maintenance', href: '/owner/maintenance', icon: Wrench },
          {
            name: 'Notifications',
            href: '/owner/notifications',
            icon: Bell,
            badge: 3,
          },
          { name: 'Messages', href: '/owner/messages', icon: MessageSquare },
          { name: 'Reports', href: '/owner/reports', icon: FileText },
        ];

      case 'tenant':
        return [
          { name: 'Dashboard', href: '/tenant', icon: Home },
          { name: 'Payments', href: '/tenant/payments', icon: Receipt },
          { name: 'Maintenance', href: '/tenant/maintenance', icon: Wrench },
          { name: 'Lease', href: '/tenant/lease', icon: FileText },
          { name: 'Messages', href: '/tenant/messages', icon: MessageSquare },
          {
            name: 'Notifications',
            href: '/tenant/notifications',
            icon: Bell,
            badge: 2,
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems(portal);

  const isActiveLink = (href: string) => {
    if (href === `/${portal}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const filteredItems = navigationItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission.resource, item.permission.action);
  });

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                portal === 'admin' && 'bg-admin-500',
                portal === 'accountant' && 'bg-accountant-500',
                portal === 'owner' && 'bg-owner-500',
                portal === 'tenant' && 'bg-tenant-500'
              )}
            />
            <span className="font-semibold capitalize">{portal} Portal</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      !isCollapsed && 'mr-3'
                    )}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'ml-2 px-2 py-0.5 text-xs rounded-full',
                            'bg-primary text-primary-foreground',
                            typeof item.badge === 'number' &&
                              item.badge > 0 &&
                              'bg-red-500 text-white'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Portal Theme Indicator */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div
            className={cn(
              'flex items-center space-x-2 text-xs text-muted-foreground p-2 rounded-md',
              portal === 'admin' && 'bg-admin-50 text-admin-700',
              portal === 'accountant' && 'bg-accountant-50 text-accountant-700',
              portal === 'owner' && 'bg-owner-50 text-owner-700',
              portal === 'tenant' && 'bg-tenant-50 text-tenant-700'
            )}
          >
            <UserCheck className="h-3 w-3" />
            <span>Logged in as {portal}</span>
          </div>
        </div>
      )}
    </div>
  );
}
