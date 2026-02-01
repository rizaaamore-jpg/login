// Achievements System
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.badgeElement = document.getElementById('achievementsBadge');
        this.init();
    }

    init() {
        this.loadAchievements();
        this.setupEventListeners();
        this.updateBadge();
    }

    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            this.achievements = JSON.parse(saved);
        } else {
            // Initial achievements
            this.achievements = [
                { id: 'first_login', title: 'Pertama Kali Login', description: 'Berhasil login pertama kali', earned: false, icon: 'fa-sign-in-alt' },
                { id: 'perfect_week', title: 'Minggu Sempurna', description: 'Hadir tepat waktu selama 5 hari berturut-turut', earned: false, icon: 'fa-calendar-check' },
                { id: 'on_time_month', title: 'Disiplin Bulanan', description: 'Tidak terlambat selama 1 bulan', earned: false, icon: 'fa-clock' },
                { id: 'attendance_90', title: 'Kehadiran 90%', description: 'Pencapaian kehadiran 90%', earned: false, icon: 'fa-chart-line' },
                { id: 'early_bird', title: 'Early Bird', description: 'Check in sebelum jam 7 pagi', earned: false, icon: 'fa-earlybirds' }
            ];
            this.saveAchievements();
        }
    }

    checkAchievements(userData) {
        const unlocked = [];
        
        // Check first login
        if (!this.achievements[0].earned) {
            this.unlockAchievement('first_login');
            unlocked.push(this.achievements[0]);
        }
        
        // Check perfect week
        if (userData.perfectWeek && !this.achievements[1].earned) {
            this.unlockAchievement('perfect_week');
            unlocked.push(this.achievements[1]);
        }
        
        // Check on-time month
        if (userData.onTimeMonth && !this.achievements[2].earned) {
            this.unlockAchievement('on_time_month');
            unlocked.push(this.achievements[2]);
        }
        
        // Notify unlocked achievements
        if (unlocked.length > 0) {
            this.showUnlockedNotification(unlocked);
        }
        
        this.updateBadge();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.earned) {
            achievement.earned = true;
            achievement.unlockedAt = new Date().toISOString();
            this.saveAchievements();
            return true;
        }
        return false;
    }

    showUnlockedNotification(achievements) {
        achievements.forEach(achievement => {
            showAppNotification(
                `🏆 Pencapaian Terbuka: ${achievement.title}`,
                'success'
            );
        });
    }

    updateBadge() {
        const earnedCount = this.achievements.filter(a => a.earned).length;
        const badgeCount = this.badgeElement.querySelector('.badge-count');
        
        if (badgeCount) {
            badgeCount.textContent = earnedCount;
        }
        
        if (earnedCount > 0) {
            this.badgeElement.style.display = 'flex';
            this.badgeElement.addEventListener('click', () => this.showAchievementsModal());
        }
    }

    showAchievementsModal() {
        const modalHTML = `
            <div class="modal" id="achievementsModal">
                <div class="modal-content">
                    <span class="close-modal" onclick="window.achievementSystem.closeModal()">&times;</span>
                    <h3>🏆 Pencapaian Saya</h3>
                    <div class="achievements-grid">
                        ${this.achievements.map(achievement => `
                            <div class="achievement-card ${achievement.earned ? 'earned' : 'locked'}">
                                <div class="achievement-icon">
                                    <i class="fas ${achievement.icon}"></i>
                                </div>
                                <div class="achievement-info">
                                    <h4>${achievement.title}</h4>
                                    <p>${achievement.description}</p>
                                    ${achievement.earned ? 
                                        `<small>Diraih: ${new Date(achievement.unlockedAt).toLocaleDateString('id-ID')}</small>` : 
                                        '<small>Belum diraih</small>'
                                    }
                                </div>
                                <div class="achievement-status">
                                    ${achievement.earned ? 
                                        '<i class="fas fa-unlock" style="color: #2ecc71;"></i>' : 
                                        '<i class="fas fa-lock" style="color: #95a5a6;"></i>'
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('achievementsModal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('achievementsModal');
        modal.style.display = 'flex';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            modal.remove();
        }
    }

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    setupEventListeners() {
        // Listen for attendance events
        document.addEventListener('attendanceRecorded', (e) => {
            this.checkAttendanceAchievements(e.detail);
        });
    }

    checkAttendanceAchievements(attendanceData) {
        // Check for early bird
        if (attendanceData.time < '07:00' && !this.achievements[4].earned) {
            this.unlockAchievement('early_bird');
        }
        
        // You can add more achievement checks here
    }
}

// Initialize achievement system
window.achievementSystem = new AchievementSystem();

// Example achievement check after login
if (window.currentUser) {
    setTimeout(() => {
        window.achievementSystem.checkAchievements({
            perfectWeek: false,
            onTimeMonth: true
        });
    }, 2000);
}
