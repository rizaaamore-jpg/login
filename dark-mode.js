// Dark Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateIcon(savedTheme === 'dark', icon);
    
    // Toggle theme
    darkModeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        
        setTheme(newTheme);
        updateIcon(!isDark, icon);
        localStorage.setItem('theme', newTheme);
        
        // Show notification
        showNotification(`Mode ${newTheme === 'dark' ? 'gelap' : 'terang'} diaktifkan`);
    });
});

function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    
    // Update meta theme-color for mobile browsers
    const themeColor = theme === 'dark' ? '#1a1a1a' : '#3498db';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
}

function updateIcon(isDark, iconElement) {
    if (isDark) {
        iconElement.classList.remove('fa-moon');
        iconElement.classList.add('fa-sun');
    } else {
        iconElement.classList.remove('fa-sun');
        iconElement.classList.add('fa-moon');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});
