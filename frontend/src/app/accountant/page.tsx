'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AccountantLayout } from '@/components/accountant/AccountantLayout';
import { cn } from '@/lib/utils';

// Mock data - will be replaced with API calls
const mockDashboardData = {
  firm: {
    name: 'Kuwait Properties LLC',
    logo: null,
    currency: 'KWD',
  },
  metrics: {
    totalProperties: 12,
    totalUnits: 48,
    occupancyRate: 85,
    monthlyRevenue: 15750,
    pendingApprovals: 3,
    overduePayments: 7,
  },
  recentActivity: [
    {
      id: '1',
      type: 'payment',
      description: 'Rent payment received - Unit A-101',
      amount: 450,
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'maintenance',
      description: 'Maintenance request - Plumbing issue',
      property: 'Salmiya Tower',
      time: '4 hours ago',
    },
    {
      id: '3',
      type: 'contract',
      description: 'Contract renewal due - Tenant Ahmed K.',
      time: '1 day ago',
    },
  ],
  urgentTasks: [
    {
      id: '1',
      title: 'Contract Expiring Soon',
      description: '3 contracts expire in next 30 days',
      priority: 'high',
      count: 3,
    },
    {
      id: '2',
      title: 'Pending Expense Approvals',
      description: 'Maintenance expenses awaiting owner approval',
      priority: 'medium',
      count: 2,
    },
    {
      id: '3',
      title: 'Overdue Payments',
      description: 'Rent payments past due date',
      priority: 'high',
      count: 7,
    },
  ],
};

export default function AccountantDashboard() {
  const [data, setData] = useState(mockDashboardData);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'week' | 'month' | 'year'
  >('month');

  return (
    <AccountantLayout>
      <div className="p-6">
        {/* Dashboard Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Welcome back! Here's what's happening with your properties
                today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) =>
                  setSelectedTimeframe(
                    e.target.value as 'week' | 'month' | 'year'
                  )
                }
                className="text-sm border rounded-lg px-3 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Properties
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.metrics.totalProperties}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data.metrics.totalUnits} total units
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Occupancy Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.metrics.occupancyRate}%
                  </p>
                  <p className="text-sm text-green-600">+2% from last month</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.metrics.monthlyRevenue.toLocaleString()}{' '}
                    {data.firm.currency}
                  </p>
                  <p className="text-sm text-green-600">+5% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Overdue Payments
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.metrics.overduePayments}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requires attention
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Priority Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center justify-between p-4 border rounded-lg',
                      task.priority === 'high'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                        : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          task.priority === 'high'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        )}
                      />
                      <div>
                        <p
                          className={cn(
                            'font-medium',
                            task.priority === 'high'
                              ? 'text-red-900 dark:text-red-100'
                              : 'text-yellow-900 dark:text-yellow-100'
                          )}
                        >
                          {task.title}
                        </p>
                        <p
                          className={cn(
                            'text-sm',
                            task.priority === 'high'
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-yellow-700 dark:text-yellow-300'
                          )}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          'text-sm font-medium px-2 py-1 rounded-full',
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        )}
                      >
                        {task.count}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      (window.location.href = '/accountant/properties')
                    }
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Tenants
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        activity.type === 'payment' &&
                          'bg-green-100 text-green-600',
                        activity.type === 'maintenance' &&
                          'bg-orange-100 text-orange-600',
                        activity.type === 'contract' &&
                          'bg-blue-100 text-blue-600'
                      )}
                    >
                      {activity.type === 'payment' && (
                        <DollarSign className="h-4 w-4" />
                      )}
                      {activity.type === 'maintenance' && (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {activity.type === 'contract' && (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      {activity.amount && (
                        <p className="text-sm text-green-600 font-medium">
                          +{activity.amount} {data.firm.currency}
                        </p>
                      )}
                      {activity.property && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.property}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}

                <Button variant="ghost" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccountantLayout>
  );
}
