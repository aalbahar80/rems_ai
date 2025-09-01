'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Settings,
  Users,
  CreditCard,
  Globe,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  completed: boolean;
  estimated: string;
}

export default function OnboardingLanding() {
  const router = useRouter();

  // Mock onboarding steps based on wireframes
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: 'Create Firm Profile',
      description:
        'Set up your organization details, logo, and basic information',
      icon: Building2,
      href: '/admin/onboarding/firm',
      completed: false,
      estimated: '3 min',
    },
    {
      id: 2,
      title: 'Configure Expense Categories',
      description: 'Set up expense categories and tax-deductible settings',
      icon: Settings,
      href: '/admin/onboarding/expenses',
      completed: false,
      estimated: '2 min',
    },
    {
      id: 3,
      title: 'Language & Regional Settings',
      description: 'Configure localization, date formats, and timezone',
      icon: Globe,
      href: '/admin/onboarding/regional',
      completed: false,
      estimated: '2 min',
    },
    {
      id: 4,
      title: 'Financial Settings',
      description: 'Set base currency, exchange rates, and late fee policies',
      icon: CreditCard,
      href: '/admin/onboarding/financial',
      completed: false,
      estimated: '3 min',
    },
    {
      id: 5,
      title: 'Business Rules',
      description: 'Configure approval thresholds and automation settings',
      icon: ShieldCheck,
      href: '/admin/onboarding/rules',
      completed: false,
      estimated: '4 min',
    },
    {
      id: 6,
      title: 'Add Team Members',
      description: 'Invite accountants and staff to your organization',
      icon: Users,
      href: '/admin/onboarding/team',
      completed: false,
      estimated: '5 min',
    },
  ]);

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepClick = (step: OnboardingStep) => {
    router.push(step.href);
  };

  const handleSkipSetup = () => {
    router.push('/admin');
  };

  const totalEstimatedTime = steps.reduce((total, step) => {
    const minutes = parseInt(step.estimated);
    return total + minutes;
  }, 0);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Setup Wizard</h1>
          <p className="text-muted-foreground mb-6">
            Let&apos;s get your property management system configured. Complete
            these steps in any order.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-sm font-medium">
              Portfolio Setup Progress:
            </span>
            <span className="text-sm text-admin-600 font-semibold">
              {completedSteps} of {steps.length} complete
            </span>
            <span className="text-xs text-muted-foreground">
              (~{totalEstimatedTime} min total)
            </span>
          </div>

          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <div
              className="bg-admin-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Setup Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-2 border-dashed border-gray-300 hover:border-admin-300 transition-colors">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-admin-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">I have property data ready</h3>
              <p className="text-sm text-muted-foreground">
                Complete setup quickly with existing data
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 hover:border-admin-300 transition-colors">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-admin-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                I need to collect information
              </h3>
              <p className="text-sm text-muted-foreground">
                Take your time and gather data as you go
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.id}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1',
                  step.completed
                    ? 'border-green-200 bg-green-50'
                    : 'hover:border-admin-300'
                )}
                onClick={() => handleStepClick(step)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg',
                        step.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-admin-100 text-admin-600'
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {step.estimated}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        step.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {step.completed ? 'Complete' : 'Pending'}
                    </span>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-admin-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            onClick={() => handleStepClick(steps[0])}
            className="min-w-[200px]"
          >
            Start with Firm Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleSkipSetup}
            className="min-w-[200px]"
          >
            Skip Setup for Now
          </Button>
        </div>

        {/* Help Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> You can complete these steps in any order
            based on your needs. All settings can be changed later from the
            admin panel.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
