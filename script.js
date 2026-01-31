// ============================================
// SISTEM ABSENSI DIGITAL - SMK JAKARTA TIMUR 1
// MAIN APPLICATION SCRIPT
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
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Absensi App...');
        
        // 1. Setup event listeners pertama
        this.setupEventListeners();
        
        // 2. Animate loading screen
        this.animateLoading();
        
        // 3. Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // 4. Check saved session
        this.checkSavedSession();
        
        // 5. Load data async
        await this.loadData();
        
        console.log('✅ App initialized successfully');
    }
    
    animateLoading() {
        const progressBar = document.getElementById('progressBar');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                // Hide loading screen
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
            // Load mapel data from API
            if (window.MockAPI) {
                const response = await window.MockAPI.getMapel();
                if (response.success) {
                    this.mapelData = response.data;
                    this.renderMapelMenu();
                } else {
                    this.mapelData = this.getDefaultMapelData();
                }
            } else {
                this.mapelData = this.getDefaultMapelData();
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
            console.log('Using default data:', error);
            this.mapelData = this.getDefaultMapelData();
            this.presensiData = [];
            this.notifications = [];
        }
    }
    
    getDefaultMapelData() {
        return {
            pjok: {
                id: 'pjok',
                name: "PJOK",
                fullName: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
                teacher: "Bpk. Dudi",
                schedule: "Senin, 07:30 - 09:00",
                room: "Lapangan Olahraga",
                color: "#10b981",
                icon: "fas fa-running",
                kelas: ["X", "XI", "XII"]
            },
            matematika: {
                id: 'matematika',
                name: "Matematika",
                fullName: "Matematika",
                teacher: "Bpk.Sutrisno",
                schedule: "Senin, 09:30 - 11:00",
                room: "Lab. Matematika",
                color: "#3b82f6",
                icon: "fas fa-calculator",
                kelas: ["X", "XI", "XII"]
            },
            bahasa_indonesia: {
                id: 'bahasa_indonesia',
                name: "Bahasa Indonesia",
                fullName: "Bahasa Indonesia",
                teacher: "Ibu Kesih",
                schedule: "Selasa, 07:30 - 09:00",
                room: "Ruang 201",
                color: "#8b5cf6",
                icon: "fas fa-language",
                kelas: ["X", "XI", "XII"]
            },
            bahasa_inggris: {
                id: 'bahasa_inggris',
                name: "Bahasa Inggris",
                fullName: "Bahasa Inggris",
                teacher: "Ms. Nada",
                schedule: "Selasa, 09:30 - 11:00",
                room: "Lab. Bahasa",
                color: "#ec4899",
                icon: "fas fa-globe",
                kelas: ["X", "XI", "XII"]
            },
            ipas: {
                id: 'ipas',
                name: "IPAS",
                fullName: "Ilmu Pengetahuan Alam dan Sosial",
                teacher: "Ibu Rahayu",
                schedule: "Rabu, 07:30 - 09:00",
                room: "Lab. IPA",
                color: "#06b6d4",
                icon: "fas fa-flask",
                kelas: ["X"]
            },
            sejarah: {
                id: 'sejarah',
                name: "Sejarah",
                fullName: "Sejarah Indonesia",
                teacher: "Ibu Rahayu",
                schedule: "Rabu, 09:30 - 11:00",
                room: "Ruang 202",
                color: "#f97316",
                icon: "fas fa-landmark",
                kelas: ["XI", "XII"]
            },
            pancasila: {
                id: 'pancasila',
                name: "Pancasila",
                fullName: "Pendidikan Pancasila",
                teacher: "Sensei Manda",
                schedule: "Kamis, 07:30 - 09:00",
                room: "Ruang 203",
                color: "#84cc16",
                icon: "fas fa-flag",
                kelas: ["X", "XI", "XII"]
            },
            jaringan_dasar: {
                id: 'jaringan_dasar',
                name: "Jaringan Dasar",
                fullName: "Komputer Jaringan Dasar",
                teacher: "Bpk. Okeu",
                schedule: "Kamis, 09:30 - 11:00",
                room: "Lab. Jaringan",
                color: "#6366f1",
                icon: "fas fa-network-wired",
                kelas: ["X"]
            },
            sistem_komputer: {
                id: 'sistem_komputer',
                name: "Sistem Komputer",
                fullName: "Sistem Komputer",
                teacher: "Bpk. Adi Hidayat",
                schedule: "Jumat, 07:30 - 09:00",
                room: "Lab. Komputer A",
                color: "#8b5cf6",
                icon: "fas fa-desktop",
                kelas: ["XI"]
            },
            coding_ai: {
                id: 'coding_ai',
                name: "Coding AI",
                fullName: "Coding Artificial Intelligence",
                teacher: "Bpk. Rama",
                schedule: "Jumat, 09:30 - 11:00",
                room: "Lab. AI",
                color: "#06b6d4",
                icon: "fas fa-robot",
                kelas: ["XII"]
            }
        };
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // 1. ROLE TABS
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const role = tab.getAttribute('data-role');
                this.switchRole(role);
            });
        });
        
        // 2. LOGIN BUTTONS
        document.getElementById('loginSiswa')?.addEventListener('click', () => this.loginSiswa());
        document.getElementById('loginGuru')?.addEventListener('click', () => this.loginGuru());
        document.getElementById('loginAdmin')?.addEventListener('click', () => this.loginAdmin());
        
        // 3. SHOW/HIDE PASSWORD
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
        
        // 4. MENU TOGGLE
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());
        
        // 5. LOGOUT BUTTONS - FIXED
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.logout();
        });
        
        document.getElementById('sidebarLogout')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.logout();
        });
        
        // 6. USER DROPDOWN
        document.getElementById('userDropdown')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdownMenu').classList.toggle('show');
        });
        
        // 7. QUICK ACTIONS
        document.getElementById('quickPresensi')?.addEventListener('click', () => this.openPresensiModal());
        document.getElementById('quickAbsenBtn')?.addEventListener('click', () => this.openPresensiModal());
        document.getElementById('viewJadwal')?.addEventListener('click', () => this.showPage('jadwal'));
        
        // 8. QR SCANNER
        document.getElementById('scanQRSiswa')?.addEventListener('click', () => this.openQRScanner());
        
        // 9. MODAL CLOSE
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        // 10. PRESENSI OPTIONS
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const status = this.getAttribute('data-status');
                window.app.selectPresensiStatus(status);
            });
        });
        
        // 11. SUBMIT PRESENSI
        document.getElementById('submitPresensi')?.addEventListener('click', () => this.submitPresensi());
        
        // 12. PAGE NAVIGATION
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // 13. NOTIFICATIONS
        document.getElementById('notifBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notificationsPanel').classList.toggle('show');
        });
        
        document.getElementById('clearNotifications')?.addEventListener('click', () => {
            this.clearNotifications();
        });
        
        // 14. QUICK ACTIONS BAR
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                window.app.handleQuickAction(action);
            });
        });
        
        // 15. CLICK OUTSIDE TO CLOSE
        document.addEventListener('click', (e) => {
            // Close user dropdown
            if (!e.target.closest('.user-profile') && !e.target.closest('#userDropdownMenu')) {
                document.getElementById('userDropdownMenu')?.classList.remove('show');
            }
            
            // Close notifications panel
            if (!e.target.closest('#notifBtn') && !e.target.closest('.notifications-panel')) {
                document.getElementById('notificationsPanel')?.classList.remove('show');
            }
            
            // Close modals on overlay click
            if (e.target.id === 'modalOverlay') {
                this.closeAllModals();
            }
        });
        
        // 16. CLOSE MODALS WITH ESCAPE KEY
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    switchRole(role) {
        console.log('Switching to role:', role);
        
        // Update tabs
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.role-tab[data-role="${role}"]`).classList.add('active');
        
        // Show corresponding form
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${role}Form`).classList.add('active');
    }
    
    async loginSiswa() {
        const username = document.getElementById('usernameSiswa').value.trim();
        const password = document.getElementById('passwordSiswa').value;
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        try {
            const response = await window.MockAPI.login(username, password);
            
            if (response.success && response.data.role === 'siswa') {
                this.currentUser = response.data;
                this.currentRole = 'siswa';
                this.completeLogin();
            } else {
                this.showToast('Login gagal. Periksa kredensial Anda.', 'error');
            }
        } catch (error) {
            this.showToast(error.message || 'Login gagal', 'error');
        }
    }
    
    async loginGuru() {
        const username = document.getElementById('usernameGuru').value.trim();
        const password = document.getElementById('passwordGuru').value;
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        try {
            const response = await window.MockAPI.login(username, password);
            
            if (response.success && response.data.role === 'guru') {
                this.currentUser = response.data;
                this.currentRole = 'guru';
                this.completeLogin();
            } else {
                this.showToast('Login gagal. Periksa kredensial Anda.', 'error');
            }
        } catch (error) {
            this.showToast(error.message || 'Login gagal', 'error');
        }
    }
    
    async loginAdmin() {
        const username = document.getElementById('usernameAdmin').value.trim();
        const password = document.getElementById('passwordAdmin').value;
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        try {
            const response = await window.MockAPI.login(username, password);
            
            if (response.success && response.data.role === 'admin') {
                this.currentUser = response.data;
                this.currentRole = 'admin';
                this.completeLogin();
            } else {
                this.showToast('Login gagal. Periksa kredensial Anda.', 'error');
            }
        } catch (error) {
            this.showToast(error.message || 'Login gagal', 'error');
        }
    }
    
    async completeLogin() {
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentRole', this.currentRole);
        
        // Show success message
        this.showToast(`Login berhasil sebagai ${this.currentUser.name}`, 'success');
        
        // Switch to dashboard
        setTimeout(async () => {
            document.querySelector('.login-wrapper').style.display = 'none';
            document.getElementById('dashboardContainer').style.display = 'block';
            
            // Update UI
            this.updateUserUI();
            
            // Load fresh data
            await this.loadData();
            this.updateDashboardStats();
            
            // Show welcome screen
            document.getElementById('welcomeScreen').classList.add('active');
            
            console.log('✅ Login completed for:', this.currentUser.name);
        }, 500);
    }
    
    updateUserUI() {
        if (!this.currentUser) return;
        
        // Update display name and role
        document.getElementById('userDisplayName').textContent = this.currentUser.name;
        document.getElementById('userDisplayRole').textContent = 
            this.currentRole === 'siswa' ? 'Siswa' : 
            this.currentRole === 'guru' ? 'Guru' : 'Admin';
        
        // Update sidebar info
        document.getElementById('sidebarName').textContent = this.currentUser.name;
        
        if (this.currentRole === 'siswa') {
            document.getElementById('sidebarNis').textContent = `NIS: ${this.currentUser.nis || 'N/A'}`;
            document.getElementById('sidebarKelas').textContent = `Kelas: ${this.currentUser.kelas || 'N/A'}`;
        } else if (this.currentRole === 'guru') {
            document.getElementById('sidebarNis').textContent = `NIP: ${this.currentUser.nip || 'N/A'}`;
            document.getElementById('sidebarKelas').textContent = `Pengajar: ${this.currentUser.mapel?.join(', ') || 'N/A'}`;
        } else {
            document.getElementById('sidebarNis').textContent = 'Administrator';
            document.getElementById('sidebarKelas').textContent = 'SMK Jakarta Timur 1';
        }
        
        // Update avatar
        const avatars = document.querySelectorAll('.avatar, .avatar-large');
        avatars.forEach(avatar => {
            avatar.innerHTML = `<span style="font-size: 1.5rem">${this.currentUser.avatar || '👤'}</span>`;
        });
        
        // Show/hide admin sections
        const adminSections = document.querySelectorAll('.admin-only');
        adminSections.forEach(section => {
            section.style.display = this.currentRole === 'admin' ? 'block' : 'none';
        });
    }
    
    renderMapelMenu() {
        const menuSection = document.querySelector('.menu-section:nth-child(2)');
        if (!menuSection || !this.mapelData) return;
        
        // Clear existing mapel items
        const existingItems = menuSection.querySelectorAll('.menu-item[data-mapel]');
        existingItems.forEach(item => item.remove());
        
        // Add mapel items
        Object.values(this.mapelData).forEach(mapel => {
            const menuItem = document.createElement('a');
            menuItem.href = `#mapel-${mapel.id}`;
            menuItem.className = 'menu-item sub';
            menuItem.setAttribute('data-page', 'mapel');
            menuItem.setAttribute('data-mapel', mapel.id);
            menuItem.innerHTML = `
                <i class="${mapel.icon}"></i>
                <span>${mapel.name}</span>
            `;
            
            menuSection.appendChild(menuItem);
            
            // Add click event
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMapelPage(mapel.id);
            });
        });
    }
    
    async updateDashboardStats() {
        if (!this.currentUser) return;
        
        try {
            const response = await window.MockAPI.getDashboardStats(this.currentUser.id, this.currentRole);
            
            if (response.success) {
                const stats = response.data;
                
                if (this.currentRole === 'siswa') {
                    document.getElementById('statHadir').textContent = stats.hadirHariIni || '0';
                    document.getElementById('statMapel').textContent = stats.totalMapel || '0';
                    document.getElementById('statPersen').textContent = `${stats.persenBulanIni || '0'}%`;
                    document.getElementById('absenToday').textContent = stats.hadirHariIni || '0';
                } else if (this.currentRole === 'admin') {
                    document.getElementById('statHadir').textContent = stats.totalSiswa || '0';
                    document.getElementById('statMapel').textContent = stats.totalGuru || '0';
                    document.getElementById('statPersen').textContent = stats.totalMapel || '0';
                }
            }
        } catch (error) {
            console.log('Error loading stats:', error);
        }
        
        // Update day
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date().getDay();
        document.getElementById('statHari').textContent = days[today];
    }
    
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            console.log('Logging out user:', this.currentUser?.name);
            
            // 1. Clear session data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            
            // 2. Reset UI to login screen
            const dashboard = document.getElementById('dashboardContainer');
            const loginWrapper = document.querySelector('.login-wrapper');
            
            if (dashboard) dashboard.style.display = 'none';
            if (loginWrapper) loginWrapper.style.display = 'flex';
            
            // 3. Reset all form inputs
            document.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
            
            // 4. Reset to siswa tab
            this.switchRole('siswa');
            
            // 5. Reset app state
            this.currentUser = null;
            this.currentRole = null;
            this.selectedStatus = null;
            this.selectedMapel = null;
            
            // 6. Hide sidebar if open
            document.getElementById('sidebar').classList.remove('open');
            
            // 7. Hide any open modals/dropdowns
            this.closeAllModals();
            document.getElementById('userDropdownMenu').classList.remove('show');
            document.getElementById('notificationsPanel').classList.remove('show');
            
            // 8. Show success message
            this.showToast('Logout berhasil!', 'success');
            
            console.log('✅ Logout completed successfully');
        }
    }
    
    checkSavedSession() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            const savedRole = localStorage.getItem('currentRole');
            
            if (savedUser && savedRole) {
                this.currentUser = JSON.parse(savedUser);
                this.currentRole = savedRole;
                
                // Auto login
                setTimeout(() => {
                    document.querySelector('.login-wrapper').style.display = 'none';
                    document.getElementById('dashboardContainer').style.display = 'block';
                    this.updateUserUI();
                    this.updateDashboardStats();
                    this.showToast('Session dipulihkan', 'info');
                }, 1000);
            }
        } catch (error) {
            console.error('Error parsing saved session:', error);
            localStorage.clear();
        }
    }
    
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('currentTime').textContent = timeString;
        
        // Update session status
        const hour = now.getHours();
        let sessionStatus = 'Malam';
        
        if (hour >= 5 && hour < 12) sessionStatus = 'Pagi';
        else if (hour >= 12 && hour < 15) sessionStatus = 'Siang';
        else if (hour >= 15 && hour < 18) sessionStatus = 'Sore';
        
        document.getElementById('sessionStatus').textContent = sessionStatus;
    }
    
    openPresensiModal() {
        if (!this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }
        
        // Update modal info
        document.getElementById('presensiNama').textContent = this.currentUser.name;
        document.getElementById('presensiMapel').textContent = this.selectedMapel || 'Pilih mata pelajaran';
        document.getElementById('presensiWaktu').textContent = `Waktu: ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Show modal
        document.getElementById('presensiModal').classList.add('show');
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    openQRScanner() {
        document.getElementById('qrModal').classList.add('show');
        document.getElementById('modalOverlay').classList.add('show');
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.getElementById('modalOverlay').classList.remove('show');
    }
    
    selectPresensiStatus(status) {
        // Remove previous selection
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add to clicked button
        event.target.closest('.presensi-option').classList.add('selected');
        this.selectedStatus = status;
    }
    
    async submitPresensi() {
        if (!this.selectedStatus) {
            this.showToast('Pilih status kehadiran terlebih dahulu', 'warning');
            return;
        }
        
        if (!this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'error');
            return;
        }
        
        const catatan = document.getElementById('presensiCatatan').value;
        const now = new Date();
        
        const presensiData = {
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            mapel: this.selectedMapel || 'Umum',
            status: this.selectedStatus,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('id-ID'),
            catatan: catatan
        };
        
        try {
            const response = await window.MockAPI.submitPresensi(presensiData);
            
            if (response.success) {
                this.showToast('Presensi berhasil disimpan!', 'success');
                this.closeAllModals();
                
                // Reset form
                this.selectedStatus = null;
                document.getElementById('presensiCatatan').value = '';
                document.querySelectorAll('.presensi-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Reload data
                await this.loadData();
                this.updateDashboardStats();
            }
        } catch (error) {
            this.showToast('Gagal menyimpan presensi', 'error');
        }
    }
    
    showMapelPage(mapelId) {
        const mapel = this.mapelData[mapelId];
        if (!mapel) return;
        
        // Hide welcome screen
        document.getElementById('welcomeScreen').classList.remove('active');
        
        // Clear and setup content area
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = '';
        contentArea.style.display = 'block';
        
        // Create mapel page
        const mapelPage = document.createElement('div');
        mapelPage.className = 'mapel-page';
        mapelPage.innerHTML = `
            <div class="page-header">
                <div class="mapel-icon-header" style="background: ${mapel.color}20; border-left: 4px solid ${mapel.color}">
                    <i class="${mapel.icon}"></i>
                </div>
                <div>
                    <h2>${mapel.fullName}</h2>
                    <p>${mapel.name} • ${mapel.schedule}</p>
                </div>
            </div>
            
            <div class="mapel-details-grid">
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
                    <h3><i class="fas fa-users"></i> Kelas</h3>
                    <p>${mapel.kelas?.join(', ') || 'Semua Kelas'}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-primary" onclick="app.openPresensiModal()">
                    <i class="fas fa-fingerprint"></i>
                    Presensi ${mapel.name}
                </button>
            </div>
        `;
        
        contentArea.appendChild(mapelPage);
        
        // Store selected mapel for presensi
        this.selectedMapel = mapel.name;
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-mapel') === mapelId) {
                item.classList.add('active');
            }
        });
    }
    
    showPage(page) {
        // Hide welcome screen
        document.getElementById('welcomeScreen').classList.remove('active');
        
        // Clear content area
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = '';
        contentArea.style.display = 'block';
        
        // Show page based on selection
        switch(page) {
            case 'dashboard':
                document.getElementById('welcomeScreen').classList.add('active');
                break;
                
            case 'absensi':
                this.showAbsensiPage();
                break;
                
            case 'jadwal':
                this.showJadwalPage();
                break;
                
            case 'laporan':
                this.showLaporanPage();
                break;
                
            case 'rekap':
                this.showRekapPage();
                break;
                
            case 'admin':
                this.showAdminPage();
                break;
        }
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });
    }
    
    showAbsensiPage() {
        const contentArea = document.getElementById('contentArea');
        
        let html = `
            <div class="page-header">
                <h2><i class="fas fa-clipboard-check"></i> Presensi</h2>
                <p>Riwayat dan manajemen presensi</p>
            </div>
            
            <div class="presensi-controls">
                <button class="btn-primary" onclick="app.openPresensiModal()">
                    <i class="fas fa-plus"></i>
                    Presensi Baru
                </button>
            </div>
        `;
        
        if (this.presensiData.length === 0) {
            html += `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Belum ada data presensi</h3>
                    <p>Lakukan presensi pertama Anda</p>
                    <button class="btn-primary" onclick="app.openPresensiModal()">
                        Presensi Sekarang
                    </button>
                </div>
            `;
        } else {
            html += `
                <div class="presensi-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Mapel</th>
                                <th>Status</th>
                                <th>Waktu</th>
                                <th>Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            this.presensiData.forEach(presensi => {
                const statusClass = this.getStatusClass(presensi.status);
                const statusText = this.getStatusText(presensi.status);
                
                html += `
                    <tr>
                        <td>${new Date(presensi.date).toLocaleDateString('id-ID')}</td>
                        <td>${presensi.mapel}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>${presensi.time}</td>
                        <td>${presensi.catatan || '-'}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        contentArea.innerHTML = html;
    }
    
    showJadwalPage() {
        const contentArea = document.getElementById('contentArea');
        
        let html = `
            <div class="page-header">
                <h2><i class="fas fa-calendar-alt"></i> Jadwal Pelajaran</h2>
                <p>Jadwal pelajaran mingguan</p>
            </div>
            
            <div class="jadwal-container">
                <div class="jadwal-filter">
                    <select id="filterKelas">
                        <option value="all">Semua Kelas</option>
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                    </select>
                    <select id="filterHari">
                        <option value="all">Semua Hari</option>
                        <option value="senin">Senin</option>
                        <option value="selasa">Selasa</option>
                        <option value="rabu">Rabu</option>
                        <option value="kamis">Kamis</option>
                        <option value="jumat">Jumat</option>
                    </select>
                </div>
                
                <div class="jadwal-grid">
        `;
        
        // Group mapel by day
        const days = {
            'Senin': [],
            'Selasa': [],
            'Rabu': [],
            'Kamis': [],
            'Jumat': []
        };
        
        Object.values(this.mapelData).forEach(mapel => {
            const day = mapel.schedule.split(',')[0];
            if (days[day]) {
                days[day].push(mapel);
            }
        });
        
        // Generate schedule
        Object.entries(days).forEach(([day, mapels]) => {
            html += `
                <div class="jadwal-day">
                    <h3>${day}</h3>
                    <div class="mapel-list">
            `;
            
            if (mapels.length === 0) {
                html += `<p class="no-mapel">Tidak ada pelajaran</p>`;
            } else {
                mapels.forEach(mapel => {
                    html += `
                        <div class="mapel-item" style="border-left-color: ${mapel.color}">
                            <div class="mapel-time">${mapel.schedule.split(',')[1]}</div>
                            <div class="mapel-info">
                                <h4>${mapel.name}</h4>
                                <p>${mapel.teacher}</p>
                                <p class="room">${mapel.room}</p>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        contentArea.innerHTML = html;
    }
    
    showLaporanPage() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="page-header">
                <h2><i class="fas fa-chart-bar"></i> Laporan</h2>
                <p>Statistik dan analisis kehadiran</p>
            </div>
            
            <div class="laporan-stats">
                <div class="stat-card large">
                    <h3>Ringkasan Bulan Ini</h3>
                    <div class="stat-row">
                        <span>Hadir</span>
                        <span class="value success">75%</span>
                    </div>
                    <div class="stat-row">
                        <span>Terlambat</span>
                        <span class="value warning">15%</span>
                    </div>
                    <div class="stat-row">
                        <span>Izin</span>
                        <span class="value info">5%</span>
                    </div>
                    <div class="stat-row">
                        <span>Alfa</span>
                        <span class="value danger">5%</span>
                    </div>
                </div>
                
                <div class="chart-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <p>Grafik kehadiran akan ditampilkan di sini</p>
                </div>
            </div>
        `;
    }
    
    showRekapPage() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="page-header">
                <h2><i class="fas fa-file-alt"></i> Rekap Harian</h2>
                <p>Rekap presensi per hari</p>
            </div>
            
            <div class="rekap-container">
                <div class="date-picker">
                    <input type="date" id="rekapDate" value="${new Date().toISOString().split('T')[0]}">
                    <button class="btn-primary">Lihat Rekap</button>
                </div>
                
                <div class="rekap-summary">
                    <h3>Rekap Presensi Hari Ini</h3>
                    <div class="summary-grid">
                        <div class="summary-item success">
                            <span class="count">24</span>
                            <span class="label">Hadir</span>
                        </div>
                        <div class="summary-item warning">
                            <span class="count">2</span>
                            <span class="label">Terlambat</span>
                        </div>
                        <div class="summary-item info">
                            <span class="count">1</span>
                            <span class="label">Izin</span>
                        </div>
                        <div class="summary-item danger">
                            <span class="count">1</span>
                            <span class="label">Alfa</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showAdminPage() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="page-header">
                <h2><i class="fas fa-user-shield"></i> Admin Panel</h2>
                <p>Manajemen sistem absensi</p>
            </div>
            
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <i class="fas fa-users"></i>
                    <h3 id="adminStatUsers">0</h3>
                    <p>Total User</p>
                </div>
                <div class="admin-stat-card">
                    <i class="fas fa-book"></i>
                    <h3 id="adminStatMapels">0</h3>
                    <p>Total Mapel</p>
                </div>
                <div class="admin-stat-card">
                    <i class="fas fa-clipboard-check"></i>
                    <h3 id="adminStatPresensi">0</h3>
                    <p>Presensi Hari Ini</p>
                </div>
                <div class="admin-stat-card">
                    <i class="fas fa-chart-line"></i>
                    <h3 id="adminStatAktivitas">0</h3>
                    <p>Aktivitas Hari Ini</p>
                </div>
            </div>
            
            <div class="admin-actions">
                <button class="admin-action-btn" onclick="app.showPage('users')">
                    <i class="fas fa-user-cog"></i>
                    <span>Manajemen User</span>
                </button>
                <button class="admin-action-btn" onclick="app.showPage('mapel-admin')">
                    <i class="fas fa-book-medical"></i>
                    <span>Manajemen Mapel</span>
                </button>
                <button class="admin-action-btn">
                    <i class="fas fa-download"></i>
                    <span>Export Data</span>
                </button>
                <button class="admin-action-btn">
                    <i class="fas fa-cogs"></i>
                    <span>Pengaturan</span>
                </button>
            </div>
            
            <div class="recent-activity">
                <h3>Aktivitas Terbaru</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <i class="fas fa-user-check success"></i>
                        <div>
                            <p>Ahmad melakukan presensi di Matematika</p>
                            <span class="time">10 menit yang lalu</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-user-plus info"></i>
                        <div>
                            <p>User baru ditambahkan: Siti</p>
                            <span class="time">1 jam yang lalu</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load admin stats
        this.loadAdminStats();
    }
    
    async loadAdminStats() {
        if (this.currentRole !== 'admin') return;
        
        try {
            // Load users count
            const usersResponse = await window.MockAPI.getUsers();
            if (usersResponse.success) {
                document.getElementById('adminStatUsers').textContent = usersResponse.data.length;
            }
            
            // Load mapel count
            document.getElementById('adminStatMapels').textContent = Object.keys(this.mapelData).length;
            
            // Load today's presensi count
            const today = new Date().toISOString().split('T')[0];
            const presensiResponse = await window.MockAPI.getPresensi(null, today);
            if (presensiResponse.success) {
                document.getElementById('adminStatPresensi').textContent = presensiResponse.data.length;
            }
            
        } catch (error) {
            console.log('Error loading admin stats:', error);
        }
    }
    
    getStatusClass(status) {
        const classes = {
            'hadir': 'success',
            'terlambat': 'warning',
            'izin': 'info',
            'sakit': 'secondary',
            'alfa': 'danger'
        };
        return classes[status] || 'secondary';
    }
    
    getStatusText(status) {
        const texts = {
            'hadir': 'Hadir',
            'terlambat': 'Terlambat',
            'izin': 'Izin',
            'sakit': 'Sakit',
            'alfa': 'Alfa'
        };
        return texts[status] || status;
    }
    
    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        document.getElementById('notifCount').textContent = unreadCount;
    }
    
    clearNotifications() {
        this.notifications.forEach(notif => notif.read = true);
        this.updateNotificationCount();
        document.getElementById('notificationsList').innerHTML = '<p class="no-notifications">Tidak ada notifikasi</p>';
        this.showToast('Notifikasi dibersihkan', 'info');
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast-' + Date.now();
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || 'fas fa-info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">
                    ${type === 'success' ? 'Sukses' : 
                      type === 'error' ? 'Error' : 
                      type === 'warning' ? 'Peringatan' : 'Info'}
                </div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="document.getElementById('${toastId}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const toastEl = document.getElementById(toastId);
            if (toastEl) {
                toastEl.style.animation = 'toastSlide 0.3s ease reverse';
                setTimeout(() => toastEl.remove(), 300);
            }
        }, 5000);
    }
    
    handleQuickAction(action) {
        switch(action) {
            case 'absen':
                this.openPresensiModal();
                break;
            case 'qr':
                this.openQRScanner();
                break;
            case 'jadwal':
                this.showPage('jadwal');
                break;
            case 'profile':
                this.showToast('Fitur profil akan datang', 'info');
                break;
        }
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AbsensiApp();
    window.app = app;
    
    // Add global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        
        // Hide loading screen on error
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    });
});

// Online/offline detection
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
