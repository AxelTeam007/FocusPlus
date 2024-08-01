let timerInterval;
let elapsedTime = 0;
let isRunning = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateXBlock') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: message.state ? [{
        id: 1,
        priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: 'x.com' }
      }] : []
    });
  }

  if (message.action === 'updateTikTokBlock') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [2],
      addRules: message.state ? [{
        id: 2,
        priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: 'tiktok.com' }
      }] : []
    });
  }
});

function startTimer() {
  console.log("Starting timer...");
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      elapsedTime++;
      chrome.storage.local.set({ elapsedTime: elapsedTime, isRunning: true });
      chrome.runtime.sendMessage({ action: 'updateDisplay', elapsedTime: elapsedTime });
    }, 1000);
  }
}

function pauseTimer() {
  console.log("Pausing timer...");
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    chrome.storage.local.set({ isRunning: false });
  }
}

function resetTimer() {
  console.log("Resetting timer...");
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  chrome.storage.local.set({ elapsedTime: elapsedTime, isRunning: false });
  chrome.runtime.sendMessage({ action: 'updateDisplay', elapsedTime: elapsedTime });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  switch (message.action) {
    case 'start':
      startTimer();
      break;
    case 'pause':
      pauseTimer();
      break;
    case 'reset':
      resetTimer();
      break;
    case 'getState':
      sendResponse({ elapsedTime: elapsedTime, isRunning: isRunning });
      break;
  }
});