import { NotificationInterface } from '../types';

let notificationId = 0;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

export const showBrowserNotification = (title: string, body: string, icon?: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
};

export const createNotification = (
  title: string,
  message: string,
  type: NotificationInterface['type'],
  patientId?: string
): NotificationInterface => {
  return {
    id: `notif-${++notificationId}-${Date.now()}`,
    title,
    message,
    type,
    timestamp: new Date(),
    read: false,
    patientId,
  };
};

export const SAMPLE_NOTIFICATIONS: NotificationInterface[] = [
  {
    id: 'n1', title: 'Critical Alert', type: 'critical',
    message: 'Patient Sofia Mendez - O2 saturation dropped to 88%. Immediate attention required.',
    timestamp: new Date(Date.now() - 5 * 60000), read: false, patientId: 'P003'
  },
  {
    id: 'n2', title: 'Appointment Reminder', type: 'info',
    message: 'Eleanor Voss has a cardiology follow-up scheduled in 2 hours.',
    timestamp: new Date(Date.now() - 15 * 60000), read: false, patientId: 'P001'
  },
  {
    id: 'n3', title: 'Medication Due', type: 'warning',
    message: 'David Kowalski - Nitroglycerin dose overdue by 30 minutes.',
    timestamp: new Date(Date.now() - 32 * 60000), read: true, patientId: 'P006'
  },
  {
    id: 'n4', title: 'Lab Results Ready', type: 'success',
    message: 'Blood panel results for James Thornton are available for review.',
    timestamp: new Date(Date.now() - 60 * 60000), read: true, patientId: 'P002'
  },
  {
    id: 'n5', title: 'New Admission', type: 'info',
    message: 'New patient admitted to Cardiology Ward — Bed 14A assigned.',
    timestamp: new Date(Date.now() - 90 * 60000), read: true,
  },
];