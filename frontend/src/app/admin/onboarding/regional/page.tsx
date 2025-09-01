'use client';

import { AdminLayout } from '@/components/shared/layout';

export default function RegionalSettingsPage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Language & Regional Settings</h1>
        <p className="text-muted-foreground">
          Step 3 of 6 - Configure localization and regional preferences
        </p>
        <div className="mt-8">
          <p>
            Basic regional page working - components will be added back step by
            step
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
