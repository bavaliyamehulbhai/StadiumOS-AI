import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  Bell, 
  User, 
  Ticket, 
  Car, 
  ListTodo, 
  AlertTriangle, 
  FileText, 
  Settings, 
  ShieldCheck, 
  QrCode,
  Users,
  Calendar,
  BarChart3,
  Activity,
  ShieldAlert,
  LogOut,
  ClipboardList,
  Bot,
  Globe,
  Terminal,
  Radio
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    const role = user?.role;
    if (role === 'Fan') {
      return [
        { name: 'Dashboard', path: '/fan', icon: <LayoutDashboard size={20} /> },
        { name: 'AI Copilot', path: '/assistant', icon: <Bot size={20} className="text-blue-500" /> },
        { name: 'My Tickets', path: '/tickets', icon: <Ticket size={20} /> },
        { name: 'Transport & Parking', path: '/fan/transport', icon: <Car size={20} /> },
        { name: 'Smart Navigation', path: '/fan/navigation', icon: <Map size={20} className="text-blue-500" /> },
        { name: 'Interactive Map', path: '/map', icon: <Map size={20} /> },
        { name: 'Notifications', path: '/fan/notifications', icon: <Bell size={20} /> },
        { name: 'Language', path: '/settings/language', icon: <Globe size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
      ];
    } else if (role === 'Volunteer') {
      return [
        { name: 'Dashboard', path: '/volunteer', icon: <LayoutDashboard size={20} /> },
        { name: 'AI Copilot', path: '/assistant', icon: <Bot size={20} className="text-blue-500" /> },
        { name: 'Assigned Tasks', path: '/volunteer/tasks', icon: <ListTodo size={20} /> },
        { name: 'Interactive Map', path: '/map', icon: <Map size={20} /> },
        { name: 'Incidents', path: '/volunteer/incidents', icon: <AlertTriangle size={20} /> },
        { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
        { name: 'Language', path: '/settings/language', icon: <Globe size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
      ];
    } else if (role === 'Organizer') {
      return [
        { name: 'Dashboard', path: '/organizer', icon: <LayoutDashboard size={20} /> },
        { name: 'Match Operations', path: '/organizer/operations', icon: <Activity size={20} className="text-red-500" /> },
        { name: 'AI Copilot', path: '/assistant', icon: <Bot size={20} className="text-blue-500" /> },
        { name: 'Gate Scanner', path: '/organizer/scanner', icon: <QrCode size={20} /> },
        { name: 'Parking Ops', path: '/organizer/parking', icon: <Car size={20} /> },
        { name: 'Live Map', path: '/map', icon: <Map size={20} /> },
        { name: 'Crowd Control', path: '/organizer/crowd', icon: <Activity size={20} /> },
        { name: 'AI Crowd Ops', path: '/organizer/crowd-ai', icon: <Bot size={20} className="text-purple-500" /> },
        { name: 'Workforce Performance', path: '/organizer/volunteers/performance', icon: <Users size={20} className="text-orange-500" /> },
        { name: 'AI Emergency', path: '/organizer/emergency-ai', icon: <ShieldAlert size={20} className="text-red-500" /> },
        { name: 'AI Command Center', path: '/organizer/ai-command', icon: <Terminal size={20} className="text-indigo-500" /> },
        { name: 'Audit Timeline', path: '/organizer/audit', icon: <FileText size={20} className="text-gray-700" /> },
        { name: 'Analytics & Reports', path: '/organizer/analytics', icon: <BarChart3 size={20} className="text-emerald-500" /> },
        { name: 'AI Executive Reports', path: '/organizer/reports', icon: <FileText size={20} className="text-indigo-600" /> },
        { name: 'Crisis Mode', path: '/organizer/emergency', icon: <ShieldAlert size={20} className="text-red-500" /> },
        { name: 'Incidents', path: '/organizer/incidents', icon: <AlertTriangle size={20} /> },
        { name: 'Broadcast Center', path: '/organizer/broadcast', icon: <Radio size={20} /> },
        { name: 'Tasks', path: '/organizer/tasks', icon: <ListTodo size={20} /> },
        { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
        { name: 'Language', path: '/settings/language', icon: <Globe size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
      ];
    } else if (role === 'Admin') {
      return [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Match Operations', path: '/admin/operations', icon: <Activity size={20} className="text-red-500" /> },
        { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: <ShieldCheck size={20} /> },
        { name: 'Workforce Performance', path: '/admin/volunteers/performance', icon: <Users size={20} className="text-orange-500" /> },
        { name: 'Stadiums', path: '/admin/stadiums', icon: <Map size={20} /> },
        { name: 'Matches', path: '/admin/matches', icon: <Calendar size={20} /> },
        { name: 'Analytics & Reports', path: '/admin/analytics', icon: <BarChart3 size={20} className="text-emerald-500" /> },
        { name: 'AI Executive Reports', path: '/admin/reports', icon: <FileText size={20} className="text-indigo-600" /> },
        { name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        { name: 'AI Emergency', path: '/admin/emergency-ai', icon: <ShieldAlert size={20} className="text-red-500" /> },
        { name: 'AI Configuration', path: '/admin/ai-settings', icon: <Bot size={20} className="text-purple-500" /> },
        { name: 'Emergency Rules', path: '/admin/emergency-rules', icon: <AlertTriangle size={20} className="text-red-500" /> },
        { name: 'Audit Logs', path: '/admin/audit', icon: <FileText size={20} className="text-gray-700" /> },
        { name: 'System Health', path: '/admin/system-health', icon: <ShieldCheck size={20} className="text-emerald-500" /> },
        { name: 'Security', path: '/admin/security', icon: <ShieldAlert size={20} className="text-blue-600" /> },
        { name: 'Language', path: '/settings/language', icon: <Globe size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 flex flex-col h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
          StadiumOS <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">AI</span>
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
