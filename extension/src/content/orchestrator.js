// orchestrator.js
(function() {
  let observer = null;
  let initTimeout = null;
  let extensionEnabled = true;

  function recalculateAndRender(table) {
    const { overallSgpa, totalOverallCredits } = SrmSgpa.Calculator.calculate(table);
    SrmSgpa.UI.renderDashboard(overallSgpa, totalOverallCredits, table);
  }

  function tryActivate() {
    if (!extensionEnabled || !SrmSgpa.Parser.isProvisionalPage()) return;

    const table = SrmSgpa.Parser.findResultsTable();
    if (table && !table.dataset.sgpaCalculated) {
      SrmSgpa.UI.initializeCheckboxes(table, () => recalculateAndRender(table));
      recalculateAndRender(table);
      table.dataset.sgpaCalculated = 'true';
    }
  }

  function startObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      if (!extensionEnabled) return;

      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
           shouldRun = true;
           break;
        }
      }

      if (shouldRun) {
        tryActivate();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function scheduleInit() {
    if (initTimeout) clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
      initTimeout = null;
      tryActivate();
    }, 1000);
  }

  function setExtensionEnabled(enabled) {
    extensionEnabled = enabled;
    if (enabled) {
      startObserver();
      scheduleInit();
    } else {
      SrmSgpa.UI.cleanup();
    }
  }

  chrome.storage.local.get({ enabled: true }, (result) => {
    setExtensionEnabled(result.enabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {
      setExtensionEnabled(changes.enabled.newValue);
    }
  });

  startObserver();
  scheduleInit();
})();
