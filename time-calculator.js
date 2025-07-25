// Running Time Calculator Logic
class TimeCalculator {
    static calculateTime(distanceMeters, paceMinKm) {
        if (distanceMeters <= 0 || !paceMinKm || paceMinKm.totalMinutes <= 0) return null;
        
        const distanceKm = distanceMeters / 1000;
        const totalMinutes = distanceKm * paceMinKm.totalMinutes;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.round((totalMinutes % 1) * 60);
        
        return { hours, minutes, seconds, totalMinutes };
    }

    static formatTime(timeObj) {
        if (!timeObj) return '--:--:--';
        const { hours, minutes, seconds } = timeObj;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    static parsePaceInput(input) {
        if (!input) return null;
        
        // Handle different input formats: "5:30", "5.5", "5", "5 30"
        const cleanInput = input.replace(/\s+/g, ':').trim();
        
        if (cleanInput.includes(':')) {
            const [min, sec] = cleanInput.split(':').map(part => parseInt(part) || 0);
            return { 
                minutes: min, 
                seconds: sec, 
                totalMinutes: min + (sec / 60) 
            };
        } else {
            const totalMinutes = parseFloat(cleanInput);
            if (isNaN(totalMinutes)) return null;
            
            const minutes = Math.floor(totalMinutes);
            const seconds = Math.round((totalMinutes - minutes) * 60);
            return { 
                minutes, 
                seconds, 
                totalMinutes 
            };
        }
    }

    static formatDistance(meters) {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)}K`;
        }
        return `${meters}m`;
    }
}

// DOM Elements
const distanceInput = document.getElementById('distance-input');
const paceInput = document.getElementById('pace-input');
const timeResult = document.getElementById('time-result');
const installBtn = document.getElementById('install-btn');

// Conversion state
let isUpdating = false;

// Input validation and visual feedback
function addValidClass(input) {
    input.classList.add('valid');
    setTimeout(() => input.classList.remove('valid'), 1000);
}

// Calculate and display time
function calculateRunningTime() {
    if (isUpdating) return;
    isUpdating = true;

    const distance = parseFloat(distanceInput.value);
    const paceInput_value = paceInput.value;
    
    if (distance && distance > 0 && paceInput_value) {
        const pace = TimeCalculator.parsePaceInput(paceInput_value);
        if (pace) {
            const time = TimeCalculator.calculateTime(distance, pace);
            if (time) {
                const resultValue = timeResult.querySelector('.result-value');
                resultValue.textContent = TimeCalculator.formatTime(time);
                
                // Add success animation
                timeResult.classList.add('result-success');
                setTimeout(() => timeResult.classList.remove('result-success'), 1000);
                
                addValidClass(distanceInput);
                addValidClass(paceInput);
            }
        }
    } else {
        const resultValue = timeResult.querySelector('.result-value');
        resultValue.textContent = '--:--:--';
    }

    // Update distances table
    updateDistancesTable();
    isUpdating = false;
}

// Update distances table with calculated times
function updateDistancesTable() {
    const paceInput_value = paceInput.value;
    const timeCells = document.querySelectorAll('.time-cell');
    
    if (paceInput_value) {
        const pace = TimeCalculator.parsePaceInput(paceInput_value);
        if (pace) {
            document.querySelectorAll('.distance-cell').forEach((cell, index) => {
                const distance = parseFloat(cell.getAttribute('data-distance'));
                const time = TimeCalculator.calculateTime(distance, pace);
                if (time) {
                    timeCells[index].textContent = TimeCalculator.formatTime(time);
                } else {
                    timeCells[index].textContent = '--';
                }
            });
        } else {
            timeCells.forEach(cell => cell.textContent = '--');
        }
    } else {
        timeCells.forEach(cell => cell.textContent = '--');
    }
}



// Event listeners for real-time calculation
distanceInput.addEventListener('input', calculateRunningTime);
paceInput.addEventListener('input', calculateRunningTime);

// Format pace input as user types
paceInput.addEventListener('blur', function() {
    const pace = TimeCalculator.parsePaceInput(this.value);
    if (pace) {
        this.value = `${pace.minutes}:${pace.seconds.toString().padStart(2, '0')}`;
    }
});

// Distance cell interactions (clicking distance fills the distance input)
document.querySelectorAll('.distance-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        const distance = cell.getAttribute('data-distance');
        distanceInput.value = distance;
        
        // Add visual feedback
        cell.style.transform = 'scale(0.98)';
        setTimeout(() => {
            cell.style.transform = '';
        }, 150);
        
        calculateRunningTime();
    });
});

// PWA Installation (shared functionality)
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
        distanceInput.value = '';
        paceInput.value = '';
        const resultValue = timeResult.querySelector('.result-value');
        resultValue.textContent = '--:--:--';
        distanceInput.focus();
    }
    
    // Switch between inputs with Tab or Enter
    if (e.key === 'Enter') {
        if (document.activeElement === distanceInput) {
            paceInput.focus();
        } else if (document.activeElement === paceInput) {
            distanceInput.focus();
        }
    }
});

// Format distance input to show commas
distanceInput.addEventListener('input', function() {
    const value = this.value.replace(/,/g, '');
    if (value && !isNaN(value)) {
        // Don't format while user is typing
        const cursorPos = this.selectionStart;
        const oldLength = this.value.length;
        
        setTimeout(() => {
            if (!this.matches(':focus')) {
                this.value = parseInt(value).toLocaleString();
            }
        }, 100);
    }
});

distanceInput.addEventListener('blur', function() {
    const value = this.value.replace(/,/g, '');
    if (value && !isNaN(value)) {
        this.value = parseInt(value).toLocaleString();
    }
});

distanceInput.addEventListener('focus', function() {
    this.value = this.value.replace(/,/g, '');
});

// Initialize with focus on first input
distanceInput.focus();

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

// Handle app visibility change for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App is hidden');
    } else {
        console.log('App is visible');
    }
}); 