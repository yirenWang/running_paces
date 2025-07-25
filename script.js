// Running Pace Converter Logic
class PaceConverter {
    static kmhToMinKm(kmh) {
        if (kmh <= 0) return null;
        const totalMinutes = 60 / kmh;
        const minutes = Math.floor(totalMinutes);
        const seconds = Math.round((totalMinutes - minutes) * 60);
        return { minutes, seconds, totalMinutes };
    }

    static minKmToKmh(minutes, seconds = 0) {
        if (minutes <= 0 && seconds <= 0) return null;
        const totalMinutes = minutes + (seconds / 60);
        return 60 / totalMinutes;
    }

    static formatPace(paceObj) {
        if (!paceObj) return '';
        const { minutes, seconds } = paceObj;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    static parsePaceInput(input) {
        if (!input) return null;
        
        // Handle different input formats: "5:30", "5.5", "5", "5 30"
        const cleanInput = input.replace(/\s+/g, ':').trim();
        
        if (cleanInput.includes(':')) {
            const [min, sec] = cleanInput.split(':').map(part => parseInt(part) || 0);
            return { minutes: min, seconds: sec };
        } else {
            const totalMinutes = parseFloat(cleanInput);
            if (isNaN(totalMinutes)) return null;
            
            const minutes = Math.floor(totalMinutes);
            const seconds = Math.round((totalMinutes - minutes) * 60);
            return { minutes, seconds };
        }
    }
}

// DOM Elements
const kmhInput = document.getElementById('kmh-input');
const minkmInput = document.getElementById('minkm-input');
const installBtn = document.getElementById('install-btn');

// Conversion state
let isUpdating = false;

// Input validation and visual feedback
function addValidClass(input) {
    input.classList.add('valid');
    setTimeout(() => input.classList.remove('valid'), 1000);
}

// Convert from km/h to min/km
function updatePaceFromSpeed() {
    if (isUpdating) return;
    isUpdating = true;

    const speed = parseFloat(kmhInput.value);
    
    if (speed && speed > 0) {
        const pace = PaceConverter.kmhToMinKm(speed);
        if (pace) {
            minkmInput.value = PaceConverter.formatPace(pace);
            addValidClass(kmhInput);
        }
    } else if (kmhInput.value === '') {
        minkmInput.value = '';
    }

    isUpdating = false;
}

// Convert from min/km to km/h
function updateSpeedFromPace() {
    if (isUpdating) return;
    isUpdating = true;

    const paceInput = minkmInput.value;
    
    if (paceInput) {
        const pace = PaceConverter.parsePaceInput(paceInput);
        if (pace && (pace.minutes > 0 || pace.seconds > 0)) {
            const speed = PaceConverter.minKmToKmh(pace.minutes, pace.seconds);
            if (speed) {
                kmhInput.value = speed.toFixed(1);
                addValidClass(minkmInput);
            }
        }
    } else {
        kmhInput.value = '';
    }

    isUpdating = false;
}

// Event listeners for real-time conversion
kmhInput.addEventListener('input', updatePaceFromSpeed);
minkmInput.addEventListener('input', updateSpeedFromPace);

// Format pace input as user types
minkmInput.addEventListener('blur', function() {
    const pace = PaceConverter.parsePaceInput(this.value);
    if (pace) {
        this.value = PaceConverter.formatPace(pace);
    }
});

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('SW registered: ', registration);
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Clear all inputs with Escape
    if (e.key === 'Escape') {
        kmhInput.value = '';
        minkmInput.value = '';
        kmhInput.focus();
    }
    
    // Switch between inputs with Tab or Enter
    if (e.key === 'Enter') {
        if (document.activeElement === kmhInput) {
            minkmInput.focus();
        } else if (document.activeElement === minkmInput) {
            kmhInput.focus();
        }
    }
});

// Quick reference interactions
document.querySelectorAll('.reference-item').forEach(item => {
    item.addEventListener('click', () => {
        const paceText = item.querySelector('.pace').textContent;
        const speedText = item.querySelector('.speed').textContent;
        
        minkmInput.value = paceText;
        kmhInput.value = speedText;
        
        // Add visual feedback
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
    });
});

// Initialize with focus on first input
kmhInput.focus();

// Add some fun animations on load
window.addEventListener('load', () => {
    document.querySelectorAll('.converter-card, .quick-conversions').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Prevent form submission (since we don't have a form, but just in case)
document.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Handle app visibility change for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // App is hidden, could pause animations or reduce activity
        console.log('App is hidden');
    } else {
        // App is visible again
        console.log('App is visible');
    }
}); 