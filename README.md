# 🏃‍♂️ Running Pace Converter PWA

A modern Progressive Web App for converting running paces between km/h and min/km format. Perfect for runners who need quick and accurate pace conversions!

## ✨ Features

### 🔄 Pace Converter
- **Real-time Conversion**: Instantly convert between km/h and min/km as you type
- **Quick Reference**: Tap on preset values for common running paces
- **Flexible Input**: Accepts multiple pace formats (5:30, 5.5, 5, etc.)

### ⏱️ Time Calculator  
- **Running Time Calculation**: Enter distance (meters) and pace to get total running time
- **Common Distance Presets**: Quick access to track distances (100m, 200m, 300m, 400m, 500m, 600m, 800m)
- **Smart Formatting**: Automatic time formatting (h:mm:ss or mm:ss)

### 📱 PWA Features
- **Install as App**: Install as a native app on your device
- **Offline Functionality**: Works without internet connection once installed
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Dark Mode Support**: Automatically adapts to your system theme
- **Navigation**: Easy switching between Pace Converter and Time Calculator

### 🎯 User Experience
- **Keyboard Shortcuts**: 
  - `Escape` to clear all fields
  - `Enter` to switch between input fields
- **Visual Feedback**: Success animations and input validation
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Option 1: Use Online (Recommended)
Simply open `index.html` in a web browser to start using the app immediately.

### Option 2: Local Development Server
For the best PWA experience, run a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Install as PWA
1. Open the app in a PWA-compatible browser (Chrome, Edge, Safari, etc.)
2. Look for the "📱 Install App" button or browser install prompt
3. Click to install the app on your device

## 📱 How to Use

### Pace Converter (⚡)
1. **Convert km/h to min/km**: Enter a speed value in the "Speed (km/h)" field
2. **Convert min/km to km/h**: Enter a pace in the "Pace (min/km)" field using format like "5:30" or "5.5"
3. **Quick Reference**: Click on any preset pace/speed combination to populate both fields
4. **Clear Fields**: Press `Escape` to clear all inputs

### Time Calculator (⏱️)
1. **Enter Distance**: Input the distance you want to run in meters
2. **Enter Pace**: Set your target pace in min/km format (e.g., "5:30")
3. **Get Time**: The calculator instantly shows your total running time
4. **Use Presets**: Click on track distances (100m, 200m, 300m, 400m, 500m, 600m, 800m) for quick setup

### Pace Input Formats
The app accepts multiple pace input formats:
- `5:30` (5 minutes 30 seconds)
- `5.5` (5.5 minutes)
- `5` (5 minutes)
- `5 30` (space separator)

## 🔧 Technical Details

### Files Structure
```
running_paces_convertor/
├── index.html           # Pace converter page
├── time-calculator.html # Time calculator page
├── style.css           # Shared styling and responsive design
├── script.js           # Pace conversion logic
├── time-calculator.js  # Time calculation logic
├── manifest.json       # PWA manifest configuration
├── sw.js              # Service worker for offline support
└── README.md          # This file
```

### PWA Features
- **Service Worker**: Caches app files for offline use
- **Web App Manifest**: Enables installation and native app-like behavior
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch-Friendly**: Large touch targets and mobile-optimized interactions

### Browser Support
- Chrome/Chromium (full PWA support)
- Safari (iOS 11.3+, limited PWA support)
- Firefox (limited PWA support)
- Edge (full PWA support)

## 🧮 Conversion Formula

The conversion uses the standard relationship between speed and pace:

- **km/h to min/km**: `pace = 60 / speed`
- **min/km to km/h**: `speed = 60 / pace`

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with smooth animations
- **Gradient Background**: Beautiful gradient that adapts to light/dark mode
- **Visual Feedback**: Input validation with color changes and animations
- **Accessibility**: High contrast ratios and keyboard navigation
- **Mobile-First**: Designed primarily for mobile use with desktop support

## 🔄 Development

To modify the app:

1. Edit the HTML structure in `index.html`
2. Modify styles in `style.css` (uses CSS custom properties for theming)
3. Update conversion logic in `script.js`
4. Adjust PWA settings in `manifest.json`
5. Modify caching behavior in `sw.js`

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the app!

---

**Made with ❤️ for runners everywhere** 