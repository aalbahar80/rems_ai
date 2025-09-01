'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  Settings,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { AdminLayout } from '@/components/shared/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, currentFirm } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  // Mock setup checklist - in real app this would come from API
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      task: 'Create Firm Profile',
      completed: true,
      href: '/admin/onboarding/firm',
    },
    {
      id: 2,
      task: 'Configure Basic Settings',
      completed: false,
      href: '/admin/onboarding/settings',
    },
    {
      id: 3,
      task: 'Add Team Member',
      completed: false,
      href: '/admin/onboarding/users',
    },
    {
      id: 4,
      task: 'Setup Payment Gateway',
      completed: false,
      href: '/admin/integrations',
    },
    {
      id: 5,
      task: 'Configure Email Templates',
      completed: false,
      href: '/admin/settings/email',
    },
    {
      id: 6,
      task: 'Test System Integration',
      completed: false,
      href: '/admin/settings/test',
    },
  ]);

  // Calculate setup progress
  useEffect(() => {
    const completedTasks = checklist.filter((item) => item.completed).length;
    const progress = (completedTasks / checklist.length) * 100;
    setSetupProgress(progress);

    // Show onboarding flow if less than 50% complete
    setIsNewUser(progress < 50);
  }, [checklist]);

  const handleStartOnboarding = () => {
    router.push('/admin/onboarding');
  };

  const toggleTask = (taskId: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Show welcome/onboarding view for new users
  if (isNewUser) {
    return (
      <AdminLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            {/* Welcome Message */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-admin-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-admin-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome {user?.username}! 🎉
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Let&apos;s set up your first firm
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-sm font-medium">Setup Progress:</span>
                <span className="text-sm text-admin-600 font-semibold">
                  Step 1 of 6
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-admin-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(1 / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Setup Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-admin-500" />
                </div>
                <CardTitle className="text-center">Setup Your Firm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Start setting up your property management system with firm
                  configuration, user management, and system settings.
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleStartOnboarding}
                >
                  Start Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Getting Started Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  Getting Started Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {checklist.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          item.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        )}
                      >
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Main dashboard for configured users
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Firm setup complete! 🎉</h1>
            <p className="text-muted-foreground">
              Welcome to your admin dashboard
            </p>
          </div>

          {/* Firm Switcher will be in Header component */}
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Firms"
            value="1"
            className="border-admin-200"
          />
          <MetricCard
            title="Total Users"
            value="1"
            className="border-admin-200"
          />
          <MetricCard
            title="System Health"
            value="100%"
            trend="up"
            change="+2%"
            className="border-admin-200"
          />
          <MetricCard
            title="Integrations"
            value="0/3"
            className="border-admin-200"
          />
        </div>

        {/* Quick Actions & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Background Jobs</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Processing</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/integrations')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Add Payment Gateway
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/settings/email')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure Email Templates
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/import')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Import Property Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Setup Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Firm created</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    2 min ago
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Admin user added</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    5 min ago
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">System initialized</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    10 min ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>
                Setup Progress ({Math.round(setupProgress)}% Complete)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group cursor-pointer hover:bg-accent/50 p-2 rounded-md"
                    onClick={() => toggleTask(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          item.completed && 'line-through text-muted-foreground'
                        )}
                      >
                        {item.task}
                      </span>
                    </div>
                    {!item.completed && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(item.href);
                        }}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
