// Absensi Kelas Application - FIXED VERSION
class AbsensiApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.mapelData = {};
        this.presensiData = [];
        this.notifications = [];
        this.isSidebarOpen = false;
        this.selectedStatus = null;
        this.selectedMapel = null;
        
        this.init();
    }
    
    async init() {
        // Load data
        await this.loadData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update time
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Check for saved session
        this.checkSavedSession();
        
        // Animate loading progress
        this.animateLoading();
    }
    
    animateLoading() {
        const progressBar = document.querySelector('.progress-bar');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                // Hide loading screen
                setTimeout(() => {
                    document.getElementById('loadingScreen').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('loadingScreen').style.display = 'none';
                    }, 300);
                }, 300);
                return;
            }
            width += 10;
            progressBar.style.width = width + '%';
        }, 150);
    }
    
    async loadData() {
        try {
            // Load mapel data
            if (typeof mapelData !== 'undefined') {
                this.mapelData = window.mapelData;
            } else {
                this.mapelData = this.getDefaultMapelData();
            }
            
            // Load presensi data from localStorage
            this.presensiData = JSON.parse(localStorage.getItem('presensi_data') || '[]');
            
            // Load notifications
            this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            this.updateNotificationCount();
            
        } catch (error) {
            console.log('Using default data:', error);
            this.mapelData = this.getDefaultMapelData();
            this.presensiData = [];
            this.notifications = [];
        }
    }
    
    getDefaultMapelData() {
        return {
            pjok: {
                name: "PJOK",
                fullName: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
                teacher: "Bpk. Ahmad Syahputra",
                schedule: "Senin, 07:30 - 09:00",
                room: "Lapangan Olahraga",
                color: "#10b981",
                icon: "fas fa-running"
            },
            // ... (data mapel lainnya sama kayak yang lu punya)
            // Tetap include semua mapel data yang lu udah tulis
        };
    }
    
    setupEventListeners() {
        // Role tabs
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchRole(tab.dataset.role));
        });
        
        // Login buttons
        document.getElementById('loginSiswa')?.addEventListener('click', () => this.loginSiswa());
        document.getElementById('loginGuru')?.addEventListener('click', () => this.loginGuru());
        document.getElementById('loginAdmin')?.addEventListener('click', () => this.loginAdmin());
        
        // Show password toggles
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.closest('.toggle-password').dataset.target;
                const input = document.getElementById(targetId);
                const icon = e.target.closest('.toggle-password').querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
        
        // Menu toggle
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());
        
        // User dropdown - FIXED SELECTOR
        document.getElementById('userDropdown')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });
        
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('sidebarLogout')?.addEventListener('click', () => this.logout());
        
        // Quick actions
        document.getElementById('quickPresensi')?.addEventListener('click', () => this.openPresensiModal());
        document.getElementById('quickAbsenBtn')?.addEventListener('click', () => this.openPresensiModal());
        
        // QR scanner
        document.getElementById('scanQRSiswa')?.addEventListener('click', () => this.openQRScanner());
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        // Presensi options
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.selectPresensiStatus(status);
            });
        });
        
        // Submit presensi
        document.getElementById('submitPresensi')?.addEventListener('click', () => this.submitPresensi());
        
        // Mapel menu items
        document.querySelectorAll('.menu-item[data-mapel]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const mapelId = e.currentTarget.dataset.mapel;
                this.showMapelPage(mapelId);
            });
        });
        
        // Page navigation
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });
        
        // Notifications button
        document.getElementById('notifBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notificationsPanel').classList.toggle('show');
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            // Close user dropdown
            if (!e.target.closest('.user-profile') && !e.target.closest('#userDropdownMenu')) {
                document.getElementById('userDropdownMenu')?.classList.remove('show');
            }
            
            // Close notifications panel
            if (!e.target.closest('#notifBtn') && !e.target.closest('.notifications-panel')) {
                document.getElementById('notificationsPanel')?.classList.remove('show');
            }
            
            // Close modals when clicking overlay
            if (e.target.id === 'qrModalOverlay') {
                this.closeAllModals();
            }
        });
        
        // Quick actions bar
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // View jadwal button
        document.getElementById('viewJadwal')?.addEventListener('click', () => {
            this.showPage('jadwal');
        });
    }
    
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdownMenu');
        dropdown?.classList.toggle('show');
    }
    
    // ... (fungsi lainnya tetep sama kayak punya lu)
    // loginSiswa(), loginGuru(), loginAdmin(), completeLogin(), dll.
    
    showMapelPage(mapelId) {
        const mapel = this.mapelData[mapelId];
        if (!mapel) return;
        
        // Hide welcome screen
        document.getElementById('welcomeScreen').classList.remove('active');
        document.getElementById('mapelContent').innerHTML = '';
        document.getElementById('contentArea').innerHTML = '';
        
        // Create mapel page - FIXED: ga pake pageTitle yang ga ada
        const mapelPage = document.createElement('div');
        mapelPage.className = 'mapel-page';
        mapelPage.innerHTML = `
            <div class="mapel-header" style="background: ${mapel.color}20; border-left: 4px solid ${mapel.color}">
                <div class="mapel-icon">
                    <i class="${mapel.icon}"></i>
                </div>
                <div class="mapel-info">
                    <h2>${mapel.fullName}</h2>
                    <p>${mapel.name} • ${mapel.schedule}</p>
                </div>
            </div>
            
            <div class="mapel-details">
                <div class="detail-card">
                    <h3><i class="fas fa-chalkboard-teacher"></i> Pengajar</h3>
                    <p>${mapel.teacher}</p>
                </div>
                
                <div class="detail-card">
                    <h3><i class="fas fa-door-open"></i> Ruangan</h3>
                    <p>${mapel.room}</p>
                </div>
                
                <div class="detail-card">
                    <h3><i class="fas fa-clock"></i> Jadwal</h3>
                    <p>${mapel.schedule}</p>
                </div>
                
                <div class="detail-card">
                    <h3><i class="fas fa-calendar-alt"></i> Presensi Hari Ini</h3>
                    <div class="presensi-stats">
                        <div class="stat">
                            <span class="number success">24</span>
                            <span class="label">Hadir</span>
                        </div>
                        <div class="stat">
                            <span class="number warning">2</span>
                            <span class="label">Terlambat</span>
                        </div>
                        <div class="stat">
                            <span class="number danger">1</span>
                            <span class="label">Izin</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mapel-actions">
                <button class="btn-primary" onclick="app.openPresensiModal()">
                    <i class="fas fa-fingerprint"></i>
                    Presensi ${mapel.name}
                </button>
                
                <button class="btn-secondary">
                    <i class="fas fa-qrcode"></i>
                    Generate QR
                </button>
                
                <button class="btn-secondary">
                    <i class="fas fa-list"></i>
                    Daftar Hadir
                </button>
            </div>
        `;
        
        document.getElementById('mapelContent').appendChild(mapelPage);
        document.getElementById('mapelContent').style.display = 'block';
        
        // Store selected mapel for presensi
        this.selectedMapel = mapel.name;
        
        // Update presensi modal dengan mapel yang dipilih
        if (document.getElementById('presensiMapel')) {
            document.getElementById('presensiMapel').textContent = mapel.name;
        }
    }
}

// Initialize app
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new AbsensiApp();
    window.app = app;
});

// Helper function for offline detection
window.addEventListener('online', () => {
    if (window.app) {
        window.app.showToast('Koneksi internet kembali', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.app) {
        window.app.showToast('Anda sedang offline', 'warning');
    }
});
