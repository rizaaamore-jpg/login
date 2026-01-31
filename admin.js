// ============================================
// ADMIN PANEL - SMK JAKARTA TIMUR 1
// ============================================

class AdminPanel {
    constructor() {
        this.api = window.MockAPI;
        this.currentAdmin = null;
        this.init();
    }
    
    init() {
        console.log('🛠️ Initializing Admin Panel...');
        this.setupAdminListeners();
        this.loadAdminDashboard();
    }
    
    setupAdminListeners() {
        // User Management
        document.getElementById('refreshUsers')?.addEventListener('click', () => this.loadUsers());
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportUsers());
        
        // Mapel Management
        document.getElementById('refreshMapel')?.addEventListener('click', () => this.loadMapel());
        document.getElementById('exportMapel')?.addEventListener('click', () => this.exportMapel());
        
        // Add User Form
        document.getElementById('addUserForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewUser();
        });
        
        // Add Mapel Form
        document.getElementById('addMapelForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewMapel();
        });
        
        // Search functionality
        document.getElementById('searchUsers')?.addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });
        
        document.getElementById('searchMapel')?.addEventListener('input', (e) => {
            this.searchMapel(e.target.value);
        });
    }
    
    async loadAdminDashboard() {
        try {
            // Load users
            await this.loadUsers();
            
            // Load mapel
            await this.loadMapel();
            
            // Load stats
            await this.loadStats();
            
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
        }
    }
    
    async loadUsers() {
        try {
            const response = await this.api.getUsers();
            if (response.success) {
                this.renderUsersTable(response.data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.showAdminToast('Gagal memuat data user', 'error');
        }
    }
    
    renderUsersTable(users) {
        const tableBody = document.getElementById('adminUsersTable');
        if (!tableBody) return;
        
        if (users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>Tidak ada data user</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>
                        <div class="user-avatar-small">
                            <span>${user.avatar || '👤'}</span>
                        </div>
                        ${user.name}
                    </td>
                    <td>${user.username}</td>
                    <td>
                        <span class="role-badge ${user.role}">
                            ${user.role === 'siswa' ? 'Siswa' : 
                              user.role === 'guru' ? 'Guru' : 'Admin'}
                        </span>
                    </td>
                    <td>${user.kelas || '-'}</td>
                    <td>${user.nis || user.nip || '-'}</td>
                    <td class="actions">
                        <button class="btn-icon edit" onclick="adminPanel.editUser('${user.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="adminPanel.deleteUser('${user.id}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon reset" onclick="adminPanel.resetPassword('${user.id}')" title="Reset Password">
                            <i class="fas fa-key"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    async loadMapel() {
        try {
            const response = await this.api.getMapel();
            if (response.success) {
                this.renderMapelTable(response.data);
            }
        } catch (error) {
            console.error('Error loading mapel:', error);
            this.showAdminToast('Gagal memuat data mapel', 'error');
        }
    }
    
    renderMapelTable(mapelData) {
        const tableBody = document.getElementById('adminMapelTable');
        if (!tableBody) return;
        
        const mapels = Object.values(mapelData);
        
        if (mapels.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-book"></i>
                        <p>Tidak ada data mapel</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        mapels.forEach(mapel => {
            html += `
                <tr>
                    <td>
                        <div class="mapel-icon-small" style="background: ${mapel.color}20; color: ${mapel.color}">
                            <i class="${mapel.icon}"></i>
                        </div>
                        ${mapel.name}
                    </td>
                    <td>${mapel.fullName}</td>
                    <td>${mapel.teacher}</td>
                    <td>${mapel.schedule}</td>
                    <td>${mapel.room}</td>
                    <td>
                        <span class="status-badge ${mapel.active ? 'active' : 'inactive'}">
                            <i class="fas fa-circle"></i>
                            ${mapel.active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </td>
                    <td class="actions">
                        <button class="btn-icon edit" onclick="adminPanel.editMapel('${mapel.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="adminPanel.deleteMapel('${mapel.id}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon toggle" onclick="adminPanel.toggleMapel('${mapel.id}')" title="${mapel.active ? 'Nonaktifkan' : 'Aktifkan'}">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    async loadStats() {
        try {
            // Load user stats
            const usersResponse = await this.api.getUsers();
            if (usersResponse.success) {
                const users = usersResponse.data;
                const siswaCount = users.filter(u => u.role === 'siswa').length;
                const guruCount = users.filter(u => u.role === 'guru').length;
                const adminCount = users.filter(u => u.role === 'admin').length;
                
                document.getElementById('statTotalUsers').textContent = users.length;
                document.getElementById('statSiswa').textContent = siswaCount;
                document.getElementById('statGuru').textContent = guruCount;
                document.getElementById('statAdmin').textContent = adminCount;
            }
            
            // Load mapel stats
            const mapelResponse = await this.api.getMapel();
            if (mapelResponse.success) {
                const mapels = Object.values(mapelResponse.data);
                const activeMapel = mapels.filter(m => m.active).length;
                
                document.getElementById('statTotalMapel').textContent = mapels.length;
                document.getElementById('statActiveMapel').textContent = activeMapel;
            }
            
            // Load presensi stats
            const today = new Date().toISOString().split('T')[0];
            const presensiResponse = await this.api.getPresensi(null, today);
            if (presensiResponse.success) {
                document.getElementById('statTodayPresensi').textContent = presensiResponse.data.length;
            }
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    async addNewUser() {
        const form = document.getElementById('addUserForm');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            name: formData.get('name'),
            role: formData.get('role'),
            kelas: formData.get('kelas') || null,
            nis: formData.get('nis') || null,
            nip: formData.get('nip') || null,
            avatar: this.getAvatarForRole(formData.get('role'))
        };
        
        // Validate required fields
        if (!userData.username || !userData.password || !userData.name || !userData.role) {
            this.showAdminToast('Harap isi semua field yang wajib', 'warning');
            return;
        }
        
        try {
            const response = await this.api.addUser(userData);
            
            if (response.success) {
                this.showAdminToast('User berhasil ditambahkan', 'success');
                form.reset();
                await this.loadUsers();
                await this.loadStats();
                
                // If the main app exists, refresh its data
                if (window.app && window.app.loadData) {
                    window.app.loadData();
                }
            } else {
                this.showAdminToast('Gagal menambahkan user', 'error');
            }
        } catch (error) {
            this.showAdminToast('Error: ' + (error.message || 'Gagal menambahkan user'), 'error');
        }
    }
    
    async addNewMapel() {
        const form = document.getElementById('addMapelForm');
        const formData = new FormData(form);
        
        const mapelData = {
            name: formData.get('name'),
            fullName: formData.get('fullName'),
            teacher: formData.get('teacher'),
            schedule: formData.get('schedule'),
            room: formData.get('room'),
            color: formData.get('color') || '#3b82f6',
            icon: formData.get('icon') || 'fas fa-book',
            kelas: formData.get('kelas') ? formData.get('kelas').split(',').map(k => k.trim()) : [],
            active: true
        };
        
        // Validate required fields
        if (!mapelData.name || !mapelData.fullName || !mapelData.teacher || !mapelData.schedule) {
            this.showAdminToast('Harap isi semua field yang wajib', 'warning');
            return;
        }
        
        try {
            const response = await this.api.addMapel(mapelData);
            
            if (response.success) {
                this.showAdminToast('Mapel berhasil ditambahkan', 'success');
                form.reset();
                await this.loadMapel();
                await this.loadStats();
                
                // Refresh mapel in main app
                if (window.app) {
                    window.app.mapelData = await this.api.getMapel().then(r => r.success ? r.data : {});
                    window.app.renderMapelMenu();
                }
            } else {
                this.showAdminToast('Gagal menambahkan mapel', 'error');
            }
        } catch (error) {
            this.showAdminToast('Error: ' + (error.message || 'Gagal menambahkan mapel'), 'error');
        }
    }
    
    async editUser(userId) {
        try {
            const usersResponse = await this.api.getUsers();
            if (!usersResponse.success) return;
            
            const user = usersResponse.data.find(u => u.id === userId);
            if (!user) {
                this.showAdminToast('User tidak ditemukan', 'error');
                return;
            }
            
            // Populate edit form
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editName').value = user.name;
            document.getElementById('editRole').value = user.role;
            document.getElementById('editKelas').value = user.kelas || '';
            document.getElementById('editNis').value = user.nis || '';
            document.getElementById('editNip').value = user.nip || '';
            
            // Show edit modal
            this.showModal('editUserModal');
            
        } catch (error) {
            console.error('Error loading user for edit:', error);
            this.showAdminToast('Gagal memuat data user', 'error');
        }
    }
    
    async updateUser() {
        const form = document.getElementById('editUserForm');
        const formData = new FormData(form);
        const userId = formData.get('userId');
        
        const updateData = {
            name: formData.get('name'),
            role: formData.get('role'),
            kelas: formData.get('kelas') || null,
            nis: formData.get('nis') || null,
            nip: formData.get('nip') || null
        };
        
        // Validate
        if (!updateData.name || !updateData.role) {
            this.showAdminToast('Nama dan role wajib diisi', 'warning');
            return;
        }
        
        try {
            // Note: In real implementation, this would call an API
            // For now, we'll simulate with localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    ...updateData
                };
                localStorage.setItem('users', JSON.stringify(users));
                
                this.showAdminToast('User berhasil diupdate', 'success');
                this.closeModal('editUserModal');
                await this.loadUsers();
                await this.loadStats();
            } else {
                this.showAdminToast('User tidak ditemukan', 'error');
            }
        } catch (error) {
            this.showAdminToast('Gagal mengupdate user', 'error');
        }
    }
    
    async deleteUser(userId) {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
        
        try {
            // Note: In real implementation, this would call an API
            // For now, we'll simulate with localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const filteredUsers = users.filter(u => u.id !== userId);
            
            if (filteredUsers.length < users.length) {
                localStorage.setItem('users', JSON.stringify(filteredUsers));
                this.showAdminToast('User berhasil dihapus', 'success');
                await this.loadUsers();
                await this.loadStats();
            } else {
                this.showAdminToast('User tidak ditemukan', 'error');
            }
        } catch (error) {
            this.showAdminToast('Gagal menghapus user', 'error');
        }
    }
    
    async resetPassword(userId) {
        if (!confirm('Reset password user ini ke default?')) return;
        
        try {
            // Note: In real implementation, this would call an API
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                const defaultPassword = users[userIndex].role === 'siswa' ? 'siswa123' :
                                      users[userIndex].role === 'guru' ? 'guru123' : 'admin123';
                
                users[userIndex].password = defaultPassword;
                localStorage.setItem('users', JSON.stringify(users));
                
                this.showAdminToast(`Password direset ke: ${defaultPassword}`, 'success');
            }
        } catch (error) {
            this.showAdminToast('Gagal reset password', 'error');
        }
    }
    
    async editMapel(mapelId) {
        try {
            const response = await this.api.getMapel();
            if (!response.success) return;
            
            const mapel = response.data[mapelId];
            if (!mapel) {
                this.showAdminToast('Mapel tidak ditemukan', 'error');
                return;
            }
            
            // Populate edit form
            document.getElementById('editMapelId').value = mapel.id;
            document.getElementById('editMapelName').value = mapel.name;
            document.getElementById('editMapelFullName').value = mapel.fullName;
            document.getElementById('editMapelTeacher').value = mapel.teacher;
            document.getElementById('editMapelSchedule').value = mapel.schedule;
            document.getElementById('editMapelRoom').value = mapel.room;
            document.getElementById('editMapelColor').value = mapel.color || '#3b82f6';
            document.getElementById('editMapelIcon').value = mapel.icon || 'fas fa-book';
            document.getElementById('editMapelKelas').value = mapel.kelas?.join(', ') || '';
            document.getElementById('editMapelActive').checked = mapel.active !== false;
            
            // Show edit modal
            this.showModal('editMapelModal');
            
        } catch (error) {
            console.error('Error loading mapel for edit:', error);
            this.showAdminToast('Gagal memuat data mapel', 'error');
        }
    }
    
    async updateMapel() {
        const form = document.getElementById('editMapelForm');
        const formData = new FormData(form);
        const mapelId = formData.get('mapelId');
        
        const updateData = {
            name: formData.get('name'),
            fullName: formData.get('fullName'),
            teacher: formData.get('teacher'),
            schedule: formData.get('schedule'),
            room: formData.get('room'),
            color: formData.get('color'),
            icon: formData.get('icon'),
            kelas: formData.get('kelas') ? formData.get('kelas').split(',').map(k => k.trim()) : [],
            active: formData.get('active') === 'on'
        };
        
        // Validate
        if (!updateData.name || !updateData.fullName || !updateData.teacher || !updateData.schedule) {
            this.showAdminToast('Field wajib tidak boleh kosong', 'warning');
            return;
        }
        
        try {
            const response = await this.api.updateMapel(mapelId, updateData);
            
            if (response.success) {
                this.showAdminToast('Mapel berhasil diupdate', 'success');
                this.closeModal('editMapelModal');
                await this.loadMapel();
                await this.loadStats();
                
                // Refresh mapel in main app
                if (window.app) {
                    window.app.mapelData = await this.api.getMapel().then(r => r.success ? r.data : {});
                    window.app.renderMapelMenu();
                }
            } else {
                this.showAdminToast(response.message || 'Gagal mengupdate mapel', 'error');
            }
        } catch (error) {
            this.showAdminToast('Gagal mengupdate mapel', 'error');
        }
    }
    
    async deleteMapel(mapelId) {
        if (!confirm('Apakah Anda yakin ingin menghapus mapel ini?')) return;
        
        try {
            const response = await this.api.deleteMapel(mapelId);
            
            if (response.success) {
                this.showAdminToast('Mapel berhasil dihapus', 'success');
                await this.loadMapel();
                await this.loadStats();
                
                // Refresh mapel in main app
                if (window.app) {
                    window.app.mapelData = await this.api.getMapel().then(r => r.success ? r.data : {});
                    window.app.renderMapelMenu();
                }
            } else {
                this.showAdminToast(response.message || 'Gagal menghapus mapel', 'error');
            }
        } catch (error) {
            this.showAdminToast('Gagal menghapus mapel', 'error');
        }
    }
    
    async toggleMapel(mapelId) {
        try {
            const response = await this.api.getMapel();
            if (!response.success) return;
            
            const mapel = response.data[mapelId];
            if (!mapel) return;
            
            const updateData = { active: !mapel.active };
            const toggleResponse = await this.api.updateMapel(mapelId, updateData);
            
            if (toggleResponse.success) {
                this.showAdminToast(
                    `Mapel ${updateData.active ? 'diaktifkan' : 'dinonaktifkan'}`,
                    'success'
                );
                await this.loadMapel();
                
                // Refresh mapel in main app
                if (window.app) {
                    window.app.mapelData = await this.api.getMapel().then(r => r.success ? r.data : {});
                    window.app.renderMapelMenu();
                }
            }
        } catch (error) {
            this.showAdminToast('Gagal mengubah status mapel', 'error');
        }
    }
    
    async exportUsers() {
        try {
            const response = await this.api.getUsers();
            if (!response.success || response.data.length === 0) {
                this.showAdminToast('Tidak ada data user untuk diexport', 'warning');
                return;
            }
            
            const csv = this.convertToCSV(response.data, [
                'id', 'username', 'name', 'role', 'kelas', 'nis', 'nip', 'createdAt'
            ]);
            
            this.downloadCSV(csv, 'users_smk_jaktim1.csv');
            this.showAdminToast('Data user berhasil diexport', 'success');
            
        } catch (error) {
            this.showAdminToast('Gagal mengexport data user', 'error');
        }
    }
    
    async exportMapel() {
        try {
            const response = await this.api.getMapel();
            if (!response.success) {
                this.showAdminToast('Tidak ada data mapel untuk diexport', 'warning');
                return;
            }
            
            const mapels = Object.values(response.data);
            if (mapels.length === 0) {
                this.showAdminToast('Tidak ada data mapel untuk diexport', 'warning');
                return;
            }
            
            const csv = this.convertToCSV(mapels, [
                'id', 'name', 'fullName', 'teacher', 'schedule', 'room', 'color', 'icon', 'kelas', 'active'
            ]);
            
            this.downloadCSV(csv, 'mapel_smk_jaktim1.csv');
            this.showAdminToast('Data mapel berhasil diexport', 'success');
            
        } catch (error) {
            this.showAdminToast('Gagal mengexport data mapel', 'error');
        }
    }
    
    searchUsers(query) {
        const tableBody = document.getElementById('adminUsersTable');
        if (!tableBody) return;
        
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }
    
    searchMapel(query) {
        const tableBody = document.getElementById('adminMapelTable');
        if (!tableBody) return;
        
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            modal.classList.add('show');
            overlay.classList.add('show');
            
            // Close modal on overlay click
            overlay.onclick = () => this.closeModal(modalId);
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            modal.classList.remove('show');
            overlay.classList.remove('show');
            overlay.onclick = null;
        }
    }
    
    showAdminToast(message, type = 'info') {
        if (window.app && window.app.showToast) {
            window.app.showToast(message, type);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
    
    getAvatarForRole(role) {
        switch(role) {
            case 'siswa': return '👨‍🎓';
            case 'guru': return '👨‍🏫';
            case 'admin': return '👨‍💼';
            default: return '👤';
        }
    }
    
    convertToCSV(data, fields) {
        const headers = fields.join(',');
        const rows = data.map(item => 
            fields.map(field => {
                const value = item[field];
                if (Array.isArray(value)) {
                    return `"${value.join(',')}"`;
                }
                return value ? `"${value}"` : '""';
            }).join(',')
        );
        
        return [headers, ...rows].join('\n');
    }
    
    downloadCSV(csv, filename) {
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on admin page
    if (document.getElementById('adminUsersTable') || document.getElementById('adminMapelTable')) {
        adminPanel = new AdminPanel();
        window.adminPanel = adminPanel;
    }
});
