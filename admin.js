// ============================================
// ADMIN PANEL FUNCTIONS
// ============================================
class AdminPanel {
    constructor(api) {
        this.api = api;
        this.currentAdmin = null;
    }
    
    init() {
        this.loadAdminData();
        this.setupAdminListeners();
    }
    
    loadAdminData() {
        // Load users
        this.api.getUsers().then(response => {
            if (response.success) {
                this.renderUsersTable(response.data);
            }
        });
        
        // Load mapel
        this.api.getMapel().then(response => {
            if (response.success) {
                this.renderMapelTable(response.data);
            }
        });
        
        // Load statistics
        this.loadStatistics();
    }
    
    renderUsersTable(users) {
        const tableBody = document.getElementById('adminUsersTable');
        if (!tableBody) return;
        
        let html = '';
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td><span class="role-badge ${user.role}">${user.role}</span></td>
                    <td>${user.kelas || '-'}</td>
                    <td>${user.nis || user.nip || '-'}</td>
                    <td>
                        <button class="btn-small edit-user" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html || '<tr><td colspan="7">Tidak ada data user</td></tr>';
        
        // Add event listeners
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                this.editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                this.deleteUser(userId);
            });
        });
    }
    
    renderMapelTable(mapelData) {
        const tableBody = document.getElementById('adminMapelTable');
        if (!tableBody) return;
        
        let html = '';
        Object.values(mapelData).forEach(mapel => {
            html += `
                <tr>
                    <td>${mapel.name}</td>
                    <td>${mapel.fullName}</td>
                    <td>${mapel.teacher}</td>
                    <td>${mapel.schedule}</td>
                    <td>${mapel.room}</td>
                    <td>
                        <span class="status-badge ${mapel.active ? 'active' : 'inactive'}">
                            ${mapel.active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-small edit-mapel" data-id="${mapel.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small delete-mapel" data-id="${mapel.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html || '<tr><td colspan="7">Tidak ada data mapel</td></tr>';
        
        // Add event listeners
        document.querySelectorAll('.edit-mapel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapelId = e.target.closest('button').dataset.id;
                this.editMapel(mapelId);
            });
        });
        
        document.querySelectorAll('.delete-mapel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapelId = e.target.closest('button').dataset.id;
                this.deleteMapel(mapelId);
            });
        });
    }
    
    loadStatistics() {
        this.api.getDashboardStats('ADM001', 'admin').then(response => {
            if (response.success) {
                const stats = response.data;
                
                document.getElementById('adminStatSiswa').textContent = stats.totalSiswa || '0';
                document.getElementById('adminStatGuru').textContent = stats.totalGuru || '0';
                document.getElementById('adminStatMapel').textContent = stats.totalMapel || '0';
                document.getElementById('adminStatPresensi').textContent = stats.presensiHariIni || '0';
            }
        });
    }
    
    setupAdminListeners() {
        // Add User Form
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewUser();
            });
        }
        
        // Add Mapel Form
        const addMapelForm = document.getElementById('addMapelForm');
        if (addMapelForm) {
            addMapelForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewMapel();
            });
        }
        
        // Export buttons
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportToCSV('users'));
        document.getElementById('exportMapel')?.addEventListener('click', () => this.exportToCSV('mapel'));
        document.getElementById('exportPresensi')?.addEventListener('click', () => this.exportToCSV('presensi'));
        
        // Refresh buttons
        document.getElementById('refreshUsers')?.addEventListener('click', () => this.loadAdminData());
        document.getElementById('refreshMapel')?.addEventListener('click', () => this.loadAdminData());
    }
    
    addNewUser() {
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
            avatar: formData.get('role') === 'siswa' ? '👨‍🎓' : 
                    formData.get('role') === 'guru' ? '👨‍🏫' : '👨‍💼'
        };
        
        this.api.addUser(userData).then(response => {
            if (response.success) {
                alert('User berhasil ditambahkan!');
                form.reset();
                this.loadAdminData();
            } else {
                alert('Gagal menambahkan user');
            }
        });
    }
    
    addNewMapel() {
        const form = document.getElementById('addMapelForm');
        const formData = new FormData(form);
        
        const mapelData = {
            name: formData.get('name'),
            fullName: formData.get('fullName'),
            teacher: formData.get('teacher'),
            schedule: formData.get('schedule'),
            room: formData.get('room'),
            color: formData.get('color'),
            icon: formData.get('icon'),
            kelas: formData.get('kelas').split(','),
            active: true
        };
        
        this.api.addMapel(mapelData).then(response => {
            if (response.success) {
                alert('Mapel berhasil ditambahkan!');
                form.reset();
                this.loadAdminData();
                
                // Refresh mapel in main app
                if (window.AbsensiApp) {
                    window.AbsensiApp.loadMapelData();
                }
            } else {
                alert('Gagal menambahkan mapel');
            }
        });
    }
    
    editUser(userId) {
        alert(`Edit user ${userId} - Fitur edit akan datang!`);
    }
    
    deleteUser(userId) {
        if (confirm(`Hapus user ${userId}?`)) {
            // Simulate delete
            setTimeout(() => {
                alert('User berhasil dihapus (simulasi)');
                this.loadAdminData();
            }, 300);
        }
    }
    
    editMapel(mapelId) {
        // Open edit modal with current data
        const mapelData = this.api.mapelData[mapelId];
        if (!mapelData) return;
        
        // Populate form
        document.getElementById('editMapelName').value = mapelData.name;
        document.getElementById('editMapelFullName').value = mapelData.fullName;
        document.getElementById('editMapelTeacher').value = mapelData.teacher;
        document.getElementById('editMapelSchedule').value = mapelData.schedule;
        document.getElementById('editMapelRoom').value = mapelData.room;
        document.getElementById('editMapelColor').value = mapelData.color;
        document.getElementById('editMapelIcon').value = mapelData.icon;
        document.getElementById('editMapelKelas').value = mapelData.kelas?.join(',') || '';
        
        // Show modal
        document.getElementById('editMapelModal').classList.add('show');
    }
    
    deleteMapel(mapelId) {
        if (confirm(`Hapus mata pelajaran ini?`)) {
            this.api.deleteMapel(mapelId).then(response => {
                if (response.success) {
                    alert('Mapel berhasil dihapus!');
                    this.loadAdminData();
                    
                    // Refresh in main app
                    if (window.AbsensiApp) {
                        window.AbsensiApp.loadMapelData();
                    }
                } else {
                    alert('Gagal menghapus mapel');
                }
            });
        }
    }
    
    exportToCSV(type) {
        let data = [];
        let filename = '';
        
        switch(type) {
            case 'users':
                data = this.api.users.map(u => ({
                    ID: u.id,
                    Username: u.username,
                    Nama: u.name,
                    Role: u.role,
                    Kelas: u.kelas || '',
                    NIS_NIP: u.nis || u.nip || ''
                }));
                filename = 'users.csv';
                break;
                
            case 'mapel':
                data = Object.values(this.api.mapelData).map(m => ({
                    Nama: m.name,
                    Nama_Lengkap: m.fullName,
                    Pengajar: m.teacher,
                    Jadwal: m.schedule,
                    Ruangan: m.room,
                    Status: m.active ? 'Aktif' : 'Nonaktif'
                }));
                filename = 'mapel.csv';
                break;
                
            case 'presensi':
                data = this.api.presensiData.map(p => ({
                    ID: p.id,
                    Nama: p.userName,
                    Mapel: p.mapel,
                    Status: p.status,
                    Tanggal: p.date,
                    Waktu: p.time,
                    Catatan: p.catatan || ''
                }));
                filename = 'presensi.csv';
                break;
        }
        
        if (data.length === 0) {
            alert('Tidak ada data untuk diexport');
            return;
        }
        
        // Convert to CSV
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
        ].join('\n');
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(`Data berhasil diexport sebagai ${filename}`);
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.MockAPI && document.getElementById('adminUsersTable')) {
        window.AdminPanel = new AdminPanel(window.MockAPI);
        window.AdminPanel.init();
    }
});
