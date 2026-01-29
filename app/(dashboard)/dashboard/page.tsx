'use client';

import { CreateLinkDialog } from '@/components/create-link-dialog';
import { LinksTable } from '@/components/links-table';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground">
            Manage and track all your shortened links
          </p>
        </div>
        <CreateLinkDialog />
      </div>
      <LinksTable />
    </div>
  );
}
