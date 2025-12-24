const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal: controller.signal, ...config });
    const text = await response.text();
    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const parsed = text ? JSON.parse(text) : null;
        errorMsg = parsed?.message || errorMsg;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(errorMsg || `API call failed: ${response.status}`);
    }

    if (!text) return ({} as T);
    return JSON.parse(text) as T;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const geminiService = {
  getTips: async (prompt: string): Promise<{ text: string }> => {
    return apiCall('/gemini/tips', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  generateImage: async (prompt: string): Promise<{ imageUrl: string }> => {
    return apiCall('/gemini/image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },
};

export const recipeService = {
  search: async (term: string, userId: string): Promise<any[]> => {
    if (!term.trim()) return [];
    return apiCall<any[]>(`/recipes/search?term=${encodeURIComponent(term)}&userId=${encodeURIComponent(userId)}`);
  },
};
