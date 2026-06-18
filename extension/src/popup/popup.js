const toggle = document.getElementById('extension-toggle');
const statusText = document.getElementById('status-text');
const toggleHint = document.getElementById('toggle-hint');
const themeToggleBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function updateUI(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? 'Active' : 'Inactive';
  statusText.classList.toggle('off', !enabled);
  toggleHint.textContent = enabled
    ? 'Calculator is active on the SRM portal.'
    : 'Calculator is paused. Refresh the results page after turning back on.';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    document.documentElement.removeAttribute('data-theme');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }
}

// Check system preference on first load if not explicitly set
function getPreferredTheme(result) {
  if (result.theme) {
    return result.theme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

chrome.storage.local.get(['enabled', 'theme'], (result) => {
  const enabled = result.enabled !== undefined ? result.enabled : true;
  updateUI(enabled);
  applyTheme(getPreferredTheme(result));
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled }, () => {
    updateUI(enabled);
  });
});

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  chrome.storage.local.set({ theme: newTheme });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.enabled) {
      updateUI(changes.enabled.newValue);
    }
    if (changes.theme) {
      applyTheme(changes.theme.newValue);
    }
  }
});
