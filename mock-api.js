// Mock API Data for Development
class MockAPI {
    constructor() {
        this.users = this.generateMockUsers();
        this.attendance = this.generateMockAttendance();
        this.delay = 500; // Simulate network delay
    }

    // Generate mock users
    generateMockUsers() {
        return [
            // Students
            { id: '2024001', name: 'Ahmad Budi Santoso', role: 'siswa', kelas: 'X TKJ 1', password: 'siswa123' },
            { id: '2024002', name: 'Siti Aminah', role: 'siswa', kelas: 'X TKJ 2', password: 'siswa123' },
            { id: '2024003', name: 'Rizki Pratama', role: 'siswa', kelas: 'XI TKJ 1', password: 'siswa123' },
            
            // Teachers
            { id: '101', name: 'Dr. Wahyu Setiawan, M.Pd', role: 'guru', password: 'guru123' },
            { id: '102', name: 'Ibu Sari Dewi, S.Kom', role: 'guru', password: 'guru123' },
            
            // Admin
            { id: 'admin', name: 'Administrator', role: 'admin', password: 'admin123' }
        ];
    }

    // Generate mock attendance data
    generateMockAttendance() {
        const attendance = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            
            // Add attendance for each student
            this.users
                .filter(u => u.role === 'siswa')
                .forEach(student => {
                    const types = ['hadir', 'hadir', 'hadir', 'sakit', 'izin', 'alpha'];
                    const type = types[Math.floor(Math.random() * types.length)];
                    
                    attendance.push({
                        id: `${student.id}-${dateStr}`,
                        userId: student.id,
                        date: dateStr,
                        type: type,
                        time: type === 'hadir' ? 
                            (Math.random() > 0.7 ? '07:45' : '07:25') : null,
                        status: type === 'hadir' ? 
                            (Math.random() > 0.7 ? 'Terlambat' : 'Tepat waktu') : type,
                        kelas: student.kelas
                    });
                });
        }
        
        return attendance;
    }

    // Mock API methods
    async login(credentials) {
        await this.simulateDelay();
        
        const user = this.users.find(u => 
            u.id === credentials.nisn && u.password === credentials.password
        );
        
        if (!user) {
            throw new Error('NISN/NIP atau password salah');
        }
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getAttendance(userId, filters = {}) {
        await this.simulateDelay();
        
        let filtered = this.attendance.filter(a => a.userId === userId);
        
        if (filters.startDate) {
            filtered = filtered.filter(a => a.date >= filters.startDate);
        }
        
        if (filters.endDate) {
            filtered = filtered.filter(a => a.date <= filters.endDate);
        }
        
        if (filters.type) {
            filtered = filtered.filter(a => a.type === filters.type);
        }
        
        return filtered.sort((a, b) => b.date.localeCompare(a.date));
    }

    async recordAttendance(data) {
        await this.simulateDelay();
        
        const id = `${data.userId}-${data.date}`;
        const existingIndex = this.attendance.findIndex(a => a.id === id);
        
        if (existingIndex !== -1) {
            // Update existing
            this.attendance[existingIndex] = { ...this.attendance[existingIndex], ...data };
        } else {
            // Add new
            this.attendance.push({
                id,
                ...data,
                status: data.type === 'hadir' ? 'Tepat waktu' : data.type
            });
        }
        
        return { success: true, id };
    }

    async getStats(userId) {
        await this.simulateDelay();
        
        const userAttendance = this.attendance.filter(a => a.userId === userId);
        const totalDays = 30; // Last 30 days
        
        const present = userAttendance.filter(a => a.type === 'hadir').length;
        const late = userAttendance.filter(a => a.status === 'Terlambat').length;
        const absent = userAttendance.filter(a => a.type === 'alpha').length;
        
        return {
            present,
            late,
            absent,
            totalDays,
            percentage: Math.round((present / totalDays) * 100)
        };
    }

    // Admin methods
    async getAllAttendance(filters = {}) {
        await this.simulateDelay();
        
        let filtered = [...this.attendance];
        
        if (filters.kelas) {
            filtered = filtered.filter(a => a.kelas === filters.kelas);
        }
        
        if (filters.startDate) {
            filtered = filtered.filter(a => a.date >= filters.startDate);
        }
        
        if (filters.endDate) {
            filtered = filtered.filter(a => a.date <= filters.endDate);
        }
        
        return filtered.sort((a, b) => b.date.localeCompare(a.date));
    }

    async getAllUsers() {
        await this.simulateDelay();
        return this.users.map(({ password, ...user }) => user);
    }

    async createUser(userData) {
        await this.simulateDelay();
        
        const newUser = {
            id: userData.id,
            name: userData.name,
            role: userData.role,
            kelas: userData.kelas || null,
            password: userData.password || 'default123'
        };
        
        this.users.push(newUser);
        return { success: true, user: newUser };
    }

    async updateUser(userId, updates) {
        await this.simulateDelay();
        
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) {
            throw new Error('User not found');
        }
        
        this.users[index] = { ...this.users[index], ...updates };
        return { success: true, user: this.users[index] };
    }

    async deleteUser(userId) {
        await this.simulateDelay();
        
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) {
            throw new Error('User not found');
        }
        
        this.users.splice(index, 1);
        return { success: true };
    }

    // Helper method to simulate network delay
    simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    }

    // Reset mock data (for testing)
    resetData() {
        this.users = this.generateMockUsers();
        this.attendance = this.generateMockAttendance();
    }
}

// Create global instance
window.mockAPI = new MockAPI();

// Example usage:
// const user = await window.mockAPI.login({ nisn: '2024001', password: 'siswa123' });
// const attendance = await window.mockAPI.getAttendance('2024001');
// const stats = await window.mockAPI.getStats('2024001');

// For admin:
// const allUsers = await window.mockAPI.getAllUsers();
// const allAttendance = await window.mockAPI.getAllAttendance();

// Integrate with main app
if (typeof window !== 'undefined') {
    // Override fetch to use mock API during development
    if (process.env.NODE_ENV === 'development') {
        const originalFetch = window.fetch;
        
        window.fetch = async function(url, options = {}) {
            // Intercept API calls
            if (url.startsWith('/api/')) {
                const endpoint = url.replace('/api/', '');
                const method = options.method || 'GET';
                const body = options.body ? JSON.parse(options.body) : {};
                
                try {
                    let responseData;
                    
                    switch (endpoint) {
                        case 'login':
                            responseData = await window.mockAPI.login(body);
                            break;
                            
                        case 'attendance':
                            if (method === 'GET') {
                                responseData = await window.mockAPI.getAttendance(body.userId, body.filters);
                            } else if (method === 'POST') {
                                responseData = await window.mockAPI.recordAttendance(body);
                            }
                            break;
                            
                        case 'stats':
                            responseData = await window.mockAPI.getStats(body.userId);
                            break;
                            
                        case 'admin/users':
                            if (method === 'GET') {
                                responseData = await window.mockAPI.getAllUsers();
                            } else if (method === 'POST') {
                                responseData = await window.mockAPI.createUser(body);
                            }
                            break;
                            
                        case 'admin/attendance':
                            responseData = await window.mockAPI.getAllAttendance(body.filters);
                            break;
                            
                        default:
                            throw new Error('Endpoint not found');
                    }
                    
                    return new Response(JSON.stringify(responseData), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                } catch (error) {
                    return new Response(JSON.stringify({ 
                        error: error.message 
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
            
            // Pass through other requests
            return originalFetch.call(this, url, options);
        };
    }
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockAPI;
}
