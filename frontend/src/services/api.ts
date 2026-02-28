import { useAuth0 } from '@auth0/auth0-react';

// Use Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  const request = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  };

  return {
    // GET live data for the graph
    getLiveData: () => request('/api/data'),
    
    // GET AI advice from Gemini
    getAdvice: () => request('/api/advice'),
    
    // POST biometrics data from hardware
    sendBiometrics: (hr: number, spo2: number, strain: number) =>
      request('/api/biometrics', {
        method: 'POST',
        body: JSON.stringify({ hr, spo2, strain }),
      }),
  };
};
