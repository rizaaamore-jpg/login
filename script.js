// ============================================
// SISTEM ABSENSI DIGITAL - SMK JAKARTA TIMUR 1
// JavaScript untuk index.html yang sudah dibuat
// ============================================

class AbsensiApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.isPresensiOpen = false;
        this.presensiTimer = null;
        this.activities = [];
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Absensi App...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check saved session
        this.checkSavedSession();
        
        // Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Initialize data
        this.initData();
        
        // Update initial UI
        this.updateNotificationCount();
        
        console.log('✅ App initialized successfully');
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Navigation menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                this.switchSection(target);
            });
        });
        
        // Login buttons
        document.querySelectorAll('.btn-login').forEach(button => {
            button.addEventListener('click', (e) => {
                const type = button.getAttribute('data-type');
                this.handleLogin(type);
            });
        });
        
        // Register button
        document.getElementById('registerBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Show login from register
        document.getElementById('showLoginFromReg')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchSection('login');
        });
        
        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
        
        // Admin controls
        document.getElementById('openPresensiSession')?.addEventListener('click', () => {
            this.openPresensiSession();
        });
        
        document.getElementById('closePresensiSession')?.addEventListener('click', () => {
            this.closePresensiSession();
        });
        
        // Schedule modal
        document.getElementById('openScheduleModal')?.addEventListener('click', () => {
            this.openScheduleModal();
        });
        
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            this.closeScheduleModal();
        });
        
        document.getElementById('saveSchedule')?.addEventListener('click', () => {
            this.saveSchedule();
        });
        
        // Clear notifications
        document.querySelector('.clear-btn')?.addEventListener('click', () => {
            this.clearNotifications();
        });
        
        // Demo credentials click
        document.querySelectorAll('.credential-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.fillDemoCredentials(item);
            });
        });
        
        // Modal overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeScheduleModal();
            }
        });
        
        // Escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeScheduleModal();
            }
        });
    }
    
    checkSavedSession() {
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');
        
        if (savedUser && savedRole) {
            this.currentUser = JSON.parse(savedUser);
            this.currentRole = savedRole;
            
            // Show admin section if admin
            if (this.currentRole === 'admin') {
                this.switchSection('admin');
                this.loadAdminData();
            }
            
            console.log(`👤 Session restored: ${this.currentUser.name} (${this.currentRole})`);
        }
    }
    
    switchSection(section) {
        console.log(`🔄 Switching to section: ${section}`);
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[data-target="${section}"]`)?.classList.add('active');
        
        // Show/hide sections
        const sections = ['login', 'register', 'admin'];
        sections.forEach(sec => {
            const element = document.getElementById(`${sec}Section`);
            if (element) {
                element.style.display = sec === section ? 'flex' : 'none';
            }
        });
        
        // Special handling for login section
        if (section === 'login') {
            document.getElementById('loginSection').style.display = 'flex';
        }
    }
    
    handleLogin(type) {
        let username, password;
        
        switch(type) {
            case 'student':
                username = document.getElementById('student-username').value;
                password = document.getElementById('student-password').value;
                break;
            case 'teacher':
                username = document.getElementById('teacher-username').value;
                password = document.getElementById('teacher-password').value;
                break;
            case 'admin':
                username = document.getElementById('admin-username').value;
                password = document.getElementById('admin-password').value;
                break;
            default:
                return;
        }
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        // Demo authentication
        const demoCredentials = {
            'student': { username: 'Arip', password: 'siswa123', name: 'Arip Siswa', role: 'student' },
            'teacher': { username: 'Guru', password: 'guru123', name: 'Budi Guru', role: 'teacher' },
            'admin': { username: 'admin', password: 'admin123', name: 'Admin Sistem', role: 'admin' }
        };
        
        const credential = demoCredentials[type];
        
        if (username === credential.username && password === credential.password) {
            this.currentUser = {
                id: Date.now(),
                username: credential.username,
                name: credential.name,
                role: credential.role
            };
            
            this.currentRole = credential.role;
            
            // Save session
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('currentRole', this.currentRole);
            
            this.showToast(`Login berhasil! Selamat datang ${credential.name}`, 'success');
            
            // Show admin section if admin
            if (this.currentRole === 'admin') {
                this.switchSection('admin');
                this.loadAdminData();
            } else {
                this.showToast('Fitur dashboard untuk siswa/guru dalam pengembangan', 'info');
            }
            
        } else {
            this.showToast('Username atau password salah', 'error');
        }
    }
    
    handleRegister() {
        const name = document.getElementById('regName').value;
        const nis = document.getElementById('regNis').value;
        const kelas = document.getElementById('regKelas').value;
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validation
        if (!name || !nis || !kelas || !username || !password) {
            this.showToast('Harap isi semua field yang wajib', 'warning');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Password tidak cocok', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password minimal 6 karakter', 'warning');
            return;
        }
        
        // Simulate registration
        setTimeout(() => {
            this.showToast('Registrasi berhasil! Silakan login dengan akun baru', 'success');
            
            // Auto-fill login form with new credentials
            document.getElementById('student-username').value = username;
            document.getElementById('student-password').value = password;
            
            // Switch to login section
            this.switchSection('login');
        }, 1000);
    }
    
    fillDemoCredentials(item) {
        const role = item.querySelector('.credential-role').textContent;
        const username = item.querySelectorAll('.credential-detail')[0].textContent.replace('Username: ', '');
        const password = item.querySelectorAll('.credential-detail')[1].textContent.replace('Password: ', '');
        
        let usernameField, passwordField;
        
        switch(role) {
            case 'Siswa':
                usernameField = document.getElementById('student-username');
                passwordField = document.getElementById('student-password');
                this.switchSection('login');
                break;
            case 'Guru':
                usernameField = document.getElementById('teacher-username');
                passwordField = document.getElementById('teacher-password');
                this.switchSection('login');
                break;
            case 'Admin':
                usernameField = document.getElementById('admin-username');
                passwordField = document.getElementById('admin-password');
                this.switchSection('login');
                break;
        }
        
        if (usernameField && passwordField) {
            usernameField.value = username;
            passwordField.value = password;
            
            // Highlight the filled form
            usernameField.parentElement.style.backgroundColor = 'rgba(30, 60, 114, 0.1)';
            passwordField.parentElement.style.backgroundColor = 'rgba(30, 60, 114, 0.1)';
            
            setTimeout(() => {
                usernameField.parentElement.style.backgroundColor = '';
                passwordField.parentElement.style.backgroundColor = '';
            }, 1500);
        }
    }
    
    openPresensiSession() {
        const duration = parseInt(document.getElementById('presensiDuration').value) || 30;
        
        if (duration < 5 || duration > 120) {
            this.showToast('Durasi harus antara 5-120 menit', 'warning');
            return;
        }
        
        this.isPresensiOpen = true;
        
        // Update UI
        document.getElementById('presensiStatusBadge').innerHTML = '<i class="fas fa-unlock"></i> Presensi Terbuka';
        document.getElementById('presensiStatusBadge').style.background = 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)';
        
        document.getElementById('openPresensiSession').disabled = true;
        document.getElementById('closePresensiSession').disabled = false;
        
        // Set timer
        if (this.presensiTimer) {
            clearTimeout(this.presensiTimer);
        }
        
        this.presensiTimer = setTimeout(() => {
            this.closePresensiSession();
            this.showToast('Sesi presensi telah berakhir secara otomatis', 'info');
        }, duration * 60 * 1000);
        
        // Add activity
        this.addActivity('Sesi presensi dibuka', `${duration} menit`);
        
        this.showToast(`Sesi presensi dibuka untuk ${duration} menit`, 'success');
    }
    
    closePresensiSession() {
        this.isPresensiOpen = false;
        
        // Update UI
        document.getElementById('presensiStatusBadge').innerHTML = '<i class="fas fa-lock"></i> Presensi Tertutup';
        document.getElementById('presensiStatusBadge').style.background = 'linear-gradient(to right, #ff6b6b 0%, #ff8e53 100%)';
        
        document.getElementById('openPresensiSession').disabled = false;
        document.getElementById('closePresensiSession').disabled = true;
        
        // Clear timer
        if (this.presensiTimer) {
            clearTimeout(this.presensiTimer);
            this.presensiTimer = null;
        }
        
        // Add activity
        this.addActivity('Sesi presensi ditutup');
        
        this.showToast('Sesi presensi ditutup', 'warning');
    }
    
    openScheduleModal() {
        document.getElementById('scheduleModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        document.getElementById('scheduleForm').reset();
    }
    
    closeScheduleModal() {
        document.getElementById('scheduleModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    saveSchedule() {
        const mapel = document.getElementById('scheduleMapel').value;
        const day = document.getElementById('scheduleDay').value;
        const time = document.getElementById('scheduleTime').value;
        const teacher = document.getElementById('scheduleTeacher').value;
        const room = document.getElementById('scheduleRoom').value;
        
        if (!mapel || !day || !time || !teacher || !room) {
            this.showToast('Harap isi semua field', 'warning');
            return;
        }
        
        // Add to schedule table
        this.addScheduleToTable({
            id: Date.now(),
            mapel,
            day,
            time,
            teacher,
            room
        });
        
        // Close modal
        this.closeScheduleModal();
        
        // Add activity
        this.addActivity('Jadwal ditambahkan', `${mapel} - ${day}`);
        
        this.showToast('Jadwal berhasil disimpan', 'success');
    }
    
    addScheduleToTable(schedule) {
        const scheduleTable = document.getElementById('scheduleTable');
        
        // Remove empty state if exists
        const emptyState = scheduleTable.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Create schedule item
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div class="schedule-header">
                <span class="schedule-mapel">${schedule.mapel}</span>
                <span class="schedule-day">${schedule.day}</span>
            </div>
            <div class="schedule-details">
                <div class="schedule-time"><i class="far fa-clock"></i> ${schedule.time}</div>
                <div class="schedule-teacher"><i class="fas fa-chalkboard-teacher"></i> ${schedule.teacher}</div>
                <div class="schedule-room"><i class="fas fa-door-open"></i> ${schedule.room}</div>
            </div>
            <div class="schedule-actions">
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners for actions
        scheduleItem.querySelector('.btn-edit').addEventListener('click', () => {
            this.editSchedule(schedule.id);
        });
        
        scheduleItem.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('Hapus jadwal ini?')) {
                scheduleItem.remove();
                
                // Show empty state if no schedules
                if (!scheduleTable.querySelector('.schedule-item')) {
                    scheduleTable.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-calendar-plus"></i>
                            <p>Belum ada jadwal. Tambah jadwal baru!</p>
                        </div>
                    `;
                }
                
                this.addActivity('Jadwal dihapus', schedule.mapel);
                this.showToast('Jadwal dihapus', 'info');
            }
        });
        
        scheduleTable.appendChild(scheduleItem);
    }
    
    editSchedule(scheduleId) {
        // Implementation for editing schedule
        this.showToast('Fitur edit jadwal dalam pengembangan', 'info');
    }
    
    addActivity(title, description = '') {
        const activity = {
            id: Date.now(),
            title,
            description,
            time: new Date().toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            timestamp: new Date().toISOString()
        };
        
        this.activities.unshift(activity);
        
        // Update activities list
        this.updateActivitiesList();
        
        // Keep only last 10 activities
        if (this.activities.length > 10) {
            this.activities.pop();
        }
    }
    
    updateActivitiesList() {
        const activitiesList = document.getElementById('adminActivities');
        
        activitiesList.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-desc">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
        
        // Add default if empty
        if (this.activities.length === 0) {
            activitiesList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Sistem siap</div>
                        <div class="activity-time">Baru saja</div>
                    </div>
                </div>
            `;
        }
    }
    
    clearNotifications() {
        const notificationList = document.querySelector('.notification-list');
        notificationList.innerHTML = '<li class="notification-item"><i class="fas fa-check-circle notification-icon"></i> Tidak ada notifikasi</li>';
        
        const clearBtn = document.querySelector('.clear-btn');
        clearBtn.disabled = true;
        clearBtn.innerHTML = 'Dibersihkan';
        
        // Re-enable button after 3 seconds
        setTimeout(() => {
            clearBtn.disabled = false;
            clearBtn.innerHTML = 'Bersihkan';
        }, 3000);
        
        this.showToast('Notifikasi dibersihkan', 'info');
    }
    
    updateNotificationCount() {
        const notifications = document.querySelectorAll('.notification-item').length;
        const navItem = document.querySelector('.nav-item[data-target="admin"]');
        
        if (navItem && notifications > 0) {
            // Remove existing badge
            const existingBadge = navItem.querySelector('.notification-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge
            const badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.textContent = notifications;
            navItem.appendChild(badge);
        }
    }
    
    updateClock() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const dateStr = now.toLocaleDateString('id-ID', options);
        
        // Find and update clock element
        let clockElement = document.getElementById('currentDateTime');
        if (!clockElement) {
            // Create clock element if it doesn't exist
            clockElement = document.createElement('div');
            clockElement.id = 'currentDateTime';
            clockElement.className = 'clock-display';
            document.querySelector('.header').appendChild(clockElement);
        }
        
        clockElement.textContent = dateStr;
    }
    
    initData() {
        // Initialize sample activities
        this.activities = [
            {
                id: 1,
                title: 'Sistem dimulai',
                description: 'Aplikasi berjalan normal',
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString()
            }
        ];
        
        // Update activities list
        this.updateActivitiesList();
    }
    
    loadAdminData() {
        // Load initial data for admin
        console.log('📊 Loading admin data...');
        
        // Sample schedule data
        const sampleSchedules = [
            {
                id: 1,
                mapel: 'Pemrograman Web',
                day: 'Senin',
                time: '07:30 - 09:00',
                teacher: 'Bu Rina',
                room: 'Lab. Komputer 1'
            },
            {
                id: 2,
                mapel: 'Basis Data',
                day: 'Selasa',
                time: '09:30 - 11:00',
                teacher: 'Pak Andi',
                room: 'Lab. Komputer 2'
            }
        ];
        
        // Add sample schedules
        sampleSchedules.forEach(schedule => {
            this.addScheduleToTable(schedule);
        });
        
        // Add sample activities
        this.addActivity('Admin login', 'Admin masuk ke sistem');
        this.addActivity('Data dimuat', 'Data awal berhasil dimuat');
    }
    
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
    getToastIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': default: return 'fa-info-circle';
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AbsensiApp();
    window.app = app;
    
    // Add CSS for toast notifications
    const toastStyles = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 15px 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 10000;
            border-left: 4px solid #2a5298;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            border-left-color: #43e97b;
        }
        
        .toast-error {
            border-left-color: #ff6b6b;
        }
        
        .toast-warning {
            border-left-color: #f59e0b;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        
        .toast-content i {
            font-size: 1.2rem;
        }
        
        .toast-success .toast-content i {
            color: #43e97b;
        }
        
        .toast-error .toast-content i {
            color: #ff6b6b;
        }
        
        .toast-warning .toast-content i {
            color: #f59e0b;
        }
        
        .toast-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-badge {
            background: #ff6b6b;
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 8px;
        }
        
        .clock-display {
            margin-top: 10px;
            font-size: 0.9rem;
            opacity: 0.9;
            background: rgba(255, 255, 255, 0.1);
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
        }
        
        .schedule-item {
            background: #f8fafc;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }
        
        .schedule-item:hover {
            background: #f0f9ff;
            border-color: #2a5298;
        }
        
        .schedule-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .schedule-mapel {
            font-weight: 600;
            color: #2a5298;
        }
        
        .schedule-day {
            background: #2a5298;
            color: white;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
        }
        
        .schedule-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .schedule-details > div {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
        }
        
        .schedule-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .btn-edit, .btn-delete {
            background: none;
            border: 1px solid #ddd;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            color: #666;
            transition: all 0.3s ease;
        }
        
        .btn-edit:hover {
            background: #2a5298;
            color: white;
            border-color: #2a5298;
        }
        
        .btn-delete:hover {
            background: #ff6b6b;
            color: white;
            border-color: #ff6b6b;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = toastStyles;
    document.head.appendChild(styleSheet);
});

// Helper function to format time
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

// Export app for global access
window.AbsensiApp = AbsensiApp;
