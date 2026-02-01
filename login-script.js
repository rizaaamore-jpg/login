// JavaScript untuk Halaman Login

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
        loginForm.addEventListener('submit', handleLogin);
        
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
                nisnGroup.style.display = 'block';
                nipGroup.style.display = 'none';
                usernameGroup.style.display = 'none';
                kelasGroup.style.display = 'block';
                loginBtnText.textContent = 'Masuk sebagai Siswa';
                break;
                
            case 'guru':
                nisnGroup.style.display = 'none';
                nipGroup.style.display = 'block';
                usernameGroup.style.display = 'none';
                kelasGroup.style.display = 'none';
                loginBtnText.textContent = 'Masuk sebagai Guru';
                break;
                
            case 'admin':
                nisnGroup.style.display = 'none';
                nipGroup.style.display = 'none';
                usernameGroup.style.display = 'block';
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
    
    function handleLogin(e) {
        e.preventDefault();
        
        // Get form data based on role
        let credentials = {};
        
        switch(currentRole) {
            case 'siswa':
                credentials = {
                    role: 'siswa',
                    nisn: document.getElementById('nisn').value.trim(),
                    password: document.getElementById('password').value.trim(),
                    kelas: document.getElementById('kelas').value
                };
                
                if (!credentials.nisn || !credentials.password || !credentials.kelas) {
                    showError('Harap isi semua field untuk siswa');
                    return;
                }
                break;
                
            case 'guru':
                credentials = {
                    role: 'guru',
                    nip: document.getElementById('nip').value.trim(),
                    password: document.getElementById('password').value.trim()
                };
                
                if (!credentials.nip || !credentials.password) {
                    showError('Harap isi semua field untuk guru');
                    return;
                }
                break;
                
            case 'admin':
                credentials = {
                    role: 'admin',
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value.trim()
                };
                
                if (!credentials.username || !credentials.password) {
                    showError('Harap isi semua field untuk admin');
                    return;
                }
                break;
        }
        
        // Add remember me
        credentials.rememberMe = document.getElementById('rememberMe').checked;
        
        // Show loading
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            const isValid = validateCredentials(credentials);
            
            if (isValid) {
                // Save credentials if remember me is checked
                if (credentials.rememberMe) {
                    localStorage.setItem('savedCredentials', JSON.stringify(credentials));
                } else {
                    localStorage.removeItem('savedCredentials');
                }
                
                // Save user data
                saveUserData(credentials);
                
                // Show success and redirect
                showSuccess('Login berhasil! Mengalihkan...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                hideLoading();
                showError('NISN/NIP/Username atau password salah');
            }
        }, 1500);
    }
    
    function validateCredentials(credentials) {
        // Mock validation - in real app, this would be API call
        
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
    
    function saveUserData(credentials) {
        // Mock user data based on credentials
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
        
        localStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('isLoggedIn', 'true');
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
                        document.getElementById('nisn').value = credentials.nisn;
                        document.getElementById('password').value = credentials.password;
                        if (credentials.kelas) {
                            document.getElementById('kelas').value = credentials.kelas;
                        }
                        break;
                        
                    case 'guru':
                        document.getElementById('nip').value = credentials.nip;
                        document.getElementById('password').value = credentials.password;
                        break;
                        
                    case 'admin':
                        document.getElementById('username').value = credentials.username;
                        document.getElementById('password').value = credentials.password;
                        break;
                }
                
                document.getElementById('rememberMe').checked = true;
            } catch (e) {
                console.error('Error loading saved credentials:', e);
            }
        }
    }
    
    function showForgotPassword() {
        const roleName = currentRole === 'siswa' ? 'Siswa' : currentRole === 'guru' ? 'Guru' : 'Admin';
        const contact = currentRole === 'siswa' ? 'Wali Kelas' : 'Administrator Sekolah';
        
        alert(`Lupa Password - ${roleName}\n\nSilakan hubungi ${contact} untuk reset password:\n\n📞 Telepon: (021) 1234-5678\n📧 Email: admin@smkjaktim1.sch.id\n\nPastikan membawa bukti identitas yang valid.`);
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
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(successMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function showError(message) {
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
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorMsg.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => errorMsg.remove(), 300);
        }, 3000);
    }
});
