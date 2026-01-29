'use client';

import { useState } from 'react';
import { useLinks } from '@/hooks/use-links';
import { CreateLinkDialog } from '@/components/create-link-dialog';
import { LinksTable } from '@/components/links-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Link2,
  MousePointerClick,
  TrendingUp,
  Globe,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: links, isLoading } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const totalLinks = links?.length || 0;
  const totalClicks = links?.reduce((sum, link) => sum + link.clickCount, 0) || 0;
  const activeLinks = links?.filter((link) => link.isActive).length || 0;

  // Filter links based on search
  const filteredLinks = links?.filter(
    (link) =>
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            My Links
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track all your shortened links
          </p>
        </div>
        <CreateLinkDialog>
          <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25">
            <Plus className="h-5 w-5" />
            Create New Link
          </Button>
        </CreateLinkDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalLinks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeLinks} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per link
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {links && links.length > 0
                    ? Math.max(...links.map((l) => l.clickCount))
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Best link
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links by title, code, or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Links</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <LinksTable links={filteredLinks} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <LinksTable
            links={filteredLinks?.filter((link) => link.isActive)}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <LinksTable
            links={filteredLinks?.filter((link) => !link.isActive)}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
