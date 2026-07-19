import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: dashboardService.getAdminDashboard,
  });
};

export const useOrganizerDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'organizer'],
    queryFn: dashboardService.getOrganizerDashboard,
  });
};

export const useVolunteerDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'volunteer'],
    queryFn: dashboardService.getVolunteerDashboard,
  });
};

export const useFanDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'fan'],
    queryFn: dashboardService.getFanDashboard,
  });
};

export const useActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'activities', limit],
    queryFn: () => dashboardService.getActivities(limit),
  });
};

export const useDashboardCharts = () => {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: dashboardService.getCharts,
  });
};
