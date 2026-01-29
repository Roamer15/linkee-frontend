'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLinks } from '@/hooks/use-links';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check, ExternalLink, BarChart3, QrCode, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { Link as LinkType } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SHORT_URL || 'http://localhost:3000';

function LinkRow({ link }: { link: LinkType }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${BASE_URL}/${link.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{shortUrl}</span>
            {link.passwordHash && <Lock className="h-3 w-3 text-muted-foreground" />}
          </div>
          {link.title && (
            <span className="text-sm text-muted-foreground">{link.title}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-[200px]">
        <span className="truncate block text-sm text-muted-foreground">
          {link.originalUrl}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span>{link.clickCount}</span>
        </div>
      </TableCell>
      <TableCell>
        {!link.isActive ? (
          <Badge variant="secondary">Inactive</Badge>
        ) : isExpired ? (
          <Badge variant="destructive">Expired</Badge>
        ) : (
          <Badge variant="default">Active</Badge>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(link.createdAt)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button size="icon-sm" variant="ghost" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button size="icon-sm" variant="ghost" asChild>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          {link.qrCodeUrl && (
            <Button size="icon-sm" variant="ghost" asChild>
              <a href={link.qrCodeUrl} target="_blank" rel="noopener noreferrer">
                <QrCode className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button size="icon-sm" variant="ghost" asChild>
            <Link href={`/dashboard/analytics/${link.id}`}>
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function LinksTable() {
  const { data: links, isLoading, error } = useLinks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load links. Please try again.
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No links yet.</p>
        <p className="text-sm text-muted-foreground">
          Create your first short link to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short Link</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
