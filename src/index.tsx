import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './services/notificationService';

// Register service worker for push notifications
registerServiceWorker();

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  setTimeout(() => {
    Notification.requestPermission();
  }, 3000);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);