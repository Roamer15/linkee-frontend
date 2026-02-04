'use client';

import { useState, useEffect } from 'react';
import { useUpdateLink } from '@/hooks/use-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Pencil } from 'lucide-react';
import { AxiosError } from 'axios';
import type { Link } from '@/lib/types';

interface EditLinkDialogProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLinkDialog({ link, open, onOpenChange }: EditLinkDialogProps) {
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [title, setTitle] = useState(link.title || '');
  const [isActive, setIsActive] = useState(link.isActive);

  const updateLink = useUpdateLink();

  // Reset form when link changes or dialog opens
  useEffect(() => {
    if (open) {
      setOriginalUrl(link.originalUrl);
      setTitle(link.title || '');
      setIsActive(link.isActive);
    }
  }, [open, link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLink.mutate(
      {
        id: link.id,
        data: {
          originalUrl: originalUrl !== link.originalUrl ? originalUrl : undefined,
          title: title !== link.title ? title : undefined,
          isActive: isActive !== link.isActive ? isActive : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Link updated successfully!');
          onOpenChange(false);
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string | string[] }>;
          const message = axiosError.response?.data?.message;
          if (Array.isArray(message)) {
            message.forEach((m) => toast.error(m));
          } else {
            toast.error(message || 'Failed to update link');
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Link
          </DialogTitle>
          <DialogDescription>
            Update your short link settings. The short code cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shortCode">Short Code</Label>
              <Input
                id="shortCode"
                value={link.shortCode}
                disabled
                className="font-mono bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Destination URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="My awesome link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive links will not redirect
                </p>
              </div>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLink.isPending}>
              {updateLink.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
