import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all',
  {
    variants: {
      variant: {
        default: 'border-border',
        outline:
          'border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50',
        elevated: 'shadow-lg border-0',
        interactive: 'cursor-pointer hover:shadow-md hover:-translate-y-1',
        // Portal-specific variants
        admin: 'border-admin-200 bg-admin-50/50',
        accountant: 'border-accountant-200 bg-accountant-50/50',
        owner: 'border-owner-200 bg-owner-50/50',
        tenant: 'border-tenant-200 bg-tenant-50/50',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Specialized card components
const DashboardCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn('card-hover', className)}
      variant="elevated"
      {...props}
    >
      {children}
    </Card>
  )
);
DashboardCard.displayName = 'DashboardCard';

const MetricCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }
>(({ className, title, value, change, trend, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn('p-6', className)}
    variant="elevated"
    {...props}
  >
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex items-baseline space-x-2">
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <span
            className={cn('text-xs font-medium', {
              'text-green-600': trend === 'up',
              'text-red-600': trend === 'down',
              'text-gray-600': trend === 'neutral',
            })}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  </Card>
));
MetricCard.displayName = 'MetricCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  DashboardCard,
  MetricCard,
  cardVariants,
};
