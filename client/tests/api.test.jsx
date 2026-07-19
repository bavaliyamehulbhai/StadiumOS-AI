import { describe, it, expect } from 'vitest';
import api from '../src/services/api';

describe('API Service', () => {
  it('creates an axios instance with correct defaults', () => {
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('intercepts 401 Unauthorized responses', async () => {
    const errorInterceptor = api.interceptors.response.handlers[0].rejected;
    
    const mockError401 = {
      response: { status: 401 }
    };
    
    await expect(errorInterceptor(mockError401)).rejects.toEqual(mockError401);
    
    const mockError500 = {
      response: { status: 500 }
    };
    await expect(errorInterceptor(mockError500)).rejects.toEqual(mockError500);
  });
});
