import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import NotificationCard from '@/components/notification/NotificationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, CheckCircle2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAllRead, loading } = useNotifications();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNREAD, PINNED, ARCHIVED
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'AI', 'INCIDENT', 'VOLUNTEER', 'CROWD', 'PARKING', 'EMERGENCY', 'SYSTEM'];

  const filteredNotifications = notifications.filter(notif => {
    // Tab filtering
    if (activeTab === 'UNREAD' && notif.isRead) return false;
    if (activeTab === 'PINNED' && !notif.isPinned) return false;
    
    // In Context we might not have fetched archived ones by default if API excludes them, 
    // but assuming they are returned or we only rely on local state
    if (activeTab === 'ARCHIVED' && !notif.isArchived) return false;
    if (activeTab !== 'ARCHIVED' && notif.isArchived) return false;

    // Category filtering
    if (categoryFilter !== 'ALL' && notif.category !== categoryFilter) return false;

    // Search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!notif.title?.toLowerCase().includes(q) && !notif.message?.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Notification Center
          </h1>
          <p className="text-gray-500 mt-1">Manage your alerts and system recommendations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search notifications..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Views
                </h3>
                <div className="flex flex-col gap-1">
                  {['ALL', 'UNREAD', 'PINNED', 'ARCHIVED'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0) + tab.slice(1).toLowerCase()}
                      {tab === 'UNREAD' && unreadCount > 0 && (
                        <span className="float-right bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        categoryFilter === cat
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                <p className="text-gray-500 mt-1 max-w-sm">
                  {activeTab !== 'ALL' || categoryFilter !== 'ALL' || searchQuery 
                    ? 'Try adjusting your filters or search terms.' 
                    : 'You\'re all caught up! New alerts will appear here.'}
                </p>
                {(activeTab !== 'ALL' || categoryFilter !== 'ALL' || searchQuery) && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setActiveTab('ALL');
                      setCategoryFilter('ALL');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {filteredNotifications.map(notification => (
                <NotificationCard 
                  key={notification._id} 
                  notification={notification} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationCenter;
