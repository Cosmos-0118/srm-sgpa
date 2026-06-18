const toggle = document.getElementById('extension-toggle');
const statusText = document.getElementById('status-text');
const toggleHint = document.getElementById('toggle-hint');

function updateUI(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? 'On' : 'Off';
  statusText.classList.toggle('off', !enabled);
  toggleHint.textContent = enabled
    ? 'Calculator is active on the SRM portal.'
    : 'Calculator is paused. Refresh the results page after turning back on.';
}

chrome.storage.local.get({ enabled: true }, (result) => {
  updateUI(result.enabled);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled }, () => {
    updateUI(enabled);
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    updateUI(changes.enabled.newValue);
  }
});
