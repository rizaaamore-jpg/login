// ============================================
// MOCK API BACKEND - SMK JAKARTA TIMUR 1
// Simulasi database dengan localStorage
// Versi kompatibel dengan aplikasi yang ada
// ============================================

class MockAPI {
    constructor() {
        this.initializeData();
        console.log('🗄️ Mock API initialized with localStorage');
    }
    
    initializeData() {
        // Initialize users if not exists
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 'SIS001',
                    username: 'Arip',
                    password: 'siswa123',
                    name: 'Arip Suyuti',
                    nis: '2023001',
                    role: 'siswa',
                    kelas: 'X TKJ 1',
                    avatar: '👨‍🎓',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'SIS002',
                    username: 'siti',
                    password: 'siswa123',
                    name: 'Siti Nurhaliza',
                    nis: '2023002',
                    role: 'siswa',
                    kelas: 'XII TKJ 2',
                    avatar: '👩‍🎓',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'SIS003',
                    username: 'budi_siswa',
                    password: 'siswa123',
                    name: 'Budi Santoso',
                    nis: '2023003',
                    role: 'siswa',
                    kelas: 'XI RPL 1',
                    avatar: '👨‍🎓',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'GUR001',
                    username: 'Guru',
                    password: 'guru123',
                    name: 'Bpk. Sutrisno, M.Pd',
                    nip: '198011022005011001',
                    role: 'guru',
                    mapel: ['Matematika', 'Pemrograman Dasar'],
                    avatar: '👨‍🏫',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'GUR002',
                    username: 'rina_guru',
                    password: 'guru123',
                    name: 'Retno, S.Kom',
                    nip: '198512032006042001',
                    role: 'guru',
                    mapel: ['Pemrograman Web', 'Basis Data'],
                    avatar: '👩‍🏫',
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
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
        
        // Initialize mapel if not exists
        if (!localStorage.getItem('mapelData')) {
            const defaultMapel = {
                'pemrograman_web': {
                    id: 'pemrograman_web',
                    name: 'Pemrograman Web',
                    teacher: 'Bu Rina, S.Kom',
                    teacherId: 'GUR002',
                    schedule: 'Senin, 07:30 - 09:00',
                    room: 'Lab. Komputer 1',
                    kelas: ['XII TKJ 1', 'XII TKJ 2', 'XII RPL 1'],
                    color: '#3b82f6',
                    icon: 'fas fa-code',
                    active: true
                },
                'basis_data': {
                    id: 'basis_data',
                    name: 'Basis Data',
                    teacher: 'Bu Rina, S.Kom',
                    teacherId: 'GUR002',
                    schedule: 'Selasa, 09:30 - 11:00',
                    room: 'Lab. Komputer 2',
                    kelas: ['XI TKJ 1', 'XI TKJ 2'],
                    color: '#10b981',
                    icon: 'fas fa-database',
                    active: true
                },
                'jaringan_komputer': {
                    id: 'jaringan_komputer',
                    name: 'Jaringan Komputer',
                    teacher: 'Pak Andi, M.Kom',
                    teacherId: 'GUR003',
                    schedule: 'Rabu, 08:00 - 10:00',
                    room: 'Lab. Jaringan',
                    kelas: ['X TKJ 1', 'X TKJ 2'],
                    color: '#6366f1',
                    icon: 'fas fa-network-wired',
                    active: true
                },
                'pemrograman_dasar': {
                    id: 'pemrograman_dasar',
                    name: 'Pemrograman Dasar',
                    teacher: 'Pak Budi, M.Pd',
                    teacherId: 'GUR001',
                    schedule: 'Kamis, 07:30 - 09:00',
                    room: 'Lab. Komputer A',
                    kelas: ['X RPL 1', 'X RPL 2'],
                    color: '#8b5cf6',
                    icon: 'fas fa-laptop-code',
                    active: true
                },
                'matematika': {
                    id: 'matematika',
                    name: 'Matematika',
                    teacher: 'Pak Sutrisno, S.Pd',
                    teacherId: 'GUR004',
                    schedule: 'Jumat, 09:30 - 11:00',
                    room: 'Ruang 301',
                    kelas: ['X', 'XI', 'XII'],
                    color: '#ef4444',
                    icon: 'fas fa-calculator',
                    active: true
                },
                'bahasa_inggris': {
                    id: 'bahasa_inggris',
                    name: 'Bahasa Inggris',
                    teacher: 'Ms. Nada, S.Pd',
                    teacherId: 'GUR005',
                    schedule: 'Senin, 09:30 - 11:00',
                    room: 'Lab. Bahasa',
                    kelas: ['X', 'XI', 'XII'],
                    color: '#ec4899',
                    icon: 'fas fa-language',
                    active: true
                }
            };
            localStorage.setItem('mapelData', JSON.stringify(defaultMapel));
        }
        
        // Initialize presensi if not exists
        if (!localStorage.getItem('presensiData')) {
            const today = new Date().toISOString().split('T')[0];
            const defaultPresensi = [
                {
                    id: 'PRS001',
                    userId: 'SIS001',
                    userName: 'Arip Suyuti',
                    mapel: 'Pemrograman Web',
                    status: 'hadir',
                    date: today,
                    time: '07:45',
                    catatan: 'Hadir tepat waktu',
                    timestamp: new Date().toISOString(),
                    verified: true
                },
                {
                    id: 'PRS002',
                    userId: 'SIS002',
                    userName: 'Siti Nurhaliza',
                    mapel: 'Basis Data',
                    status: 'hadir',
                    date: today,
                    time: '09:35',
                    catatan: '',
                    timestamp: new Date().toISOString(),
                    verified: true
                },
                {
                    id: 'PRS003',
                    userId: 'SIS003',
                    userName: 'Budi Santoso',
                    mapel: 'Matematika',
                    status: 'izin',
                    date: today,
                    time: '09:40',
                    catatan: 'Izin sakit',
                    timestamp: new Date().toISOString(),
                    verified: true
                }
            ];
            localStorage.setItem('presensiData', JSON.stringify(defaultPresensi));
        }
        
        // Initialize notifications if not exists
        if (!localStorage.getItem('notifications')) {
            const defaultNotifications = [
                {
                    id: 'NOT001',
                    title: 'Selamat Datang',
                    message: 'Selamat datang di Sistem Absensi Digital SMK Jakarta Timur 1',
                    type: 'info',
                    userId: null,
                    read: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'NOT002',
                    title: 'Presensi Berhasil',
                    message: 'Arip melakukan presensi di Pemrograman Web',
                    type: 'success',
                    userId: 'ADM001',
                    read: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'NOT003',
                    title: 'Reminder',
                    message: 'Jangan lupa presensi sebelum jam 10:00',
                    type: 'warning',
                    userId: null,
                    read: false,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        }
    }
    
    // ================= USER MANAGEMENT =================
    
    async login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.username === username && u.password === password);
                    
                    if (user) {
                        // Clone user object and remove password
                        const userResponse = { ...user };
                        delete userResponse.password;
                        
                        resolve({
                            success: true,
                            message: 'Login berhasil',
                            data: userResponse,
                            token: 'mock-jwt-token-' + Date.now()
                        });
                    } else {
                        reject({
                            success: false,
                            message: 'Username atau password salah'
                        });
                    }
                } catch (error) {
                    reject({
                        success: false,
                        message: 'Error saat login: ' + error.message
                    });
                }
            }, 800); // Simulate network delay
        });
    }
    
    async register(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    
                    // Check if username already exists
                    if (users.some(u => u.username === userData.username)) {
                        resolve({
                            success: false,
                            message: 'Username sudah digunakan'
                        });
                        return;
                    }
                    
                    // Check if NIS already exists (for students)
                    if (userData.nis && users.some(u => u.nis === userData.nis)) {
                        resolve({
                            success: false,
                            message: 'NIS sudah terdaftar'
                        });
                        return;
                    }
                    
                    // Generate ID
                    const id = userData.role === 'siswa' ? 'SIS' + (users.filter(u => u.role === 'siswa').length + 1).toString().padStart(3, '0') :
                              userData.role === 'guru' ? 'GUR' + (users.filter(u => u.role === 'guru').length + 1).toString().padStart(3, '0') :
                              'ADM' + (users.filter(u => u.role === 'admin').length + 1).toString().padStart(3, '0');
                    
                    const newUser = {
                        id,
                        ...userData,
                        createdAt: new Date().toISOString()
                    };
                    
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Clone user object and remove password for response
                    const userResponse = { ...newUser };
                    delete userResponse.password;
                    
                    resolve({
                        success: true,
                        message: 'Registrasi berhasil',
                        data: userResponse
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal melakukan registrasi: ' + error.message
                    });
                }
            }, 1000);
        });
    }
    
    async getUsers(role = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    let filteredUsers = users;
                    
                    if (role) {
                        filteredUsers = users.filter(u => u.role === role);
                    }
                    
                    // Remove passwords from response
                    const safeUsers = filteredUsers.map(user => {
                        const { password, ...userWithoutPass } = user;
                        return userWithoutPass;
                    });
                    
                    resolve({
                        success: true,
                        data: safeUsers,
                        total: safeUsers.length
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data pengguna',
                        data: []
                    });
                }
            }, 300);
        });
    }
    
    async getUserById(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.id === userId);
                    
                    if (user) {
                        const { password, ...userWithoutPass } = user;
                        resolve({
                            success: true,
                            data: userWithoutPass
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Pengguna tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data pengguna'
                    });
                }
            }, 200);
        });
    }
    
    // ================= MAPEL MANAGEMENT =================
    
    async getMapel(activeOnly = true) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    
                    // Convert object to array
                    let mapelArray = Object.values(mapelData);
                    
                    // Filter active mapel if requested
                    if (activeOnly) {
                        mapelArray = mapelArray.filter(mapel => mapel.active !== false);
                    }
                    
                    // Sort by name
                    mapelArray.sort((a, b) => a.name.localeCompare(b.name));
                    
                    resolve({
                        success: true,
                        data: mapelArray,
                        total: mapelArray.length
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data mata pelajaran',
                        data: []
                    });
                }
            }, 200);
        });
    }
    
    async getMapelById(mapelId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    const mapel = mapelData[mapelId];
                    
                    if (mapel) {
                        resolve({
                            success: true,
                            data: mapel
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Mata pelajaran tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data mata pelajaran'
                    });
                }
            }, 200);
        });
    }
    
    async addMapel(mapelData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const allMapel = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    
                    // Generate ID from name
                    const id = mapelData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    
                    // Check if mapel already exists
                    if (allMapel[id]) {
                        resolve({
                            success: false,
                            message: 'Mata pelajaran sudah ada'
                        });
                        return;
                    }
                    
                    const newMapel = {
                        id,
                        ...mapelData,
                        active: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    allMapel[id] = newMapel;
                    localStorage.setItem('mapelData', JSON.stringify(allMapel));
                    
                    // Add notification
                    this.addNotification({
                        title: 'Mata Pelajaran Baru',
                        message: `${mapelData.name} telah ditambahkan`,
                        type: 'info',
                        userId: 'ADM001'
                    });
                    
                    resolve({
                        success: true,
                        message: 'Mata pelajaran berhasil ditambahkan',
                        data: newMapel
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menambahkan mata pelajaran: ' + error.message
                    });
                }
            }, 500);
        });
    }
    
    async updateMapel(mapelId, updateData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    
                    if (mapelData[mapelId]) {
                        mapelData[mapelId] = {
                            ...mapelData[mapelId],
                            ...updateData,
                            updatedAt: new Date().toISOString()
                        };
                        
                        localStorage.setItem('mapelData', JSON.stringify(mapelData));
                        
                        resolve({
                            success: true,
                            message: 'Mata pelajaran berhasil diupdate',
                            data: mapelData[mapelId]
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Mata pelajaran tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal mengupdate mata pelajaran'
                    });
                }
            }, 400);
        });
    }
    
    async deleteMapel(mapelId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    
                    if (mapelData[mapelId]) {
                        delete mapelData[mapelId];
                        localStorage.setItem('mapelData', JSON.stringify(mapelData));
                        
                        resolve({
                            success: true,
                            message: 'Mata pelajaran berhasil dihapus'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Mata pelajaran tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menghapus mata pelajaran'
                    });
                }
            }, 400);
        });
    }
    
    // ================= PRESENSI MANAGEMENT =================
    
    async submitPresensi(presensiData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    const today = new Date().toISOString().split('T')[0];
                    
                    // Check if user already has presensi for this mapel today
                    const existingPresensi = allPresensi.find(p => 
                        p.userId === presensiData.userId && 
                        p.mapel === presensiData.mapel &&
                        p.date === today
                    );
                    
                    if (existingPresensi) {
                        resolve({
                            success: false,
                            message: 'Anda sudah melakukan presensi untuk mata pelajaran ini hari ini'
                        });
                        return;
                    }
                    
                    const newPresensi = {
                        id: 'PRS' + Date.now(),
                        ...presensiData,
                        date: today,
                        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        timestamp: new Date().toISOString(),
                        verified: false
                    };
                    
                    allPresensi.push(newPresensi);
                    localStorage.setItem('presensiData', JSON.stringify(allPresensi));
                    
                    // Add notification for admin
                    this.addNotification({
                        title: 'Presensi Baru',
                        message: `${presensiData.userName} melakukan presensi di ${presensiData.mapel} sebagai ${presensiData.status}`,
                        type: 'info',
                        userId: 'ADM001'
                    });
                    
                    // Add notification for teacher
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    const mapel = Object.values(mapelData).find(m => m.name === presensiData.mapel);
                    if (mapel && mapel.teacherId) {
                        this.addNotification({
                            title: 'Siswa Presensi',
                            message: `${presensiData.userName} melakukan presensi di ${presensiData.mapel}`,
                            type: 'info',
                            userId: mapel.teacherId
                        });
                    }
                    
                    resolve({
                        success: true,
                        message: 'Presensi berhasil disimpan',
                        data: newPresensi
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menyimpan presensi: ' + error.message
                    });
                }
            }, 600);
        });
    }
    
    async getPresensi(userId = null, date = null, mapel = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    let allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    
                    // Apply filters
                    if (userId) {
                        allPresensi = allPresensi.filter(p => p.userId === userId);
                    }
                    
                    if (date) {
                        allPresensi = allPresensi.filter(p => p.date === date);
                    }
                    
                    if (mapel) {
                        allPresensi = allPresensi.filter(p => p.mapel === mapel);
                    }
                    
                    // Sort by timestamp (newest first)
                    allPresensi.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    resolve({
                        success: true,
                        data: allPresensi,
                        total: allPresensi.length
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data presensi',
                        data: []
                    });
                }
            }, 300);
        });
    }
    
    async getTodayPresensi() {
        const today = new Date().toISOString().split('T')[0];
        return this.getPresensi(null, today);
    }
    
    async verifyPresensi(presensiId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    const presensi = allPresensi.find(p => p.id === presensiId);
                    
                    if (presensi) {
                        presensi.verified = true;
                        presensi.verifiedAt = new Date().toISOString();
                        localStorage.setItem('presensiData', JSON.stringify(allPresensi));
                        
                        resolve({
                            success: true,
                            message: 'Presensi telah diverifikasi',
                            data: presensi
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Data presensi tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memverifikasi presensi'
                    });
                }
            }, 400);
        });
    }
    
    // ================= NOTIFICATIONS =================
    
    async getNotifications(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                    
                    // Filter notifications: admin gets all, others get global or their own
                    if (userId !== 'ADM001') {
                        notifications = notifications.filter(n => 
                            n.userId === null || n.userId === userId || userId.startsWith('GUR') && n.type === 'teacher'
                        );
                    }
                    
                    // Sort by date (newest first)
                    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    // Mark as read if they were unread and belong to this user
                    notifications.forEach(notif => {
                        if (!notif.read && (notif.userId === userId || notif.userId === null)) {
                            notif.read = true;
                        }
                    });
                    
                    // Save updated notifications
                    localStorage.setItem('notifications', JSON.stringify(notifications));
                    
                    resolve({
                        success: true,
                        data: notifications,
                        unread: notifications.filter(n => !n.read).length
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat notifikasi',
                        data: []
                    });
                }
            }, 250);
        });
    }
    
    addNotification(notification) {
        try {
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            
            const newNotif = {
                id: 'NOT' + Date.now(),
                ...notification,
                read: false,
                createdAt: new Date().toISOString()
            };
            
            notifications.unshift(newNotif);
            
            // Keep only last 100 notifications
            if (notifications.length > 100) {
                notifications.length = 100;
            }
            
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Trigger notification event for real-time update
            if (window.dispatchEvent) {
                const event = new CustomEvent('newNotification', { detail: newNotif });
                window.dispatchEvent(event);
            }
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    }
    
    async markNotificationAsRead(notificationId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                    const notification = notifications.find(n => n.id === notificationId);
                    
                    if (notification) {
                        notification.read = true;
                        localStorage.setItem('notifications', JSON.stringify(notifications));
                        
                        resolve({
                            success: true,
                            message: 'Notifikasi ditandai sebagai telah dibaca'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Notifikasi tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memperbarui notifikasi'
                    });
                }
            }, 200);
        });
    }
    
    // ================= STATISTICS =================
    
    async getDashboardStats(userId, userRole) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    const presensiData = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    
                    const today = new Date().toISOString().split('T')[0];
                    const currentMonth = new Date().getMonth() + 1;
                    const currentYear = new Date().getFullYear();
                    
                    let stats = {};
                    
                    if (userRole === 'siswa') {
                        const userPresensi = presensiData.filter(p => p.userId === userId);
                        const todayPresensi = userPresensi.filter(p => p.date === today);
                        const monthlyPresensi = userPresensi.filter(p => {
                            const presensiDate = new Date(p.date);
                            return presensiDate.getMonth() + 1 === currentMonth && 
                                   presensiDate.getFullYear() === currentYear;
                        });
                        
                        const totalMapelForStudent = Object.values(mapelData).filter(mapel => 
                            mapel.kelas.some(kelas => {
                                const user = users.find(u => u.id === userId);
                                return user && user.kelas && user.kelas.includes(kelas);
                            })
                        ).length;
                        
                        stats = {
                            hadirHariIni: todayPresensi.filter(p => p.status === 'hadir').length,
                            totalMapel: totalMapelForStudent,
                            presensiBulanIni: monthlyPresensi.length,
                            persenKehadiran: monthlyPresensi.length > 0 ? 
                                Math.round((monthlyPresensi.filter(p => p.status === 'hadir').length / monthlyPresensi.length) * 100) : 0,
                            totalPresensi: userPresensi.length,
                            izinHariIni: todayPresensi.filter(p => p.status === 'izin').length,
                            alphaHariIni: todayPresensi.filter(p => p.status === 'alpha').length
                        };
                    } else if (userRole === 'guru') {
                        const guru = users.find(u => u.id === userId);
                        const guruMapel = guru?.mapel || [];
                        const mapelCount = guruMapel.length;
                        
                        const todayPresensi = presensiData.filter(p => 
                            p.date === today && guruMapel.includes(p.mapel)
                        );
                        
                        stats = {
                            totalMapel: mapelCount,
                            siswaTotal: users.filter(u => u.role === 'siswa').length,
                            presensiHariIni: todayPresensi.length,
                            kehadiranHariIni: todayPresensi.filter(p => p.status === 'hadir').length,
                            persenKehadiran: todayPresensi.length > 0 ? 
                                Math.round((todayPresensi.filter(p => p.status === 'hadir').length / todayPresensi.length) * 100) : 0,
                            totalPresensiBulanIni: presensiData.filter(p => 
                                guruMapel.includes(p.mapel) && 
                                new Date(p.date).getMonth() + 1 === currentMonth
                            ).length
                        };
                    } else if (userRole === 'admin') {
                        const todayPresensi = presensiData.filter(p => p.date === today);
                        
                        stats = {
                            totalSiswa: users.filter(u => u.role === 'siswa').length,
                            totalGuru: users.filter(u => u.role === 'guru').length,
                            totalMapel: Object.values(mapelData).length,
                            presensiHariIni: todayPresensi.length,
                            kehadiranHariIni: todayPresensi.filter(p => p.status === 'hadir').length,
                            izinHariIni: todayPresensi.filter(p => p.status === 'izin').length,
                            alphaHariIni: todayPresensi.filter(p => p.status === 'alpha').length,
                            persenKehadiran: todayPresensi.length > 0 ? 
                                Math.round((todayPresensi.filter(p => p.status === 'hadir').length / todayPresensi.length) * 100) : 0
                        };
                    }
                    
                    resolve({
                        success: true,
                        data: stats
                    });
                } catch (error) {
                    console.error('Error getting dashboard stats:', error);
                    resolve({
                        success: false,
                        message: 'Gagal memuat statistik',
                        data: {}
                    });
                }
            }, 350);
        });
    }
    
    // ================= UTILITY METHODS =================
    
    async clearAllData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    localStorage.removeItem('users');
                    localStorage.removeItem('mapelData');
                    localStorage.removeItem('presensiData');
                    localStorage.removeItem('notifications');
                    
                    // Reinitialize with default data
                    this.initializeData();
                    
                    resolve({
                        success: true,
                        message: 'Semua data telah direset ke default'
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal mereset data'
                    });
                }
            }, 1000);
        });
    }
    
    async exportData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const data = {
                        users: JSON.parse(localStorage.getItem('users') || '[]'),
                        mapelData: JSON.parse(localStorage.getItem('mapelData') || '{}'),
                        presensiData: JSON.parse(localStorage.getItem('presensiData') || '[]'),
                        notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
                        exportedAt: new Date().toISOString()
                    };
                    
                    resolve({
                        success: true,
                        data: data,
                        message: 'Data berhasil diekspor'
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal mengekspor data'
                    });
                }
            }, 500);
        });
    }
    
    async importData(importData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    if (importData.users) {
                        localStorage.setItem('users', JSON.stringify(importData.users));
                    }
                    if (importData.mapelData) {
                        localStorage.setItem('mapelData', JSON.stringify(importData.mapelData));
                    }
                    if (importData.presensiData) {
                        localStorage.setItem('presensiData', JSON.stringify(importData.presensiData));
                    }
                    if (importData.notifications) {
                        localStorage.setItem('notifications', JSON.stringify(importData.notifications));
                    }
                    
                    resolve({
                        success: true,
                        message: 'Data berhasil diimpor'
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal mengimpor data'
                    });
                }
            }, 800);
        });
    }
}

// Create global instance
if (!window.MockAPI) {
    window.MockAPI = new MockAPI();
}

// Export for Node.js/ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockAPI;
                           }
