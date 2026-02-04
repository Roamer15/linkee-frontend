// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

// Auth types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse extends AuthTokens {
  message: string;
  user: User;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

// Link types
export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  passwordHash?: string;
  isActive: boolean;
  expiresAt?: string;
  title?: string;
  previewImage?: string;
  qrCodeUrl?: string;
  clickCount: number;
  lastClickedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customCode?: string;
  password?: string;
  title?: string;
  expiresAt?: string;
}

export interface CreateLinkResponse {
  savedLink: Link;
  shortUrl: string;
}

export interface UpdateLinkRequest {
  originalUrl?: string;
  title?: string;
  isActive?: boolean;
}

// Analytics types
export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
  bot: number;
}

export interface GeoData {
  country: string;
  clicks: number;
}

export interface AnalyticsOverview {
  totalClicks: number;
  uniqueVisitors: number;
  deviceBreakdown: DeviceBreakdown;
  topCountries: GeoData[];
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
}

export interface ReferrerData {
  referrer: string;
  clicks: number;
}

// API Error
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
