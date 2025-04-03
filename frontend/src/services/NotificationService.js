class NotificationService {
  constructor() {
    this.permission = null;
    this.initialize();
  }

  async initialize() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    this.permission = await Notification.requestPermission();
    console.log('Notification permission:', this.permission);
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  showNotification(title, options = {}) {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      ...options
    };

    new Notification(title, defaultOptions);
  }

  showMessageNotification(sender, message) {
    this.showNotification('New Message', {
      body: `${sender}: ${message}`,
      tag: 'message-notification'
    });
  }

  showAppointmentNotification(appointment) {
    const date = new Date(appointment.date).toLocaleDateString();
    const time = appointment.time;
    this.showNotification('New Appointment', {
      body: `Appointment scheduled for ${date} at ${time}`,
      tag: 'appointment-notification'
    });
  }
}

export const notificationService = new NotificationService(); 