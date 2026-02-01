// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // State Management
    let currentUser = null;
    let attendanceData = [];
    let isLoggedIn = false;
    let checkInTime = null;

    // DOM Elements
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('loginForm');
    const roleButtons = document.querySelectorAll('.role-btn');
    const kelasGroup = document.getElementById('kelasGroup');
    const greetingName = document.getElementById('greetingName');
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    const manualAttendanceBtn = document.getElementById('manualAttendanceBtn');
    const manualAttendanceModal = document.getElementById('manualAttendanceModal');
    const manualAttendanceForm = document.getElementById('manualAttendanceForm');
    const toggleQrBtn = document.getElementById('toggleQrBtn');
    const qrScanner = document.getElementById('qrScanner');
    const attendanceHistory = document.getElementById('attendanceHistory');
    const todayStatus = document.getElementById('todayStatus');
    const attendanceTime = document.getElementById('attendanceTime');
    const userDashboard = document.getElementById('userDashboard');
    const adminDashboard = document.getElementById('adminDashboard');

    // Initialize
    initApp();

    function initApp() {
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        loadUserData();
        setupEventListeners();
        checkTodayAttendance();
    }

    // Event Listeners
    function setupEventListeners() {
        // Role selection
        roleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                roleButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                if (this.dataset.role === 'siswa') {
                    kelasGroup.style.display = 'block';
                } else {
                    kelasGroup.style.display = 'none';
                }
            });
        });

        // Login form
        loginForm.addEventListener('submit', handleLogin);

        // Attendance buttons
        checkInBtn.addEventListener('click', handleCheckIn);
        checkOutBtn.addEventListener('click', handleCheckOut);
        manualAttendanceBtn.addEventListener('click', () => showModal('manualAttendanceModal'));

        // Manual attendance form
        manualAttendanceForm.addEventListener('submit', handleManualAttendance);

        // QR Scanner toggle
        toggleQrBtn.addEventListener('click', toggleQrScanner);

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
    }

    // Update date and time
    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.textContent = now.toLocaleDateString('id-ID', options);
        currentTime.textContent = now.toLocaleTimeString('id-ID');
    }

    // Login handler
    async function handleLogin(e) {
        e.preventDefault();
        
        const nisn = document.getElementById('nisn').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('.role-btn.active').dataset.role;
        const kelas = role === 'siswa' ? document.getElementById('kelas').value : null;

        if (role === 'siswa' && !kelas) {
            showNotification('Pilih kelas terlebih dahulu', 'error');
            return;
        }

        // Simulate API call
        showNotification('Memproses login...', 'info');
        
        setTimeout(() => {
            // Mock user data
            currentUser = {
                id: nisn,
                name: role === 'siswa' ? `Siswa ${nisn}` : role === 'guru' ? `Guru ${nisn}` : 'Admin',
                role: role,
                kelas: kelas,
                nisn: nisn
            };

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            isLoggedIn = true;
            
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            
            if (role === 'admin') {
                userDashboard.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadAdminData();
            } else {
                userDashboard.style.display = 'block';
                adminDashboard.style.display = 'none';
                loadUserDashboard();
            }
            
            greetingName.textContent = currentUser.name;
            showNotification('Login berhasil!', 'success');
            
            // Load attendance data
            loadAttendanceData();
        }, 1000);
    }

    // Load user data from localStorage
    function loadUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            
            if (currentUser.role === 'admin') {
                userDashboard.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadAdminData();
            } else {
                userDashboard.style.display = 'block';
                adminDashboard.style.display = 'none';
                loadUserDashboard();
            }
            
            greetingName.textContent = currentUser.name;
            loadAttendanceData();
        }
    }

    // Load user dashboard data
    function loadUserDashboard() {
        // Mock attendance data
        const mockData = [
            { date: '2024-01-15', type: 'hadir', time: '07:30', status: 'Tepat waktu' },
            { date: '2024-01-14', type: 'hadir', time: '07:45', status: 'Terlambat' },
            { date: '2024-01-13', type: 'sakit', time: '-', status: 'Sakit' },
            { date: '2024-01-12', type: 'hadir', time: '07:25', status: 'Tepat waktu' },
            { date: '2024-01-11', type: 'izin', time: '-', status: 'Izin' }
        ];

        attendanceData = mockData;
        updateStats();
        updateAttendanceHistory();
    }

    // Update statistics
    function updateStats() {
        const presentCount = attendanceData.filter(a => a.type === 'hadir').length;
        const lateCount = attendanceData.filter(a => a.status === 'Terlambat').length;
        const absentCount = attendanceData.filter(a => a.type === 'alpha').length;
        const totalDays = 20; // Mock total days
        const percentage = Math.round((presentCount / totalDays) * 100);

        document.getElementById('presentCount').textContent = presentCount;
        document.getElementById('absentCount').textContent = absentCount;
        document.getElementById('lateCount').textContent = lateCount;
        document.getElementById('attendancePercentage').textContent = percentage + '%';
    }

    // Check today's attendance
    function checkTodayAttendance() {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = attendanceData.find(a => a.date === today);
        
        if (todayRecord) {
            todayStatus.textContent = `Status: ${todayRecord.type}`;
            attendanceTime.textContent = `Waktu: ${todayRecord.time}`;
            checkInBtn.disabled = true;
            
            if (todayRecord.type === 'hadir') {
                checkOutBtn.disabled = false;
            }
        } else {
            todayStatus.textContent = 'Status: Belum absen';
            attendanceTime.textContent = '-';
        }
    }

    // Handle check in
    function handleCheckIn() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let status = 'Tepat waktu';
        if (currentHour > 7 || (currentHour === 7 && currentMinute > 30)) {
            status = 'Terlambat';
        }

        const attendanceRecord = {
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            type: 'hadir',
            status: status
        };

        attendanceData.unshift(attendanceRecord);
        
        todayStatus.textContent = `Status: ${attendanceRecord.type}`;
        attendanceTime.textContent = `Waktu: ${attendanceRecord.time}`;
        checkInBtn.disabled = true;
        checkOutBtn.disabled = false;
        
        checkInTime = now;
        
        showNotification('Check in berhasil!', 'success');
        updateStats();
        updateAttendanceHistory();
        
        // Save to localStorage (simulate)
        saveAttendanceData();
    }

    // Handle check out
    function handleCheckOut() {
        if (!checkInTime) return;
        
        const now = new Date();
        const checkOutTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        const todayIndex = attendanceData.findIndex(a => 
            a.date === new Date().toISOString().split('T')[0]
        );
        
        if (todayIndex !== -1) {
            attendanceData[todayIndex].checkOut = checkOutTime;
        }
        
        checkOutBtn.disabled = true;
        showNotification('Check out berhasil!', 'success');
        
        // Save to localStorage
        saveAttendanceData();
    }

    // Handle manual attendance
    function handleManualAttendance(e) {
        e.preventDefault();
        
        const type = document.getElementById('manualType').value;
        const date = document.getElementById('manualDate').value;
        const note = document.getElementById('manualNote').value;
        
        const attendanceRecord = {
            date: date,
            time: '-',
            type: type,
            status: note || type,
            note: note
        };
        
        attendanceData.unshift(attendanceRecord);
        
        showNotification('Absen manual berhasil disimpan', 'success');
        manualAttendanceModal.style.display = 'none';
        manualAttendanceForm.reset();
        
        updateStats();
        updateAttendanceHistory();
        saveAttendanceData();
    }

    // Update attendance history display
    function updateAttendanceHistory() {
        attendanceHistory.innerHTML = '';
        
        attendanceData.slice(0, 10).forEach(record => {
            const item = document.createElement('div');
            item.className = 'attendance-item';
            
            item.innerHTML = `
                <div>
                    <div class="attendance-date">${formatDate(record.date)}</div>
                    <div>${record.status}</div>
                </div>
                <div>
                    <span class="attendance-type type-${record.type}">${record.type.toUpperCase()}</span>
                    <div class="attendance-time">${record.time}</div>
                </div>
            `;
            
            attendanceHistory.appendChild(item);
        });
    }

    // Toggle QR Scanner
    function toggleQrScanner() {
        if (qrScanner.style.display === 'none') {
            qrScanner.style.display = 'block';
            startQrScanner();
            toggleQrBtn.innerHTML = '<i class="fas fa-times"></i> Tutup Scanner';
        } else {
            qrScanner.style.display = 'none';
            stopQrScanner();
            toggleQrBtn.innerHTML = '<i class="fas fa-qrcode"></i> Scan QR Code';
        }
    }

    // Start QR Scanner
    function startQrScanner() {
        const html5QrCode = new Html5Qrcode("qr-reader");
        
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                // Handle scanned QR code
                handleScannedQr(decodedText);
                html5QrCode.stop();
                qrScanner.style.display = 'none';
                toggleQrBtn.innerHTML = '<i class="fas fa-qrcode"></i> Scan QR Code';
            },
            (errorMessage) => {
                // Ignore errors
            }
        ).catch(err => {
            console.error("Unable to start scanning", err);
        });
    }

    // Stop QR Scanner
    function stopQrScanner() {
        // Clean up if scanner is running
        const scannerElement = document.getElementById('qr-reader');
        if (scannerElement) {
            scannerElement.innerHTML = '';
        }
    }

    // Handle scanned QR code
    function handleScannedQr(qrData) {
        try {
            const data = JSON.parse(qrData);
            
            if (data.type === 'attendance' && data.location === 'SMK Jakarta Timur 1') {
                showNotification('QR Code valid, melakukan check in...', 'success');
                setTimeout(() => handleCheckIn(), 1000);
            } else {
                showNotification('QR Code tidak valid', 'error');
            }
        } catch (error) {
            showNotification('QR Code tidak valid', 'error');
        }
    }

    // Save attendance data to localStorage
    function saveAttendanceData() {
        const userAttendance = {
            userId: currentUser.id,
            data: attendanceData,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`attendance_${currentUser.id}`, JSON.stringify(userAttendance));
    }

    // Load attendance data from localStorage
    function loadAttendanceData() {
        if (!currentUser) return;
        
        const savedData = localStorage.getItem(`attendance_${currentUser.id}`);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            attendanceData = parsedData.data || [];
            
            if (currentUser.role !== 'admin') {
                updateStats();
                updateAttendanceHistory();
                checkTodayAttendance();
            }
        }
    }

    // Utility Functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function showNotification(message, type = 'info') {
        // This will be handled by notifications.js
        if (window.showAppNotification) {
            window.showAppNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Load admin data (stub)
    function loadAdminData() {
        console.log('Loading admin data...');
        // Will be implemented in admin.js
    }

    // Make functions available globally
    window.showModal = showModal;
    window.currentUser = currentUser;
    window.attendanceData = attendanceData;
});
