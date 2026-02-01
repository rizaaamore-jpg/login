// Real-time Updates with Firebase (Example)
class RealtimeSystem {
    constructor() {
        this.isConnected = false;
        this.db = null;
        this.init();
    }

    async init() {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.warn('Firebase tidak tersedia, menggunakan mock data');
            this.useMockData();
            return;
        }

        try {
            // Firebase configuration
            const firebaseConfig = {
                apiKey: "YOUR_API_KEY",
                authDomain: "smk-jaktim1-absensi.firebaseapp.com",
                projectId: "smk-jaktim1-absensi",
                storageBucket: "smk-jaktim1-absensi.appspot.com",
                messagingSenderId: "YOUR_SENDER_ID",
                appId: "YOUR_APP_ID"
            };

            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            this.isConnected = true;
            
            this.setupListeners();
            showAppNotification('Sistem real-time aktif', 'success');
            
        } catch (error) {
            console.error('Firebase error:', error);
            this.useMockData();
        }
    }

    useMockData() {
        // Fallback to WebSocket or polling
        console.log('Menggunakan mock data untuk real-time updates');
        this.setupMockListeners();
    }

    setupListeners() {
        if (!this.db || !window.currentUser) return;

        const userId = window.currentUser.id;
        const userRole = window.currentUser.role;

        // Listen for user's attendance updates
        this.db.collection('attendance')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        this.handleNewAttendance(change.doc.data());
                    }
                });
            });

        // Listen for announcements (admin only)
        if (userRole === 'admin' || userRole === 'guru') {
            this.db.collection('announcements')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            this.handleNewAnnouncement(change.doc.data());
                        }
                    });
                });
        }

        // Monitor connection status
        this.db.collection('connection').doc('status')
            .onSnapshot((doc) => {
                this.isConnected = doc.exists;
            });
    }

    handleNewAttendance(data) {
        // Update local attendance data
        if (window.attendanceData) {
            window.attendanceData.unshift(data);
            
            // Update UI
            if (typeof updateAttendanceHistory === 'function') {
                updateAttendanceHistory();
            }
            
            // Show notification for today's attendance
            const today = new Date().toISOString().split('T')[0];
            if (data.date === today && data.userId === window.currentUser?.id) {
                showAppNotification(`Absensi ${data.type} tercatat`, 'success');
            }
        }
    }

    handleNewAnnouncement(data) {
        const notification = `
            <div class="announcement-notification">
                <strong>${data.title}</strong>
                <p>${data.message}</p>
                <small>${new Date(data.timestamp).toLocaleTimeString('id-ID')}</small>
            </div>
        `;
        
        showAppNotification(`Pengumuman baru: ${data.title}`, 'info');
        
        // Add to announcements list if exists
        const announcementsList = document.getElementById('announcementsList');
        if (announcementsList) {
            announcementsList.insertAdjacentHTML('afterbegin', notification);
        }
    }

    setupMockListeners() {
        // Simulate real-time updates with interval
        setInterval(() => {
            if (Math.random() > 0.7 && window.currentUser) {
                this.simulateUpdate();
            }
        }, 30000); // Check every 30 seconds
    }

    simulateUpdate() {
        const updates = [
            'Data kehadiran diperbarui',
            'Laporan baru tersedia',
            'Sistem backup berjalan'
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        showAppNotification(randomUpdate, 'info');
    }

    // Send attendance data to server
    async sendAttendance(data) {
        if (!this.isConnected) {
            // Save locally for sync later
            this.saveOffline(data);
            return false;
        }

        try {
            await this.db.collection('attendance').add({
                ...data,
                userId: window.currentUser.id,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                synced: true
            });
            return true;
        } catch (error) {
            console.error('Gagal mengirim data:', error);
            this.saveOffline(data);
            return false;
        }
    }

    saveOffline(data) {
        const offlineData = JSON.parse(localStorage.getItem('offlineAttendance') || '[]');
        offlineData.push({
            ...data,
            timestamp: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('offlineAttendance', JSON.stringify(offlineData));
        
        showAppNotification('Data disimpan offline, akan disinkronkan nanti', 'warning');
    }

    // Sync offline data when online
    async syncOfflineData() {
        if (!this.isConnected) return;
        
        const offlineData = JSON.parse(localStorage.getItem('offlineAttendance') || '[]');
        if (offlineData.length === 0) return;
        
        showAppNotification('Menyinkronkan data offline...', 'info');
        
        const batch = this.db.batch();
        const attendanceRef = this.db.collection('attendance');
        
        for (const data of offlineData) {
            if (!data.synced) {
                const docRef = attendanceRef.doc();
                batch.set(docRef, {
                    ...data,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    synced: true
                });
            }
        }
        
        try {
            await batch.commit();
            localStorage.removeItem('offlineAttendance');
            showAppNotification('Data offline berhasil disinkronkan', 'success');
        } catch (error) {
            console.error('Gagal sinkronisasi:', error);
        }
    }
}

// Initialize real-time system
window.realtimeSystem = new RealtimeSystem();

// Sync when coming online
window.addEventListener('online', () => {
    if (window.realtimeSystem) {
        window.realtimeSystem.syncOfflineData();
    }
});

// Example usage in attendance functions
function sendAttendanceToServer(attendanceData) {
    if (window.realtimeSystem) {
        return window.realtimeSystem.sendAttendance(attendanceData);
    }
    return false;
}
