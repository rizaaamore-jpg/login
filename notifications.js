// Notification System
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationsContainer');
        this.notifications = [];
        this.init();
    }

    init() {
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }
        
        // Listen for online/offline status
        window.addEventListener('online', () => {
            this.show('Koneksi internet kembali aktif', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.show('Koneksi internet terputus', 'warning');
        });
    }

    show(message, type = 'info', duration = 5000) {
        const id = Date.now();
        const notification = this.createNotification(id, message, type);
        
        this.container.appendChild(notification);
        this.notifications.push({ id, element: notification });
        
        // Browser notification
        if (type === 'important' && Notification.permission === 'granted') {
            new Notification('SMK Jaktim 1 - Absensi', {
                body: message,
                icon: '/icon-192.png'
            });
        }
        
        // Auto remove
        setTimeout(() => this.remove(id), duration);
        
        return id;
    }

    createNotification(id, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.dataset.id = id;
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="window.notificationSystem.remove(${id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return notification;
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            important: 'fa-bell'
        };
        return icons[type] || 'fa-info-circle';
    }

    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            const notification = this.notifications[index];
            notification.element.classList.add('fade-out');
            
            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.remove();
                }
                this.notifications.splice(index, 1);
            }, 300);
        }
    }

    clearAll() {
        this.notifications.forEach(n => n.element.remove());
        this.notifications = [];
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Global function to show notifications
window.showAppNotification = (message, type) => {
    return notificationSystem.show(message, type);
};

// Example usage:
// showAppNotification('Absensi berhasil dicatat', 'success');
// showAppNotification('Keterlambatan tercatat', 'warning');
// showAppNotification('Gagal menyimpan data', 'error');
