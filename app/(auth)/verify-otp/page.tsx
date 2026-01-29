'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useVerifyOtp, useResendOtp } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';
import { AxiosError } from 'axios';

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp.mutate(
      { email, otp },
      {
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast.error(axiosError.response?.data?.message || 'Invalid OTP');
        },
      }
    );
  };

  const handleResend = () => {
    resendOtp.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success('OTP sent! Check your email.');
          setCanResend(false);
          setCountdown(60);
        },
        onError: (error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          toast.error(axiosError.response?.data?.message || 'Failed to resend OTP');
        },
      }
    );
  };

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Request</CardTitle>
          <CardDescription>No email address provided.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/register">
            <Button>Go to Register</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Check your email
        </CardTitle>
        <CardDescription className="text-center">
          We sent a verification code to <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={verifyOtp.isPending || otp.length !== 6}
          >
            {verifyOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Didn&apos;t receive the code?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtp.isPending}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {resendOtp.isPending ? 'Sending...' : 'Resend'}
            </button>
          ) : (
            <span className="text-muted-foreground">
              Resend in {countdown}s
            </span>
          )}
        </p>
        <Link
          href="/register"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Use a different email
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
