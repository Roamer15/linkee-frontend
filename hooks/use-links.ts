import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Link,
  CreateLinkRequest,
  CreateLinkResponse,
  UpdateLinkRequest,
  AnalyticsOverview,
  TimeSeriesData,
  ReferrerData,
} from '@/lib/types';

// Query keys
export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (filters: string) => [...linkKeys.lists(), { filters }] as const,
  details: () => [...linkKeys.all, 'detail'] as const,
  detail: (id: string) => [...linkKeys.details(), id] as const,
};

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (linkId: string) => [...analyticsKeys.all, 'overview', linkId] as const,
  timeseries: (linkId: string, startDate?: string, endDate?: string) =>
    [...analyticsKeys.all, 'timeseries', linkId, { startDate, endDate }] as const,
  referrers: (linkId: string) => [...analyticsKeys.all, 'referrers', linkId] as const,
};

// Links hooks
export function useLinks() {
  return useQuery({
    queryKey: linkKeys.lists(),
    queryFn: async (): Promise<Link[]> => {
      const response = await api.get('api/links');
      return response.data;
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
      const response = await api.post('api/links', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLinkRequest;
    }): Promise<Link> => {
      const response = await api.patch(`api/links/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`api/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
    },
  });
}

// Analytics hooks
export function useAnalyticsOverview(linkId: string) {
  return useQuery({
    queryKey: analyticsKeys.overview(linkId),
    queryFn: async (): Promise<AnalyticsOverview> => {
      const response = await api.get(`api/analytics/${linkId}/overview`);
      return response.data;
    },
    enabled: !!linkId,
  });
}

export function useAnalyticsTimeseries(
  linkId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: analyticsKeys.timeseries(linkId, startDate, endDate),
    queryFn: async (): Promise<TimeSeriesData[]> => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const response = await api.get(
        `api/analytics/${linkId}/timeseries${params.toString() ? `?${params}` : ''}`
      );
      return response.data;
    },
    enabled: !!linkId,
  });
}

export function useAnalyticsReferrers(linkId: string) {
  return useQuery({
    queryKey: analyticsKeys.referrers(linkId),
    queryFn: async (): Promise<ReferrerData[]> => {
      const response = await api.get(`api/analytics/${linkId}/referrers`);
      return response.data;
    },
    enabled: !!linkId,
  });
}
