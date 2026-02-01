// JavaScript untuk Halaman Login - FIXED

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const roleButtons = document.querySelectorAll('.role-btn');
    const loginForm = document.getElementById('loginForm');
    const nisnGroup = document.getElementById('nisnGroup');
    const nipGroup = document.getElementById('nipGroup');
    const usernameGroup = document.getElementById('usernameGroup');
    const kelasGroup = document.getElementById('kelasGroup');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtnText = document.getElementById('loginBtnText');
    const demoItems = document.querySelectorAll('.demo-item');
    
    let currentRole = 'siswa';
    
    // Initialize
    initLoginPage();
    
    function initLoginPage() {
        setupEventListeners();
        loadSavedCredentials();
    }
    
    function setupEventListeners() {
        // Role selection
        roleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                changeRole(this.dataset.role);
            });
        });
        
        // Toggle password visibility
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        // Form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
        
        // Demo account click
        demoItems.forEach(item => {
            item.addEventListener('click', function() {
                fillDemoCredentials(this);
            });
        });
        
        // Forgot password
        document.getElementById('forgotPassword').addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPassword();
        });
        
        // Register link
        document.getElementById('registerLink').addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterInfo();
        });
        
        // Help link
        document.getElementById('helpLink').addEventListener('click', function(e) {
            e.preventDefault();
            showHelp();
        });
    }
    
    function changeRole(role) {
        // Update active button
        roleButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-role="${role}"]`).classList.add('active');
        
        // Update current role
        currentRole = role;
        
        // Update form fields visibility
        switch(role) {
            case 'siswa':
                nisnGroup.style.display = 'flex';
                nipGroup.style.display = 'none';
                usernameGroup.style.display = 'none';
                kelasGroup.style.display = 'flex';
                loginBtnText.textContent = 'Masuk sebagai Siswa';
                break;
                
            case 'guru':
                nisnGroup.style.display = 'none';
                nipGroup.style.display = 'flex';
                usernameGroup.style.display = 'none';
                kelasGroup.style.display = 'none';
                loginBtnText.textContent = 'Masuk sebagai Guru';
                break;
                
            case 'admin':
                nisnGroup.style.display = 'none';
                nipGroup.style.display = 'none';
                usernameGroup.style.display = 'flex';
                kelasGroup.style.display = 'none';
                loginBtnText.textContent = 'Masuk sebagai Admin';
                break;
        }
        
        // Clear form
        loginForm.reset();
    }
    
    function fillDemoCredentials(demoElement) {
        const role = demoElement.dataset.role;
        
        // Change role first
        changeRole(role);
        
        // Fill credentials
        switch(role) {
            case 'siswa':
                document.getElementById('nisn').value = demoElement.dataset.nisn;
                document.getElementById('password').value = demoElement.dataset.password;
                document.getElementById('kelas').value = demoElement.dataset.kelas;
                break;
                
            case 'guru':
                document.getElementById('nip').value = demoElement.dataset.nip;
                document.getElementById('password').value = demoElement.dataset.password;
                break;
                
            case 'admin':
                document.getElementById('username').value = demoElement.dataset.username;
                document.getElementById('password').value = demoElement.dataset.password;
                break;
        }
        
        // Highlight the demo item briefly
        demoElement.style.backgroundColor = '#e3f2fd';
        setTimeout(() => {
            demoElement.style.backgroundColor = '';
        }, 1000);
    }
    
    function handleLogin() {
        // Get form data based on role
        let credentials = {};
        let isValid = true;
        let errorMessage = '';
        
        switch(currentRole) {
            case 'siswa':
                const nisn = document.getElementById('nisn').value.trim();
                const password = document.getElementById('password').value.trim();
                const kelas = document.getElementById('kelas').value;
                
                if (!nisn) {
                    isValid = false;
                    errorMessage = 'NISN harus diisi';
                } else if (!password) {
                    isValid = false;
                    errorMessage = 'Password harus diisi';
                } else if (!kelas) {
                    isValid = false;
                    errorMessage = 'Pilih kelas';
                } else {
                    credentials = {
                        role: 'siswa',
                        nisn: nisn,
                        password: password,
                        kelas: kelas
                    };
                }
                break;
                
            case 'guru':
                const nip = document.getElementById('nip').value.trim();
                const guruPassword = document.getElementById('password').value.trim();
                
                if (!nip) {
                    isValid = false;
                    errorMessage = 'NIP harus diisi';
                } else if (!guruPassword) {
                    isValid = false;
                    errorMessage = 'Password harus diisi';
                } else {
                    credentials = {
                        role: 'guru',
                        nip: nip,
                        password: guruPassword
                    };
                }
                break;
                
            case 'admin':
                const username = document.getElementById('username').value.trim();
                const adminPassword = document.getElementById('password').value.trim();
                
                if (!username) {
                    isValid = false;
                    errorMessage = 'Username harus diisi';
                } else if (!adminPassword) {
                    isValid = false;
                    errorMessage = 'Password harus diisi';
                } else {
                    credentials = {
                        role: 'admin',
                        username: username,
                        password: adminPassword
                    };
                }
                break;
        }
        
        if (!isValid) {
            showError(errorMessage);
            return;
        }
        
        // Add remember me
        credentials.rememberMe = document.getElementById('rememberMe').checked;
        
        // Show loading
        showLoading();
        
        // Simulate API call with timeout
        setTimeout(() => {
            const loginSuccessful = validateLogin(credentials);
            
            if (loginSuccessful) {
                // Save credentials if remember me is checked
                if (credentials.rememberMe) {
                    localStorage.setItem('savedCredentials', JSON.stringify(credentials));
                } else {
                    localStorage.removeItem('savedCredentials');
                }
                
                // Save user data
                const userData = getUserDataByCredentials(credentials);
                localStorage.setItem('userData', JSON.stringify(userData));
                sessionStorage.setItem('isLoggedIn', 'true');
                
                // Show success and redirect
                showSuccess('Login berhasil! Mengalihkan...');
                
                setTimeout(() => {
                    // Redirect based on role
                    if (credentials.role === 'siswa') {
                        window.location.href = 'dashboard-siswa.html';
                    } else if (credentials.role === 'guru') {
                        window.location.href = 'dashboard-guru.html';
                    } else if (credentials.role === 'admin') {
                        window.location.href = 'dashboard-admin.html';
                    }
                }, 1500);
            } else {
                hideLoading();
                showError('Login gagal. Periksa kembali NISN/NIP/Username dan password Anda.');
            }
        }, 1500);
    }
    
    function validateLogin(credentials) {
        // Mock validation - simple check
        if (credentials.role === 'siswa') {
            // Demo siswa: NISN 2024001, password siswa123
            return credentials.nisn === '2024001' && credentials.password === 'siswa123';
        }
        else if (credentials.role === 'guru') {
            // Demo guru: NIP 101, password guru123
            return credentials.nip === '101' && credentials.password === 'guru123';
        }
        else if (credentials.role === 'admin') {
            // Demo admin: username admin, password admin123
            return credentials.username === 'admin' && credentials.password === 'admin123';
        }
        
        return false;
    }
    
    function getUserDataByCredentials(credentials) {
        let userData = {};
        
        switch(credentials.role) {
            case 'siswa':
                userData = {
                    id: credentials.nisn,
                    name: 'Ahmad Budi Santoso',
                    role: 'siswa',
                    kelas: credentials.kelas,
                    nisn: credentials.nisn,
                    avatar: '👨‍🎓'
                };
                break;
                
            case 'guru':
                userData = {
                    id: credentials.nip,
                    name: 'Dr. Wahyu Setiawan, M.Pd',
                    role: 'guru',
                    nip: credentials.nip,
                    avatar: '👨‍🏫'
                };
                break;
                
            case 'admin':
                userData = {
                    id: credentials.username,
                    name: 'Administrator Sistem',
                    role: 'admin',
                    username: credentials.username,
                    avatar: '👨‍💼'
                };
                break;
        }
        
        return userData;
    }
    
    function loadSavedCredentials() {
        const saved = localStorage.getItem('savedCredentials');
        if (saved) {
            try {
                const credentials = JSON.parse(saved);
                changeRole(credentials.role);
                
                // Fill saved credentials
                switch(credentials.role) {
                    case 'siswa':
                        document.getElementById('nisn').value = credentials.nisn || '';
                        document.getElementById('password').value = credentials.password || '';
                        if (credentials.kelas) {
                            document.getElementById('kelas').value = credentials.kelas;
                        }
                        break;
                        
                    case 'guru':
                        document.getElementById('nip').value = credentials.nip || '';
                        document.getElementById('password').value = credentials.password || '';
                        break;
                        
                    case 'admin':
                        document.getElementById('username').value = credentials.username || '';
                        document.getElementById('password').value = credentials.password || '';
                        break;
                }
                
                document.getElementById('rememberMe').checked = true;
            } catch (e) {
                console.error('Error loading saved credentials:', e);
                localStorage.removeItem('savedCredentials');
            }
        }
    }
    
    function showForgotPassword() {
        const roleName = currentRole === 'siswa' ? 'Siswa' : currentRole === 'guru' ? 'Guru' : 'Admin';
        const contact = currentRole === 'siswa' ? 'Wali Kelas' : 'Administrator Sekolah';
        
        alert(`🔐 Lupa Password - ${roleName}\n\nSilakan hubungi ${contact} untuk reset password:\n\n📞 Telepon: (021) 1234-5678\n📧 Email: admin@smkjaktim1.sch.id\n\n📍 Lokasi: Ruang Tata Usaha\n\n⚠️ Pastikan membawa bukti identitas yang valid.`);
    }
    
    function showRegisterInfo() {
        alert(`📝 Informasi Pendaftaran\n\nUntuk mendaftar sebagai:\n\n👨‍🎓 Siswa: Hubungi bagian Penerimaan Siswa Baru\n👨‍🏫 Guru: Kirim lamaran ke HRD sekolah\n👨‍💼 Admin: Hanya untuk staf IT sekolah\n\n📧 Email: psb@smkjaktim1.sch.id\n📞 Telp: (021) 1234-5678 ext. 101`);
    }
    
    function showHelp() {
        alert(`❓ Bantuan Login\n\nMasalah yang umum:\n\n1. Lupa password → Klik "Lupa password?"\n2. Akun terkunci → Hubungi admin\n3. NISN/NIP salah → Periksa kartu identitas\n4. Browser error → Coba browser lain\n5. Koneksi internet → Periksa koneksi\n\n🛠️ Support: helpdesk@smkjaktim1.sch.id`);
    }
    
    function showLoading() {
        const loginBtn = document.querySelector('.login-btn');
        const originalHTML = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        loginBtn.disabled = true;
        
        // Store original HTML to restore later
        loginBtn.dataset.original = originalHTML;
    }
    
    function hideLoading() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn.dataset.original) {
            loginBtn.innerHTML = loginBtn.dataset.original;
        }
        loginBtn.disabled = false;
    }
    
    function showSuccess(message) {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert success';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(successMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
    }
    
    function showError(message) {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        // Create error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert error';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(errorMsg);
        
        // Remove after 4 seconds
        setTimeout(() => {
            errorMsg.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => errorMsg.remove(), 300);
        }, 4000);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* Additional form group styles */
        .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 1.25rem;
        }
        
        .form-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #495057;
        }
        
        .password-input {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.25rem;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);
});
