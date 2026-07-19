import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FanDashboard from '../src/pages/fan/Dashboard';
import * as dashboardHooks from '../src/hooks/useDashboard';

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

describe('Fan Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('displays skeleton loaders while fetching', () => {
    vi.spyOn(dashboardHooks, 'useFanDashboard').mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
    });

    renderWithRouter(<FanDashboard />);
    expect(screen.getByTestId('skeleton-dashboard')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    vi.spyOn(dashboardHooks, 'useFanDashboard').mockReturnValue({
      isLoading: false,
      data: null,
      isError: true,
      refetch: vi.fn(),
    });

    renderWithRouter(<FanDashboard />);
    expect(screen.getByText(/Unable to load dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard content successfully for active match', () => {
    const mockData = {
      stats: {
        upcomingMatch: 'Real Madrid vs FCB',
        myTickets: 2,
      },
      aiSuggestions: ['Arrive 30 mins early'],
      recentNotifs: [{ title: 'Gate changes' }],
    };

    vi.spyOn(dashboardHooks, 'useFanDashboard').mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
    });

    renderWithRouter(<FanDashboard />);
    expect(screen.getByText(/Welcome back to the Stadium/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Madrid vs FCB/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest: Gate changes/i)).toBeInTheDocument();
  });

  it('renders dashboard content successfully for no match', () => {
    const mockData = {
      stats: {
        upcomingMatch: 'No Upcoming Matches',
        myTickets: 0,
      },
      aiSuggestions: [],
      recentNotifs: [],
    };

    vi.spyOn(dashboardHooks, 'useFanDashboard').mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
    });

    renderWithRouter(<FanDashboard />);
    expect(screen.getByText(/Welcome back to the Stadium/i)).toBeInTheDocument();
    expect(screen.getByText(/No Match Today/i)).toBeInTheDocument();
    expect(screen.getByText(/0 Active/i)).toBeInTheDocument();
    expect(screen.getByText(/0 Unread/i)).toBeInTheDocument();
  });
});
