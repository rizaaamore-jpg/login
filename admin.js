// Admin Panel Logic
document.addEventListener('DOMContentLoaded', function() {
    if (!window.currentUser || window.currentUser.role !== 'admin') {
        return;
    }

    const adminDashboard = document.getElementById('adminDashboard');
    if (!adminDashboard) return;

    // Initialize admin features
    initAdminPanel();
});

function initAdminPanel() {
    console.log('Admin panel initialized');
    
    // Create modals for admin features
    createAdminModals();
    
    // Load admin data
    loadAdminDashboard();
}

function createAdminModals() {
    // Create Manage Users Modal
    const manageUsersModal = document.createElement('div');
    manageUsersModal.id = 'manageUsersModal';
    manageUsersModal.className = 'modal';
    manageUsersModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('manageUsersModal')">&times;</span>
            <h3>Kelola Pengguna</h3>
            <div class="admin-tabs">
                <button class="tab-btn active" onclick="switchTab('users', 'siswa')">Siswa</button>
                <button class="tab-btn" onclick="switchTab('users', 'guru')">Guru</button>
                <button class="tab-btn" onclick="switchTab('users', 'admin')">Admin</button>
            </div>
            <div id="usersTabContent" class="tab-content">
                <div class="admin-controls">
                    <button onclick="addUser()" class="btn-primary">
                        <i class="fas fa-plus"></i> Tambah Pengguna
                    </button>
                    <button onclick="exportUsers()" class="btn-secondary">
                        <i class="fas fa-file-export"></i> Export Data
                    </button>
                </div>
                <div id="usersTableContainer" class="table-container">
                    <!-- Users table will be loaded here -->
                </div>
            </div>
        </div>
    `;

    // Create Reports Modal
    const reportsModal = document.createElement('div');
    reportsModal.id = 'reportsModal';
    reportsModal.className = 'modal';
    reportsModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('reportsModal')">&times;</span>
            <h3>Generate Laporan</h3>
            <form id="reportForm">
                <div class="form-group">
                    <label>Jenis Laporan</label>
                    <select id="reportType">
                        <option value="daily">Laporan Harian</option>
                        <option value="weekly">Laporan Mingguan</option>
                        <option value="monthly">Laporan Bulanan</option>
                        <option value="semester">Laporan Semester</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tanggal Mulai</label>
                    <input type="date" id="reportStartDate" required>
                </div>
                <div class="form-group">
                    <label>Tanggal Akhir</label>
                    <input type="date" id="reportEndDate" required>
                </div>
                <div class="form-group">
                    <label>Format Export</label>
                    <select id="exportFormat">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Filter Kelas</label>
                    <select id="reportClass" multiple>
                        <option value="all">Semua Kelas</option>
                        <option value="X TKJ 1">X TKJ 1</option>
                        <option value="X TKJ 2">X TKJ 2</option>
                        <option value="XI TKJ 1">XI TKJ 1</option>
                        <option value="XII TKJ 1">XII TKJ 1</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-file-export"></i> Generate Laporan
                </button>
            </form>
        </div>
    `;

    // Create Settings Modal
    const settingsModal = document.createElement('div');
    settingsModal.id = 'settingsModal';
    settingsModal.className = 'modal';
    settingsModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('settingsModal')">&times;</span>
            <h3>Pengaturan Sistem</h3>
            <div class="settings-tabs">
                <button class="tab-btn active" onclick="switchTab('settings', 'general')">Umum</button>
                <button class="tab-btn" onclick="switchTab('settings', 'attendance')">Absensi</button>
                <button class="tab-btn" onclick="switchTab('settings', 'notifications')">Notifikasi</button>
            </div>
            <div id="settingsTabContent" class="tab-content">
                <!-- Settings content will be loaded here -->
            </div>
        </div>
    `;

    // Append modals to body
    document.body.appendChild(manageUsersModal);
    document.body.appendChild(reportsModal);
    document.body.appendChild(settingsModal);

    // Setup event listeners for admin modals
    setupAdminEventListeners();
}

function setupAdminEventListeners() {
    // Report form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateReport();
        });
    }

    // Set default dates for reports
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const reportStartDate = document.getElementById('reportStartDate');
    const reportEndDate = document.getElementById('reportEndDate');
    
    if (reportStartDate && reportEndDate) {
        reportStartDate.valueAsDate = firstDay;
        reportEndDate.valueAsDate = today;
    }
}

function loadAdminDashboard() {
    // Load statistics
    loadAdminStats();
    
    // Load recent activities
    loadRecentActivities();
}

function loadAdminStats() {
    // Mock admin statistics
    const stats = {
        totalStudents: 450,
        totalTeachers: 35,
        todayAttendance: 87,
        averageAttendance: 92.5
    };

    // Update stats display (you can create elements for this)
    console.log('Admin stats loaded:', stats);
}

function loadRecentActivities() {
    // Mock recent activities
    const activities = [
        { user: 'Siswa 001', action: 'Check in', time: '07:30', date: '2024-01-15' },
        { user: 'Guru 101', action: 'Check out', time: '15:45', date: '2024-01-15' },
        { user: 'Admin', action: 'Export report', time: '10:20', date: '2024-01-15' }
    ];

    // Display activities
    console.log('Recent activities:', activities);
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const format = document.getElementById('exportFormat').value;
    const selectedClass = document.getElementById('reportClass').value;

    // Show loading
    showNotification('Membuat laporan...', 'info');

    // Simulate report generation
    setTimeout(() => {
        const reportData = {
            type: reportType,
            period: `${startDate} - ${endDate}`,
            format: format,
            fileSize: '2.4 MB',
            downloadLink: '#'
        };

        showNotification(`Laporan berhasil dibuat (${reportData.fileSize})`, 'success');
        
        // In real app, trigger download
        console.log('Generated report:', reportData);
        
        // Close modal
        closeModal('reportsModal');
    }, 2000);
}

function addUser() {
    // Show add user form
    const formHTML = `
        <h4>Tambah Pengguna Baru</h4>
        <form id="addUserForm">
            <div class="form-group">
                <label>Tipe Pengguna</label>
                <select id="newUserType" required>
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" id="newUserName" required>
            </div>
            <div class="form-group">
                <label>NISN/NIP</label>
                <input type="text" id="newUserID" required>
            </div>
            <div class="form-group" id="newUserClassGroup">
                <label>Kelas</label>
                <select id="newUserClass">
                    <option value="X TKJ 1">X TKJ 1</option>
                    <option value="X TKJ 2">X TKJ 2</option>
                    <option value="XI TKJ 1">XI TKJ 1</option>
                    <option value="XII TKJ 1">XII TKJ 1</option>
                </select>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="newUserPassword" required>
            </div>
            <button type="submit" class="btn-primary">Simpan</button>
        </form>
    `;

    // Create or update modal with this form
    showCustomModal('Tambah Pengguna', formHTML);
    
    // Setup form submission
    setTimeout(() => {
        const form = document.getElementById('addUserForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveNewUser();
            });
        }
    }, 100);
}

function saveNewUser() {
    // Get form data
    const userData = {
        type: document.getElementById('newUserType').value,
        name: document.getElementById('newUserName').value,
        id: document.getElementById('newUserID').value,
        password: document.getElementById('newUserPassword').value,
        class: document.getElementById('newUserClass')?.value || null
    };

    // Save user (in real app, send to API)
    console.log('Saving new user:', userData);
    showNotification('Pengguna berhasil ditambahkan', 'success');
    
    // Close modal and refresh users list
    closeCustomModal();
    loadUsersTable();
}

function loadUsersTable() {
    // Mock users data
    const users = [
        { id: '001', name: 'Ahmad Budi', type: 'siswa', class: 'X TKJ 1', status: 'active' },
        { id: '002', name: 'Siti Aminah', type: 'siswa', class: 'X TKJ 2', status: 'active' },
        { id: '101', name: 'Dr. Wahyu', type: 'guru', class: null, status: 'active' }
    ];

    const tableHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Tipe</th>
                    <th>Kelas</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td><span class="badge badge-${user.type}">${user.type}</span></td>
                        <td>${user.class || '-'}</td>
                        <td><span class="badge badge-${user.status}">${user.status}</span></td>
                        <td>
                            <button onclick="editUser('${user.id}')" class="btn-icon-sm">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteUser('${user.id}')" class="btn-icon-sm btn-danger">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const container = document.getElementById('usersTableContainer');
    if (container) {
        container.innerHTML = tableHTML;
    }
}

function exportUsers() {
    // Export users data
    showNotification('Mengekspor data pengguna...', 'info');
    
    setTimeout(() => {
        showNotification('Data berhasil diekspor', 'success');
    }, 1500);
}

function editUser(userId) {
    console.log('Edit user:', userId);
    showNotification(`Mengedit pengguna ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${userId}?`)) {
        showNotification(`Menghapus pengguna ${userId}...`, 'info');
        
        setTimeout(() => {
            showNotification('Pengguna berhasil dihapus', 'success');
            loadUsersTable();
        }, 1000);
    }
}

function switchTab(section, tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll(`#${section}TabContent + .admin-tabs .tab-btn, 
                                                  #${section}TabContent + .settings-tabs .tab-btn`);
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Load tab content
    if (section === 'users') {
        loadUsersTab(tabName);
    } else if (section === 'settings') {
        loadSettingsTab(tabName);
    }
}

function loadUsersTab(tabName) {
    console.log('Loading users tab:', tabName);
    // Load different user types based on tab
}

function loadSettingsTab(tabName) {
    let content = '';
    
    switch(tabName) {
        case 'general':
            content = `
                <form id="generalSettings">
                    <div class="form-group">
                        <label>Nama Sekolah</label>
                        <input type="text" value="SMK Jakarta Timur 1">
                    </div>
                    <div class="form-group">
                        <label>Jam Masuk</label>
                        <input type="time" value="07:30">
                    </div>
                    <div class="form-group">
                        <label>Jam Pulang</label>
                        <input type="time" value="15:30">
                    </div>
                    <button type="submit" class="btn-primary">Simpan Pengaturan</button>
                </form>
            `;
            break;
            
        case 'attendance':
            content = `
                <form id="attendanceSettings">
                    <div class="form-group">
                        <label>Toleransi Keterlambatan (menit)</label>
                        <input type="number" value="15" min="0" max="60">
                    </div>
                    <div class="form-group">
                        <label>QR Code Expiry (menit)</label>
                        <input type="number" value="5" min="1" max="60">
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="enableGPS" checked>
                        <label for="enableGPS">Aktifkan verifikasi GPS</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="enableNotifications" checked>
                        <label for="enableNotifications">Aktifkan notifikasi</label>
                    </div>
                    <button type="submit" class="btn-primary">Simpan Pengaturan</button>
                </form>
            `;
            break;
            
        case 'notifications':
            content = `
                <form id="notificationSettings">
                    <div class="form-group">
                        <label>Notifikasi Email</label>
                        <select>
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                        </select>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="parentNotifications" checked>
                        <label for="parentNotifications">Kirim notifikasi ke orang tua</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="teacherNotifications" checked>
                        <label for="teacherNotifications">Notifikasi untuk guru</label>
                    </div>
                    <button type="submit" class="btn-primary">Simpan Pengaturan</button>
                </form>
            `;
            break;
    }
    
    const container = document.getElementById('settingsTabContent');
    if (container) {
        container.innerHTML = content;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showCustomModal(title, content) {
    // Remove existing custom modal
    const existingModal = document.getElementById('customModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create new modal
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeCustomModal()">&times;</span>
            <h3>${title}</h3>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.remove();
    }
}

// Make functions available globally
window.switchTab = switchTab;
window.closeModal = closeModal;
window.addUser = addUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.exportUsers = exportUsers;
window.closeCustomModal = closeCustomModal;
