// ============================================
// REAL-TIME UPDATES SYSTEM
// WebSocket simulation for live updates
// Versi kompatibel dengan aplikasi yang ada
// ============================================

class RealTimeSystem {
    constructor() {
        this.connections = new Map(); // Store user connections
        this.presensiSession = null; // Current presensi session
        this.lastActivity = new Date(); // Last activity timestamp
        this.heartbeatInterval = null; // Heartbeat interval
        this.reconnectAttempts = 0; // Reconnect attempts counter
        this.maxReconnectAttempts = 5; // Maximum reconnect attempts
        
        this.init();
    }
    
    init() {
        console.log('🔄 Real-Time System Initializing...');
        
        // Load existing session from localStorage
        this.loadSessionFromStorage();
        
        // Initialize heartbeat
        this.startHeartbeat();
        
        // Listen for visibility changes
        this.setupVisibilityListener();
        
        // Listen for storage changes (cross-tab communication)
        this.setupStorageListener();
        
        // Simulate network events
        this.setupEventSimulation();
        
        console.log('✅ Real-Time System Ready');
    }
    
    loadSessionFromStorage() {
        try {
            const sessionData = localStorage.getItem('presensiSession');
            if (sessionData) {
                this.presensiSession = JSON.parse(sessionData);
                console.log('📂 Loaded presensi session from storage');
            }
        } catch (error) {
            console.error('Error loading session from storage:', error);
        }
    }
    
    saveSessionToStorage() {
        try {
            if (this.presensiSession) {
                localStorage.setItem('presensiSession', JSON.stringify(this.presensiSession));
            } else {
                localStorage.removeItem('presensiSession');
            }
        } catch (error) {
            console.error('Error saving session to storage:', error);
        }
    }
    
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.onAppVisible();
            } else {
                this.onAppHidden();
            }
        });
    }
    
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'presensiSession') {
                try {
                    if (event.newValue) {
                        this.presensiSession = JSON.parse(event.newValue);
                        this.notifySessionChange();
                    } else {
                        this.presensiSession = null;
                        this.notifySessionChange();
                    }
                } catch (error) {
                    console.error('Error parsing storage update:', error);
                }
            }
            
            if (event.key === 'presensiData') {
                this.notifyPresensiUpdate();
            }
        });
    }
    
    setupEventSimulation() {
        // Simulate real-time events every 45 seconds
        setInterval(() => {
            this.simulateRealTimeEvent();
        }, 45000);
        
        // Simulate periodic status updates
        setInterval(() => {
            this.broadcastStatusUpdate();
        }, 30000);
    }
    
    startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, 15000); // Every 15 seconds
    }
    
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    
    sendHeartbeat() {
        const heartbeatMessage = {
            type: 'heartbeat',
            data: {
                timestamp: new Date().toISOString(),
                activeConnections: this.connections.size,
                sessionActive: !!this.presensiSession
            }
        };
        
        this.broadcastUpdate(heartbeatMessage);
    }
    
    connect(userId, callback) {
        const connectionId = `conn_${userId}_${Date.now()}`;
        
        // Check if user already has a connection
        this.disconnectUser(userId);
        
        // Create new connection
        this.connections.set(connectionId, {
            userId,
            callback,
            connectedAt: new Date().toISOString(),
            lastSeen: new Date().toISOString()
        });
        
        console.log(`🔗 User ${userId} connected (ID: ${connectionId})`);
        
        // Send welcome message
        setTimeout(() => {
            callback({
                type: 'welcome',
                data: {
                    userId,
                    connectionId,
                    serverTime: new Date().toISOString(),
                    activeSession: this.presensiSession
                },
                message: 'Connected to real-time system'
            });
        }, 100);
        
        // Return disconnect function
        return () => {
            this.disconnect(connectionId);
        };
    }
    
    disconnect(connectionId) {
        if (this.connections.has(connectionId)) {
            const connection = this.connections.get(connectionId);
            this.connections.delete(connectionId);
            
            console.log(`🔒 Connection ${connectionId} (User: ${connection.userId}) disconnected`);
            
            // Notify other users if admin disconnected
            if (connection.userId === 'ADM001') {
                this.broadcastUpdate({
                    type: 'admin_disconnected',
                    data: { userId: connection.userId },
                    message: 'Admin disconnected from system'
                });
            }
        }
    }
    
    disconnectUser(userId) {
        const userConnections = [];
        
        this.connections.forEach((connection, connectionId) => {
            if (connection.userId === userId) {
                userConnections.push(connectionId);
            }
        });
        
        userConnections.forEach(connectionId => {
            this.disconnect(connectionId);
        });
    }
    
    broadcastUpdate(message) {
        const fullMessage = {
            ...message,
            serverTimestamp: new Date().toISOString(),
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        this.connections.forEach((connection, connectionId) => {
            try {
                // Update last seen time
                connection.lastSeen = new Date().toISOString();
                
                // Send message
                connection.callback(fullMessage);
                
                // Log for debugging (only first few characters of message)
                if (connectionId === Array.from(this.connections.keys())[0]) {
                    console.log(`📤 Broadcast: ${message.type} to ${this.connections.size} connections`);
                }
            } catch (error) {
                console.error(`Error sending to connection ${connectionId}:`, error);
                this.disconnect(connectionId);
            }
        });
    }
    
    sendToUser(userId, message) {
        const fullMessage = {
            ...message,
            serverTimestamp: new Date().toISOString(),
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        let sentCount = 0;
        
        this.connections.forEach((connection, connectionId) => {
            if (connection.userId === userId) {
                try {
                    connection.callback(fullMessage);
                    connection.lastSeen = new Date().toISOString();
                    sentCount++;
                } catch (error) {
                    console.error(`Error sending to user ${userId}:`, error);
                }
            }
        });
        
        if (sentCount > 0) {
            console.log(`📨 Sent to user ${userId}: ${message.type}`);
        }
        
        return sentCount > 0;
    }
    
    sendToRole(role, message) {
        const users = this.getUsersByRole(role);
        let sentCount = 0;
        
        users.forEach(userId => {
            if (this.sendToUser(userId, message)) {
                sentCount++;
            }
        });
        
        return sentCount;
    }
    
    getUsersByRole(role) {
        const users = new Set();
        
        this.connections.forEach((connection) => {
            // Note: In real app, you'd need to lookup user role from user data
            // For now, we'll use ID prefixes to determine role
            if (role === 'admin' && connection.userId.startsWith('ADM')) {
                users.add(connection.userId);
            } else if (role === 'guru' && connection.userId.startsWith('GUR')) {
                users.add(connection.userId);
            } else if (role === 'siswa' && connection.userId.startsWith('SIS')) {
                users.add(connection.userId);
            }
        });
        
        return Array.from(users);
    }
    
    simulateRealTimeEvent() {
        const eventTypes = [
            'system_notification',
            'reminder',
            'announcement',
            'schedule_update'
        ];
        
        const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const events = {
            system_notification: {
                type: 'system_notification',
                data: {
                    title: 'Pemeliharaan Sistem',
                    message: 'Sistem akan dilakukan pemeliharaan pada pukul 22:00 WIB',
                    priority: 'low'
                },
                message: 'Notifikasi sistem'
            },
            reminder: {
                type: 'reminder',
                data: {
                    title: 'Ingat Presensi!',
                    message: 'Jangan lupa melakukan presensi hari ini',
                    urgency: 'medium'
                },
                message: 'Pengingat presensi'
            },
            announcement: {
                type: 'announcement',
                data: {
                    title: 'Pengumuman',
                    message: 'Ujian tengah semester akan dimulai minggu depan',
                    category: 'academic'
                },
                message: 'Pengumuman penting'
            },
            schedule_update: {
                type: 'schedule_update',
                data: {
                    title: 'Perubahan Jadwal',
                    message: 'Jadwal Matematika hari ini digeser ke jam 10:00',
                    affectedClass: 'XII TKJ 1'
                },
                message: 'Update jadwal'
            }
        };
        
        const event = events[randomEventType];
        if (event) {
            this.broadcastUpdate(event);
        }
    }
    
    broadcastStatusUpdate() {
        const statusMessage = {
            type: 'status_update',
            data: {
                timestamp: new Date().toISOString(),
                onlineUsers: this.connections.size,
                presensiSession: this.presensiSession ? {
                    status: this.presensiSession.status,
                    duration: this.presensiSession.allowedDuration,
                    elapsed: this.getSessionElapsedTime()
                } : null,
                serverLoad: Math.floor(Math.random() * 30) + 10 // Simulated
            },
            message: 'Status update'
        };
        
        // Only send to admin users
        this.sendToRole('admin', statusMessage);
    }
    
    // Presensi Session Management
    openPresensiSession(duration = 30, openedBy = 'ADM001') {
        const session = {
            id: `sess_${Date.now()}`,
            openedBy,
            startTime: new Date().toISOString(),
            allowedDuration: parseInt(duration) || 30,
            status: 'open',
            autoClose: true
        };
        
        this.presensiSession = session;
        this.saveSessionToStorage();
        
        // Broadcast to all users
        this.broadcastUpdate({
            type: 'presensi_session_opened',
            data: session,
            message: 'Sesi presensi telah dibuka!'
        });
        
        // Set auto-close timer if enabled
        if (session.autoClose) {
            setTimeout(() => {
                if (this.presensiSession && this.presensiSession.id === session.id) {
                    this.closePresensiSession();
                }
            }, session.allowedDuration * 60 * 1000);
        }
        
        console.log(`✅ Presensi session opened: ${session.id}`);
        return session;
    }
    
    closePresensiSession() {
        if (!this.presensiSession) return null;
        
        const closedSession = {
            ...this.presensiSession,
            endTime: new Date().toISOString(),
            status: 'closed'
        };
        
        this.presensiSession = null;
        this.saveSessionToStorage();
        
        // Broadcast to all users
        this.broadcastUpdate({
            type: 'presensi_session_closed',
            data: closedSession,
            message: 'Sesi presensi telah ditutup!'
        });
        
        console.log(`🔒 Presensi session closed: ${closedSession.id}`);
        return closedSession;
    }
    
    getCurrentSession() {
        return this.presensiSession;
    }
    
    isPresensiOpen() {
        if (!this.presensiSession || this.presensiSession.status !== 'open') {
            return false;
        }
        
        const startTime = new Date(this.presensiSession.startTime);
        const now = new Date();
        const elapsedMinutes = (now - startTime) / (1000 * 60);
        
        return elapsedMinutes <= this.presensiSession.allowedDuration;
    }
    
    getSessionElapsedTime() {
        if (!this.presensiSession) return 0;
        
        const startTime = new Date(this.presensiSession.startTime);
        const now = new Date();
        return Math.floor((now - startTime) / (1000 * 60)); // in minutes
    }
    
    getSessionRemainingTime() {
        if (!this.presensiSession) return 0;
        
        const elapsed = this.getSessionElapsedTime();
        return Math.max(0, this.presensiSession.allowedDuration - elapsed);
    }
    
    // Presensi Data Management
    hasUserPresensiToday(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
            
            return allPresensi.some(p => 
                p.userId === userId && 
                p.date === today &&
                (p.status === 'hadir' || p.status === 'terlambat')
            );
        } catch (error) {
            console.error('Error checking user presensi:', error);
            return false;
        }
    }
    
    getUserPresensiToday(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
            
            return allPresensi.filter(p => 
                p.userId === userId && 
                p.date === today
            );
        } catch (error) {
            console.error('Error getting user presensi:', error);
            return [];
        }
    }
    
    submitPresensi(presensiData) {
        return new Promise((resolve, reject) => {
            try {
                // Validate session is open
                if (!this.isPresensiOpen()) {
                    reject({
                        success: false,
                        message: 'Sesi presensi tidak aktif'
                    });
                    return;
                }
                
                // Check if user already presensi today for this mapel
                const today = new Date().toISOString().split('T')[0];
                const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                
                const existingPresensi = allPresensi.find(p => 
                    p.userId === presensiData.userId && 
                    p.mapel === presensiData.mapel &&
                    p.date === today
                );
                
                if (existingPresensi) {
                    reject({
                        success: false,
                        message: 'Anda sudah melakukan presensi untuk mata pelajaran ini hari ini'
                    });
                    return;
                }
                
                // Create new presensi record
                const newPresensi = {
                    id: `pres_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    ...presensiData,
                    date: today,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date().toISOString(),
                    sessionId: this.presensiSession?.id,
                    verified: false
                };
                
                // Add to localStorage
                allPresensi.push(newPresensi);
                localStorage.setItem('presensiData', JSON.stringify(allPresensi));
                
                // Broadcast to admin and teachers
                this.notifyNewPresensi(newPresensi);
                
                // Send confirmation to user
                this.sendToUser(presensiData.userId, {
                    type: 'presensi_confirmed',
                    data: newPresensi,
                    message: 'Presensi Anda berhasil direkam'
                });
                
                resolve({
                    success: true,
                    data: newPresensi,
                    message: 'Presensi berhasil disimpan'
                });
                
            } catch (error) {
                console.error('Error submitting presensi:', error);
                reject({
                    success: false,
                    message: 'Gagal menyimpan presensi'
                });
            }
        });
    }
    
    notifyNewPresensi(presensiData) {
        // Notify admin
        this.sendToRole('admin', {
            type: 'new_presensi',
            data: presensiData,
            message: `${presensiData.userName} melakukan presensi di ${presensiData.mapel}`
        });
        
        // Notify teachers (in real app, you'd lookup which teacher teaches this mapel)
        this.sendToRole('guru', {
            type: 'student_presensi',
            data: presensiData,
            message: `Siswa ${presensiData.userName} melakukan presensi`
        });
    }
    
    notifySessionChange() {
        this.broadcastUpdate({
            type: 'session_update',
            data: {
                session: this.presensiSession,
                isOpen: this.isPresensiOpen(),
                remainingTime: this.getSessionRemainingTime()
            },
            message: 'Status sesi presensi diperbarui'
        });
    }
    
    notifyPresensiUpdate() {
        this.sendToRole('admin', {
            type: 'presensi_data_updated',
            data: { timestamp: new Date().toISOString() },
            message: 'Data presensi telah diperbarui'
        });
    }
    
    // Utility Methods
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
    
    getConnectionStats() {
        const stats = {
            totalConnections: this.connections.size,
            byRole: {
                admin: this.getUsersByRole('admin').length,
                guru: this.getUsersByRole('guru').length,
                siswa: this.getUsersByRole('siswa').length
            },
            oldestConnection: null,
            newestConnection: null
        };
        
        if (this.connections.size > 0) {
            const connectionsArray = Array.from(this.connections.values());
            connectionsArray.sort((a, b) => new Date(a.connectedAt) - new Date(b.connectedAt));
            
            stats.oldestConnection = connectionsArray[0]?.connectedAt;
            stats.newestConnection = connectionsArray[connectionsArray.length - 1]?.connectedAt;
        }
        
        return stats;
    }
    
    // Event Handlers
    onAppVisible() {
        console.log('📱 App became visible');
        
        // Sync data when app becomes visible
        this.syncData();
        
        // Send reconnect message to user connections
        this.broadcastUpdate({
            type: 'reconnect',
            data: { timestamp: new Date().toISOString() },
            message: 'Aplikasi aktif kembali'
        });
    }
    
    onAppHidden() {
        console.log('📱 App hidden');
        
        // Cleanup temporary data if needed
        this.lastActivity = new Date();
    }
    
    async syncData() {
        console.log('🔄 Syncing data with server...');
        
        this.broadcastUpdate({
            type: 'sync_request',
            data: {
                timestamp: new Date().toISOString(),
                session: this.presensiSession
            },
            message: 'Memperbarui data...'
        });
        
        // Simulate server sync
        return new Promise(resolve => {
            setTimeout(() => {
                this.broadcastUpdate({
                    type: 'sync_complete',
                    data: { timestamp: new Date().toISOString() },
                    message: 'Data telah disinkronkan'
                });
                resolve(true);
            }, 1000);
        });
    }
    
    // Cleanup inactive connections
    cleanupInactiveConnections(timeoutMinutes = 5) {
        const now = new Date();
        const timeoutMs = timeoutMinutes * 60 * 1000;
        
        this.connections.forEach((connection, connectionId) => {
            const lastSeen = new Date(connection.lastSeen);
            if (now - lastSeen > timeoutMs) {
                console.log(`🕒 Removing inactive connection: ${connectionId}`);
                this.disconnect(connectionId);
            }
        });
    }
    
    // Initialize cleanup interval (every minute)
    startConnectionCleanup() {
        setInterval(() => {
            this.cleanupInactiveConnections();
        }, 60000);
    }
}

// Create global instance
if (!window.RealTimeSystem) {
    window.RealTimeSystem = new RealTimeSystem();
    
    // Start connection cleanup
    setTimeout(() => {
        window.RealTimeSystem.startConnectionCleanup();
    }, 30000);
}

// Export for Node.js/ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeSystem;
}

console.log('🚀 Real-Time System loaded successfully');
