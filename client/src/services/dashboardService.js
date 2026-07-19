import api from './api';

export const dashboardService = {
  getAdminDashboard: async () => {
    const { data } = await api.get('/dashboard/admin');
    return data.data;
  },

  getOrganizerDashboard: async () => {
    const { data } = await api.get('/dashboard/organizer');
    return data.data;
  },

  getVolunteerDashboard: async () => {
    const { data } = await api.get('/dashboard/volunteer');
    return data.data;
  },

  getFanDashboard: async () => {
    const { data } = await api.get('/dashboard/fan');
    return data.data;
  },

  getActivities: async (limit = 10) => {
    const { data } = await api.get(`/dashboard/activities?limit=${limit}`);
    return data.data;
  },

  getCharts: async () => {
    const { data } = await api.get('/dashboard/charts');
    return data.data;
  }
};
