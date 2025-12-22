const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add any other default headers here, e.g., authorization
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API call failed: ${response.statusText}`);
  }

  return response.json();
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
