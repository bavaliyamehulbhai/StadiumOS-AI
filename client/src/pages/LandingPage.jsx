import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Map, Users, Zap, Globe, ShieldAlert, ChevronRight, User, Shield, Briefcase, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">StadiumOS AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900 font-medium">Features</a>
              <a href="#roles" className="text-gray-500 hover:text-gray-900 font-medium">Roles</a>
              <a href="#tech" className="text-gray-500 hover:text-gray-900 font-medium">Tech Stack</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  Try Demo <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32 lg:pt-32 lg:pb-48 bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 uppercase">
            STADIUMOS AI <br className="hidden md:block" />
            <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-4xl md:text-5xl mt-2 block capitalize">
              The Intelligent Operating System<br />for Smart Stadiums
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
            AI-powered real-time stadium operations, crowd intelligence, emergency response, and smart fan experiences—all in one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                🚀 Explore Live Demo
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white">
                🏗️ View Architecture
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to run a world-class event</h2>
            <p className="mt-4 text-lg text-gray-500">Six core pillars of StadiumOS AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<Bot />} title="AI Intelligence" desc="Crowd prediction, incident analysis, navigation, and executive intelligence." color="bg-purple-100 text-purple-600" />
            <FeatureCard icon={<Map />} title="Live Digital Twin" desc="Real-time stadium map showing crowd density, incidents, and volunteer locations." color="bg-blue-100 text-blue-600" />
            <FeatureCard icon={<Zap />} title="Real-Time Operations" desc="Instant synchronization of tasks, alerts, and analytics across all dashboards." color="bg-emerald-100 text-emerald-600" />
            <FeatureCard icon={<ShieldAlert />} title="Emergency Response" desc="AI-guided evacuation protocols, safe routing, and instant danger zone alerts." color="bg-red-100 text-red-600" />
            <FeatureCard icon={<Globe />} title="Smart Navigation" desc="Multilingual AI guiding fans securely through optimal crowd flow paths." color="bg-pink-100 text-pink-600" />
            <FeatureCard icon={<Users />} title="Multi-Role Collaboration" desc="Connected ecosystem for Admins, Organizers, Volunteers, and Fans." color="bg-amber-100 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div id="roles" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Tailored experiences for every user</h2>
            <p className="mt-4 text-lg text-gray-500">Secure, role-based access control built right in.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <RoleCard icon={<User />} title="Fan" desc="Navigation, Tickets, AI Assistant" />
            <RoleCard icon={<Briefcase />} title="Volunteer" desc="Task assignments & Incident reporting" />
            <RoleCard icon={<Shield />} title="Organizer" desc="Live Analytics & Global overview" />
            <RoleCard icon={<Lock />} title="Admin" desc="System config & User management" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight">StadiumOS AI</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2026 Smart City Hackathon. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </CardContent>
  </Card>
);

const RoleCard = ({ icon, title, desc }) => (
  <Card className="border-gray-100 hover:border-blue-200 transition-colors">
    <CardContent className="p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
