// ============================================
// MOCK API BACKEND - SIMULASI DATABASE
// ============================================
class MockAPI {
    constructor() {
        this.users = this.loadFromStorage('users') || this.getDefaultUsers();
        this.mapelData = this.loadFromStorage('mapelData') || this.getDefaultMapelData();
        this.presensiData = this.loadFromStorage('presensiData') || [];
        this.notifications = this.loadFromStorage('notifications') || [];
    }
    
    // Storage helper
    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    }
    
    loadFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    // ================= USER MANAGEMENT =================
    getDefaultUsers() {
        return [
            {
                id: 'SIS001',
                username: 'ahmad',
                password: 'siswa123',
                name: 'Ahmad Fauzi',
                nis: '2023001',
                role: 'siswa',
                kelas: 'XII TKJ 1',
                avatar: '👨‍🎓',
                createdAt: new Date().toISOString()
            },
            {
                id: 'GUR001',
                username: 'guru',
                password: 'guru123',
                name: 'Sutrisno, Retno M.Pd',
                nip: '198011022005011001',
                role: 'guru',
                mapel: ['matematika', 'informatika'],
                avatar: '👨‍🏫',
                createdAt: new Date().toISOString()
            },
            {
                id: 'ADM001',
                username: 'admin',
                password: 'admin123',
                name: 'Administrator Sistem',
                role: 'admin',
                avatar: '👨‍💼',
                createdAt: new Date().toISOString()
            }
        ];
    }
    
    // Login method
    login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => 
                    u.username === username && u.password === password
                );
                
                if (user) {
                    // Remove password from response
                    const { password, ...userWithoutPass } = user;
                    resolve({
                        success: true,
                        message: 'Login berhasil',
                        data: userWithoutPass,
                        token: 'mock-jwt-token-' + Date.now()
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Username atau password salah'
                    });
                }
            }, 500); // Simulate network delay
        });
    }
    
    // Add new user (admin only)
    addUser(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: userData.role.toUpperCase().substring(0, 3) + Date.now().toString().slice(-3),
                    ...userData,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(newUser);
                this.saveToStorage('users', this.users);
                
                resolve({
                    success: true,
                    message: 'User berhasil ditambahkan',
                    data: newUser
                });
            }, 300);
        });
    }
    
    // Get all users
    getUsers(role = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredUsers = this.users;
                if (role) {
                    filteredUsers = this.users.filter(u => u.role === role);
                }
                
                // Remove passwords
                const safeUsers = filteredUsers.map(({ password, ...user }) => user);
                
                resolve({
                    success: true,
                    data: safeUsers
                });
            }, 200);
        });
    }
    
    // ================= MAPEL MANAGEMENT =================
    getDefaultMapelData() {
        return {
            pjok: {
                id: 'pjok',
                name: "PJOK",
                fullName: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
                teacher: "Bpk. Dudi",
                teacherId: "GUR002",
                schedule: "Senin, 07:30 - 09:00",
                room: "Lapangan Olahraga",
                color: "#10b981",
                icon: "fas fa-running",
                kelas: ["X", "XI", "XII"],
                active: true
            },
            // ... tambahkan semua mapel sesuai kebutuhan
        };
    }
    
    getMapel() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: this.mapelData
                });
            }, 100);
        });
    }
    
    updateMapel(mapelId, updateData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.mapelData[mapelId]) {
                    this.mapelData[mapelId] = {
                        ...this.mapelData[mapelId],
                        ...updateData
                    };
                    this.saveToStorage('mapelData', this.mapelData);
                    
                    resolve({
                        success: true,
                        message: 'Mapel berhasil diupdate',
                        data: this.mapelData[mapelId]
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Mapel tidak ditemukan'
                    });
                }
            }, 300);
        });
    }
    
    addMapel(mapelData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const id = mapelData.name.toLowerCase().replace(/ /g, '_');
                
                this.mapelData[id] = {
                    id: id,
                    ...mapelData
                };
                this.saveToStorage('mapelData', this.mapelData);
                
                resolve({
                    success: true,
                    message: 'Mapel berhasil ditambahkan',
                    data: this.mapelData[id]
                });
            }, 300);
        });
    }
    
    deleteMapel(mapelId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.mapelData[mapelId]) {
                    delete this.mapelData[mapelId];
                    this.saveToStorage('mapelData', this.mapelData);
                    
                    resolve({
                        success: true,
                        message: 'Mapel berhasil dihapus'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Mapel tidak ditemukan'
                    });
                }
            }, 300);
        });
    }
    
    // ================= PRESENSI MANAGEMENT =================
    submitPresensi(presensiData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newPresensi = {
                    id: 'PRS' + Date.now(),
                    ...presensiData,
                    timestamp: new Date().toISOString(),
                    verified: false
                };
                
                this.presensiData.push(newPresensi);
                this.saveToStorage('presensiData', this.presensiData);
                
                // Add notification
                this.addNotification({
                    title: 'Presensi Baru',
                    message: `${presensiData.userName} melakukan presensi sebagai ${presensiData.status}`,
                    type: 'info',
                    userId: 'ADM001'
                });
                
                resolve({
                    success: true,
                    message: 'Presensi berhasil disimpan',
                    data: newPresensi
                });
            }, 400);
        });
    }
    
    getPresensi(userId = null, date = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = this.presensiData;
                
                if (userId) {
                    filtered = filtered.filter(p => p.userId === userId);
                }
                
                if (date) {
                    filtered = filtered.filter(p => p.date === date);
                }
                
                resolve({
                    success: true,
                    data: filtered
                });
            }, 200);
        });
    }
    
    // ================= NOTIFICATIONS =================
    addNotification(notification) {
        const newNotif = {
            id: 'NOT' + Date.now(),
            ...notification,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        this.notifications.push(newNotif);
        this.saveToStorage('notifications', this.notifications);
    }
    
    getNotifications(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let userNotifs = this.notifications;
                
                // Admin gets all, others get only theirs
                if (userId !== 'ADM001') {
                    userNotifs = this.notifications.filter(n => 
                        !n.userId || n.userId === userId
                    );
                }
                
                resolve({
                    success: true,
                    data: userNotifs
                });
            }, 150);
        });
    }
    
    markNotificationRead(notifId) {
        const notif = this.notifications.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            this.saveToStorage('notifications', this.notifications);
        }
    }
    
    // ================= STATISTICS =================
    getDashboardStats(userId, userRole) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const today = new Date().toISOString().split('T')[0];
                let stats = {};
                
                if (userRole === 'siswa') {
                    const userPresensi = this.presensiData.filter(p => p.userId === userId);
                    const todayPresensi = userPresensi.filter(p => p.date === today);
                    const monthlyPresensi = userPresensi.filter(p => 
                        new Date(p.date).getMonth() === new Date().getMonth()
                    );
                    
                    stats = {
                        hadirHariIni: todayPresensi.filter(p => p.status === 'hadir').length,
                        totalMapel: Object.keys(this.mapelData).length,
                        persenBulanIni: monthlyPresensi.length > 0 ? 
                            Math.round((monthlyPresensi.filter(p => p.status === 'hadir').length / monthlyPresensi.length) * 100) : 0,
                        totalPresensi: userPresensi.length
                    };
                } else if (userRole === 'admin') {
                    stats = {
                        totalSiswa: this.users.filter(u => u.role === 'siswa').length,
                        totalGuru: this.users.filter(u => u.role === 'guru').length,
                        totalMapel: Object.keys(this.mapelData).length,
                        presensiHariIni: this.presensiData.filter(p => p.date === today).length
                    };
                }
                
                resolve({
                    success: true,
                    data: stats
                });
            }, 250);
        });
    }
}

// Export global instance
window.MockAPI = new MockAPI();
