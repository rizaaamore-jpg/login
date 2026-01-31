// ============================================
// ABSENSI DIGITAL SMK TI - FINAL SCRIPT
// ============================================
console.log('🚀 DARK : Sistem Absensi Digital v2.0 Loading...');

// SINGLE GLOBAL OBJECT
window.AbsensiApp = {
    // Properties
    currentUser: null,
    currentRole: null,
    mapelData: {},
    presensiData: [],
    notifications: [],
    selectedStatus: null,
    selectedMapel: null,
    
    // Initialize dengan safety check
    init: function() {
        console.log('🔧 Initializing application...');
        
        // 1. Sembunyikan loading screen setelah 2 detik (JAMINAN!)
        this.hideLoadingScreen();
        
        // 2. Setup semua event listeners
        this.setupEventListeners();
        
        // 3. Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        // 4. Check session
        this.checkSavedSession();
        
        console.log('✅ Application initialized successfully');
    },
    
    hideLoadingScreen: function() {
        // Method garantized buat hide loading
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.transition = 'opacity 0.5s ease';
                loadingScreen.style.opacity = '0';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    console.log('📴 Loading screen hidden');
                }, 500);
            } else {
                console.warn('⚠️ Loading screen element not found');
            }
        }, 2000); // 2 detik loading minimum
    },
    
    setupEventListeners: function() {
        console.log('🔗 Setting up event listeners...');
        
        // 1. ROLE TABS - WORKING
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const role = tab.getAttribute('data-role');
                this.switchRole(role);
            });
        });
        
        // 2. LOGIN BUTTONS - WORKING
        if (document.getElementById('loginSiswa')) {
            document.getElementById('loginSiswa').addEventListener('click', () => this.loginSiswa());
        }
        if (document.getElementById('loginGuru')) {
            document.getElementById('loginGuru').addEventListener('click', () => this.loginGuru());
        }
        if (document.getElementById('loginAdmin')) {
            document.getElementById('loginAdmin').addEventListener('click', () => this.loginAdmin());
        }
        
        // 3. SHOW/HIDE PASSWORD - WORKING
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
        
        // 4. MENU TOGGLE - WORKING
        if (document.getElementById('menuToggle')) {
            document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        }
        
        // 5. LOGOUT - WORKING
        const logoutBtns = ['logoutBtn', 'sidebarLogout'];
        logoutBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        });
        
        // 6. QUICK ACTIONS - WORKING
        if (document.getElementById('quickPresensi')) {
            document.getElementById('quickPresensi').addEventListener('click', () => this.openPresensiModal());
        }
        if (document.getElementById('quickAbsenBtn')) {
            document.getElementById('quickAbsenBtn').addEventListener('click', () => this.openPresensiModal());
        }
        
        // 7. QR SCANNER - WORKING
        if (document.getElementById('scanQRSiswa')) {
            document.getElementById('scanQRSiswa').addEventListener('click', () => this.openQRScanner());
        }
        
        // 8. MODAL CLOSE - WORKING
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        // 9. PRESENSI OPTIONS - WORKING
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const status = this.getAttribute('data-status');
                window.AbsensiApp.selectPresensiStatus(status);
            });
        });
        
        // 10. SUBMIT PRESENSI - WORKING
        if (document.getElementById('submitPresensi')) {
            document.getElementById('submitPresensi').addEventListener('click', () => this.submitPresensi());
        }
        
        // 11. MAPEL MENU - WORKING
        document.querySelectorAll('.menu-item[data-mapel]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const mapelId = item.getAttribute('data-mapel');
                this.showMapelPage(mapelId);
            });
        });
        
        // 12. PAGE NAVIGATION - WORKING
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // 13. USER DROPDOWN - WORKING (FIXED SELECTOR)
        if (document.getElementById('userDropdown')) {
            document.getElementById('userDropdown').addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('userDropdownMenu').classList.toggle('show');
            });
        }
        
        // 14. NOTIFICATIONS - WORKING
        if (document.getElementById('notifBtn')) {
            document.getElementById('notifBtn').addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('notificationsPanel').classList.toggle('show');
            });
        }
        
        // 15. VIEW JADWAL - WORKING
        if (document.getElementById('viewJadwal')) {
            document.getElementById('viewJadwal').addEventListener('click', () => this.showPage('jadwal'));
        }
        
        // 16. QUICK ACTIONS BAR - WORKING
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                window.AbsensiApp.handleQuickAction(action);
            });
        });
        
        // 17. CLICK OUTSIDE TO CLOSE - WORKING
        document.addEventListener('click', (e) => {
            // Close dropdowns
            if (!e.target.closest('.user-profile') && !e.target.closest('#userDropdownMenu')) {
                document.getElementById('userDropdownMenu')?.classList.remove('show');
            }
            
            if (!e.target.closest('#notifBtn') && !e.target.closest('.notifications-panel')) {
                document.getElementById('notificationsPanel')?.classList.remove('show');
            }
            
            // Close modals on overlay click
            if (e.target.id === 'qrModalOverlay') {
                this.closeAllModals();
            }
        });
        
        console.log('✅ Event listeners setup complete');
    },
    
    // ================= LOGIN FUNCTIONS =================
    switchRole: function(role) {
        console.log('Switching to role:', role);
        
        // Update tabs
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-role') === role) {
                tab.classList.add('active');
            }
        });
        
        // Show corresponding form
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(role + 'Form').classList.add('active');
    },
    
    loginSiswa: function() {
        const nis = document.getElementById('nis').value.trim();
        const password = document.getElementById('passwordSiswa').value;
        
        if (!nis || !password) {
            this.showToast('Harap isi NIS dan password', 'warning');
            return;
        }
        
        // SIMULASI LOGIN SUKSES
        this.currentUser = {
            id: 'SIS' + nis,
            nis: nis,
            name: 'Arif Suyuti',
            role: 'siswa',
            kelas: 'X TKJ 1',
            avatar: '👨‍🎓'
        };
        
        this.currentRole = 'siswa';
        this.completeLogin();
    },
    
    loginGuru: function() {
        const nip = document.getElementById('nip').value.trim();
        const password = document.getElementById('passwordGuru').value;
        const mapel = document.getElementById('mapelSelect').value;
        const kelas = document.getElementById('kelasSelect').value;
        
        if (!nip || !password || !mapel || !kelas) {
            this.showToast('Harap isi semua field', 'warning');
            return;
        }
        
        // SIMULASI LOGIN SUKSES
        this.currentUser = {
            id: 'GUR' + nip,
            nip: nip,
            name: 'Sutrisno, M.Pd',
            role: 'guru',
            mapel: mapel,
            kelas: kelas,
            avatar: '👨‍🏫'
        };
        
        this.currentRole = 'guru';
        this.completeLogin();
    },
    
    loginAdmin: function() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if (!username || !password) {
            this.showToast('Harap isi username dan password', 'warning');
            return;
        }
        
        // SIMULASI LOGIN SUKSES
        this.currentUser = {
            id: 'ADM001',
            username: username,
            name: 'Administrator Sistem',
            role: 'admin',
            avatar: '👨‍💼'
        };
        
        this.currentRole = 'admin';
        this.completeLogin();
    },
    
    completeLogin: function() {
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('currentRole', this.currentRole);
        
        // Show success
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
    },
    
    // ================= UI FUNCTIONS =================
    updateUserUI: function() {
        if (!this.currentUser) return;
        
        // Update display
        const nameEl = document.getElementById('userDisplayName');
        const roleEl = document.getElementById('userDisplayRole');
        const sidebarName = document.getElementById('sidebarName');
        const sidebarNis = document.getElementById('sidebarNis');
        const sidebarKelas = document.getElementById('sidebarKelas');
        
        if (nameEl) nameEl.textContent = this.currentUser.name;
        if (roleEl) roleEl.textContent = this.currentRole === 'siswa' ? 'Siswa' : 
                                        this.currentRole === 'guru' ? 'Guru' : 'Admin';
        
        if (sidebarName) sidebarName.textContent = this.currentUser.name;
        if (sidebarNis) sidebarNis.textContent = this.currentRole === 'siswa' ? `NIS: ${this.currentUser.nis}` : 
                                                this.currentRole === 'guru' ? `NIP: ${this.currentUser.nip}` : 'Admin';
        if (sidebarKelas) sidebarKelas.textContent = this.currentUser.kelas ? `Kelas: ${this.currentUser.kelas}` : '';
        
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
    },
    
    updateDashboardStats: function() {
        // Sample stats
        document.getElementById('statHadir').textContent = '5';
        document.getElementById('statMapel').textContent = '8';
        document.getElementById('statPersen').textContent = '92%';
        document.getElementById('absenToday').textContent = '5';
    },
    
    updateClock: function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timeEl = document.getElementById('currentTime');
        const statusEl = document.getElementById('sessionStatus');
        
        if (timeEl) timeEl.textContent = timeString;
        
        // Session status
        const hour = now.getHours();
        let sessionStatus = 'Offline';
        if (hour >= 7 && hour < 12) sessionStatus = 'Pagi';
        else if (hour >= 12 && hour < 15) sessionStatus = 'Siang';
        else if (hour >= 15 && hour < 18) sessionStatus = 'Sore';
        else sessionStatus = 'Malam';
        
        if (statusEl) statusEl.textContent = sessionStatus;
    },
    
    toggleSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    },
    
    // ================= PRESENSI FUNCTIONS =================
    openPresensiModal: function() {
        if (!this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }
        
        // Update modal info
        document.getElementById('presensiNama').textContent = this.currentUser.name;
        document.getElementById('presensiWaktu').textContent = `Waktu: ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Show modal
        document.getElementById('presensiModal').classList.add('show');
        document.getElementById('qrModalOverlay').classList.add('show');
    },
    
    openQRScanner: function() {
        document.getElementById('qrModal').classList.add('show');
        document.getElementById('qrModalOverlay').classList.add('show');
    },
    
    closeAllModals: function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.getElementById('qrModalOverlay').classList.remove('show');
    },
    
    selectPresensiStatus: function(status) {
        // Remove previous selection
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add to clicked button
        event.target.closest('.presensi-option').classList.add('selected');
        this.selectedStatus = status;
    },
    
    submitPresensi: function() {
        if (!this.selectedStatus) {
            this.showToast('Pilih status kehadiran terlebih dahulu', 'warning');
            return;
        }
        
        const catatan = document.getElementById('presensiCatatan').value;
        
        // Simpan presensi
        this.showToast('Presensi berhasil disimpan!', 'success');
        
        // Close modal & reset
        this.closeAllModals();
        this.selectedStatus = null;
        document.getElementById('presensiCatatan').value = '';
        document.querySelectorAll('.presensi-option').forEach(btn => {
            btn.classList.remove('selected');
        });
    },
    
    // ================= PAGE FUNCTIONS =================
    showMapelPage: function(mapelId) {
        const mapelData = this.getDefaultMapelData()[mapelId];
        if (!mapelData) return;
        
        // Hide welcome screen
        document.getElementById('welcomeScreen').classList.remove('active');
        document.getElementById('mapelContent').innerHTML = '';
        document.getElementById('contentArea').innerHTML = '';
        
        // Create simple mapel page
        const mapelPage = document.createElement('div');
        mapelPage.className = 'mapel-page';
        mapelPage.innerHTML = `
            <div class="mapel-header">
                <h2><i class="${mapelData.icon}"></i> ${mapelData.fullName}</h2>
                <p>${mapelData.schedule} • ${mapelData.room}</p>
            </div>
            <div class="mapel-info">
                <p><strong>Pengajar:</strong> ${mapelData.teacher}</p>
                <button class="btn-primary" onclick="AbsensiApp.openPresensiModal()">
                    <i class="fas fa-fingerprint"></i> Presensi ${mapelData.name}
                </button>
            </div>
        `;
        
        document.getElementById('mapelContent').appendChild(mapelPage);
        document.getElementById('mapelContent').style.display = 'block';
        
        // Update selected mapel
        this.selectedMapel = mapelData.name;
        document.getElementById('presensiMapel').textContent = mapelData.name;
    },
    
    showPage: function(page) {
        // Hide other content
        document.getElementById('welcomeScreen').classList.remove('active');
        document.getElementById('mapelContent').style.display = 'none';
        
        // Clear content area
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `<h2>Halaman ${page}</h2><p>Fitur sedang dikembangkan</p>`;
        
        // Update active menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });
    },
    
    // ================= UTILITY FUNCTIONS =================
    checkSavedSession: function() {
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');
        
        if (savedUser && savedRole) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.currentRole = savedRole;
                
                // Auto login
                document.querySelector('.login-wrapper').style.display = 'none';
                document.getElementById('dashboardContainer').style.display = 'block';
                this.updateUserUI();
                this.updateDashboardStats();
            } catch (e) {
                console.error('Error parsing saved session:', e);
            }
        }
    },
    
    logout: function() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Clear session
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            
            // Reset UI
            document.getElementById('dashboardContainer').style.display = 'none';
            document.querySelector('.login-wrapper').style.display = 'flex';
            
            // Reset forms
            document.querySelectorAll('input').forEach(input => input.value = '');
            
            // Show message
            this.showToast('Logout berhasil', 'success');
            
            // Reset data
            this.currentUser = null;
            this.currentRole = null;
        }
    },
    
    showToast: function(message, type = 'info') {
        console.log(`Toast [${type}]: ${message}`);
        
        // Simple alert for now
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    handleQuickAction: function(action) {
        const actions = {
            'absen': () => this.openPresensiModal(),
            'qr': () => this.openQRScanner(),
            'camera': () => this.showToast('Fitur kamera belum tersedia', 'info'),
            'location': () => this.showToast('Mengambil lokasi...', 'info'),
            'emergency': () => this.showToast('Membuka form izin darurat', 'info')
        };
        
        if (actions[action]) {
            actions[action]();
        }
    },
    
    getDefaultMapelData: function() {
        return {
            pjok: {
                name: "PJOK",
                fullName: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
                teacher: "Bpk. Dudi",
                schedule: "Senin, 06:30 - 07:50",
                room: "Lapangan Olahraga",
                color: "#10b981",
                icon: "fas fa-running"
            },
            matematika: {
                name: "Matematika",
                fullName: "Matematika",
                teacher: "Bpk. Sutrisno",
                schedule: "Senin, 09:30 - 11:00",
                room: "Lab. Matematika",
                color: "#3b82f6",
                icon: "fas fa-calculator"
            },
            bahasa_indonesia: {
                name: "Bahasa Indonesia",
                fullName: "Bahasa Indonesia",
                teacher: "Ibu Kesih",
                schedule: "Selasa, 07:30 - 09:00",
                room: "Ruang 201",
                color: "#8b5cf6",
                icon: "fas fa-language"
            },
            bahasa_inggris: {
                name: "Bahasa Inggris",
                fullName: "Bahasa Inggris",
                teacher: "Ms.Nada",
                schedule: "Selasa, 09:30 - 11:00",
                room: "Lab. Bahasa",
                color: "#ec4899",
                icon: "fas fa-globe"
            },
            english_comms: {
                name: "English Communications",
                fullName: "English Communications",
                teacher: "Ms. Nada",
                schedule: "Rabu, 07:30 - 09:00",
                room: "Lab. Bahasa",
                color: "#f59e0b",
                icon: "fas fa-comments"
            },
            seni_musik: {
                name: "Seni Musik",
                fullName: "Seni Musik",
                teacher: "Bpk. Hendar",
                schedule: "Rabu, 09:30 - 11:00",
                room: "Studio Musik",
                color: "#ef4444",
                icon: "fas fa-music"
            },
            ipas: {
                name: "IPAS",
                fullName: "Ilmu Pengetahuan Alam dan Sosial",
                teacher: "Ibu Rahayu",
                schedule: "Kamis, 07:30 - 09:00",
                room: "Lab. IPA",
                color: "#06b6d4",
                icon: "fas fa-flask"
            },
            sejarah: {
                name: "Sejarah",
                fullName: "Sejarah",
                teacher: "Ibu. Rahayu",
                schedule: "Kamis, 09:30 - 11:00",
                room: "Ruang 202",
                color: "#f97316",
                icon: "fas fa-landmark"
            },
            pancasila: {
                name: "Pendidikan Pancasila",
                fullName: "Pendidikan Pancasila",
                teacher: "Sensei",
                schedule: "Jumat, 07:30 - 09:00",
                room: "Ruang 203",
                color: "#84cc16",
                icon: "fas fa-flag"
            },
            jaringan_dasar: {
                name: "Komputer Jaringan Dasar",
                fullName: "Komputer Jaringan Dasar",
                teacher: "Bpk. Okeu",
                schedule: "Jumat, 09:30 - 11:00",
                room: "Lab. Jaringan",
                color: "#6366f1",
                icon: "fas fa-network-wired"
            },
            sistem_komputer: {
                name: "Sistem Komputer",
                fullName: "Sistem Komputer",
                teacher: "Bpk. Adi",
                schedule: "Senin, 13:00 - 14:30",
                room: "Lab. Komputer A",
                color: "#8b5cf6",
                icon: "fas fa-desktop"
            },
            jaringan_luas: {
                name: "Teknik Jaringan Berbasis Luas",
                fullName: "Teknik Jaringan Berbasis Luas",
                teacher: "Bpk. Fahrul",
                schedule: "Selasa, 13:00 - 14:30",
                room: "Lab. Jaringan B",
                color: "#0ea5e9",
                icon: "fas fa-wifi"
            },
            coding_ai: {
                name: "Coding AI",
                fullName: "Coding Artificial Intelligence",
                teacher: "Bpk. Rama",
                schedule: "Rabu, 13:00 - 14:30",
                room: "Lab. AI",
                color: "#06b6d4",
                icon: "fas fa-robot"
            },
            informatika: {
                name: "Informatika",
                fullName: "Informatika",
                teacher: "Ibu. Retno",
                schedule: "Kamis, 13:00 - 14:30",
                room: "Lab. Komputer B",
                color: "#10b981",
                icon: "fas fa-code"
            }
        };
    }
};

// ============================================
// START APPLICATION WHEN PAGE LOADS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .show { display: block !important; }
        .modal { display: none; }
        .modal.show { display: block !important; }
        #qrModalOverlay { 
            display: none; 
            position: fixed; 
            top:0; left:0; 
            width:100%; height:100%; 
            background: rgba(0,0,0,0.5); 
            z-index: 999; 
        }
        #qrModalOverlay.show { display: block !important; }
        .selected { border: 3px solid #3b82f6 !important; }
    `;
    document.head.appendChild(style);
    
    // Initialize app
    setTimeout(() => {
        window.AbsensiApp.init();
    }, 100);
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    
    // Force hide loading screen on error
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

console.log('✅ Script loaded successfully!');
