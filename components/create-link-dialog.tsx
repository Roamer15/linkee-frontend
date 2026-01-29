'use client';

import { useState } from 'react';
import { useCreateLink } from '@/hooks/use-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Link2, Copy, Check } from 'lucide-react';
import { AxiosError } from 'axios';

interface CreateLinkDialogProps {
  children?: React.ReactNode;
}

export function CreateLinkDialog({ children }: CreateLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createLink = useCreateLink();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLink.mutate(
      {
        originalUrl,
        customCode: customCode || undefined,
        title: title || undefined,
        password: password || undefined,
      },
      {
        onSuccess: (data) => {
          setCreatedLink(data.shortUrl);
          toast.success('Link created successfully!');
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string | string[] }>;
          const message = axiosError.response?.data?.message;
          if (Array.isArray(message)) {
            message.forEach((m) => toast.error(m));
          } else {
            toast.error(message || 'Failed to create link');
          }
        },
      }
    );
  };

  const handleCopy = async () => {
    if (createdLink) {
      await navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOriginalUrl('');
    setCustomCode('');
    setTitle('');
    setPassword('');
    setShowAdvanced(false);
    setCreatedLink(null);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            {createdLink ? 'Link Created!' : 'Create Short Link'}
          </DialogTitle>
          <DialogDescription>
            {createdLink
              ? 'Your short link is ready to share.'
              : 'Shorten a long URL to make it easy to share.'}
          </DialogDescription>
        </DialogHeader>
        {createdLink ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input value={createdLink} readOnly className="font-mono" />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button className="w-full" onClick={handleClose}>
              Create Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide' : 'Show'} advanced options
              </Button>
              {showAdvanced && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (optional)</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="My awesome link"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom">Custom Code (optional)</Label>
                    <Input
                      id="custom"
                      type="text"
                      placeholder="my-link"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max 10 characters. Leave empty for auto-generated code.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password Protection (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createLink.isPending}>
                {createLink.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Link
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
