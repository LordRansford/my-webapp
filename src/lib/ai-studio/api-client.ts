/**
 * AI Studio API Client
 * 
 * Centralized API client with error handling, retries, and type safety
 */

export interface ApiResponse<T> {
  data: T;
  requestId: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
}

/**
 * Custom error class for API errors
 */
export class AIStudioApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = "AIStudioApiError";
  }
}

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_CONFIG: Required<ApiClientConfig> = {
  baseUrl: "/api/ai-studio",
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};

/**
 * AI Studio API Client
 */
export class AIStudioApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Make a request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error = data.error || {
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred",
        };

        // Retry on 5xx errors
        if (
          response.status >= 500 &&
          retryCount < this.config.retries
        ) {
          await this.delay(this.config.retryDelay * (retryCount + 1));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        throw new AIStudioApiError(
          error.code,
          error.message,
          response.status,
          error.details
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AIStudioApiError) {
        throw error;
      }

      // Retry on network errors
      if (retryCount < this.config.retries) {
        await this.delay(this.config.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw new AIStudioApiError(
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Network request failed",
        0
      );
    }
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))
      : "";
    const response = await this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: "DELETE",
    });
    return response.data;
  }

  /**
   * Upload file
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AIStudioApiError(
        error.error?.code || "UPLOAD_ERROR",
        error.error?.message || "File upload failed",
        response.status,
        error.error?.details
      );
    }

    const data = await response.json();
    return data.data;
  }
}

/**
 * Default API client instance
 */
export const apiClient = new AIStudioApiClient();

/**
 * Convenience functions using default client
 */
export const api = {
  datasets: {
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      apiClient.get("/datasets", params),
    get: (id: string) => apiClient.get(`/datasets/${id}`),
    create: (data: any) => apiClient.post("/datasets", data),
    update: (id: string, data: any) => apiClient.put(`/datasets/${id}`, data),
    delete: (id: string) => apiClient.delete(`/datasets/${id}`),
    upload: (file: File, metadata: { name: string; license: string; description?: string }) =>
      apiClient.uploadFile("/datasets/upload", file, metadata),
  },
  models: {
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      apiClient.get("/models", params),
    get: (id: string) => apiClient.get(`/models/${id}`),
    create: (data: any) => apiClient.post("/models", data),
    update: (id: string, data: any) => apiClient.put(`/models/${id}`, data),
    delete: (id: string) => apiClient.delete(`/models/${id}`),
  },
  jobs: {
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      apiClient.get("/jobs", params),
    get: (id: string) => apiClient.get(`/jobs/${id}`),
    create: (data: any) => apiClient.post("/models/train", data),
    cancel: (id: string) => apiClient.post(`/jobs/${id}/cancel`),
  },
  agents: {
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      apiClient.get("/agents", params),
    get: (id: string) => apiClient.get(`/agents/${id}`),
    create: (data: any) => apiClient.post("/agents", data),
    update: (id: string, data: any) => apiClient.put(`/agents/${id}`, data),
    delete: (id: string) => apiClient.delete(`/agents/${id}`),
    run: (data: { agentId: string; input: string; context?: any }) =>
      apiClient.post("/agents/run", data),
  },
  compute: {
    estimate: (data: any) => apiClient.post("/compute/estimate", data),
  },
};

