let timerInterval;
let elapsedTime = 0;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const youtubeCheckbox = document.getElementById('youtube-filter-checkbox');
const xCheckbox = document.getElementById('x-filter-checkbox');
const tiktokCheckbox = document.getElementById('tiktok-filter-checkbox');
const notionLogo = document.getElementById('notion-logo');

// Charger les checkbox
chrome.storage.local.get(['youtubeFilter', 'xFilter', 'tiktokFilter'], (result) => {
  youtubeCheckbox.checked = result.youtubeFilter || false;
  xCheckbox.checked = result.xFilter || false;
  tiktokCheckbox.checked = result.tiktokFilter || false;
});

// Les boutons du timer
startButton.addEventListener('click', toggleStartReset);
pauseButton.addEventListener('click', togglePauseResume);

// YouTube
youtubeCheckbox.addEventListener('change', (event) => {
  chrome.storage.local.set({ youtubeFilter: event.target.checked });
});

// X
xCheckbox.addEventListener('change', (event) => {
  chrome.storage.local.set({ xFilter: event.target.checked }, () => {
    chrome.runtime.sendMessage({ action: 'updateXBlock', state: event.target.checked });
  });
});

// TikTok
tiktokCheckbox.addEventListener('change', (event) => {
  chrome.storage.local.set({ tiktokFilter: event.target.checked }, () => {
    chrome.runtime.sendMessage({ action: 'updateTikTokBlock', state: event.target.checked });
  });
});

// Notion
notionLogo.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.notion.so' });
});

// Timer
function toggleStartReset() {
  if (startButton.textContent === 'Démarrer') {
    startTimer();
    startButton.textContent = 'Réinitialiser';
    pauseButton.style.display = 'inline-block';
  } else {
    resetTimer();
    startButton.textContent = 'Démarrer';
    pauseButton.textContent = 'Pause';
    pauseButton.style.display = 'none';
  }
}

function togglePauseResume() {
  if (pauseButton.textContent === 'Pause') {
    pauseTimer();
    pauseButton.textContent = 'Reprendre';
  } else {
    startTimer();
    pauseButton.textContent = 'Pause';
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateTimerDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
  }
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  let hours = Math.floor(elapsedTime / 3600);
  let minutes = Math.floor((elapsedTime % 3600) / 60);
  let seconds = elapsedTime % 60;

  timerDisplay.textContent = 
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch').querySelector('input');
  
  // Preference Theme
  chrome.storage.local.get('theme', (result) => {
    const theme = result.theme || 'light';
    document.body.classList.add(theme);
    themeSwitch.checked = (theme === 'dark');
  });

  themeSwitch.addEventListener('change', () => {
    const theme = themeSwitch.checked ? 'dark' : 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    chrome.storage.local.set({ theme: theme });
  });
});