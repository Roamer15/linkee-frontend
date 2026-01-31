'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  QrCode,
  Lock,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  ImageIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Link as LinkType } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface LinksTableProps {
  links?: LinkType[];
  isLoading?: boolean;
}

function LinkCard({ link }: { link: LinkType }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${BASE_URL}/${link.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <Card className="hover:shadow-md transition-all hover:border-primary/50 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Preview Image */}
          {link.previewImage && (
            <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={link.previewImage}
                alt={link.title || 'Link preview'}
                fill
                className="object-cover"
                sizes="128px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          {!link.previewImage && (
            <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}

          {/* Left side - Link info */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title or original URL */}
            <div>
              <h3 className="font-semibold text-lg mb-1 truncate">
                {link.title || 'Untitled Link'}
              </h3>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground truncate block max-w-125 hover:underline"
              >
                {link.originalUrl}
              </a>
            </div>

            {/* Short URL with badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-mono text-sm font-medium text-primary">
                  {shortUrl}
                </span>
                {link.passwordHash && (
                  <Lock className="h-3.5 w-3.5 text-primary" />
                )}
              </div>

              {!link.isActive ? (
                <Badge variant="secondary">Inactive</Badge>
              ) : isExpired ? (
                <Badge variant="destructive">Expired</Badge>
              ) : (
                <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  Active
                </Badge>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {link.clickCount.toLocaleString()}
                </span>
                <span>clicks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(link.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-start gap-2">
            <Button
              size="lg"
              variant="outline"
              onClick={handleCopy}
              className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="hover:bg-primary/5">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/analytics/${link.id}`}
                    className="cursor-pointer"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Link
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/qr/${link.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${link.shortCode}-qr.png`}
                    className="cursor-pointer"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Download QR Code
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  Delete Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LinksTable({ links, isLoading }: LinksTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No links found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {links === undefined
              ? 'Create your first short link to get started.'
              : 'Try adjusting your search or filters.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
