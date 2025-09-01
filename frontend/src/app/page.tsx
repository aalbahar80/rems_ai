import Link from 'next/link';
import { Building2, Users, BarChart3, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PublicLayout } from '@/components/shared/layout';

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">REMS</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline">Schedule Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Open REMS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Modern Property Management for Growing Firms
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="xl" className="px-8">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Complete Property Management Solution
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to manage properties, tenants, and finances in
            one integrated platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center card-hover">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Manage Properties</h3>
              <p className="text-sm text-muted-foreground">
                Centralized property portfolio management with multi-tenant
                support
              </p>
            </Card>

            <Card className="p-6 text-center card-hover">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Streamline Finances
              </h3>
              <p className="text-sm text-muted-foreground">
                Automated invoicing, expense tracking, and financial reporting
              </p>
            </Card>

            <Card className="p-6 text-center card-hover">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Tenant Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Digital tenant portal with payment processing and communication
              </p>
            </Card>

            <Card className="p-6 text-center card-hover">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Maintenance Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Work order management with vendor coordination and tracking
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-8">
          <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/support" className="hover:text-foreground">
              Support
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            © 2024 REMS. All rights reserved.
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
}
