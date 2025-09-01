'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  DollarSign,
  Bell,
  Settings,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, FormField } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BusinessRules {
  // Approval Thresholds
  ownerApprovalThreshold: number;
  adminApprovalThreshold: number;
  autoApprovalLimit: number;

  // Workflow Settings
  enableAutoApproval: boolean;
  requireOwnerApproval: boolean;
  escalationTimeHours: number;

  // Security Deposit Rules
  securityDepositMultiplier: number;
  securityDepositMinimum: number;
  securityDepositMaximum: number;

  // Maintenance Settings
  urgentMaintenanceThreshold: number;
  autoAssignMaintenance: boolean;
  maintenanceNotificationDelay: number;

  // Automation Rules
  enableLatePaymentReminders: boolean;
  latePaymentReminderDays: number[];
  enableMaintenanceReminders: boolean;
  enableLeaseExpirationAlerts: boolean;
  leaseExpirationAlertDays: number;

  // Notification Settings
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  enablePushNotifications: boolean;
}

interface ApprovalWorkflow {
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function BusinessRulesPage() {
  const router = useRouter();

  const [rules, setRules] = useState<BusinessRules>({
    // Approval Thresholds
    ownerApprovalThreshold: 1000,
    adminApprovalThreshold: 500,
    autoApprovalLimit: 100,

    // Workflow Settings
    enableAutoApproval: true,
    requireOwnerApproval: true,
    escalationTimeHours: 48,

    // Security Deposit Rules
    securityDepositMultiplier: 1.5,
    securityDepositMinimum: 500,
    securityDepositMaximum: 5000,

    // Maintenance Settings
    urgentMaintenanceThreshold: 500,
    autoAssignMaintenance: false,
    maintenanceNotificationDelay: 24,

    // Automation Rules
    enableLatePaymentReminders: true,
    latePaymentReminderDays: [3, 7, 14],
    enableMaintenanceReminders: true,
    enableLeaseExpirationAlerts: true,
    leaseExpirationAlertDays: 60,

    // Notification Settings
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvalWorkflows: ApprovalWorkflow[] = [
    {
      type: 'auto',
      name: 'Auto-Approval',
      description: 'Expenses under limit are automatically approved',
      icon: Zap,
    },
    {
      type: 'admin',
      name: 'Admin Approval',
      description: 'Mid-range expenses require admin approval',
      icon: Settings,
    },
    {
      type: 'owner',
      name: 'Owner Approval',
      description: 'High-value expenses require owner approval',
      icon: Users,
    },
  ];

  const updateRule = <K extends keyof BusinessRules>(
    key: K,
    value: BusinessRules[K]
  ) => {
    setRules((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleReminderDay = (day: number) => {
    setRules((prev) => ({
      ...prev,
      latePaymentReminderDays: prev.latePaymentReminderDays.includes(day)
        ? prev.latePaymentReminderDays.filter((d) => d !== day)
        : [...prev.latePaymentReminderDays, day].sort((a, b) => a - b),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual API call
      console.log('Business rules:', rules);

      // Navigate to next step
      router.push('/admin/onboarding/team');
    } catch (error) {
      console.error('Failed to save business rules:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/onboarding/financial');
  };

  const reminderDayOptions = [1, 3, 7, 14, 30];

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">Business Rules Configuration</h1>
            <p className="text-muted-foreground">
              Step 5 of 6 - Set up approval workflows and automation rules
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-admin-600 font-medium">Step 5 of 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-admin-500 h-2 rounded-full w-[83.33%]"></div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Approval Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Approval Workflow</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Configure approval thresholds for different types of expenses
                and requests.
              </p>

              {/* Workflow Overview */}
              <div className="space-y-3">
                {approvalWorkflows.map((workflow, index) => {
                  const Icon = workflow.icon;
                  let threshold = 0;
                  let range = '';

                  if (workflow.type === 'auto') {
                    threshold = rules.autoApprovalLimit;
                    range = `Up to ${threshold} KWD`;
                  } else if (workflow.type === 'admin') {
                    threshold = rules.adminApprovalThreshold;
                    range = `${rules.autoApprovalLimit + 1} - ${threshold} KWD`;
                  } else if (workflow.type === 'owner') {
                    threshold = rules.ownerApprovalThreshold;
                    range = `Above ${rules.adminApprovalThreshold} KWD`;
                  }

                  return (
                    <div
                      key={workflow.type}
                      className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-admin-100 text-admin-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workflow.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{range}</p>
                        <p className="text-xs text-muted-foreground">
                          Amount Range
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Threshold Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Auto-Approval Limit">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="10"
                      value={rules.autoApprovalLimit}
                      onChange={(e) =>
                        updateRule(
                          'autoApprovalLimit',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">KWD</span>
                  </div>
                </FormField>

                <FormField label="Admin Approval Limit">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="50"
                      value={rules.adminApprovalThreshold}
                      onChange={(e) =>
                        updateRule(
                          'adminApprovalThreshold',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">KWD</span>
                  </div>
                </FormField>

                <FormField label="Owner Approval Limit">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={rules.ownerApprovalThreshold}
                      onChange={(e) =>
                        updateRule(
                          'ownerApprovalThreshold',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">KWD</span>
                  </div>
                </FormField>
              </div>

              {/* Workflow Options */}
              <div className="space-y-4">
                <FormField label="Workflow Settings">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Enable Auto-Approval</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically approve expenses under the limit
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateRule(
                            'enableAutoApproval',
                            !rules.enableAutoApproval
                          )
                        }
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          rules.enableAutoApproval
                            ? 'bg-admin-500'
                            : 'bg-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            rules.enableAutoApproval
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Require Owner Approval</p>
                        <p className="text-sm text-muted-foreground">
                          High-value expenses must be approved by property owner
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateRule(
                            'requireOwnerApproval',
                            !rules.requireOwnerApproval
                          )
                        }
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          rules.requireOwnerApproval
                            ? 'bg-admin-500'
                            : 'bg-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            rules.requireOwnerApproval
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </FormField>

                <FormField label="Escalation Time">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={rules.escalationTimeHours}
                      onChange={(e) =>
                        updateRule(
                          'escalationTimeHours',
                          parseInt(e.target.value) || 24
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      hours before escalating to next level
                    </span>
                  </div>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Security Deposit Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Security Deposit Rules</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure security deposit calculation and limits.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Deposit Multiplier">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={rules.securityDepositMultiplier}
                      onChange={(e) =>
                        updateRule(
                          'securityDepositMultiplier',
                          parseFloat(e.target.value) || 1
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      × rent
                    </span>
                  </div>
                </FormField>

                <FormField label="Minimum Deposit">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="50"
                      value={rules.securityDepositMinimum}
                      onChange={(e) =>
                        updateRule(
                          'securityDepositMinimum',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">KWD</span>
                  </div>
                </FormField>

                <FormField label="Maximum Deposit">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={rules.securityDepositMaximum}
                      onChange={(e) =>
                        updateRule(
                          'securityDepositMaximum',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">KWD</span>
                  </div>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Automation Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Automation & Notifications</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment Reminders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Late Payment Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send automatic reminders for overdue payments
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateRule(
                        'enableLatePaymentReminders',
                        !rules.enableLatePaymentReminders
                      )
                    }
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      rules.enableLatePaymentReminders
                        ? 'bg-admin-500'
                        : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        rules.enableLatePaymentReminders
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {rules.enableLatePaymentReminders && (
                  <FormField label="Send reminders after">
                    <div className="flex flex-wrap gap-2">
                      {reminderDayOptions.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleReminderDay(day)}
                          className={cn(
                            'px-3 py-1 border rounded-full text-sm transition-colors',
                            rules.latePaymentReminderDays.includes(day)
                              ? 'border-admin-500 bg-admin-50 text-admin-700'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {day} day{day !== 1 ? 's' : ''}
                          {rules.latePaymentReminderDays.includes(day) && (
                            <Check className="inline h-3 w-3 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </FormField>
                )}
              </div>

              {/* Maintenance Reminders */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Maintenance Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Notify about scheduled maintenance and inspections
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateRule(
                      'enableMaintenanceReminders',
                      !rules.enableMaintenanceReminders
                    )
                  }
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    rules.enableMaintenanceReminders
                      ? 'bg-admin-500'
                      : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      rules.enableMaintenanceReminders
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              {/* Lease Expiration Alerts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Lease Expiration Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when lease agreements are approaching expiration
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateRule(
                        'enableLeaseExpirationAlerts',
                        !rules.enableLeaseExpirationAlerts
                      )
                    }
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      rules.enableLeaseExpirationAlerts
                        ? 'bg-admin-500'
                        : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        rules.enableLeaseExpirationAlerts
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {rules.enableLeaseExpirationAlerts && (
                  <FormField label="Alert days before expiration">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={rules.leaseExpirationAlertDays}
                        onChange={(e) =>
                          updateRule(
                            'leaseExpirationAlertDays',
                            parseInt(e.target.value) || 60
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        days
                      </span>
                    </div>
                  </FormField>
                )}
              </div>

              {/* Notification Channels */}
              <FormField label="Notification Channels">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        📧
                      </div>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateRule(
                          'enableEmailNotifications',
                          !rules.enableEmailNotifications
                        )
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        rules.enableEmailNotifications
                          ? 'bg-admin-500'
                          : 'bg-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          rules.enableEmailNotifications
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                        📱
                      </div>
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Send urgent notifications via SMS
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateRule(
                          'enableSMSNotifications',
                          !rules.enableSMSNotifications
                        )
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        rules.enableSMSNotifications
                          ? 'bg-admin-500'
                          : 'bg-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          rules.enableSMSNotifications
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                        🔔
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          In-app push notifications
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateRule(
                          'enablePushNotifications',
                          !rules.enablePushNotifications
                        )
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        rules.enablePushNotifications
                          ? 'bg-admin-500'
                          : 'bg-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          rules.enablePushNotifications
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </FormField>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-admin-50 border-admin-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-admin-800 mb-3">
                Business Rules Summary
              </h4>
              <div className="space-y-2 text-sm text-admin-700">
                <div className="flex justify-between">
                  <span>Auto-approval limit:</span>
                  <span className="font-medium">
                    {rules.autoApprovalLimit} KWD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Admin approval limit:</span>
                  <span className="font-medium">
                    {rules.adminApprovalThreshold} KWD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Security deposit:</span>
                  <span className="font-medium">
                    {rules.securityDepositMultiplier}× rent
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Late payment reminders:</span>
                  <span className="font-medium">
                    {rules.enableLatePaymentReminders
                      ? `After ${rules.latePaymentReminderDays.join(', ')} days`
                      : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Notification channels:</span>
                  <span className="font-medium">
                    {[
                      rules.enableEmailNotifications && 'Email',
                      rules.enableSMSNotifications && 'SMS',
                      rules.enablePushNotifications && 'Push',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
