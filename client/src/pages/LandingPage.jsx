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
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            AI-Powered Smart Stadium <br className="hidden md:block" />
            <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              & Tournament Operations
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
            Transform traditional venues into hyper-connected environments. Real-time crowd analytics, AI incident summarization, and dynamic role-based dashboards.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                🚀 Explore Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white">
              📺 Watch Video
            </Button>
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
            <FeatureCard icon={<Bot />} title="AI Assistant" desc="Powered by Llama 3 for instant fan support and automated incident summaries." color="bg-purple-100 text-purple-600" />
            <FeatureCard icon={<Map />} title="Stadium Navigation" desc="Interactive Leaflet maps guiding fans to their seats and facilities." color="bg-blue-100 text-blue-600" />
            <FeatureCard icon={<Users />} title="Crowd Analytics" desc="Live heatmaps and congestion monitoring for safety optimization." color="bg-emerald-100 text-emerald-600" />
            <FeatureCard icon={<Zap />} title="Real-Time Updates" desc="Socket.io powered instant notifications and live dashboards." color="bg-amber-100 text-amber-600" />
            <FeatureCard icon={<Globe />} title="Multi-language" desc="Seamless translation support for international tournament visitors." color="bg-pink-100 text-pink-600" />
            <FeatureCard icon={<ShieldAlert />} title="Emergency Response" desc="One-tap SOS and live incident routing to nearest volunteers." color="bg-red-100 text-red-600" />
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
