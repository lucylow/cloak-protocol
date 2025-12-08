// Enhanced API Client for Cloak Protocol
// Comprehensive error handling, retry logic, and type-safe requests

import { ERROR_MESSAGES } from './enhancedMockData';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};

export class CloakApiClient {
  private config: ApiConfig;
  private wsConnection: WebSocket | null = null;
  private wsReconnectAttempts = 0;
  private maxWsReconnectAttempts = 5;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Generic HTTP request with retry logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic
      if (retryCount < this.config.retries) {
        await this.delay(this.config.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      // Handle specific error types
      let errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      let errorCode = 'NETWORK_ERROR';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout. Please try again.';
          errorCode = 'TIMEOUT';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = ERROR_MESSAGES.BACKEND_UNAVAILABLE;
          errorCode = 'BACKEND_UNAVAILABLE';
        } else {
          errorMessage = error.message;
          errorCode = 'UNKNOWN_ERROR';
        }
      }

      return {
        success: false,
        error: errorMessage,
        code: errorCode
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    psy_sync_status: string;
    block_height: number;
    connected_peers: number;
  }>> {
    return this.request('/health');
  }

  // Submit ZK proof
  async submitProof(data: {
    user_sdkey: string;
    proof_data: string;
    public_inputs: string[];
    signature: string;
  }): Promise<ApiResponse<{
    proof_id: string;
    status: string;
    tx_hash?: string;
  }>> {
    return this.request('/api/proof/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Query user state
  async queryState(userSdkey: string): Promise<ApiResponse<{
    balances: Array<{ token: string; amount: number; privacy_status: string }>;
    positions: any[];
    orders: any[];
  }>> {
    return this.request('/api/state/query', {
      method: 'POST',
      body: JSON.stringify({ user_sdkey: userSdkey })
    });
  }

  // Get orders
  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.request('/api/orders');
  }

  // Get positions
  async getPositions(): Promise<ApiResponse<any[]>> {
    return this.request('/api/positions');
  }

  // Get proofs
  async getProofs(): Promise<ApiResponse<any[]>> {
    return this.request('/api/proofs');
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = this.config.baseUrl.replace('http', 'ws') + '/ws';
    
    try {
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log('WebSocket connected');
        this.wsReconnectAttempts = 0;
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptWebSocketReconnect(onMessage, onError);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (onError) {
        onError(error as Event);
      }
    }
  }

  private attemptWebSocketReconnect(onMessage: (data: any) => void, onError?: (error: Event) => void): void {
    if (this.wsReconnectAttempts < this.maxWsReconnectAttempts) {
      this.wsReconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.wsReconnectAttempts), 30000);
      
      console.log(`Attempting WebSocket reconnect in ${delay}ms (attempt ${this.wsReconnectAttempts}/${this.maxWsReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(onMessage, onError);
      }, delay);
    } else {
      console.error('Max WebSocket reconnect attempts reached');
    }
  }

  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Utility function for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let apiClientInstance: CloakApiClient | null = null;

export function getApiClient(config?: Partial<ApiConfig>): CloakApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new CloakApiClient(config);
  }
  return apiClientInstance;
}

// Mock mode fallback for Lovable hosting
export class MockApiClient extends CloakApiClient {
  async healthCheck() {
    await this.delay(100);
    return {
      success: true,
      data: {
        status: 'healthy',
        psy_sync_status: 'synced',
        block_height: 12345,
        connected_peers: 4
      }
    };
  }

  async submitProof(data: any) {
    await this.delay(2000);
    return {
      success: true,
      data: {
        proof_id: `PROOF-${Date.now()}`,
        status: 'submitted',
        tx_hash: `0x${Math.random().toString(16).substring(2, 66)}`
      }
    };
  }

  async queryState(userSdkey: string) {
    await this.delay(500);
    return {
      success: true,
      data: {
        balances: [
          { token: 'RWA-CREDIT-01', amount: 125.4, privacy_status: 'shielded' }
        ],
        positions: [],
        orders: []
      }
    };
  }

  async getOrders() {
    await this.delay(300);
    return {
      success: true,
      data: []
    };
  }

  async getPositions() {
    await this.delay(300);
    return {
      success: true,
      data: []
    };
  }

  async getProofs() {
    await this.delay(300);
    return {
      success: true,
      data: []
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Auto-detect mode based on environment
export function createApiClient(): CloakApiClient {
  const useMockMode = import.meta.env.VITE_USE_MOCK_API === 'true' || 
                       import.meta.env.MODE === 'development';
  
  if (useMockMode) {
    console.log('Using Mock API Client for development/Lovable hosting');
    return new MockApiClient();
  }
  
  return getApiClient();
}
