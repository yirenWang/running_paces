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

    static parseTimeInput(input) {
        if (!input) return null;
        
        // Handle different time formats: "1:30:45", "90:30", "90"
        const cleanInput = input.replace(/\s+/g, ':').trim();
        const parts = cleanInput.split(':').map(part => parseInt(part) || 0);
        
        let hours = 0, minutes = 0, seconds = 0;
        
        if (parts.length === 1) {
            // Just minutes: "90"
            minutes = parts[0];
        } else if (parts.length === 2) {
            // Minutes and seconds: "90:30"
            minutes = parts[0];
            seconds = parts[1];
        } else if (parts.length === 3) {
            // Hours, minutes, seconds: "1:30:45"
            hours = parts[0];
            minutes = parts[1];
            seconds = parts[2];
        }
        
        const totalMinutes = hours * 60 + minutes + (seconds / 60);
        return { hours, minutes, seconds, totalMinutes };
    }

    static calculatePace(distanceMeters, timeObj) {
        if (distanceMeters <= 0 || !timeObj || timeObj.totalMinutes <= 0) return null;
        
        const distanceKm = distanceMeters / 1000;
        const paceMinutesPerKm = timeObj.totalMinutes / distanceKm;
        
        const minutes = Math.floor(paceMinutesPerKm);
        const seconds = Math.round((paceMinutesPerKm - minutes) * 60);
        
        return { 
            minutes, 
            seconds, 
            totalMinutes: paceMinutesPerKm 
        };
    }

    static formatPace(paceObj) {
        if (!paceObj) return '--:--';
        const { minutes, seconds } = paceObj;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// DOM Elements - First converter
const distanceInput = document.getElementById('distance-input');
const paceInput = document.getElementById('pace-input');
const timeInput = document.getElementById('time-input');

// DOM Elements - Second converter
const distanceInput2 = document.getElementById('distance-input-2');
const paceInput2 = document.getElementById('pace-input-2');
const timeInput2 = document.getElementById('time-input-2');

const installBtn = document.getElementById('install-btn');

// Input validation and visual feedback
function addValidClass(input) {
    input.classList.add('valid');
    setTimeout(() => input.classList.remove('valid'), 1000);
}

// Calculate running time when distance and pace are provided (generic function)
function calculateRunningTimeFor(distanceEl, paceEl, timeEl) {
    const distance = parseFloat(distanceEl.value);
    const paceValue = paceEl.value.trim();
    
    // Only calculate if both distance and pace have valid values
    if (distance && distance > 0 && paceValue) {
        const pace = TimeCalculator.parsePaceInput(paceValue);
        if (pace) {
            const time = TimeCalculator.calculateTime(distance, pace);
            if (time) {
                timeEl.value = TimeCalculator.formatTime(time);
                addValidClass(timeEl);
            }
        }
    } else {
        // Clear time if either distance or pace is missing/invalid
        timeEl.value = '';
    }
}

// Calculate running time for first converter
function calculateRunningTime() {
    calculateRunningTimeFor(distanceInput, paceInput, timeInput);
}

// Calculate pace for second converter (distance + time → pace)
function calculatePace2() {
    const distance = parseFloat(distanceInput2.value);
    const timeValue = timeInput2.value.trim();
    
    // Only calculate if both distance and time have valid values
    if (distance && distance > 0 && timeValue) {
        const time = TimeCalculator.parseTimeInput(timeValue);
        if (time) {
            const pace = TimeCalculator.calculatePace(distance, time);
            if (pace) {
                paceInput2.value = TimeCalculator.formatPace(pace);
                addValidClass(paceInput2);
            }
        }
    } else {
        // Clear pace if either distance or time is missing/invalid
        paceInput2.value = '';
    }
}

// Event listeners for first converter
distanceInput.addEventListener('input', calculateRunningTime);
paceInput.addEventListener('input', calculateRunningTime);

// Event listeners for second converter (distance + time → pace)
distanceInput2.addEventListener('input', calculatePace2);
timeInput2.addEventListener('input', calculatePace2);




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

// Reset all inputs
function resetAll() {
    // Clear first converter (distance + pace → time)
    distanceInput.value = '';
    paceInput.value = '';
    timeInput.value = '';
    
    // Clear second converter (distance + time → pace)
    distanceInput2.value = '';
    timeInput2.value = '';
    paceInput2.value = '';
    
    // Clear distances table
    const timeCells = document.querySelectorAll('.time-cell');
    timeCells.forEach(cell => cell.textContent = '--');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Clear all inputs with Escape
    if (e.key === 'Escape') {
        resetAll();
        distanceInput.focus();
    }
    
    // Switch between inputs with Tab or Enter (skip readonly result inputs)
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission behavior
        
        if (document.activeElement === distanceInput) {
            paceInput.focus();
        } else if (document.activeElement === paceInput) {
            distanceInput2.focus();
        } else if (document.activeElement === distanceInput2) {
            timeInput2.focus();
        } else if (document.activeElement === timeInput2) {
            distanceInput.focus();
        }
    }
});

// Removed distance formatting to prevent clearing issues

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