// ============================================
// ENHANCED ADMIN PANEL WITH SCHEDULE CONTROL
// ============================================

class AdminPanel {
    constructor(app) {
        this.app = app;
        this.schedules = [];
        this.activeSessions = [];
        this.adminActivities = [];
        this.currentModal = null;
        this.selectedScheduleId = null;
        
        this.init();
    }
    
    init() {
        console.log('👨‍💼 Initializing Admin Panel...');
        
        this.setupAdminListeners();
        this.loadInitialData();
        this.initRealtimeUpdates();
        
        // Start auto-refresh for admin data
        this.startAutoRefresh();
        
        console.log('✅ Admin Panel initialized');
    }
    
    setupAdminListeners() {
        console.log('🔗 Setting up admin listeners...');
        
        // Presensi session controls
        document.getElementById('openPresensiSession')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openPresensiSession();
        });
        
        document.getElementById('closePresensiSession')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.closePresensiSession();
        });
        
        // Schedule modal
        document.getElementById('openScheduleModal')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openScheduleModal();
        });
        
        document.querySelector('.modal-close')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeCurrentModal();
        });
        
        document.getElementById('saveSchedule')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveSchedule();
        });
        
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeCurrentModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCurrentModal();
            }
        });
        
        // Schedule duration input validation
        document.getElementById('presensiDuration')?.addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (value < 5) e.target.value = 5;
            if (value > 120) e.target.value = 120;
        });
        
        // Real-time status indicator
        this.updatePresensiStatus();
        
        // Log admin login
        this.logAdminActivity('Admin login ke sistem', {
            user: this.app.currentUser?.name,
            role: this.app.currentRole
        });
    }
    
    loadInitialData() {
        // Load schedules from localStorage or use defaults
        this.schedules = JSON.parse(localStorage.getItem('adminSchedules')) || [
            {
                id: 1,
                mapel: 'Pemrograman Web',
                day: 'Senin',
                time: '07:30 - 09:00',
                teacher: 'Bu Rina, S.Kom',
                room: 'Lab. Komputer 1',
                kelas: 'XII TKJ 1, XII TKJ 2',
                status: 'active'
            },
            {
                id: 2,
                mapel: 'Basis Data',
                day: 'Selasa',
                time: '09:30 - 11:00',
                teacher: 'Pak Andi, M.Kom',
                room: 'Lab. Komputer 2',
                kelas: 'XI RPL 1, XI RPL 2',
                status: 'active'
            },
            {
                id: 3,
                mapel: 'Jaringan Komputer',
                day: 'Rabu',
                time: '08:00 - 10:00',
                teacher: 'Pak Budi, S.T',
                room: 'Lab. Jaringan',
                kelas: 'X TKJ 1, X TKJ 2',
                status: 'active'
            }
        ];
        
        // Load admin activities
        this.adminActivities = JSON.parse(localStorage.getItem('adminActivities')) || [
            {
                id: 1,
                action: 'Sistem admin diinisialisasi',
                details: 'Panel admin dimuat',
                timestamp: new Date().toISOString(),
                icon: 'fa-cog'
            }
        ];
        
        // Update UI
        this.renderScheduleTable();
        this.renderAdminActivities();
        
        // Update presensi status
        this.updatePresensiStatus();
    }
    
    openPresensiSession() {
        const duration = parseInt(document.getElementById('presensiDuration').value) || 30;
        
        if (duration < 5 || duration > 120) {
            this.app.showToast('Durasi harus antara 5-120 menit', 'warning');
            return;
        }
        
        // Create new session
        const session = {
            id: Date.now(),
            startTime: new Date().toISOString(),
            duration: duration, // in minutes
            status: 'open',
            participants: 0
        };
        
        this.activeSessions.push(session);
        
        // Update UI
        this.updatePresensiStatus();
        
        // Update button states
        document.getElementById('openPresensiSession').disabled = true;
        document.getElementById('closePresensiSession').disabled = false;
        
        // Start auto-close timer
        session.timer = setTimeout(() => {
            this.closePresensiSession(session.id);
        }, duration * 60 * 1000);
        
        // Log activity
        this.logAdminActivity('Membuka sesi presensi', {
            duration: `${duration} menit`,
            sessionId: session.id
        });
        
        // Show success message
        this.app.showToast(`Sesi presensi dibuka untuk ${duration} menit`, 'success');
        
        // Update real-time badge
        const badge = document.getElementById('presensiStatusBadge');
        badge.innerHTML = `<i class="fas fa-unlock"></i> Presensi Terbuka (${duration}m)`;
        badge.style.background = 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)';
        
        // Add activity
        this.addAdminActivity(`Sesi presensi dibuka untuk ${duration} menit`);
    }
    
    closePresensiSession(sessionId = null) {
        let session;
        
        if (sessionId) {
            session = this.activeSessions.find(s => s.id === sessionId);
        } else {
            session = this.activeSessions[this.activeSessions.length - 1];
        }
        
        if (session) {
            // Clear timer
            if (session.timer) {
                clearTimeout(session.timer);
            }
            
            // Update session status
            session.status = 'closed';
            session.endTime = new Date().toISOString();
            
            // Update UI
            this.updatePresensiStatus();
            
            // Update button states
            document.getElementById('openPresensiSession').disabled = false;
            document.getElementById('closePresensiSession').disabled = true;
            
            // Log activity
            this.logAdminActivity('Menutup sesi presensi', {
                sessionId: session.id,
                duration: this.calculateSessionDuration(session),
                participants: session.participants || 0
            });
            
            // Show message
            this.app.showToast('Sesi presensi ditutup', 'warning');
            
            // Update real-time badge
            const badge = document.getElementById('presensiStatusBadge');
            badge.innerHTML = '<i class="fas fa-lock"></i> Presensi Tertutup';
            badge.style.background = 'linear-gradient(to right, #ff6b6b 0%, #ff8e53 100%)';
            
            // Add activity
            this.addAdminActivity('Sesi presensi ditutup');
        }
    }
    
    calculateSessionDuration(session) {
        if (!session.endTime) return 'Masih berjalan';
        
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        const diffMs = end - start;
        const diffMins = Math.floor(diffMs / 60000);
        
        return `${diffMins} menit`;
    }
    
    updatePresensiStatus() {
        const isOpen = this.activeSessions.some(session => session.status === 'open');
        const badge = document.getElementById('presensiStatusBadge');
        
        if (!badge) return;
        
        if (isOpen) {
            badge.innerHTML = '<i class="fas fa-unlock"></i> Presensi Terbuka';
            badge.style.background = 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)';
            document.getElementById('openPresensiSession').disabled = true;
            document.getElementById('closePresensiSession').disabled = false;
        } else {
            badge.innerHTML = '<i class="fas fa-lock"></i> Presensi Tertutup';
            badge.style.background = 'linear-gradient(to right, #ff6b6b 0%, #ff8e53 100%)';
            document.getElementById('openPresensiSession').disabled = false;
            document.getElementById('closePresensiSession').disabled = true;
        }
    }
    
    openScheduleModal(scheduleId = null) {
        this.selectedScheduleId = scheduleId;
        
        // Reset form
        document.getElementById('scheduleForm').reset();
        
        // If editing existing schedule
        if (scheduleId) {
            const schedule = this.schedules.find(s => s.id === scheduleId);
            if (schedule) {
                document.getElementById('scheduleMapel').value = schedule.mapel;
                document.getElementById('scheduleDay').value = schedule.day;
                document.getElementById('scheduleTime').value = schedule.time;
                document.getElementById('scheduleTeacher').value = schedule.teacher;
                document.getElementById('scheduleRoom').value = schedule.room;
            }
        }
        
        // Show modal
        document.getElementById('scheduleModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.currentModal = 'scheduleModal';
    }
    
    closeCurrentModal() {
        if (this.currentModal) {
            document.getElementById(this.currentModal).style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentModal = null;
            this.selectedScheduleId = null;
        }
    }
    
    saveSchedule() {
        const mapel = document.getElementById('scheduleMapel').value;
        const day = document.getElementById('scheduleDay').value;
        const time = document.getElementById('scheduleTime').value;
        const teacher = document.getElementById('scheduleTeacher').value;
        const room = document.getElementById('scheduleRoom').value;
        
        if (!mapel || !day || !time || !teacher || !room) {
            this.app.showToast('Harap isi semua field', 'warning');
            return;
        }
        
        // Validate time format (simple validation)
        if (!time.match(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/)) {
            this.app.showToast('Format waktu: HH:MM - HH:MM', 'warning');
            return;
        }
        
        if (this.selectedScheduleId) {
            // Update existing schedule
            const index = this.schedules.findIndex(s => s.id === this.selectedScheduleId);
            if (index !== -1) {
                this.schedules[index] = {
                    ...this.schedules[index],
                    mapel,
                    day,
                    time,
                    teacher,
                    room,
                    updatedAt: new Date().toISOString()
                };
                
                // Log activity
                this.logAdminActivity('Mengupdate jadwal pelajaran', {
                    scheduleId: this.selectedScheduleId,
                    mapel,
                    day,
                    time
                });
                
                this.app.showToast('Jadwal berhasil diupdate', 'success');
            }
        } else {
            // Add new schedule
            const newSchedule = {
                id: Date.now(),
                mapel,
                day,
                time,
                teacher,
                room,
                kelas: 'TBD',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.schedules.push(newSchedule);
            
            // Log activity
            this.logAdminActivity('Menambahkan jadwal baru', {
                scheduleId: newSchedule.id,
                mapel,
                day,
                time
            });
            
            this.app.showToast('Jadwal berhasil ditambahkan', 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('adminSchedules', JSON.stringify(this.schedules));
        
        // Update UI
        this.renderScheduleTable();
        
        // Close modal
        this.closeCurrentModal();
    }
    
    deleteSchedule(scheduleId) {
        if (!confirm('Hapus jadwal ini?')) return;
        
        const schedule = this.schedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        
        // Remove schedule
        this.schedules = this.schedules.filter(s => s.id !== scheduleId);
        
        // Save to localStorage
        localStorage.setItem('adminSchedules', JSON.stringify(this.schedules));
        
        // Log activity
        this.logAdminActivity('Menghapus jadwal', {
            scheduleId,
            mapel: schedule.mapel,
            day: schedule.day
        });
        
        // Update UI
        this.renderScheduleTable();
        
        // Show message
        this.app.showToast('Jadwal dihapus', 'info');
        
        // Add activity
        this.addAdminActivity(`Menghapus jadwal: ${schedule.mapel}`);
    }
    
    toggleScheduleStatus(scheduleId) {
        const schedule = this.schedules.find(s => s.id === scheduleId);
        if (!schedule) return;
        
        schedule.status = schedule.status === 'active' ? 'inactive' : 'active';
        schedule.updatedAt = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('adminSchedules', JSON.stringify(this.schedules));
        
        // Log activity
        this.logAdminActivity('Mengubah status jadwal', {
            scheduleId,
            mapel: schedule.mapel,
            newStatus: schedule.status
        });
        
        // Update UI
        this.renderScheduleTable();
        
        // Show message
        const statusText = schedule.status === 'active' ? 'diaktifkan' : 'dinonaktifkan';
        this.app.showToast(`Jadwal ${statusText}`, 'info');
    }
    
    renderScheduleTable() {
        const scheduleTable = document.getElementById('scheduleTable');
        if (!scheduleTable) return;
        
        if (this.schedules.length === 0) {
            scheduleTable.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <p>Belum ada jadwal. Tambah jadwal baru!</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        this.schedules.forEach(schedule => {
            const statusClass = schedule.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = schedule.status === 'active' ? 'Aktif' : 'Nonaktif';
            
            html += `
                <div class="schedule-item">
                    <div class="schedule-header">
                        <div class="schedule-title">
                            <h4>${schedule.mapel}</h4>
                            <span class="schedule-status ${statusClass}">
                                <i class="fas fa-circle"></i> ${statusText}
                            </span>
                        </div>
                        <div class="schedule-day">${schedule.day}</div>
                    </div>
                    
                    <div class="schedule-details">
                        <div class="schedule-info">
                            <div class="schedule-time">
                                <i class="far fa-clock"></i>
                                <span>${schedule.time}</span>
                            </div>
                            <div class="schedule-teacher">
                                <i class="fas fa-chalkboard-teacher"></i>
                                <span>${schedule.teacher}</span>
                            </div>
                            <div class="schedule-room">
                                <i class="fas fa-door-open"></i>
                                <span>${schedule.room}</span>
                            </div>
                            <div class="schedule-kelas">
                                <i class="fas fa-users"></i>
                                <span>${schedule.kelas}</span>
                            </div>
                        </div>
                        
                        <div class="schedule-actions">
                            <button class="btn-edit" onclick="window.adminPanel.openScheduleModal(${schedule.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-toggle" onclick="window.adminPanel.toggleScheduleStatus(${schedule.id})">
                                <i class="fas fa-power-off"></i> ${schedule.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <button class="btn-delete" onclick="window.adminPanel.deleteSchedule(${schedule.id})">
                                <i class="fas fa-trash"></i> Hapus
                            </button>
                        </div>
                    </div>
                    
                    <div class="schedule-footer">
                        <small>Terakhir update: ${this.formatRelativeTime(schedule.updatedAt)}</small>
                    </div>
                </div>
            `;
        });
        
        scheduleTable.innerHTML = html;
    }
    
    addAdminActivity(message) {
        const activity = {
            id: Date.now(),
            message: message,
            timestamp: new Date().toISOString(),
            type: 'system'
        };
        
        this.adminActivities.unshift(activity);
        
        // Keep only last 50 activities
        if (this.adminActivities.length > 50) {
            this.adminActivities.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('adminActivities', JSON.stringify(this.adminActivities));
        
        // Update UI
        this.renderAdminActivities();
    }
    
    renderAdminActivities() {
        const activitiesList = document.getElementById('adminActivities');
        if (!activitiesList) return;
        
        let html = '';
        
        // Take only last 10 activities for display
        const recentActivities = this.adminActivities.slice(0, 10);
        
        if (recentActivities.length === 0) {
            html = `
                <div class="activity-item">
                    <i class="fas fa-info-circle activity-icon"></i>
                    <div class="activity-content">
                        <div class="activity-title">Tidak ada aktivitas</div>
                        <div class="activity-time">Belum ada aktivitas yang tercatat</div>
                    </div>
                </div>
            `;
        } else {
            recentActivities.forEach(activity => {
                const icon = this.getActivityIcon(activity.type);
                const timeAgo = this.formatRelativeTime(activity.timestamp);
                
                html += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">${activity.message || activity.action}</div>
                            <div class="activity-time">${timeAgo}</div>
                        </div>
                    </div>
                `;
            });
        }
        
        activitiesList.innerHTML = html;
    }
    
    getActivityIcon(type) {
        switch(type) {
            case 'system': return 'fas fa-cog';
            case 'presensi': return 'fas fa-fingerprint';
            case 'schedule': return 'fas fa-calendar-alt';
            case 'user': return 'fas fa-user';
            default: return 'fas fa-info-circle';
        }
    }
    
    formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    logAdminActivity(action, details = {}) {
        const activity = {
            id: Date.now(),
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            type: 'admin',
            adminId: this.app.currentUser?.id || 'system',
            adminName: this.app.currentUser?.name || 'System'
        };
        
        this.adminActivities.unshift(activity);
        
        // Save to localStorage
        localStorage.setItem('adminActivities', JSON.stringify(this.adminActivities));
        
        // Update UI
        this.renderAdminActivities();
    }
    
    initRealtimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            // Update presensi status
            this.updatePresensiStatus();
            
            // Simulate new activities occasionally
            if (Math.random() > 0.8) {
                const fakeActivities = [
                    'Sistem melakukan pembersihan cache',
                    'Backup database otomatis',
                    'Pengecekan keamanan sistem',
                    'Update statistik pengguna'
                ];
                
                const randomActivity = fakeActivities[Math.floor(Math.random() * fakeActivities.length)];
                this.addAdminActivity(randomActivity);
            }
        }, 30000); // Every 30 seconds
    }
    
    startAutoRefresh() {
        // Auto-refresh schedule table every 2 minutes
        setInterval(() => {
            this.renderScheduleTable();
            this.renderAdminActivities();
        }, 120000);
    }
}

// Initialize admin panel when DOM is ready
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.app && window.app.currentRole === 'admin') {
            adminPanel = new AdminPanel(window.app);
            window.adminPanel = adminPanel;
            console.log('👨‍💼 Admin Panel initialized');
        }
    }, 1000);
});

// Add CSS for admin-specific styles
const adminStyles = `
    .schedule-item {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
    }
    
    .schedule-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        border-color: #2a5298;
    }
    
    .schedule-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 2px solid #f1f5f9;
    }
    
    .schedule-title {
        flex: 1;
    }
    
    .schedule-title h4 {
        margin: 0 0 8px 0;
        color: #1e3c72;
        font-size: 1.2rem;
    }
    
    .schedule-day {
        background: linear-gradient(to right, #2a5298, #1e3c72);
        color: white;
        padding: 6px 15px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
        white-space: nowrap;
        margin-left: 15px;
    }
    
    .schedule-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status-active {
        background: rgba(67, 233, 123, 0.1);
        color: #43e97b;
        border: 1px solid rgba(67, 233, 123, 0.3);
    }
    
    .status-inactive {
        background: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
        border: 1px solid rgba(255, 107, 107, 0.3);
    }
    
    .schedule-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .schedule-info {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
    }
    
    .schedule-info > div {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #666;
    }
    
    .schedule-info i {
        color: #2a5298;
        width: 20px;
        text-align: center;
    }
    
    .schedule-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .schedule-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .btn-edit {
        background: rgba(30, 60, 114, 0.1);
        color: #2a5298;
    }
    
    .btn-edit:hover {
        background: #2a5298;
        color: white;
    }
    
    .btn-toggle {
        background: rgba(67, 233, 123, 0.1);
        color: #43e97b;
    }
    
    .btn-toggle:hover {
        background: #43e97b;
        color: white;
    }
    
    .btn-delete {
        background: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
    }
    
    .btn-delete:hover {
        background: #ff6b6b;
        color: white;
    }
    
    .schedule-footer {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;
        color: #999;
        font-size: 0.85rem;
    }
    
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #e5e7eb;
        transition: all 0.3s ease;
    }
    
    .activity-item:hover {
        background: #f8fafc;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #2a5298, #1e3c72);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
        flex-shrink: 0;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-title {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
    }
    
    .activity-time {
        color: #6b7280;
        font-size: 0.85rem;
    }
    
    @media (max-width: 768px) {
        .schedule-details {
            flex-direction: column;
            align-items: stretch;
        }
        
        .schedule-actions {
            justify-content: center;
        }
        
        .schedule-header {
            flex-direction: column;
            gap: 10px;
        }
        
        .schedule-day {
            align-self: flex-start;
        }
    }
    
    @media (max-width: 480px) {
        .schedule-actions {
            flex-direction: column;
        }
        
        .schedule-info {
            grid-template-columns: 1fr;
        }
    }
`;

// Add admin styles to document
document.addEventListener('DOMContentLoaded', () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = adminStyles;
    document.head.appendChild(styleSheet);
});

// Export for global access
window.AdminPanel = AdminPanel;
