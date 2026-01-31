// ============================================
// REAL-TIME UPDATES SYSTEM
// WebSocket simulation for live updates
// ============================================

class RealTimeSystem {
    constructor() {
        this.connections = new Map();
        this.presensiUpdates = [];
        this.init();
    }
    
    init() {
        console.log('🔄 Real-Time System Initialized');
        
        // Simulate WebSocket connection
        this.simulateConnection();
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.syncData();
            }
        });
    }
    
    simulateConnection() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.broadcastUpdate({
                type: 'presensi_update',
                data: {
                    timestamp: new Date().toISOString(),
                    totalPresensi: this.getTotalPresensiToday(),
                    activeUsers: this.getActiveUsersCount()
                }
            });
        }, 30000);
        
        // Simulate new presensi events
        setInterval(() => {
            this.simulateNewPresensi();
        }, 60000);
    }
    
    connect(userId, callback) {
        const connectionId = 'conn_' + Date.now();
        this.connections.set(connectionId, { userId, callback });
        
        console.log(`🔗 User ${userId} connected to real-time system`);
        
        // Return disconnect function
        return () => {
            this.connections.delete(connectionId);
            console.log(`🔒 User ${userId} disconnected`);
        };
    }
    
    broadcastUpdate(message) {
        this.connections.forEach((connection, id) => {
            try {
                connection.callback(message);
            } catch (error) {
                console.error('Error in connection callback:', error);
                this.connections.delete(id);
            }
        });
    }
    
    sendToUser(userId, message) {
        this.connections.forEach((connection, id) => {
            if (connection.userId === userId) {
                try {
                    connection.callback(message);
                } catch (error) {
                    console.error('Error sending to user:', error);
                }
            }
        });
    }
    
    async simulateNewPresensi() {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const siswa = users.filter(u => u.role === 'siswa');
            
            if (siswa.length === 0) return;
            
            const randomSiswa = siswa[Math.floor(Math.random() * siswa.length)];
            const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
            const mapels = Object.values(mapelData);
            
            if (mapels.length === 0) return;
            
            const randomMapel = mapels[Math.floor(Math.random() * mapels.length)];
            const statuses = ['hadir', 'terlambat', 'izin', 'sakit'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            const newPresensi = {
                id: 'PRS' + Date.now(),
                userId: randomSiswa.id,
                userName: randomSiswa.name,
                mapel: randomMapel.name,
                status: randomStatus,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('id-ID'),
                timestamp: new Date().toISOString(),
                verified: true
            };
            
            // Add to localStorage
            const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
            allPresensi.push(newPresensi);
            localStorage.setItem('presensiData', JSON.stringify(allPresensi));
            
            // Broadcast to admin
            this.sendToUser('ADM001', {
                type: 'new_presensi',
                data: newPresensi,
                message: `${randomSiswa.name} melakukan presensi di ${randomMapel.name}`
            });
            
        } catch (error) {
            console.error('Error simulating presensi:', error);
        }
    }
    
    getTotalPresensiToday() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
            return allPresensi.filter(p => p.date === today).length;
        } catch (error) {
            return 0;
        }
    }
    
    getActiveUsersCount() {
        return this.connections.size;
    }
    
    async syncData() {
        console.log('🔄 Syncing data...');
        
        // Notify all connected users to refresh their data
        this.broadcastUpdate({
            type: 'sync_request',
            data: { timestamp: new Date().toISOString() }
        });
    }
    
    // Admin control functions
    openPresensiSession() {
        const session = {
            id: 'SESSION_' + Date.now(),
            openedBy: 'ADM001',
            startTime: new Date().toISOString(),
            status: 'open',
            allowedDuration: 30 // minutes
        };
        
        localStorage.setItem('presensiSession', JSON.stringify(session));
        
        this.broadcastUpdate({
            type: 'presensi_session_opened',
            data: session,
            message: 'Sesi presensi telah dibuka!'
        });
        
        return session;
    }
    
    closePresensiSession() {
        localStorage.removeItem('presensiSession');
        
        this.broadcastUpdate({
            type: 'presensi_session_closed',
            data: { timestamp: new Date().toISOString() },
            message: 'Sesi presensi telah ditutup!'
        });
    }
    
    getCurrentSession() {
        return JSON.parse(localStorage.getItem('presensiSession') || 'null');
    }
    
    isPresensiOpen() {
        const session = this.getCurrentSession();
        if (!session) return false;
        
        const startTime = new Date(session.startTime);
        const now = new Date();
        const diffMinutes = (now - startTime) / (1000 * 60);
        
        return diffMinutes <= session.allowedDuration;
    }
    
    hasUserPresensiToday(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
            
            return allPresensi.some(p => 
                p.userId === userId && 
                p.date === today &&
                p.status !== 'alfa'
            );
        } catch (error) {
            return false;
        }
    }
}

// Global instance
window.RealTimeSystem = new RealTimeSystem();
