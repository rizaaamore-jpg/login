// Absensi Kelas Application
class AbsensiApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
        this.mapelData = {};
        this.presensiData = [];
        this.notifications = [];
        this.isSidebarOpen = false;
        
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
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 300);
        }, 1500);
    }
    
    async loadData() {
        try {
            // Load mapel data
            const mapelResponse = await fetch('mapel-data.js');
            // Load sample data if file doesn't exist
            this.mapelData = this.getDefaultMapelData();
            
            // Load presensi data from localStorage
            this.presensiData = JSON.parse(localStorage.getItem('presensi_data') || '[]');
            
            // Load notifications
            this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            this.updateNotificationCount();
            
        } catch (error) {
            console.log('Using default data');
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
            matematika: {
                name: "Matematika",
                fullName: "Matematika",
                teacher: "Ibu Siti Nurhaliza",
                schedule: "Senin, 09:30 - 11:00",
                room: "Lab. Matematika",
                color: "#3b82f6",
                icon: "fas fa-calculator"
            },
            bahasa_indonesia: {
                name: "Bahasa Indonesia",
                fullName: "Bahasa Indonesia",
                teacher: "Ibu Dian Sastro",
                schedule: "Selasa, 07:30 - 09:00",
                room: "Ruang 201",
                color: "#8b5cf6",
                icon: "fas fa-language"
            },
            bahasa_inggris: {
                name: "Bahasa Inggris",
                fullName: "Bahasa Inggris",
                teacher: "Mr. John Smith",
                schedule: "Selasa, 09:30 - 11:00",
                room: "Lab. Bahasa",
                color: "#ec4899",
                icon: "fas fa-globe"
            },
            english_comms: {
                name: "English Communications",
                fullName: "English Communications",
                teacher: "Ms. Sarah Johnson",
                schedule: "Rabu, 07:30 - 09:00",
                room: "Lab. Bahasa",
                color: "#f59e0b",
                icon: "fas fa-comments"
            },
            seni_musik: {
                name: "Seni Musik",
                fullName: "Seni Musik",
                teacher: "Bpk. Didi Kempot",
                schedule: "Rabu, 09:30 - 11:00",
                room: "Studio Musik",
                color: "#ef4444",
                icon: "fas fa-music"
            },
            ipas: {
                name: "IPAS",
                fullName: "Ilmu Pengetahuan Alam dan Sosial",
                teacher: "Ibu Maria Ulfa",
                schedule: "Kamis, 07:30 - 09:00",
                room: "Lab. IPA",
                color: "#06b6d4",
                icon: "fas fa-flask"
            },
            sejarah: {
                name: "Sejarah",
                fullName: "Sejarah",
                teacher: "Bpk. Joko Widodo",
                schedule: "Kamis, 09:30 - 11:00",
                room: "Ruang 202",
                color: "#f97316",
                icon: "fas fa-landmark"
            },
            pancasila: {
                name: "Pendidikan Pancasila",
                fullName: "Pendidikan Pancasila",
                teacher: "Bpk. Soekarno",
                schedule: "Jumat, 07:30 - 09:00",
                room: "Ruang 203",
                color: "#84cc16",
                icon: "fas fa-flag"
            },
            jaringan_dasar: {
                name: "Komputer Jaringan Dasar",
                fullName: "Komputer Jaringan Dasar",
                teacher: "Bpk. Bill Gates",
                schedule: "Jumat, 09:30 - 11:00",
                room: "Lab. Jaringan",
                color: "#6366f1",
                icon: "fas fa-network-wired"
            },
            sistem_komputer: {
                name: "Sistem Komputer",
                fullName: "Sistem Komputer",
                teacher: "Bpk. Linus Torvalds",
                schedule: "Senin, 13:00 - 14:30",
                room: "Lab. Komputer A",
                color: "#8b5cf6",
                icon: "fas fa-desktop"
            },
            jaringan_luas: {
                name: "Teknik Jaringan Berbasis Luas",
                fullName: "Teknik Jaringan Berbasis Luas",
                teacher: "Bpk. Tim Berners-Lee",
                schedule: "Selasa, 13:00 - 14:30",
                room: "Lab. Jaringan B",
                color: "#0ea5e9",
                icon: "fas fa-wifi"
            },
            coding_ai: {
                name: "Coding AI",
                fullName: "Coding Artificial Intelligence",
                teacher: "Bpk. Elon Musk",
                schedule: "Rabu, 13:00 - 14:30",
                room: "Lab. AI",
                color: "#06b6d4",
                icon: "fas fa-robot"
            },
            informatika: {
                name: "Informatika",
                fullName: "Informatika",
                teacher: "Ibu Ada Lovelace",
                schedule: "Kamis, 13:00 - 14:30",
                room: "Lab. Komputer B",
                color: "#10b981",
                icon: "fas fa-code"
            }
        };
    }
    
    setupEventListeners() {
        // Role tabs
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchRole(tab.dataset.role));
        });
        
        // Login buttons
        document.getElementById('loginSiswa').addEventListener('click', () => this.loginSiswa());
        document.getElementById('loginGuru').addEventListener('click', () => this.loginGuru());
        document.getElementById('loginAdmin').addEventListener('click', () => this.loginAdmin());
        
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
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        
        // User dropdown
        document.getElementById('userBtn').addEventListener('click', () => this.toggleUserDropdown());
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('sidebarLogout').addEventListener('click', () => this.logout());
        
        // Quick actions
        document.getElementById('quickPresensi').addEventListener('click', () => this.openPresensiModal());
        document.getElementById('quickAbsenBtn').addEventListener('click', () => this.openPresensiModal());
        
        // QR scanner
        document.getElementById('scanQRSiswa').addEventListener('click', () => this.openQRScanner());
        
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
        document.getElementById('submitPresensi').addEventListener('click', () => this.submitPresensi());
        
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
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile') && !e.target.closest('.dropdown-menu')) {
                document.getElementById('userDropdownMenu').classList.remove('show');
            }
            
            if (!e.target.closest('.nav-btn') && !e.target.closest('.notifications-panel')) {
                document.getElementById('notificationsPanel').classList.remove('show');
            }
        });
        
        // Quick actions bar
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    switchRole(role) {
        // Update active tab
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.role === role) {
                tab.classList.add('active');
            }
        });
        
        // Show corresponding form
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${role}Form`).classList.add('active');
    }
    
    loginSiswa() {
        const nis = document.getElementById('nis').value.trim();
        const password = document.getElementById('passwordSiswa').value;
        
        if (!nis || !password) {
            this.showToast('Harap isi NIS dan password', 'warning');
            return;
        }
        
        // Simulate login
        this.currentUser = {
            id: 'SIS' + nis,
            nis: nis,
            name: 'Ahmad Fauzi',
            role: 'siswa',
            kelas: 'XII TKJ 1',
            avatar: '👨‍🎓'
        };
        
        this.currentRole = 'siswa';
        
        this.completeLogin();
    }
    
    loginGuru() {
        const nip = document.getElementById('nip').value.trim();
        const password = document.getElementById('passwordGuru').value;
        const mapel = document.getElementById('mapelSelect').value;
        const kelas = document.getElementById('kelasSelect').value;
        
        if (!nip || !password || !mapel || !kelas) {
            this.showToast('Harap isi semua field', 'warning');
            return;
        }
        
        // Simulate login
        this.currentUser = {
            id: 'GUR' + nip,
            nip: nip,
            name: 'Budi Santoso, M.Pd',
            role: 'guru',
            mapel: mapel,
            kelas: kelas,
            avatar: '👨‍🏫'
        };
        
        this.currentRole = 'guru';
        
        this.completeLogin();
    }
    
    loginAdmin() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        // Simulate login
        this.currentUser = {
            id: 'ADM001',
            username: username,
            name: 'Administrator Sistem',
            role: 'admin',
            avatar: '👨‍💼'
        };
        
        this.currentRole = 'admin';
        
        this.completeLogin();
    }
    
    completeLogin() {
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentRole', this.currentRole);
        
        // Show success message
        this.showToast(`Login berhasil sebagai ${this.currentUser.name}`, 'success');
        
        // Switch to dashboard
        setTimeout(() => {
            document.querySelector('.login-wrapper').style.display = 'none';
            document.getElementById('dashboardContainer').style.display = 'block';
            
            // Update UI
            this.updateUserUI();
            this.updateDashboardStats();
            
            // Show welcome screen
            document.getElementById('welcomeScreen').classList.add('active');
        }, 500);
    }
    
    updateUserUI() {
        if (!this.currentUser) return;
        
        // Update user info
        document.getElementById('userDisplayName').textContent = this.currentUser.name;
        document.getElementById('userDisplayRole').textContent = this.currentRole === 'siswa' ? 'Siswa' : 
                                                                this.currentRole === 'guru' ? 'Guru' : 'Admin';
        
        document.getElementById('sidebarName').textContent = this.currentUser.name;
        document.getElementById('sidebarNis').textContent = this.currentRole === 'siswa' ? `NIS: ${this.currentUser.nis}` : 
                                                            this.currentRole === 'guru' ? `NIP: ${this.currentUser.nip}` : 'Admin';
        document.getElementById('sidebarKelas').textContent = this.currentUser.kelas ? `Kelas: ${this.currentUser.kelas}` : '';
        
        // Update avatar
        const avatars = document.querySelectorAll('.avatar, .avatar-large');
        avatars.forEach(avatar => {
            avatar.innerHTML = `<span style="font-size: 1.5rem">${this.currentUser.avatar}</span>`;
        });
        
        // Show/hide admin sections
        const adminSections = document.querySelectorAll('.admin-only');
        adminSections.forEach(section => {
            section.style.display = this.currentRole === 'admin' ? 'block' : 'none';
        });
    }
    
    updateDashboardStats() {
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayPresensi = this.presensiData.filter(p => 
            p.date === today && p.userId === this.currentUser.id
        );
        
        const hadirToday = todayPresensi.filter(p => p.status === 'hadir').length;
        const totalMapelToday = Object.keys(this.mapelData).length;
        const monthlyPresensi = this.presensiData.filter(p => 
            p.userId === this.currentUser.id && 
            new Date(p.date).getMonth() === new Date().getMonth()
        );
        const monthlyPercentage = monthlyPresensi.length > 0 ? 
            Math.round((monthlyPresensi.filter(p => p.status === 'hadir').length / monthlyPresensi.length) * 100) : 0;
        
        // Update stats
        document.getElementById('statHadir').textContent = hadirToday;
        document.getElementById('statMapel').textContent = totalMapelToday;
        document.getElementById('statPersen').textContent = `${monthlyPercentage}%`;
        
        // Update today's absen count
        document.getElementById('absenToday').textContent = hadirToday;
    }
    
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        document.getElementById('sidebar').classList.toggle('open', this.isSidebarOpen);
    }
    
    toggleUserDropdown() {
        document.getElementById('userDropdownMenu').classList.toggle('show');
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Clear session
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            
            // Reset UI
            document.getElementById('dashboardContainer').style.display = 'none';
            document.querySelector('.login-wrapper').style.display = 'flex';
            
            // Reset forms
            document.querySelectorAll('input').forEach(input => input.value = '');
            
            // Show success message
            this.showToast('Logout berhasil', 'success');
            
            // Reset user data
            this.currentUser = null;
            this.currentRole = null;
        }
    }
    
    checkSavedSession() {
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');
        
        if (savedUser && savedRole) {
            this.currentUser = JSON.parse(savedUser);
            this.currentRole = savedRole;
            
            // Auto login
            document.querySelector('.login-wrapper').style.display = 'none';
            document.getElementById('dashboardContainer').style.display = 'block';
            this.updateUserUI();
            this.updateDashboardStats();
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
        
        const dateString = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('currentTime').textContent = timeString;
        
        // Update session status
        const hour = now.getHours();
        let sessionStatus = 'Offline';
        
        if (hour >= 7 && hour < 12) {
            sessionStatus = 'Pagi';
        } else if (hour >= 12 && hour < 15) {
            sessionStatus = 'Siang';
        } else if (hour >= 15 && hour < 18) {
            sessionStatus = 'Sore';
        } else {
            sessionStatus = 'Malam';
        }
        
        document.getElementById('sessionStatus').textContent = sessionStatus;
    }
    
    openPresensiModal() {
        if (!this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }
        
        // Update modal info
        document.getElementById('presensiNama').textContent = this.currentUser.name;
        document.getElementById('presensiMapel').textContent = 'Pilih mapel terlebih dahulu';
        document.getElementById('presensiWaktu').textContent = `Waktu: ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Show modal
        document.getElementById('presensiModal').classList.add('show');
        document.getElementById('qrModalOverlay').classList.add('show');
    }
    
    openQRScanner() {
        document.getElementById('qrModal').classList.add('show');
        document.getElementById('qrModalOverlay').classList.add('show');
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.getElementById('qrModalOverlay').classList.remove('show');
    }
    
    selectPresensiStatus(status) {
        // Highlight selected button
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.closest('.presensi-option').classList.add('selected');
        
        // Store selected status
        this.selectedStatus = status;
    }
    
    submitPresensi() {
        if (!this.selectedStatus) {
            this.showToast('Pilih status kehadiran terlebih dahulu', 'warning');
            return;
        }
        
        const catatan = document.getElementById('presensiCatatan').value;
        const now = new Date();
        
        const presensiRecord = {
            id: 'PRS' + Date.now(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            mapel: this.selectedMapel || 'Umum',
            status: this.selectedStatus,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('id-ID'),
            timestamp: now.toISOString(),
            catatan: catatan,
            verified: false
        };
        
        // Add to presensi data
        this.presensiData.push(presensiRecord);
        localStorage.setItem('presensi_data', JSON.stringify(this.presensiData));
        
        // Add notification
        this.addNotification('Presensi berhasil', `Anda telah melakukan presensi sebagai ${this.selectedStatus}`, 'success');
        
        // Show success message
        this.showToast('Presensi berhasil disimpan!', 'success');
        
        // Close modal
        this.closeAllModals();
        
        // Reset form
        this.selectedStatus = null;
        document.getElementById('presensiCatatan').value = '';
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Update stats
        this.updateDashboardStats();
    }
    
    showMapelPage(mapelId) {
        const mapel = this.mapelData[mapelId];
        if (!mapel) return;
        
        // Hide welcome screen
        document.getElementById('welcomeScreen').classList.remove('active');
        document.getElementById('mapelContent').innerHTML = '';
        document.getElementById('contentArea').innerHTML = '';
        
        // Create mapel page
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
            
            <div class="recent-presensi">
                <h3>Riwayat Presensi</h3>
                <div class="presensi-list">
                    <!-- Presensi history will be loaded here -->
                </div>
            </div>
        `;
        
        document.getElementById('mapelContent').appendChild(mapelPage);
        document.getElementById('mapelContent').style.display = 'block';
        
        // Update page title
        document.getElementById('pageTitle').textContent = mapel.name;
        
        // Store selected mapel for presensi
        this.selectedMapel = mapel.name;
    }
    
    showPage(page) {
        // Hide other content
        document.getElementById('welcomeScreen').classList.remove('active');
        document.getElementById('mapelContent').style.display = 'none';
        
        // Clear content area
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = '';
        
        // Show page based on selection
        switch(page) {
            case 'dashboard':
                document.getElementById('welcomeScreen').classList.add('active');
                document.getElementById('pageTitle').textContent = 'Dashboard';
                break;
                
            case 'absensi':
                this.showAbsensiPage();
                break;
                
            case 'jadwal':
                this.showJadwalPage();
                break;
                
            case 'presensi':
                this.showPresensiPage();
                break;
                
            case 'laporan':
                this.showLaporanPage();
                break;
                
            case 'rekap':
                this.showRekapPage();
                break;
        }
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
    }
    
    showAbsensiPage() {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="page-header">
                <h2><i class="fas fa-clipboard-check"></i> Absensi</h2>
                <p>Kelola dan lihat data presensi</p>
            </div>
            
            <div class="absensi-controls">
                <div class="filter-group">
                    <select id="filterMapel">
                        <option value="">Semua Mapel</option>
                        ${Object.values(this.mapelData).map(mapel => 
                            `<option value="${mapel.name}">${mapel.name}</option>`
                        ).join('')}
                    </select>
                    
                    <input type="date" id="filterDate" value="${new Date().toISOString().split('T')[0]}">
                    
                    <select id="filterStatus">
                        <option value="">Semua Status</option>
                        <option value="hadir">Hadir</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="izin">Izin</option>
                        <option value="sakit">Sakit</option>
                        <option value="alfa">Alfa</option>
                    </select>
                </div>
                
                <button class="btn-primary" onclick="app.openPresensiModal()">
                    <i class="fas fa-plus"></i>
                    Tambah Presensi
                </button>
            </div>
            
            <div class="absensi-table">
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Mapel</th>
                            <th>Status</th>
                            <th>Waktu</th>
                            <th>Catatan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="absensiTableBody">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;
        
        document.getElementById('pageTitle').textContent = 'Absensi';
        this.loadAbsensiTable();
    }
    
    loadAbsensiTable() {
        const tableBody = document.getElementById('absensiTableBody');
        if (!tableBody) return;
        
        // Filter presensi for current user
        const userPresensi = this.presensiData.filter(p => p.userId === this.currentUser.id);
        
        if (userPresensi.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>Belum ada data presensi</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        userPresensi.forEach(presensi => {
            const statusClass = this.getStatusClass(presensi.status);
            const statusText = this.getStatusText(presensi.status);
            
            html += `
                <tr>
                    <td>${new Date(presensi.date).toLocaleDateString('id-ID')}</td>
                    <td>${presensi.mapel}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${presensi.time}</td>
                    <td>${presensi.catatan || '-'}</td>
                    <td>
                        <button class="btn-small" onclick="app.editPresensi('${presensi.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    getStatusClass(status) {
        const classes = {
            hadir: 'success',
            terlambat: 'warning',
            izin: 'info',
            sakit: 'secondary',
            alfa: 'danger'
        };
        return classes[status] || 'secondary';
    }
    
    getStatusText(status) {
        const texts = {
            hadir: 'Hadir',
            terlambat: 'Terlambat',
            izin: 'Izin',
            sakit: 'Sakit',
            alfa: 'Alfa'
        };
        return texts[status] || status;
    }
    
    addNotification(title, message, type = 'info') {
        const notification = {
            id: 'NOT' + Date.now(),
            title: title,
            message: message,
            type: type,
            date: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        
        this.updateNotificationCount();
    }
    
    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        document.getElementById('notifCount').textContent = unreadCount;
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
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type === 'success' ? 'Sukses' : 
                                         type === 'error' ? 'Error' : 
                                         type === 'warning' ? 'Peringatan' : 'Info'}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="document.getElementById('${toastId}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById(toastId)) {
                toast.style.animation = 'toastSlide 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
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
            case 'camera':
                this.showToast('Fitur kamera belum tersedia', 'info');
                break;
            case 'location':
                this.showToast('Mengambil lokasi...', 'info');
                break;
            case 'emergency':
                this.showToast('Membuka form izin darurat', 'info');
                break;
        }
    }
}

// Initialize app
const app = new AbsensiApp();
window.app = app;

// Helper function for offline detection
window.addEventListener('online', () => {
    app.showToast('Koneksi internet kembali', 'success');
});

window.addEventListener('offline', () => {
    app.showToast('Anda sedang offline', 'warning');
});

// PWA Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    setTimeout(() => {
        app.showToast('Instal aplikasi untuk pengalaman lebih baik', 'info');
    }, 5000);
});
