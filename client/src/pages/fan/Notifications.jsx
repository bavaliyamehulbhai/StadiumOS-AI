import React from 'react';
import NotificationCenter from '../notifications/NotificationCenter';

// Fan Notifications now delegates to the unified NotificationCenter
const Notifications = () => {
  return <NotificationCenter />;
};

export default Notifications;
