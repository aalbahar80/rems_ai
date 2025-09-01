'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Rocket,
  Users,
  Building2,
  Settings,
  CreditCard,
  Globe,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompletedStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'complete';
}

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  priority: 'high' | 'medium' | 'low';
}

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setShowAnimation(true);
  }, []);

  const completedSteps: CompletedStep[] = [
    {
      id: 1,
      title: 'Firm Profile Created',
      description: 'Organization details and branding configured',
      icon: Building2,
      status: 'complete',
    },
    {
      id: 2,
      title: 'Expense Categories Configured',
      description: 'Expense tracking categories set up',
      icon: Settings,
      status: 'complete',
    },
    {
      id: 3,
      title: 'Regional Settings Applied',
      description: 'Language, timezone, and format preferences set',
      icon: Globe,
      status: 'complete',
    },
    {
      id: 4,
      title: 'Financial Configuration Complete',
      description: 'Currency settings and payment rules configured',
      icon: CreditCard,
      status: 'complete',
    },
    {
      id: 5,
      title: 'Business Rules Established',
      description: 'Approval workflows and automation rules set',
      icon: ShieldCheck,
      status: 'complete',
    },
    {
      id: 6,
      title: 'Team Management Ready',
      description: 'Team members and permissions configured',
      icon: Users,
      status: 'complete',
    },
  ];

  const nextSteps: NextStep[] = [
    {
      id: 'properties',
      title: 'Add Your First Property',
      description: 'Start by adding properties to your portfolio',
      icon: Building2,
      href: '/admin/properties/add',
      priority: 'high',
    },
    {
      id: 'tenants',
      title: 'Manage Tenants',
      description: 'Add tenants and set up lease agreements',
      icon: Users,
      href: '/admin/tenants',
      priority: 'high',
    },
    {
      id: 'dashboard',
      title: 'Explore Dashboard',
      description: 'View your property management overview',
      icon: Target,
      href: '/admin',
      priority: 'medium',
    },
    {
      id: 'integrations',
      title: 'Setup Integrations',
      description: 'Connect payment gateways and accounting systems',
      icon: Zap,
      href: '/admin/integrations',
      priority: 'medium',
    },
  ];

  const handleGetStarted = () => {
    router.push('/admin');
  };

  const handleQuickAction = (href: string) => {
    router.push(href);
  };

  const highPrioritySteps = nextSteps.filter(
    (step) => step.priority === 'high'
  );
  const mediumPrioritySteps = nextSteps.filter(
    (step) => step.priority === 'medium'
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className={cn(
              'transition-all duration-1000',
              showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            )}
          >
            <div className="relative inline-flex">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          <h1
            className={cn(
              'text-3xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-300',
              showAnimation
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
          >
            🎉 Setup Complete!
          </h1>

          <p
            className={cn(
              'text-lg text-muted-foreground mb-6 transition-all duration-1000 delay-500',
              showAnimation
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
          >
            Your REMS property management system is ready to use. You&apos;ve
            successfully configured all essential settings.
          </p>

          <div
            className={cn(
              'inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium transition-all duration-1000 delay-700',
              showAnimation
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
          >
            <Rocket className="h-4 w-4" />
            <span>System is operational and ready for use</span>
          </div>
        </div>

        {/* Configuration Summary */}
        <Card
          className={cn(
            'mb-8 transition-all duration-1000 delay-300',
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Configuration Summary</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-start space-x-3 p-3 border rounded-lg bg-green-50 border-green-200 transition-all duration-500',
                      showAnimation
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-4 opacity-0'
                    )}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-green-900">
                        {step.title}
                      </p>
                      <p className="text-xs text-green-700">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div
          className={cn(
            'space-y-6 transition-all duration-1000 delay-500',
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          {/* High Priority Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-admin-600" />
                <span>Recommended Next Steps</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Start here for best results)
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highPrioritySteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleQuickAction(step.href)}
                      className="flex items-start space-x-4 p-4 border rounded-lg text-left hover:border-admin-300 hover:bg-admin-50 transition-all duration-200 hover:shadow-md group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-admin-100 text-admin-600 group-hover:bg-admin-200 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {step.title}
                          </h4>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Priority
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="flex items-center mt-2 text-admin-600 text-sm font-medium">
                          <span>Get started</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Optional Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Additional Options</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Configure when ready)
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediumPrioritySteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleQuickAction(step.href)}
                      className="flex items-start space-x-4 p-4 border rounded-lg text-left hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                          <span>Configure</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Tips */}
        <Card
          className={cn(
            'mt-8 bg-gradient-to-r from-admin-50 to-blue-50 border-admin-200 transition-all duration-1000 delay-700',
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-admin-100 text-admin-600 flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-admin-800 mb-2">
                  Quick Start Tips
                </h4>
                <ul className="text-sm text-admin-700 space-y-1">
                  <li>
                    • Start by adding 1-2 properties to get familiar with the
                    system
                  </li>
                  <li>
                    • Invite key team members early to establish workflows
                  </li>
                  <li>
                    • Set up payment integrations before onboarding tenants
                  </li>
                  <li>
                    • Use the dashboard to monitor key metrics and system health
                  </li>
                  <li>
                    • Check the help documentation for detailed feature guides
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 transition-all duration-1000 delay-900',
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="min-w-[200px] bg-gradient-to-r from-admin-500 to-admin-600 hover:from-admin-600 hover:to-admin-700"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleQuickAction('/admin/properties/add')}
            className="min-w-[200px]"
          >
            Add First Property
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Footer Note */}
        <div
          className={cn(
            'text-center mt-8 transition-all duration-1000 delay-1000',
            showAnimation ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p className="text-sm text-muted-foreground">
            <strong>Need help?</strong> Check our documentation or contact
            support anytime. You can always modify these settings later from the
            admin panel.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
