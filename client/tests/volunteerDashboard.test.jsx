import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VolunteerDashboard from '../src/pages/volunteer/Dashboard';
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

describe('Volunteer Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('displays skeleton loaders while fetching', () => {
    vi.spyOn(dashboardHooks, 'useVolunteerDashboard').mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
    });

    renderWithRouter(<VolunteerDashboard />);
    expect(screen.getByTestId('skeleton-dashboard')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', () => {
    vi.spyOn(dashboardHooks, 'useVolunteerDashboard').mockReturnValue({
      isLoading: false,
      data: null,
      isError: true,
      refetch: vi.fn(),
    });

    renderWithRouter(<VolunteerDashboard />);
    expect(screen.getByText(/Unable to load dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard content successfully', () => {
    const mockData = {
      stats: {
        assignedTasks: 4,
        myIncidents: 1,
        completedTasks: 10,
      },
      activeTasksList: [],
      nearbyIncidents: [],
    };

    vi.spyOn(dashboardHooks, 'useVolunteerDashboard').mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
    });

    renderWithRouter(<VolunteerDashboard />);
    expect(screen.getByText(/Volunteer Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/4/)).toBeInTheDocument(); // active tasks count
    expect(screen.getByText(/Ask AI Copilot/i)).toBeInTheDocument();
  });
});
