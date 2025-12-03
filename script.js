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
    notificationTone: "alarm",
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
  notificationToneSelect: document.getElementById("notificationTone"),
  testSoundBtn: document.getElementById("testSoundBtn"),
  volumeControl: document.getElementById("volumeControl"),
  volumeValue: document.getElementById("volumeValue"),
  themeSelect: document.getElementById("themeSelect"),

  // Theme toggle
  themeToggle: document.getElementById("themeToggle"),

  // Audio
  notificationSound: document.getElementById("notificationSound"),

  // Notification banner
  notificationBanner: document.getElementById("notificationBanner"),
  notificationMessage: document.getElementById("notificationMessage"),
  notificationIcon: document.getElementById("notificationIcon"),
  notificationClose: document.getElementById("notificationClose"),

  // Progress ring
  progressRingFill: document.querySelector(".progress-ring-circle-fill"),
};

// ==================== NOTIFICATION SYSTEM ====================
const NotificationManager = {
  timeoutId: null,
  currentAudio: null,
  isPlayingAudio: false,

  init() {
    elements.notificationClose.addEventListener("click", () => {
      this.hide();
      this.stopAudio();
    });
  },

  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isPlayingAudio = false;
    }
  },

  setAudio(audio) {
    this.currentAudio = audio;
    this.isPlayingAudio = true;

    // Listen for audio end event
    const handleAudioEnd = () => {
      this.isPlayingAudio = false;
      this.currentAudio = null;
      // Only auto-hide if notification is still showing
      if (elements.notificationBanner.classList.contains("show")) {
        this.hide();
      }
      audio.removeEventListener("ended", handleAudioEnd);
    };

    audio.addEventListener("ended", handleAudioEnd);
  },

  show(message, type = "info", duration = 3000, withAudio = false) {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set message and icon based on type
    elements.notificationMessage.textContent = message;

    // Remove all type classes
    elements.notificationBanner.classList.remove(
      "success",
      "error",
      "info",
      "warning"
    );

    // Add appropriate type class
    elements.notificationBanner.classList.add(type);

    // Set icon based on type
    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };
    elements.notificationIcon.textContent = icons[type] || icons.info;

    // Show notification
    elements.notificationBanner.classList.add("show");

    // Only auto-hide if not playing audio
    if (!withAudio) {
      this.timeoutId = setTimeout(() => {
        this.hide();
      }, duration);
    }
    // If with audio, the banner will hide when audio ends (handled in setAudio)
  },

  hide() {
    elements.notificationBanner.classList.remove("show");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    // Reset audio tracking when hiding
    this.isPlayingAudio = false;
  },
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
      NotificationManager.show(
        "Timer is running! Please pause or reset before switching modes.",
        "warning",
        3000
      );
      return;
    }

    // Stop current timer
    TimerManager.stop();

    // Stop any playing notification audio
    NotificationManager.stopAudio();

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
    circle.style.strokeDashoffset = `0`;

    // Update immediately to show full ring
    this.updateProgressRing();
  },

  updateProgressRing() {
    const circle = elements.progressRingFill;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    const timeElapsed = state.totalTime - state.timeLeft;
    const progress = timeElapsed / state.totalTime;
    const offset = circumference * progress;

    circle.style.strokeDashoffset = offset;
  },

  playNotification() {
    this.playSound(state.settings.notificationTone, true);
  },

  playSound(tone, isNotification = false, isTest = false) {
    const audio = elements.notificationSound;
    const soundFile = this.getSoundFile(tone);

    audio.src = soundFile;

    // For test sounds, use current slider value; for notifications, use saved setting
    if (isTest) {
      audio.volume = parseInt(elements.volumeControl.value, 10) / 100;
    } else {
      audio.volume = state.settings.volume / 100;
    }

    audio.play().catch((err) => {
      NotificationManager.show(
        "Audio playback failed, using fallback sound",
        "warning",
        2000
      );
      this.playBeep();
    });

    // If this is a notification sound, track it
    if (isNotification) {
      NotificationManager.setAudio(audio);
    }
  },

  getSoundFile(tone) {
    const soundMap = {
      alarm: "audios/iphone_alarm.mp3",
      signal: "audios/loud_signal.mp3",
      nashia_signal: "audios/nashia_signal.mp3",
      radar: "audios/radar.mp3",
    };
    return soundMap[tone] || soundMap.alarm;
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

    NotificationManager.show(
      messages[state.currentMode],
      "success",
      5000,
      true
    );
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
      const volumeValue = e.target.value;
      elements.volumeValue.textContent = `${volumeValue}%`;

      // Update volume in real-time if audio is playing
      const audio = elements.notificationSound;
      if (!audio.paused) {
        audio.volume = volumeValue / 100;
      }
    });

    // Test sound button
    elements.testSoundBtn.addEventListener("click", () => {
      this.testSound();
    });
  },

  openModal() {
    elements.settingsModal.style.display = "block";
    this.populateSettings();
  },

  closeModal() {
    elements.settingsModal.style.display = "none";
    // Stop any playing test sound
    const audio = elements.notificationSound;
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  },

  populateSettings() {
    elements.pomodoroTimeInput.value = state.settings.pomodoroTime;
    elements.shortBreakTimeInput.value = state.settings.shortBreakTime;
    elements.longBreakTimeInput.value = state.settings.longBreakTime;
    elements.autoStartBreaksInput.checked = state.settings.autoStartBreaks;
    elements.autoStartPomodorosInput.checked =
      state.settings.autoStartPomodoros;
    elements.soundEnabledInput.checked = state.settings.soundEnabled;
    elements.notificationToneSelect.value = state.settings.notificationTone;
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
    state.settings.notificationTone = elements.notificationToneSelect.value;
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

  testSound() {
    const selectedTone = elements.notificationToneSelect.value;
    TimerManager.playSound(selectedTone, false, true);
  },

  loadSettings() {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      state.settings = { ...state.settings, ...settings };
    }
  },
  showSaveConfirmation() {
    NotificationManager.show("Settings saved successfully!", "success", 2000);
  },
};

// ==================== SERVICE WORKER REGISTRATION ====================
const PWAManager = {
  deferredPrompt: null,
  installPromptElement: null,
  installBtn: null,
  installLaterBtn: null,

  init() {
    this.installPromptElement = document.getElementById("installPrompt");
    this.installBtn = document.getElementById("installBtn");
    this.installLaterBtn = document.getElementById("installLaterBtn");

    this.registerServiceWorker();
    this.handleInstallPrompt();
    this.setupEventListeners();
  },

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered successfully:",
              registration.scope
            );

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
      });
    }
  },

  handleInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;

      // Show install notification banner after a short delay
      setTimeout(() => {
        NotificationManager.show(
          "Install this app for a better experience!",
          "info",
          5000
        );
      }, 3000);

      // Check if user has dismissed the prompt before
      const dismissed = sessionStorage.getItem("installPromptDismissed");
      if (!dismissed) {
        // Show custom install prompt after a short delay
        setTimeout(() => {
          this.showInstallPrompt();
        }, 5000);
      }
    });

    window.addEventListener("appinstalled", () => {
      NotificationManager.show(
        "App installed successfully! You can now use it offline.",
        "success",
        4000
      );
      this.hideInstallPrompt();
      this.deferredPrompt = null;
    });
  },

  setupEventListeners() {
    if (this.installBtn) {
      this.installBtn.addEventListener("click", () => {
        this.installApp();
      });
    }

    if (this.installLaterBtn) {
      this.installLaterBtn.addEventListener("click", () => {
        this.dismissInstallPrompt();
      });
    }
  },

  showInstallPrompt() {
    if (this.installPromptElement) {
      this.installPromptElement.classList.add("show");
    }
  },

  hideInstallPrompt() {
    if (this.installPromptElement) {
      this.installPromptElement.classList.remove("show");
    }
  },

  async installApp() {
    if (!this.deferredPrompt) {
      NotificationManager.show(
        "Installation not available at this time.",
        "error",
        3000
      );
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === "accepted") {
      NotificationManager.show("Installing app...", "success", 2000);
    } else {
      NotificationManager.show("Installation cancelled.", "info", 2000);
    }

    // Hide the custom prompt
    this.hideInstallPrompt();

    // Clear the deferredPrompt
    this.deferredPrompt = null;
  },

  dismissInstallPrompt() {
    this.hideInstallPrompt();
    // Remember that user dismissed the prompt (for this session only)
    localStorage.setItem("installPromptDismissed", "true");
    NotificationManager.show(
      "You can install later from your browser menu.",
      "info",
      3000
    );
  },
};

// ==================== INITIALIZATION ====================
function init() {
  NotificationManager.init();
  ThemeManager.init();
  ModeManager.init();
  TimerManager.init();
  SettingsManager.init();
  TimerManager.loadSessionCount();
  PWAManager.init();
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
