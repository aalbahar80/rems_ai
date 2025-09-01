'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ClipboardList,
  TrendingUp,
  Wrench,
  Bell,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AccountantLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
  submenu?: NavItem[];
}

const navigation: NavItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    href: '/accountant',
  },
  {
    icon: Building2,
    label: 'Properties',
    href: '/accountant/properties',
    submenu: [
      {
        icon: Building2,
        label: 'All Properties',
        href: '/accountant/properties',
      },
      {
        icon: Building2,
        label: 'Add Property',
        href: '/accountant/properties/create',
      },
    ],
  },
  {
    icon: Users,
    label: 'Owners',
    href: '/accountant/owners',
    submenu: [
      { icon: Users, label: 'All Owners', href: '/accountant/owners' },
      { icon: Users, label: 'Add Owner', href: '/accountant/owners/create' },
    ],
  },
  {
    icon: Users,
    label: 'Tenants',
    href: '/accountant/tenants',
    submenu: [
      { icon: Users, label: 'All Tenants', href: '/accountant/tenants' },
      { icon: Users, label: 'Add Tenant', href: '/accountant/tenants/create' },
    ],
  },
  {
    icon: ClipboardList,
    label: 'Contracts',
    href: '/accountant/contracts',
    submenu: [
      {
        icon: ClipboardList,
        label: 'Active Contracts',
        href: '/accountant/contracts',
      },
      {
        icon: ClipboardList,
        label: 'Create Contract',
        href: '/accountant/contracts/create',
      },
      {
        icon: ClipboardList,
        label: 'Renewals',
        href: '/accountant/contracts/renewals',
      },
    ],
  },
  {
    icon: FileText,
    label: 'Invoices',
    href: '/accountant/invoices',
    badge: '3',
    submenu: [
      { icon: FileText, label: 'All Invoices', href: '/accountant/invoices' },
      {
        icon: FileText,
        label: 'Generate Invoice',
        href: '/accountant/invoices/create',
      },
      {
        icon: FileText,
        label: 'Overdue',
        href: '/accountant/invoices/overdue',
      },
    ],
  },
  {
    icon: CreditCard,
    label: 'Expenses',
    href: '/accountant/expenses',
    submenu: [
      { icon: CreditCard, label: 'All Expenses', href: '/accountant/expenses' },
      {
        icon: CreditCard,
        label: 'Add Expense',
        href: '/accountant/expenses/create',
      },
      {
        icon: CreditCard,
        label: 'Pending Approval',
        href: '/accountant/expenses/pending',
      },
    ],
  },
  {
    icon: Wrench,
    label: 'Maintenance',
    href: '/accountant/maintenance',
    badge: '2',
    submenu: [
      { icon: Wrench, label: 'All Requests', href: '/accountant/maintenance' },
      {
        icon: Wrench,
        label: 'Pending Assignment',
        href: '/accountant/maintenance/pending',
      },
      {
        icon: Wrench,
        label: 'Vendors',
        href: '/accountant/maintenance/vendors',
      },
    ],
  },
  {
    icon: TrendingUp,
    label: 'Reports',
    href: '/accountant/reports',
    submenu: [
      {
        icon: TrendingUp,
        label: 'Financial Reports',
        href: '/accountant/reports/financial',
      },
      {
        icon: TrendingUp,
        label: 'Occupancy Reports',
        href: '/accountant/reports/occupancy',
      },
      {
        icon: TrendingUp,
        label: 'Collection Reports',
        href: '/accountant/reports/collections',
      },
    ],
  },
];

export function AccountantLayout({ children }: AccountantLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    // Auto-expand parent menu if child is active
    const activeParent = navigation.find((item) =>
      item.submenu?.some((sub) => sub.href === pathname)
    );
    if (activeParent && !expandedItems.includes(activeParent.href)) {
      setExpandedItems((prev) => [...prev, activeParent.href]);
    }
  }, [pathname, expandedItems]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) =>
    item.submenu?.some((sub) => pathname === sub.href) ||
    pathname === item.href;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                Kuwait Properties LLC
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accountant Portal
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isItemActive = isParentActive(item);
              const isExpanded = expandedItems.includes(item.href);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.href}>
                  {/* Main Menu Item */}
                  <button
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleExpanded(item.href);
                      } else {
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isItemActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200">
                          {item.badge}
                        </span>
                      )}
                      {hasSubmenu && (
                        <svg
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isExpanded ? 'rotate-90' : ''
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu!.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.href}
                            onClick={() => router.push(subItem.href)}
                            className={cn(
                              'w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors',
                              isActive(subItem.href)
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/25 dark:text-green-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            )}
                          >
                            <SubIcon className="h-3 w-3" />
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center space-x-2"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>

              {/* Breadcrumb will be handled by individual pages */}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-green-700">AC</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
