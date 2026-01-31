// ============================================
// MAIN APPLICATION - ENHANCED VERSION
// ============================================

class AbsensiApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.mapelData = {};
        this.presensiData = [];
        this.notifications = [];
        this.selectedStatus = null;
        this.selectedMapel = null;
        this.isSidebarOpen = false;
        this.realtime = window.RealTimeSystem;
        this.disconnectRealtime = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Enhanced Absensi App...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Animate loading screen
        this.animateLoading();
        
        // Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // Check saved session
        this.checkSavedSession();
        
        // Load data
        await this.loadData();
        
        // Initialize real-time connection if logged in
        if (this.currentUser) {
            this.initRealtimeConnection();
        }
        
        console.log('✅ App initialized successfully');
    }
    
    animateLoading() {
        const progressBar = document.getElementById('progressBar');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loadingScreen');
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        console.log('📴 Loading screen hidden');
                    }, 500);
                }, 300);
                return;
            }
            width += 2;
            progressBar.style.width = width + '%';
        }, 30);
    }
    
    async loadData() {
        try {
            // Load mapel data
            if (window.MockAPI) {
                const response = await window.MockAPI.getMapel();
                if (response.success) {
                    this.mapelData = response.data;
                    this.renderMapelMenu();
                }
            }
            
            // Load presensi data if logged in
            if (this.currentUser) {
                const presensiResponse = await window.MockAPI.getPresensi(this.currentUser.id);
                if (presensiResponse.success) {
                    this.presensiData = presensiResponse.data;
                }
                
                // Load notifications
                const notifResponse = await window.MockAPI.getNotifications(this.currentUser.id);
                if (notifResponse.success) {
                    this.notifications = notifResponse.data;
                    this.updateNotificationCount();
                }
            }
            
        } catch (error) {
            console.log('Error loading data:', error);
        }
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Auth tabs (Login/Register)
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = tab.dataset.form;
                this.switchAuthForm(formType);
            });
        });
        
        // Login button
        document.getElementById('loginBtn')?.addEventListener('click', () => this.login());
        
        // Register button
        document.getElementById('registerBtn')?.addEventListener('click', () => this.register());
        
        // Show/hide password
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
        
        // Switch to register link
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('register');
        });
        
        // Switch to login link
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });
        
        // ... (rest of the event listeners remain similar but enhanced)
    }
    
    switchAuthForm(formType) {
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.auth-tab[data-form="${formType}"]`).classList.add('active');
        
        // Show corresponding form
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${formType}Form`).classList.add('active');
    }
    
    async register() {
        const form = document.getElementById('registerForm');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('regUsername'),
            password: formData.get('regPassword'),
            confirmPassword: formData.get('regConfirmPassword'),
            name: formData.get('regName'),
            nis: formData.get('regNis'),
            kelas: formData.get('regKelas'),
            role: 'siswa' // Default role for registration
        };
        
        // Validation
        if (!userData.username || !userData.password || !userData.name) {
            this.showToast('Harap isi semua field yang wajib', 'warning');
            return;
        }
        
        if (userData.password !== userData.confirmPassword) {
            this.showToast('Password tidak cocok', 'error');
            return;
        }
        
        if (userData.password.length < 6) {
            this.showToast('Password minimal 6 karakter', 'warning');
            return;
        }
        
        try {
            // Check if username exists
            const usersResponse = await window.MockAPI.getUsers();
            if (usersResponse.success) {
                const existingUser = usersResponse.data.find(u => u.username === userData.username);
                if (existingUser) {
                    this.showToast('Username sudah digunakan', 'error');
                    return;
                }
            }
            
            // Add new user
            const addResponse = await window.MockAPI.addUser({
                username: userData.username,
                password: userData.password,
                name: userData.name,
                role: userData.role,
                kelas: userData.kelas,
                nis: userData.nis,
                avatar: '👨‍🎓'
            });
            
            if (addResponse.success) {
                this.showToast('Registrasi berhasil! Silakan login', 'success');
                form.reset();
                this.switchAuthForm('login');
            }
            
        } catch (error) {
            this.showToast('Registrasi gagal', 'error');
        }
    }
    
    async login() {
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
        
        const credentials = {
            username: formData.get('loginUsername'),
            password: formData.get('loginPassword')
        };
        
        if (!credentials.username || !credentials.password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        try {
            const response = await window.MockAPI.login(credentials.username, credentials.password);
            
            if (response.success) {
                this.currentUser = response.data;
                this.currentRole = this.currentUser.role;
                this.completeLogin();
            }
        } catch (error) {
            this.showToast(error.message || 'Login gagal', 'error');
        }
    }
    
    async completeLogin() {
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentRole', this.currentRole);
        
        // Hide auth screen, show dashboard
        document.getElementById('authWrapper').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        
        // Update UI
        this.updateUserUI();
        await this.loadData();
        this.updateDashboardStats();
        
        // Initialize real-time connection
        this.initRealtimeConnection();
        
        // Show welcome
        document.getElementById('welcomeScreen').classList.add('active');
        
        this.showToast(`Selamat datang ${this.currentUser.name}!`, 'success');
    }
    
    initRealtimeConnection() {
        if (!this.currentUser || this.disconnectRealtime) return;
        
        this.disconnectRealtime = this.realtime.connect(this.currentUser.id, (message) => {
            this.handleRealtimeMessage(message);
        });
        
        console.log('🔗 Connected to real-time system');
    }
    
    handleRealtimeMessage(message) {
        switch(message.type) {
            case 'new_presensi':
                if (this.currentRole === 'admin') {
                    this.showNotification(message.data.message, 'info');
                    this.updateDashboardStats();
                }
                break;
                
            case 'presensi_session_opened':
                this.showNotification('Sesi presensi dibuka!', 'success');
                this.updatePresensiButton();
                break;
                
            case 'presensi_session_closed':
                this.showNotification('Sesi presensi ditutup!', 'warning');
                this.updatePresensiButton();
                break;
                
            case 'sync_request':
                this.loadData();
                break;
        }
    }
    
    updatePresensiButton() {
        const presensiBtn = document.getElementById('quickPresensi');
        const isOpen = this.realtime.isPresensiOpen();
        const hasPresensi = this.realtime.hasUserPresensiToday(this.currentUser?.id);
        
        if (presensiBtn) {
            if (!isOpen) {
                presensiBtn.disabled = true;
                presensiBtn.innerHTML = '<i class="fas fa-lock"></i> Presensi Ditutup';
                presensiBtn.classList.add('disabled');
            } else if (hasPresensi) {
                presensiBtn.disabled = true;
                presensiBtn.innerHTML = '<i class="fas fa-check"></i> Sudah Presensi';
                presensiBtn.classList.add('disabled');
            } else {
                presensiBtn.disabled = false;
                presensiBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Presensi Sekarang';
                presensiBtn.classList.remove('disabled');
            }
        }
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Disconnect real-time
            if (this.disconnectRealtime) {
                this.disconnectRealtime();
                this.disconnectRealtime = null;
            }
            
            // Clear session
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            
            // Show auth screen
            document.getElementById('dashboardContainer').style.display = 'none';
            document.getElementById('authWrapper').style.display = 'flex';
            
            // Reset forms
            document.querySelectorAll('input').forEach(input => input.value = '');
            
            // Reset to login form
            this.switchAuthForm('login');
            
            // Reset app state
            this.currentUser = null;
            this.currentRole = null;
            
            this.showToast('Logout berhasil!', 'success');
        }
    }
    
    // Enhanced presensi check
    async openPresensiModal() {
        if (!this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }
        
        // Check if presensi session is open
        if (!this.realtime.isPresensiOpen()) {
            this.showToast('Sesi presensi belum dibuka oleh admin', 'warning');
            return;
        }
        
        // Check if user already has presensi today
        if (this.realtime.hasUserPresensiToday(this.currentUser.id)) {
            this.showToast('Anda sudah melakukan presensi hari ini', 'info');
            return;
        }
        
        // Proceed with presensi modal
        document.getElementById('presensiModal').classList.add('show');
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    // ... (rest of the functions remain with enhancements)
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AbsensiApp();
    window.app = app;
});
