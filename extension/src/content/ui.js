// ui.js
window.SrmSgpa = window.SrmSgpa || {};

SrmSgpa.UI = {
  dashboardElement: null,

  renderDashboard(overallSgpa, totalOverallCredits, targetTable) {
    if (!this.dashboardElement || !document.body.contains(this.dashboardElement)) {
      this.dashboardElement = document.createElement('div');
      this.dashboardElement.className = 'sgpa-dashboard';

      const mountPoint = SrmSgpa.Parser.getStableMountPoint(targetTable);
      if (mountPoint && mountPoint.parentNode) {
         mountPoint.parentNode.insertBefore(this.dashboardElement, mountPoint);
      }
    }

    this.dashboardElement.innerHTML = `
      <div class="sgpa-dashboard-header">
        <div class="sgpa-dashboard-title-container">
          <svg class="sgpa-dashboard-icon" viewBox="0 0 512 512">
            <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path>
          </svg>
          <span class="sgpa-dashboard-title">SGPA Calculator</span>
        </div>
      </div>
      <div class="sgpa-dashboard-body">
        <div class="sgpa-dashboard-stats">
          <div class="sgpa-stat-box sgpa-stat-sgpa">
            <div class="sgpa-stat-label">Overall SGPA</div>
            <div class="sgpa-stat-value sgpa">${overallSgpa}</div>
          </div>
          <div class="sgpa-stat-box sgpa-stat-credits">
            <div class="sgpa-stat-label">Total Credits</div>
            <div class="sgpa-stat-value credits">${totalOverallCredits}</div>
          </div>
        </div>
        <p class="sgpa-copyright">&copy; 2026 srmsgpa</p>
      </div>
    `;
  },

  initializeCheckboxes(table, onCheckboxChange) {
    if (table.dataset.sgpaInitialized) return;

    const rows = table.querySelectorAll('tr');
    let headerHandled = false;

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) return;

      let rowText = row.innerText.toUpperCase();
      if (!headerHandled && rowText.includes('GRADE') && rowText.includes('CREDIT')) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.innerText = 'Include';
        th.style.padding = '8px';
        th.style.textAlign = 'center';
        th.className = 'sgpa-include-header';
        row.insertBefore(th, row.cells[0]);
        headerHandled = true;
        return;
      }

      const isHeaderRow = (row.cells.length === 1 && row.cells[0].colSpan > 3) ||
                          row.innerText.trim().match(/^[a-z]{3}\s*-\s*\d{4}$/i) ||
                          row.innerText.trim().match(/^semester\s*\d+/i);

      if (isHeaderRow) {
         if (row.cells.length === 1) {
            const currentColspan = parseInt(row.cells[0].getAttribute('colspan') || '9');
            row.cells[0].setAttribute('colspan', (currentColspan + 1).toString());
            row.cells[0].dataset.sgpaColspanAdjusted = 'true';
         }
         return;
      }

      const { grade, credit } = SrmSgpa.Parser.extractGradeAndCredit(cells);
      if (grade !== null && credit !== null) {
        if (!row.dataset.sgpaCheckboxAdded) {
          const td = document.createElement(cells[0].tagName === 'TH' ? 'th' : 'td');
          td.className = 'sgpa-checkbox-container';
          td.style.textAlign = 'center';
          td.style.verticalAlign = 'middle';

          td.innerHTML = `<input type="checkbox" class="sgpa-checkbox" checked>`;

          row.insertBefore(td, row.cells[0]);

          const checkbox = td.querySelector('.sgpa-checkbox');
          checkbox.addEventListener('change', onCheckboxChange);

          row.dataset.sgpaCheckboxAdded = 'true';
        }
      }
    });

    table.dataset.sgpaInitialized = 'true';
  },

  cleanup() {
    if (this.dashboardElement && this.dashboardElement.parentNode) {
      this.dashboardElement.parentNode.removeChild(this.dashboardElement);
    }
    this.dashboardElement = null;

    document.querySelectorAll('.sgpa-checkbox-container').forEach(el => el.remove());
    document.querySelectorAll('.sgpa-include-header').forEach(el => el.remove());

    document.querySelectorAll('tr').forEach(row => {
      if (row.dataset.sgpaCheckboxAdded) {
        delete row.dataset.sgpaCheckboxAdded;
        row.classList.remove('sgpa-row-excluded');
      }
      if (row.cells.length === 1 && row.cells[0].dataset.sgpaColspanAdjusted === 'true') {
        const currentColspan = parseInt(row.cells[0].getAttribute('colspan') || '1');
        row.cells[0].setAttribute('colspan', Math.max(1, currentColspan - 1).toString());
        delete row.cells[0].dataset.sgpaColspanAdjusted;
      }
    });

    document.querySelectorAll('table').forEach(table => {
      delete table.dataset.sgpaInitialized;
      delete table.dataset.sgpaCalculated;
    });
  }
};
