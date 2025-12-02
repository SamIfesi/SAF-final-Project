// ==================== STATE MANAGEMENT ====================
const state = {
  currentMode: "pomodoro",
  isRunning: false,
  isPaused: false,
  timeLeft: 25 * 60, // in seconds
  totalTime: 25 * 60,
  sessionCount: 0,
  timerInterval: null,
  settings: {
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    volume: 50,
    theme: "system",
  },
};

// ==================== DOM ELEMENTS ====================
const elements = {
  // Mode buttons
  modeBtns: document.querySelectorAll(".mode-btn"),

  // Timer display
  timerDisplay: document.getElementById("timer"),

  // Control buttons
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),

  // Session counter
  sessionCount: document.getElementById("sessionCount"),

  // Settings
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  closeSettings: document.getElementById("closeSettings"),
  saveSettings: document.getElementById("saveSettings"),

  // Settings inputs
  pomodoroTimeInput: document.getElementById("pomodoroTime"),
  shortBreakTimeInput: document.getElementById("shortBreakTime"),
  longBreakTimeInput: document.getElementById("longBreakTime"),
  autoStartBreaksInput: document.getElementById("autoStartBreaks"),
  autoStartPomodorosInput: document.getElementById("autoStartPomodoros"),
  soundEnabledInput: document.getElementById("soundEnabled"),
  volumeControl: document.getElementById("volumeControl"),
  volumeValue: document.getElementById("volumeValue"),
  themeSelect: document.getElementById("themeSelect"),

  // Theme toggle
  themeToggle: document.getElementById("themeToggle"),

  // Audio
  notificationSound: document.getElementById("notificationSound"),

  // Progress ring
  progressRingFill: document.querySelector(".progress-ring-circle-fill"),
};

// ==================== THEME MANAGEMENT ====================
const ThemeManager = {
  init() {
    this.loadTheme();
    this.attachEventListeners();
    this.updateThemeIcon();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "system";
    state.settings.theme = savedTheme;
    elements.themeSelect.value = savedTheme;
    this.applyTheme(savedTheme);
  },

  applyTheme(theme) {
    const root = document.documentElement;

    if (theme === "system") {
      // Remove data-theme attribute to use system preference
      root.removeAttribute("data-theme");
    } else {
      // Set explicit theme
      root.setAttribute("data-theme", theme);
    }

    this.updateThemeIcon();
  },

  updateThemeIcon() {
    const sunIcon = elements.themeToggle.querySelector(".sun-icon");
    const moonIcon = elements.themeToggle.querySelector(".moon-icon");

    const isDark = this.isDarkMode();

    if (isDark) {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  },

  isDarkMode() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (theme === "dark") return true;
    if (theme === "light") return false;

    // System theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  },

  toggleTheme() {
    const currentTheme = state.settings.theme;
    let newTheme;

    if (currentTheme === "system") {
      newTheme = this.isDarkMode() ? "light" : "dark";
    } else if (currentTheme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "light";
    }

    state.settings.theme = newTheme;
    elements.themeSelect.value = newTheme;
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  },

  saveTheme(theme) {
    localStorage.setItem("theme", theme);
  },

  attachEventListeners() {
    // Theme toggle button
    elements.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Theme select in settings
    elements.themeSelect.addEventListener("change", (e) => {
      const theme = e.target.value;
      state.settings.theme = theme;
      this.applyTheme(theme);
      this.saveTheme(theme);
    });

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (state.settings.theme === "system") {
          this.updateThemeIcon();
        }
      });
  },
};

// ==================== MODE MANAGEMENT ====================
const ModeManager = {
  init() {
    this.attachEventListeners();
  },

  attachEventListeners() {
    elements.modeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mode = e.target.dataset.mode;
        this.switchMode(mode);
      });
    });
  },

  switchMode(mode) {
    // Don't switch if timer is running
    if (state.isRunning && !state.isPaused) {
      const confirmSwitch = confirm(
        "Timer is running. Do you want to switch modes?"
      );
      if (!confirmSwitch) return;
    }

    // Stop current timer
    TimerManager.stop();

    // Update state
    state.currentMode = mode;

    // Update UI
    this.updateModeUI(mode);

    // Reset timer for new mode
    TimerManager.reset();
  },

  updateModeUI(mode) {
    // Update active button
    elements.modeBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      }
    });

    // Update progress ring color based on mode
    const colors = {
      pomodoro: "#f97316", // orange-500
      shortBreak: "#34d399", // green-400
      longBreak: "#60a5fa", // blue-400
    };

    elements.progressRingFill.setAttribute(
      "stroke",
      colors[mode] || colors.pomodoro
    );
  },

  getModeTime() {
    const times = {
      pomodoro: state.settings.pomodoroTime,
      shortBreak: state.settings.shortBreakTime,
      longBreak: state.settings.longBreakTime,
    };

    return times[state.currentMode] * 60; // Convert to seconds
  },
};

// ==================== TIMER MANAGEMENT ====================
const TimerManager = {
  init() {
    this.attachEventListeners();
    this.updateDisplay();
    this.initProgressRing();
  },

  attachEventListeners() {
    elements.startBtn.addEventListener("click", () => this.start());
    elements.pauseBtn.addEventListener("click", () => this.pause());
    elements.resetBtn.addEventListener("click", () => this.reset());
  },

  start() {
    if (!state.isRunning) {
      state.isRunning = true;
      state.isPaused = false;

      elements.startBtn.disabled = true;
      elements.pauseBtn.disabled = false;

      state.timerInterval = setInterval(() => {
        if (state.timeLeft > 0) {
          state.timeLeft--;
          this.updateDisplay();
          this.updateProgressRing();
        } else {
          this.complete();
        }
      }, 1000);
    }
  },

  pause() {
    if (state.isRunning) {
      state.isRunning = false;
      state.isPaused = true;

      clearInterval(state.timerInterval);

      elements.startBtn.disabled = false;
      elements.pauseBtn.disabled = true;
    }
  },

  stop() {
    state.isRunning = false;
    state.isPaused = false;

    clearInterval(state.timerInterval);

    elements.startBtn.disabled = false;
    elements.pauseBtn.disabled = true;
  },

  reset() {
    this.stop();

    state.totalTime = ModeManager.getModeTime();
    state.timeLeft = state.totalTime;

    this.updateDisplay();
    this.updateProgressRing();
  },

  complete() {
    this.stop();

    // Increment session count if completing a pomodoro
    if (state.currentMode === "pomodoro") {
      state.sessionCount++;
      elements.sessionCount.textContent = state.sessionCount;
      this.saveSessionCount();
    }

    // Play notification sound
    if (state.settings.soundEnabled) {
      this.playNotification();
    }

    // Show completion message
    this.showCompletionMessage();

    // Auto-start next session if enabled
    this.handleAutoStart();
  },

  updateDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;

    elements.timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  },

  initProgressRing() {
    const circle = elements.progressRingFill;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = "0";
  },

  updateProgressRing() {
    const circle = elements.progressRingFill;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    const progress = state.timeLeft / state.totalTime;
    const offset = circumference - progress * circumference;

    circle.style.strokeDashoffset = offset;
  },

  playNotification() {
    const audio = elements.notificationSound;
    audio.volume = state.settings.volume / 100;

    // Create a simple beep sound using Web Audio API if no audio file is available
    if (!audio.src || audio.error) {
      this.playBeep();
    } else {
      audio.play().catch((err) => {
        console.log("Audio playback failed:", err);
        this.playBeep();
      });
    }
  },

  playBeep() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.value = (state.settings.volume / 100) * 0.3;

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  },

  showCompletionMessage() {
    const messages = {
      pomodoro: "Great work! Time for a break.",
      shortBreak: "Break is over. Ready to focus?",
      longBreak: "Long break complete. Let's get back to work!",
    };

    alert(messages[state.currentMode]);
  },

  handleAutoStart() {
    const shouldAutoStart =
      (state.currentMode === "pomodoro" && state.settings.autoStartBreaks) ||
      (state.currentMode !== "pomodoro" && state.settings.autoStartPomodoros);

    if (shouldAutoStart) {
      setTimeout(() => {
        this.reset();
        this.start();
      }, 1000);
    } else {
      this.reset();
    }
  },

  saveSessionCount() {
    localStorage.setItem("sessionCount", state.sessionCount);
  },

  loadSessionCount() {
    const saved = localStorage.getItem("sessionCount");
    if (saved) {
      state.sessionCount = parseInt(saved, 10);
      elements.sessionCount.textContent = state.sessionCount;
    }
  },
};

// ==================== SETTINGS MANAGEMENT ====================
const SettingsManager = {
  init() {
    this.loadSettings();
    this.attachEventListeners();
  },

  attachEventListeners() {
    // Open/close settings modal
    elements.settingsBtn.addEventListener("click", () => this.openModal());
    elements.closeSettings.addEventListener("click", () => this.closeModal());

    // Close modal when clicking outside
    elements.settingsModal.addEventListener("click", (e) => {
      if (e.target === elements.settingsModal) {
        this.closeModal();
      }
    });

    // Save settings
    elements.saveSettings.addEventListener("click", () => this.saveSettings());

    // Volume control
    elements.volumeControl.addEventListener("input", (e) => {
      elements.volumeValue.textContent = `${e.target.value}%`;
    });
  },

  openModal() {
    elements.settingsModal.style.display = "block";
    this.populateSettings();
  },

  closeModal() {
    elements.settingsModal.style.display = "none";
  },

  populateSettings() {
    elements.pomodoroTimeInput.value = state.settings.pomodoroTime;
    elements.shortBreakTimeInput.value = state.settings.shortBreakTime;
    elements.longBreakTimeInput.value = state.settings.longBreakTime;
    elements.autoStartBreaksInput.checked = state.settings.autoStartBreaks;
    elements.autoStartPomodorosInput.checked =
      state.settings.autoStartPomodoros;
    elements.soundEnabledInput.checked = state.settings.soundEnabled;
    elements.volumeControl.value = state.settings.volume;
    elements.volumeValue.textContent = `${state.settings.volume}%`;
    elements.themeSelect.value = state.settings.theme;
  },

  saveSettings() {
    // Get values from inputs
    state.settings.pomodoroTime = parseInt(
      elements.pomodoroTimeInput.value,
      10
    );
    state.settings.shortBreakTime = parseInt(
      elements.shortBreakTimeInput.value,
      10
    );
    state.settings.longBreakTime = parseInt(
      elements.longBreakTimeInput.value,
      10
    );
    state.settings.autoStartBreaks = elements.autoStartBreaksInput.checked;
    state.settings.autoStartPomodoros =
      elements.autoStartPomodorosInput.checked;
    state.settings.soundEnabled = elements.soundEnabledInput.checked;
    state.settings.volume = parseInt(elements.volumeControl.value, 10);

    // Save to localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(state.settings));

    // Reset timer with new duration
    TimerManager.reset();

    // Close modal
    this.closeModal();

    // Show confirmation
    this.showSaveConfirmation();
  },

  loadSettings() {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      state.settings = { ...state.settings, ...settings };
    }
  },

  showSaveConfirmation() {
    // You can implement a toast notification here
    console.log("Settings saved successfully!");
  },
};

// ==================== INITIALIZATION ====================
function init() {
  ThemeManager.init();
  ModeManager.init();
  TimerManager.init();
  SettingsManager.init();
  TimerManager.loadSessionCount();
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
