import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { Toaster } from 'react-hot-toast';
import CriticalAlertBanner from './components/emergency/CriticalAlertBanner';
import ProtectedRoute from './routes/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import FanDashboard from './pages/fan/Dashboard';
import Assistant from './pages/ai/Assistant';
import AccessibilitySettings from './pages/fan/AccessibilitySettings';
import AINavigation from './pages/navigation/AINavigation';
import FanTransport from './pages/fan/Transport';
import FanNotifications from './pages/fan/Notifications';
import VolunteerDashboard from './pages/volunteer/Dashboard';
import OrganizerDashboard from './pages/organizer/Dashboard';
import SustainabilityDashboard from './pages/organizer/Sustainability';
import AdminDashboard from './pages/admin/Dashboard';
import StadiumList from './pages/admin/StadiumList';
import AddStadium from './pages/admin/AddStadium';
import EditStadium from './pages/admin/EditStadium';
import ViewStadium from './pages/admin/ViewStadium';
import Matches from './pages/admin/Matches';
import AddMatch from './pages/admin/AddMatch';
import EditMatch from './pages/admin/EditMatch';
import ViewMatch from './pages/admin/ViewMatch';

// --- ENTERPRISE ADMIN IMPORTS ---
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import SystemSettings from './pages/admin/SystemSettings';
import AISettings from './pages/admin/AISettings';
import EmergencyRules from './pages/admin/EmergencyRules';
import SecurityCenter from './pages/admin/SecurityCenter';

// Incident Pages
import ReportIncident from './pages/volunteer/ReportIncident';
import MyIncidents from './pages/volunteer/MyIncidents';
import Incidents from './pages/organizer/Incidents';
import IncidentDetails from './pages/organizer/IncidentDetails';

// Notification Pages
import NotificationCenter from './pages/notifications/NotificationCenter';

// Task Pages
import Tasks from './pages/organizer/Tasks';
import AssignTask from './pages/organizer/AssignTask';
import EmergencyBroadcastCenter from './pages/organizer/EmergencyBroadcastCenter';
import TaskDetails from './pages/organizer/TaskDetails';
import MyTasks from './pages/volunteer/MyTasks';

// Map Pages
// Map Pages

// Ticket Pages
import MyTickets from './pages/tickets/MyTickets';
import TicketDetails from './pages/tickets/TicketDetails';
import OrganizerScanner from './pages/tickets/OrganizerScanner';

// Mobility Pages
import Transportation from './pages/transport/Transportation';
import ParkingPanel from './pages/parking/ParkingPanel';

// Crowd Pages
import CrowdDashboard from './pages/crowd/CrowdDashboard';
import AICrowdDashboard from './pages/crowd/AICrowdDashboard';

// Emergency Pages
import EmergencyDashboard from './pages/emergency/EmergencyDashboard';
import AIEmergencyDashboard from './pages/emergency/AIEmergencyDashboard';

// Analytics & Command Center
import AIAnalyticsDashboard from './pages/analytics/AIAnalyticsDashboard';
import ActivityTimeline from './pages/audit/ActivityTimeline';
import VolunteerPerformanceCenter from './pages/volunteerPerformance/VolunteerPerformanceCenter';
import VolunteerPerformanceDetails from './pages/volunteerPerformance/VolunteerPerformanceDetails';
import MatchOperationsSelect from './pages/matchOperations/MatchOperationsSelect';

// Lazy Loaded Heavy Routes
const AICommandCenter = React.lazy(() => import('./pages/ai/AICommandCenter'));
const AnalyticsCenter = React.lazy(() => import('./pages/analytics/AnalyticsCenter'));
const ExecutiveReportCenter = React.lazy(() => import('./pages/reports/ExecutiveReportCenter'));
const ExecutiveReportDetails = React.lazy(() => import('./pages/reports/ExecutiveReportDetails'));
const MatchOperationsCenter = React.lazy(() => import('./pages/matchOperations/MatchOperationsCenter'));
const SystemHealthDashboard = React.lazy(() => import('./pages/systemHealth/SystemHealthDashboard'));
const StadiumMap = React.lazy(() => import('./pages/map/StadiumMap'));

// Language Settings
import LanguageSettings from './pages/language/LanguageSettings';

// Socket Provider
import { SocketProvider } from './socket/SocketProvider';

// Shared Pages
import Profile from './pages/profile/Profile';

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <SocketProvider>
          <EmergencyProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Toaster position="top-right" />
                  <CriticalAlertBanner />
                  <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Default Route */}
                      <Route path="/" element={<LandingPage />} />
                      
                      {/* Protected Routes wrapped in DashboardLayout */}
                      <Route element={<DashboardLayout />}>
                        {/* Map Routes */}
                        <Route path="map" element={<StadiumMap />} />
                        <Route path="map/stadium/:id" element={<StadiumMap />} />
                        
                        {/* Shared Global Routes */}
                        <Route path="notifications" element={<NotificationCenter />} />
                        
                        {/* Fan Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['Fan']} />}>
                          <Route path="/fan" element={<FanDashboard />} />
                          <Route path="/fan/navigation" element={<AINavigation />} />
                          <Route path="/fan/transport" element={<Transportation />} />
                          <Route path="/fan/accessibility" element={<AccessibilitySettings />} />
                          <Route path="/fan/notifications" element={<FanNotifications />} />
                          <Route path="/fan/incidents/report" element={<ReportIncident />} />
                        </Route>
                        
                        {/* Volunteer Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['Volunteer']} />}>
                          <Route path="/volunteer" element={<VolunteerDashboard />} />
                          <Route path="/volunteer/tasks" element={<MyTasks />} />
                          <Route path="/volunteer/tasks/:id" element={<TaskDetails />} />
                          <Route path="/volunteer/incidents" element={<MyIncidents />} />
                          <Route path="/volunteer/incidents/report" element={<ReportIncident />} />
                          <Route path="/volunteer/incidents/:id" element={<IncidentDetails />} />
                        </Route>
                        
                        {/* Organizer Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['Organizer']} />}>
                          <Route path="/organizer" element={<OrganizerDashboard />} />
                          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                          <Route path="/organizer/operations" element={<MatchOperationsSelect />} />
                          <Route path="/organizer/operations/:id" element={<MatchOperationsCenter />} />
                          <Route path="/organizer/analytics" element={<AnalyticsCenter />} />
                          <Route path="/organizer/reports" element={<ExecutiveReportCenter />} />
                          <Route path="/organizer/reports/:id" element={<ExecutiveReportDetails />} />
                          <Route path="/organizer/volunteers/performance" element={<VolunteerPerformanceCenter />} />
                          <Route path="/organizer/volunteers/:id/performance" element={<VolunteerPerformanceDetails />} />
                          <Route path="/organizer/scanner" element={<OrganizerScanner />} />
                          <Route path="/organizer/volunteers" element={<div>Volunteers Page</div>} />
                          <Route path="/organizer/tasks" element={<Tasks />} />
                          <Route path="/organizer/tasks/assign" element={<AssignTask />} />
                          <Route path="/organizer/tasks/:id" element={<TaskDetails />} />
                          <Route path="/organizer/incidents" element={<Incidents />} />
                          <Route path="/organizer/incidents/report" element={<ReportIncident />} />
                          <Route path="/organizer/incidents/:id" element={<IncidentDetails />} />
                          <Route path="/organizer/transport" element={<Transportation />} />
                          <Route path="/organizer/parking" element={<ParkingPanel />} />
                          <Route path="/organizer/crowd" element={<CrowdDashboard />} />
                          <Route path="/organizer/crowd-ai" element={<AICrowdDashboard />} />
                          <Route path="/organizer/emergency" element={<EmergencyDashboard />} />
                          <Route path="/organizer/broadcast" element={<EmergencyBroadcastCenter />} />
                          <Route path="/organizer/emergency-ai" element={<AIEmergencyDashboard />} />
                          <Route path="/organizer/ai-command" element={<AICommandCenter />} />
                          <Route path="/organizer/audit" element={<ActivityTimeline />} />
                        </Route>
                        
                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                          <Route path="/admin" element={<AdminOverview />} />
                          <Route path="/admin/users" element={<UserManagement />} />
                          <Route path="/admin/roles" element={<RoleManagement />} />
                          <Route path="/admin/settings" element={<SystemSettings />} />
                          <Route path="/admin/ai-settings" element={<AISettings />} />
                          <Route path="/admin/emergency-rules" element={<EmergencyRules />} />
                          <Route path="/admin/security" element={<SecurityCenter />} />
                          <Route path="/admin/system-health" element={<SystemHealthDashboard />} />
                          
                          {/* Shared Modules */}
                          <Route path="/admin/stadiums" element={<StadiumList />} />
                          <Route path="/admin/stadiums/add" element={<AddStadium />} />
                          <Route path="/admin/stadiums/edit/:id" element={<EditStadium />} />
                          <Route path="/admin/stadiums/:id" element={<ViewStadium />} />
                          <Route path="/admin/matches" element={<Matches />} />
                          <Route path="/admin/matches/add" element={<AddMatch />} />
                          <Route path="/admin/matches/edit/:id" element={<EditMatch />} />
                          <Route path="/admin/matches/:id" element={<ViewMatch />} />
                          
                          <Route path="/admin/tasks" element={<Tasks />} />
                          <Route path="/admin/tasks/assign" element={<AssignTask />} />
                          <Route path="/admin/tasks/:id" element={<TaskDetails />} />
                          <Route path="/admin/incidents" element={<Incidents />} />
                          <Route path="/admin/incidents/report" element={<ReportIncident />} />
                          <Route path="/admin/incidents/:id" element={<IncidentDetails />} />
                          <Route path="/admin/crowd-ai" element={<AICrowdDashboard />} />
                          <Route path="/admin/emergency-ai" element={<AIEmergencyDashboard />} />
                          <Route path="/admin/operations" element={<MatchOperationsSelect />} />
                          <Route path="/admin/operations/:id" element={<MatchOperationsCenter />} />
                          <Route path="/admin/ai-command" element={<AICommandCenter />} />
                          <Route path="/admin/analytics" element={<AnalyticsCenter />} />
                          <Route path="/admin/reports" element={<ExecutiveReportCenter />} />
                          <Route path="/admin/reports/:id" element={<ExecutiveReportDetails />} />
                          <Route path="/admin/volunteers/performance" element={<VolunteerPerformanceCenter />} />
                          <Route path="/admin/volunteers/:id/performance" element={<VolunteerPerformanceDetails />} />

                          <Route path="/admin/audit" element={<ActivityTimeline />} />
                        </Route>

                        {/* Shared Authenticated Routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/notifications" element={<NotificationCenter />} />
                          <Route path="/assistant" element={<Assistant />} />
                          <Route path="/settings/language" element={<LanguageSettings />} />
                        </Route>

                        {/* Ticket Routes - Fans */}
                        <Route path="/tickets" element={<ProtectedRoute allowedRoles={['Fan']}><MyTickets /></ProtectedRoute>} />
                        <Route path="/tickets/:id" element={<ProtectedRoute allowedRoles={['Fan', 'Organizer', 'Admin']}><TicketDetails /></ProtectedRoute>} />
                        
                        {/* Ticket Scanner - Organizer/Admin */}
                        <Route path="/scanner" element={<ProtectedRoute allowedRoles={['Organizer', 'Admin']}><OrganizerScanner /></ProtectedRoute>} />
                      </Route>
                      {/* 404 Catch-All Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Router>
              </ErrorBoundary>
            </NotificationProvider>
          </EmergencyProvider>
        </SocketProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
