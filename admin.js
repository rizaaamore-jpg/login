// ============================================
// ENHANCED ADMIN PANEL WITH SCHEDULE CONTROL
// ============================================

class AdminPanel {
    constructor() {
        this.api = window.MockAPI;
        this.realtime = window.RealTimeSystem;
        this.init();
    }
    
    init() {
        this.setupAdminListeners();
        this.loadAdminDashboard();
        this.initScheduleControls();
    }
    
    initScheduleControls() {
        // Schedule editor
        document.getElementById('saveSchedule')?.addEventListener('click', () => this.saveSchedule());
        document.getElementById('openPresensiSession')?.addEventListener('click', () => this.openPresensiSession());
        document.getElementById('closePresensiSession')?.addEventListener('click', () => this.closePresensiSession());
        
        // Real-time status display
        this.updatePresensiStatus();
        setInterval(() => this.updatePresensiStatus(), 10000);
    }
    
    updatePresensiStatus() {
        const statusBadge = document.getElementById('presensiStatusBadge');
        const openBtn = document.getElementById('openPresensiSession');
        const closeBtn = document.getElementById('closePresensiSession');
        
        if (this.realtime.isPresensiOpen()) {
            statusBadge.className = 'realtime-badge success';
            statusBadge.innerHTML = '<i class="fas fa-unlock"></i> Presensi Terbuka';
            openBtn.disabled = true;
            closeBtn.disabled = false;
        } else {
            statusBadge.className = 'realtime-badge danger';
            statusBadge.innerHTML = '<i class="fas fa-lock"></i> Presensi Tertutup';
            openBtn.disabled = false;
            closeBtn.disabled = true;
        }
    }
    
    openPresensiSession() {
        const duration = document.getElementById('presensiDuration').value || 30;
        const session = this.realtime.openPresensiSession();
        session.allowedDuration = parseInt(duration);
        
        this.showAdminToast(`Sesi presensi dibuka untuk ${duration} menit`, 'success');
        this.updatePresensiStatus();
        
        // Log the action
        this.logAdminActivity('Membuka sesi presensi', {
            duration: duration,
            startTime: session.startTime
        });
    }
    
    closePresensiSession() {
        this.realtime.closePresensiSession();
        this.showAdminToast('Sesi presensi ditutup', 'warning');
        this.updatePresensiStatus();
        
        this.logAdminActivity('Menutup sesi presensi');
    }
    
    async saveSchedule() {
        const form = document.getElementById('scheduleForm');
        const formData = new FormData(form);
        
        const scheduleData = {
            mapel: formData.get('scheduleMapel'),
            day: formData.get('scheduleDay'),
            time: formData.get('scheduleTime'),
            teacher: formData.get('scheduleTeacher'),
            room: formData.get('scheduleRoom')
        };
        
        try {
            // Update mapel data
            const response = await this.api.updateMapel(scheduleData.mapel, {
                schedule: `${scheduleData.day}, ${scheduleData.time}`,
                teacher: scheduleData.teacher,
                room: scheduleData.room
            });
            
            if (response.success) {
                this.showAdminToast('Jadwal berhasil diupdate', 'success');
                await this.loadMapel();
                
                // Broadcast update to all users
                this.realtime.broadcastUpdate({
                    type: 'schedule_updated',
                    data: scheduleData,
                    message: 'Jadwal pelajaran telah diupdate'
                });
                
                this.logAdminActivity('Mengupdate jadwal pelajaran', scheduleData);
            }
        } catch (error) {
            this.showAdminToast('Gagal mengupdate jadwal', 'error');
        }
    }
    
    async editSchedule(mapelId) {
        try {
            const response = await this.api.getMapel();
            if (!response.success) return;
            
            const mapel = response.data[mapelId];
            if (!mapel) return;
            
            // Parse schedule
            const [day, time] = mapel.schedule.split(', ');
            
            // Populate form
            document.getElementById('scheduleMapel').value = mapelId;
            document.getElementById('scheduleDay').value = day;
            document.getElementById('scheduleTime').value = time;
            document.getElementById('scheduleTeacher').value = mapel.teacher;
            document.getElementById('scheduleRoom').value = mapel.room;
            
            // Show modal
            this.showModal('scheduleModal');
            
        } catch (error) {
            this.showAdminToast('Gagal memuat data jadwal', 'error');
        }
    }
    
    logAdminActivity(action, details = {}) {
        try {
            const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
            
            activities.unshift({
                id: 'ACT' + Date.now(),
                adminId: 'ADM001',
                adminName: 'Administrator',
                action: action,
                details: details,
                timestamp: new Date().toISOString(),
                ip: '127.0.0.1' // Simulated
            });
            
            // Keep only last 100 activities
            if (activities.length > 100) {
                activities.length = 100;
            }
            
            localStorage.setItem('adminActivities', JSON.stringify(activities));
            
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }
    
    async loadAdminActivities() {
        try {
            const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
            const container = document.getElementById('adminActivities');
            
            if (!container) return;
            
            if (activities.length === 0) {
                container.innerHTML = '<p class="empty">Belum ada aktivitas</p>';
                return;
            }
            
            let html = '';
            activities.forEach(activity => {
                html += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-user-cog"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-header">
                                <strong>${activity.adminName}</strong>
                                <span class="activity-time">${this.formatTime(activity.timestamp)}</span>
                            </div>
                            <p>${activity.action}</p>
                            ${activity.details && Object.keys(activity.details).length > 0 ? 
                                `<small class="activity-details">${JSON.stringify(activity.details)}</small>` : ''}
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading activities:', error);
        }
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} hari yang lalu`;
        
        return date.toLocaleDateString('id-ID');
    }
    
    // ... (rest of the admin functions with enhancements)
}
