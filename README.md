# 🍅 Pomodoro Timer - Time Management Web App

A beautiful and functional Pomodoro Timer web application built with HTML, CSS, and JavaScript to help users implement the Pomodoro Technique for better productivity and time management.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Customization](#customization)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 About the Project

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. This application provides a digital implementation of this technique with modern features and an intuitive user interface.

This project was developed as part of the FlexiSAF Internship Final Project to demonstrate proficiency in:

- DOM manipulation
- JavaScript logic and state management
- Responsive web design
- CSS variables and theming
- Local storage for data persistence
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
- **Auto-start Options:**
  - Auto-start breaks after Pomodoro completion
  - Auto-start Pomodoros after break completion
- **Sound Notifications:**
  - Toggle sound on/off
  - Adjustable volume control
  - Fallback beep sound using Web Audio API

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
- **Keyboard Navigation:** Full keyboard support
- **Reduced Motion Support:** Respects user preferences for animations
- **Focus States:** Clear visual indicators for accessibility

## 🖥️ Demo

To see the application in action:

1. Clone this repository
2. Open `index.html` in your web browser
3. Start your first Pomodoro session!

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS variables
  - Flexbox for layouts
  - CSS Grid where applicable
  - Custom properties for theming
  - Media queries for responsiveness
- **JavaScript (ES6+)** - Vanilla JavaScript with no frameworks
  - DOM manipulation
  - Event handling
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
├── index.html          # Main HTML structure
├── style.css           # CSS styles and themes
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── notification.mp3    # Optional notification sound file
```

### Code Organization

**script.js** is organized into modular sections:

- `State Management` - Central application state
- `DOM Elements` - Cached DOM references
- `ThemeManager` - Theme switching logic
- `ModeManager` - Timer mode handling
- `TimerManager` - Core timer functionality
- `SettingsManager` - Settings persistence

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
