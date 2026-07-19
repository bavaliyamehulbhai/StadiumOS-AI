import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSocket } from '../src/socket/hooks/useSocket';
import { SocketContext } from '../src/socket/SocketProvider';

describe('useSocket Hook', () => {
  it('throws an error if used outside of SocketProvider', () => {
    // Suppress console.error for the expected throw
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => renderHook(() => useSocket())).toThrow('useSocket must be used within a SocketProvider');
    
    console.error = originalError;
  });

  it('returns context value when wrapped in provider', () => {
    const mockSocket = { id: '123', emit: vi.fn(), on: vi.fn() };
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={{ socket: mockSocket, isConnected: true }}>
        {children}
      </SocketContext.Provider>
    );

    const { result } = renderHook(() => useSocket(), { wrapper });
    
    expect(result.current.socket).toBe(mockSocket);
    expect(result.current.isConnected).toBe(true);
  });
});
