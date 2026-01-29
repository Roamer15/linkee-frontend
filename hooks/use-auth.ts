import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api, { tokenStorage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
} from '@/lib/types';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post('api/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.access_token, data.refresh_token);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      const response = await api.post('api/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
      const response = await api.post('api/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      router.push('/dashboard');
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
      const response = await api.post('api/auth/resend-otp', data);
      return response.data;
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post('api/auth/logout');
    },
    onSuccess: () => {
      logout();
      router.push('/');
    },
    onError: () => {
      // Even if the server request fails, clear local state
      logout();
      router.push('/');
    },
  });
}

export function useGoogleAuth() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const initiateGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return { initiateGoogleAuth };
}
