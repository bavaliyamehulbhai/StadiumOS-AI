import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizerDashboard from '../src/pages/organizer/Dashboard';
import * as dashboardHooks from '../src/hooks/useDashboard';
import * as socketHooks from '../src/socket/hooks/useSocket';

// Mock Recharts ResponsiveContainer to avoid size errors in jsdom
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '300px' }}>{children}</div>
    ),
  };
});

describe('Organizer Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('displays skeleton loaders while fetching', () => {
    vi.spyOn(dashboardHooks, 'useOrganizerDashboard').mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
    });
    vi.spyOn(socketHooks, 'useSocket').mockReturnValue({
      socket: { on: vi.fn(), off: vi.fn() }
    });

    renderWithRouter(<OrganizerDashboard />);
    expect(screen.getByTestId('skeleton-dashboard')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    vi.spyOn(dashboardHooks, 'useOrganizerDashboard').mockReturnValue({
      isLoading: false,
      data: null,
      isError: true,
      refetch: vi.fn(),
    });
    vi.spyOn(socketHooks, 'useSocket').mockReturnValue({
      socket: { on: vi.fn(), off: vi.fn() }
    });

    renderWithRouter(<OrganizerDashboard />);
    expect(screen.getByText(/Unable to load dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard content successfully and registers socket events', () => {
    const mockData = {
      stats: {
        totalAttendance: 50000,
        activeIncidents: 3,
        staffOnDuty: 150,
      },
      recentActivities: [],
    };

    const mockOn = vi.fn();
    const mockOff = vi.fn();

    vi.spyOn(dashboardHooks, 'useOrganizerDashboard').mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
    });
    vi.spyOn(socketHooks, 'useSocket').mockReturnValue({
      socket: { on: mockOn, off: mockOff }
    });

    const { unmount } = renderWithRouter(<OrganizerDashboard />);
    
    expect(screen.getByText(/Match Day Command Center/i)).toBeInTheDocument();
    expect(mockOn).toHaveBeenCalledWith('dashboard:kpi:updated', expect.any(Function));

    unmount();
    expect(mockOff).toHaveBeenCalledWith('dashboard:kpi:updated');
  });
});
