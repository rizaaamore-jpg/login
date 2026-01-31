// ============================================
// MOCK API BACKEND - SMK JAKARTA TIMUR 1
// Simulasi database dengan localStorage
// ============================================

class MockAPI {
    constructor() {
        this.initializeData();
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
                    id: 'GUR001',
                    username: 'budi',
                    password: 'guru123',
                    name: 'Budi Santoso, M.Pd',
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
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
        
        // Initialize mapel if not exists
        if (!localStorage.getItem('mapelData')) {
            const defaultMapel = {
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
                    active: true,
                    createdAt: new Date().toISOString()
                },
                matematika: {
                    id: 'matematika',
                    name: "Matematika",
                    fullName: "Matematika",
                    teacher: "Bpk.Sutrisno",
                    teacherId: "GUR001",
                    schedule: "Senin, 09:30 - 11:00",
                    room: "Lab. Matematika",
                    color: "#3b82f6",
                    icon: "fas fa-calculator",
                    kelas: ["X", "XI", "XII"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                bahasa_indonesia: {
                    id: 'bahasa_indonesia',
                    name: "Bahasa Indonesia",
                    fullName: "Bahasa Indonesia",
                    teacher: "Ibu Kesih",
                    teacherId: "GUR003",
                    schedule: "Selasa, 07:30 - 09:00",
                    room: "Ruang 201",
                    color: "#8b5cf6",
                    icon: "fas fa-language",
                    kelas: ["X", "XI", "XII"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                bahasa_inggris: {
                    id: 'bahasa_inggris',
                    name: "Bahasa Inggris",
                    fullName: "Bahasa Inggris",
                    teacher: "Ms.Nada",
                    teacherId: "GUR004",
                    schedule: "Selasa, 09:30 - 11:00",
                    room: "Lab. Bahasa",
                    color: "#ec4899",
                    icon: "fas fa-globe",
                    kelas: ["X", "XI", "XII"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                ipas: {
                    id: 'ipas',
                    name: "IPAS",
                    fullName: "Ilmu Pengetahuan Alam dan Sosial",
                    teacher: "Ibu Rahayu",
                    teacherId: "GUR005",
                    schedule: "Rabu, 07:30 - 09:00",
                    room: "Lab. IPA",
                    color: "#06b6d4",
                    icon: "fas fa-flask",
                    kelas: ["X"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                sejarah: {
                    id: 'sejarah',
                    name: "Sejarah",
                    fullName: "Sejarah Indonesia",
                    teacher: "Ibu Rahayu",
                    teacherId: "GUR006",
                    schedule: "Rabu, 09:30 - 11:00",
                    room: "Ruang 202",
                    color: "#f97316",
                    icon: "fas fa-landmark",
                    kelas: ["XI", "XII"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                pancasila: {
                    id: 'pancasila',
                    name: "Pancasila",
                    fullName: "Pendidikan Pancasila",
                    teacher: "Ibu Manda",
                    teacherId: "GUR007",
                    schedule: "Kamis, 07:30 - 09:00",
                    room: "Ruang 203",
                    color: "#84cc16",
                    icon: "fas fa-flag",
                    kelas: ["X", "XI", "XII"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                jaringan_dasar: {
                    id: 'jaringan_dasar',
                    name: "Jaringan Dasar",
                    fullName: "Komputer Jaringan Dasar",
                    teacher: "Bpk. Okeu",
                    teacherId: "GUR008",
                    schedule: "Kamis, 09:30 - 11:00",
                    room: "Lab. Jaringan",
                    color: "#6366f1",
                    icon: "fas fa-network-wired",
                    kelas: ["X"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                sistem_komputer: {
                    id: 'sistem_komputer',
                    name: "Sistem Komputer",
                    fullName: "Sistem Komputer",
                    teacher: "Bpk. Adi",
                    teacherId: "GUR009",
                    schedule: "Jumat, 07:30 - 09:00",
                    room: "Lab. Komputer A",
                    color: "#8b5cf6",
                    icon: "fas fa-desktop",
                    kelas: ["XI"],
                    active: true,
                    createdAt: new Date().toISOString()
                },
                coding_ai: {
                    id: 'coding_ai',
                    name: "Coding AI",
                    fullName: "Coding Artificial Intelligence",
                    teacher: "Bpk.Rama",
                    teacherId: "GUR010",
                    schedule: "Jumat, 09:30 - 11:00",
                    room: "Lab. AI",
                    color: "#06b6d4",
                    icon: "fas fa-robot",
                    kelas: ["XII"],
                    active: true,
                    createdAt: new Date().toISOString()
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
                    userName: 'Ahmad Fauzi',
                    mapel: 'Matematika',
                    status: 'hadir',
                    date: today,
                    time: '07:45',
                    catatan: '',
                    timestamp: new Date().toISOString(),
                    verified: true
                },
                {
                    id: 'PRS002',
                    userId: 'SIS002',
                    userName: 'Siti Nurhaliza',
                    mapel: 'Bahasa Indonesia',
                    status: 'hadir',
                    date: today,
                    time: '08:00',
                    catatan: '',
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
                    message: 'Ahmad melakukan presensi di Matematika',
                    type: 'success',
                    userId: 'ADM001',
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
                } catch (error) {
                    reject({
                        success: false,
                        message: 'Error saat login'
                    });
                }
            }, 500);
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
                    
                    // Remove passwords for security
                    const safeUsers = filteredUsers.map(({ password, ...user }) => user);
                    
                    resolve({
                        success: true,
                        data: safeUsers
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data user'
                    });
                }
            }, 200);
        });
    }
    
    async addUser(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    
                    // Generate ID
                    const prefix = userData.role === 'siswa' ? 'SIS' :
                                  userData.role === 'guru' ? 'GUR' : 'ADM';
                    const id = prefix + (users.length + 1).toString().padStart(3, '0');
                    
                    const newUser = {
                        id,
                        ...userData,
                        createdAt: new Date().toISOString()
                    };
                    
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Remove password from response
                    const { password, ...userWithoutPass } = newUser;
                    
                    resolve({
                        success: true,
                        message: 'User berhasil ditambahkan',
                        data: userWithoutPass
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menambahkan user'
                    });
                }
            }, 300);
        });
    }
    
    // ================= MAPEL MANAGEMENT =================
    
    async getMapel() {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const mapelData = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    resolve({
                        success: true,
                        data: mapelData
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data mapel'
                    });
                }
            }, 150);
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
                            message: 'Mapel berhasil diupdate',
                            data: mapelData[mapelId]
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Mapel tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal mengupdate mapel'
                    });
                }
            }, 300);
        });
    }
    
    async addMapel(mapelData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const allMapel = JSON.parse(localStorage.getItem('mapelData') || '{}');
                    
                    // Generate ID from name
                    const id = mapelData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    
                    const newMapel = {
                        id,
                        ...mapelData,
                        createdAt: new Date().toISOString()
                    };
                    
                    allMapel[id] = newMapel;
                    localStorage.setItem('mapelData', JSON.stringify(allMapel));
                    
                    resolve({
                        success: true,
                        message: 'Mapel berhasil ditambahkan',
                        data: newMapel
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menambahkan mapel'
                    });
                }
            }, 300);
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
                            message: 'Mapel berhasil dihapus'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Mapel tidak ditemukan'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menghapus mapel'
                    });
                }
            }, 300);
        });
    }
    
    // ================= PRESENSI MANAGEMENT =================
    
    async submitPresensi(presensiData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    
                    const newPresensi = {
                        id: 'PRS' + Date.now(),
                        ...presensiData,
                        timestamp: new Date().toISOString(),
                        verified: false
                    };
                    
                    allPresensi.push(newPresensi);
                    localStorage.setItem('presensiData', JSON.stringify(allPresensi));
                    
                    // Add notification for admin
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
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal menyimpan presensi'
                    });
                }
            }, 400);
        });
    }
    
    async getPresensi(userId = null, date = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    let allPresensi = JSON.parse(localStorage.getItem('presensiData') || '[]');
                    
                    // Filter by userId if provided
                    if (userId) {
                        allPresensi = allPresensi.filter(p => p.userId === userId);
                    }
                    
                    // Filter by date if provided
                    if (date) {
                        allPresensi = allPresensi.filter(p => p.date === date);
                    }
                    
                    // Sort by timestamp (newest first)
                    allPresensi.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    resolve({
                        success: true,
                        data: allPresensi
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat data presensi'
                    });
                }
            }, 200);
        });
    }
    
    // ================= NOTIFICATIONS =================
    
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
            localStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    }
    
    async getNotifications(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                    
                    // Admin gets all notifications
                    // Others get only global notifications or their own
                    if (userId !== 'ADM001') {
                        notifications = notifications.filter(n => 
                            !n.userId || n.userId === userId
                        );
                    }
                    
                    // Sort by date (newest first)
                    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    resolve({
                        success: true,
                        data: notifications
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat notifikasi'
                    });
                }
            }, 150);
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
                    const currentMonth = new Date().getMonth();
                    
                    let stats = {};
                    
                    if (userRole === 'siswa') {
                        const userPresensi = presensiData.filter(p => p.userId === userId);
                        const todayPresensi = userPresensi.filter(p => p.date === today);
                        const monthlyPresensi = userPresensi.filter(p => 
                            new Date(p.date).getMonth() === currentMonth
                        );
                        
                        stats = {
                            hadirHariIni: todayPresensi.filter(p => p.status === 'hadir').length,
                            totalMapel: Object.keys(mapelData).length,
                            persenBulanIni: monthlyPresensi.length > 0 ? 
                                Math.round((monthlyPresensi.filter(p => p.status === 'hadir').length / monthlyPresensi.length) * 100) : 0,
                            totalPresensi: userPresensi.length
                        };
                    } else if (userRole === 'guru') {
                        const guru = users.find(u => u.id === userId);
                        const guruMapel = guru?.mapel || [];
                        const mapelCount = guruMapel.length;
                        
                        stats = {
                            totalMapel: mapelCount,
                            siswaTotal: users.filter(u => u.role === 'siswa').length,
                            presensiHariIni: presensiData.filter(p => p.date === today).length
                        };
                    } else if (userRole === 'admin') {
                        stats = {
                            totalSiswa: users.filter(u => u.role === 'siswa').length,
                            totalGuru: users.filter(u => u.role === 'guru').length,
                            totalMapel: Object.keys(mapelData).length,
                            presensiHariIni: presensiData.filter(p => p.date === today).length
                        };
                    }
                    
                    resolve({
                        success: true,
                        data: stats
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Gagal memuat statistik',
                        data: {}
                    });
                }
            }, 250);
        });
    }
}

// Create global instance
window.MockAPI = new MockAPI();
