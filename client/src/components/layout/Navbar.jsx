import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationBell from '../notification/NotificationBell';
import LanguageSwitcher from '../language/LanguageSwitcher';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex items-center relative w-96">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder="Search anything..." className="pl-9 bg-gray-50 border-none focus-visible:ring-1" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <NotificationBell />
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-8 w-8 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
