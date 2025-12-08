import { useMemo } from 'react';
import { createApiClient, CloakApiClient } from '@/lib/apiClient';

/**
 * Hook to get the API client instance
 * Creates a singleton instance that persists across renders
 */
export function useApiClient(): CloakApiClient {
  return useMemo(() => createApiClient(), []);
}

