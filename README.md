# 🍅 Pomodoro Timer - Progressive Web App

A beautiful and functional Pomodoro Timer **Progressive Web App (PWA)** built with HTML, CSS, and JavaScript to help users implement the Pomodoro Technique for better productivity and time management.

**📱 Installable on all devices - Works offline!**

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [PWA Features](#pwa-features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 About the Project

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. This application provides a digital implementation with modern PWA capabilities, allowing users to install it on any device and use it offline like a native app.

This project was developed as part of the FlexiSAF Internship Final Project to demonstrate proficiency in:

- DOM manipulation
- JavaScript logic and state management
- Responsive web design
- CSS variables and theming
- Local storage for data persistence
- Progressive Web App development
- Service Workers and offline functionality
- User experience design

## ✨ Features

### Timer Functionality

- **Three Timer Modes:**
  - 🎯 Pomodoro (default: 25 minutes) - Focus time
  - ☕ Short Break (default: 5 minutes) - Quick rest
  - 🌴 Long Break (default: 15 minutes) - Extended rest
- **Timer Controls:** Start, Pause, and Reset functionality
- **Visual Progress Ring:** Animated SVG circle showing time remaining
- **Session Counter:** Tracks completed Pomodoro sessions

### Customization

- **Adjustable Durations:** Customize time for all three modes
- **Multiple Notification Sounds:** Choose from 4 different alert tones
- **Auto-start Options:**
  - Auto-start breaks after Pomodoro completion
  - Auto-start Pomodoros after break completion
- **Sound Notifications:**
  - Toggle sound on/off
  - 4 notification tones to choose from
  - Adjustable volume control
  - Test sound feature
- **Smart Notifications:** Banner stays visible during audio playback

### Theme System

- **Multiple Theme Options:**
  - 🌞 Light Mode
  - 🌙 Dark Mode
  - 💻 System Theme (auto-detects OS preference)
- **Smooth Transitions:** Seamless theme switching
- **Persistent Preferences:** Theme choice saved to local storage

### Design & Accessibility

- **Responsive Design:** Works perfectly on desktop, tablet, and mobile devices
- **Modern UI:** Clean interface with orange color scheme
- **Inter Font:** Professional typography
- **Smart Notifications:** Beautiful banner system instead of alerts
- **Keyboard Navigation:** Full keyboard support
- **Reduced Motion Support:** Respects user preferences for animations
- **Focus States:** Clear visual indicators for accessibility

## 📱 PWA Features

### Installable App

- **Add to Home Screen:** Install on any device like a native app
- **Standalone Mode:** Runs in its own window without browser UI
- **App Icons:** Custom icons for all platforms (iOS, Android, Windows, macOS, Linux)
- **Splash Screen:** Professional loading experience

### Offline Functionality

- **Service Worker:** Caches all resources for offline use
- **Offline Mode:** Full functionality without internet connection
- **Cache-First Strategy:** Lightning-fast loading from cache
- **Background Sync:** Ready for future data synchronization

### Performance

- **Instant Loading:** Cached assets load immediately
- **Auto-Updates:** Automatically updates when new version available
- **Update Notifications:** Notifies users of app installation and updates

### Platform Support

- ✅ Android (Chrome, Edge, Samsung Internet)
- ✅ iOS (Safari - Add to Home Screen)
- ✅ Windows (Edge, Chrome)
- ✅ macOS (Safari, Chrome)
- ✅ Linux (Chrome, Firefox)

**📖 See [PWA_SETUP.md](PWA_SETUP.md) for detailed installation instructions**

## 🖥️ Demo

To see the application in action:

1. Clone this repository
2. Open `index.html` in your web browser
3. Install it as a PWA (optional but recommended!)
4. Start your first Pomodoro session!

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS variables
  - Flexbox for layouts
  - CSS Grid where applicable
  - Custom properties for theming
  - Media queries for responsiveness
  - Smooth animations and transitions
- **JavaScript (ES6+)** - Vanilla JavaScript with no frameworks
  - DOM manipulation
  - Event handling
  - Service Workers
  - Cache API
  - Web Audio API
  - Local Storage API
  - Web Audio API
  - State management patterns

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or build tools required!

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SamIfesi/SAF-final-Project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SAF-final-Project
   ```

3. Open `index.html` in your browser:

   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser, or
   - Use a local server (e.g., Live Server extension in VS Code)

4. **(Optional) Generate App Icons:**

   - Open `generate-icons.html` in your browser
   - Download all icon sizes
   - Save them to the `icons/` folder
   - See [ICONS_README.md](ICONS_README.md) for detailed instructions

5. **(Optional) Install as PWA:**
   - Follow instructions in [PWA_SETUP.md](PWA_SETUP.md)
   - Install on your device for offline access
   - Enjoy native app experience!

That's it! No build process required.

## 📖 Usage

### Starting a Pomodoro Session

1. **Select Your Mode:** Click on "Pomodoro", "Short Break", or "Long Break"
2. **Start the Timer:** Click the "Start" button
3. **Focus on Your Task:** Work until the timer completes
4. **Take a Break:** When the timer finishes, you'll receive a notification
5. **Track Progress:** Your completed sessions are automatically counted

### Customizing Settings

1. Click the "Settings" button
2. Adjust timer durations (1-60 minutes)
3. Toggle auto-start features
4. Enable/disable sound notifications
5. Adjust volume level
6. Select your preferred theme
7. Click "Save Settings" to apply changes

### Keyboard Shortcuts

- `Space` - Start/Pause timer (when focused)
- `Esc` - Close settings modal
- `Tab` - Navigate between interactive elements

## 🎨 Customization

### Changing Colors

The color scheme is controlled by CSS variables in `style.css`. To change the primary color from orange:

```css
:root {
  --primary: #your-color;
  --primary-hover: #your-darker-color;
}
```

### Adding New Timer Modes

You can extend the application by adding new modes in `script.js`:

```javascript
const times = {
  pomodoro: state.settings.pomodoroTime,
  shortBreak: state.settings.shortBreakTime,
  longBreak: state.settings.longBreakTime,
  yourNewMode: state.settings.yourNewModeTime,
};
```

## 📁 Project Structure

```
SAF-final-Project/
│
├── index.html              # Main HTML structure
├── style.css               # CSS styles and themes
├── script.js               # JavaScript functionality
├── manifest.json           # PWA manifest configuration
├── service-worker.js       # Service worker for offline support
├── generate-icons.html     # Icon generator tool
│
├── audios/                 # Notification sound files
│   ├── iphone_alarm.mp3
│   ├── loud_signal.mp3
│   ├── nashia_signal.mp3
│   └── radar.mp3
│
├── icons/                  # PWA app icons (generate using tool)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
├── README.md               # Main project documentation
├── PWA_SETUP.md           # PWA installation guide
└── ICONS_README.md        # Icon generation instructions
```

### Code Organization

**script.js** is organized into modular sections:

- `State Management` - Central application state
- `DOM Elements` - Cached DOM references
- `NotificationManager` - Smart banner notification system
- `ThemeManager` - Theme switching logic
- `ModeManager` - Timer mode handling
- `TimerManager` - Core timer functionality
- `SettingsManager` - Settings persistence
- `PWAManager` - Service worker and installation handling

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for educational purposes.

## 👤 Contact

**Samrose Ifesi**

- GitHub: [@SamIfesi](https://github.com/SamIfesi)
- Project Link: [https://github.com/SamIfesi/SAF-final-Project](https://github.com/SamIfesi/SAF-final-Project)

## 🙏 Acknowledgments

- FlexiSAF for the internship opportunity
- Francesco Cirillo for developing the Pomodoro Technique
- The open-source community for inspiration and resources

---

**Built with ❤️ for better productivity** | _FlexiSAF Internship Final Project 2025_
