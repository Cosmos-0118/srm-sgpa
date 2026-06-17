// content.js
(function() {
  const gradePoints = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5,
    'W': 0, 'F': 0, 'Ab': 0, 'I': 0
  };

  let dashboardElement = null;

  function isProvisionalPage() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-header, .card-title');
    for (let h of headings) {
      if (h.innerText.toUpperCase().includes('PROVISIONAL RESULTS')) {
        return true;
      }
    }
    if (document.title.toUpperCase().includes('PROVISIONAL RESULTS')) return true;
    return false;
  }

  function findResultsTable() {
    const tables = document.querySelectorAll('table');
    for (let table of tables) {
      if (table.rows.length < 3) continue;
      
      let hasGrade = false;
      let hasCredit = false;
      
      const checkLimit = Math.min(table.rows.length, 3);
      for (let i = 0; i < checkLimit; i++) {
        const rowText = table.rows[i].innerText.toUpperCase();
        if (rowText.includes('GRADE') && rowText.includes('CREDIT')) {
          hasGrade = true;
          hasCredit = true;
          break;
        }
      }
      
      if (hasGrade && hasCredit) return table;
    }
    return null;
  }

  function getStableMountPoint(table) {
    let current = table;
    while (current.parentNode && current.parentNode !== document.body) {
      const parent = current.parentNode;
      const classList = parent.className || '';
      if (typeof classList === 'string' && (classList.includes('row') || classList.includes('card-body') || classList.includes('container'))) {
         return current; 
      }
      let elementChildren = 0;
      for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].nodeType === 1) elementChildren++;
      }
      if (elementChildren > 1) {
        return current;
      }
      current = parent;
    }
    return table;
  }

  function extractGradeAndCredit(cells) {
    let grade = null;
    let credit = null;

    for (let i = cells.length - 1; i >= 0; i--) {
      const text = cells[i].innerText.trim();
      if (gradePoints[text] !== undefined) {
        grade = text;
        for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
          const textCell = cells[j].innerText.trim();
          const possibleCredit = parseFloat(textCell);
          if (!isNaN(possibleCredit) && possibleCredit.toString() === textCell) {
             credit = possibleCredit;
             break;
          }
        }
        break;
      }
    }
    return { grade, credit };
  }

  function renderDashboard(semesters, overallCgpa, totalOverallCredits, targetTable) {
    if (!dashboardElement || !document.body.contains(dashboardElement)) {
      dashboardElement = document.createElement('div');
      dashboardElement.className = 'card card-icon border-custom lift lift-sm mb-4 mt-1 sgpa-dashboard-container';
      
      dashboardElement.style.border = '1px solid #e3e6f0';
      dashboardElement.style.borderRadius = '8px';
      dashboardElement.style.boxShadow = '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)';
      dashboardElement.style.backgroundColor = '#fff';
      dashboardElement.style.marginBottom = '20px';
      dashboardElement.style.overflow = 'hidden';
      dashboardElement.style.width = '100%';
      
      const mountPoint = getStableMountPoint(targetTable);
      if (mountPoint && mountPoint.parentNode) {
         mountPoint.parentNode.insertBefore(dashboardElement, mountPoint);
      }
    }

    let semesterBreakdownHtml = '';
    semesters.forEach(sem => {
      semesterBreakdownHtml += `
        <div style="display:flex; justify-content:space-between; padding: 12px 16px; background: rgba(0, 123, 255, 0.05); border-radius: 8px; margin-bottom: 8px; font-weight: bold; border: 1px solid rgba(0, 123, 255, 0.1);">
          <span style="color: #495057; font-family: sans-serif;">${sem.title}</span>
          <span style="color: #007bff; font-size: 16px; font-family: sans-serif;">${sem.sgpa}</span>
        </div>
      `;
    });

    dashboardElement.innerHTML = `
      <div style="background-color: #007bff; color: white; padding: 12px 20px; font-weight: bold; display: flex; align-items: center; font-family: sans-serif; font-size: 16px;">
        <svg style="width:18px; height:18px; margin-right:10px; fill:currentColor;" viewBox="0 0 512 512"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg> 
        SGPA / CGPA Calculator
      </div>
      <div style="padding: 20px;">
        <div style="display:flex; flex-wrap:wrap; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1 1 200px;">
            <div style="padding: 20px; border: 1px solid #e3e6f0; border-radius: 8px; text-align: center; background: #fff; box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);">
              <div style="font-size: 13px; color: #1cc88a; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; font-family: sans-serif;">Overall CGPA</div>
              <div style="font-size: 36px; font-weight: 800; color: #5a5c69; font-family: sans-serif;">${overallCgpa}</div>
            </div>
          </div>
          <div style="flex: 1 1 200px;">
            <div style="padding: 20px; border: 1px solid #e3e6f0; border-radius: 8px; text-align: center; background: #fff; box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);">
              <div style="font-size: 13px; color: #4e73df; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; font-family: sans-serif;">Total Credits</div>
              <div style="font-size: 36px; font-weight: 800; color: #5a5c69; font-family: sans-serif;">${totalOverallCredits}</div>
            </div>
          </div>
        </div>
        ${semesters.length > 0 ? `
          <h6 style="color: #4e73df; font-weight: bold; margin-top: 12px; margin-bottom: 16px; font-size: 14px; text-transform: uppercase; font-family: sans-serif;">Semester Breakdown</h6>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
            ${semesterBreakdownHtml}
          </div>
        ` : ''}
      </div>
    `;
  }

  function recalculateAndRender(table) {
    let overallTotalCredits = 0;
    let overallTotalPoints = 0;

    const semestersMap = {}; 
    let lastSeenSemesterTitle = 'Unknown Semester';
    const semesterTitles = [];

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const rowText = row.innerText.trim();
      const isHeaderRow = (row.cells.length === 1 && row.cells[0].colSpan > 3) || 
                          rowText.match(/^[a-z]{3}\s*-\s*\d{4}$/i) || 
                          rowText.match(/^semester\s*\d+/i);
      
      if (isHeaderRow) {
        if (rowText.length > 0 && rowText.length < 50) {
          lastSeenSemesterTitle = rowText;
          if (!semestersMap[lastSeenSemesterTitle]) {
            semestersMap[lastSeenSemesterTitle] = { credits: 0, points: 0 };
            semesterTitles.push(lastSeenSemesterTitle);
          }
        }
      } else {
        const checkbox = row.querySelector('.sgpa-checkbox');
        if (!checkbox) return; 

        if (checkbox.checked) {
          row.style.opacity = '1';
          const cells = row.querySelectorAll('td, th');
          
          const { grade, credit } = extractGradeAndCredit(cells);

          if (grade !== null && credit !== null) {
            const gradePoint = gradePoints[grade];
            
            if (!semestersMap[lastSeenSemesterTitle]) {
              semestersMap[lastSeenSemesterTitle] = { credits: 0, points: 0 };
              semesterTitles.push(lastSeenSemesterTitle);
            }
            
            semestersMap[lastSeenSemesterTitle].credits += credit;
            semestersMap[lastSeenSemesterTitle].points += (credit * gradePoint);
            
            overallTotalCredits += credit;
            overallTotalPoints += (credit * gradePoint);
          }
        } else {
          row.style.opacity = '0.5';
        }
      }
    });

    const semesters = semesterTitles.map(title => {
      const data = semestersMap[title];
      return {
        title: title,
        sgpa: data.credits > 0 ? (data.points / data.credits).toFixed(2) : '0.00'
      };
    }).filter(sem => sem.sgpa !== '0.00' || semestersMap[sem.title].credits > 0);

    const overallCgpa = overallTotalCredits > 0 ? (overallTotalPoints / overallTotalCredits).toFixed(2) : '0.00';
    renderDashboard(semesters, overallCgpa, overallTotalCredits, table);
  }

  function initializeCheckboxes(table) {
    if (table.dataset.sgpaInitialized) return;

    const rows = table.querySelectorAll('tr');
    let headerHandled = false;

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) return;

      let rowText = row.innerText.toUpperCase();
      if (!headerHandled && rowText.includes('GRADE') && rowText.includes('CREDIT')) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.innerText = 'Include';
        th.style.padding = '8px';
        th.style.textAlign = 'center';
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
         }
         return;
      }

      const { grade, credit } = extractGradeAndCredit(cells);
      if (grade !== null && credit !== null) {
        if (!row.dataset.sgpaCheckboxAdded) {
          const td = document.createElement(cells[0].tagName === 'TH' ? 'th' : 'td');
          td.className = 'sgpa-checkbox-container';
          td.style.textAlign = 'center';
          td.style.verticalAlign = 'middle';
          
          td.innerHTML = `<input type="checkbox" class="sgpa-checkbox" style="width:16px; height:16px; cursor:pointer;" checked>`;
          
          row.insertBefore(td, row.cells[0]);
          
          const checkbox = td.querySelector('.sgpa-checkbox');
          checkbox.addEventListener('change', () => recalculateAndRender(table));

          row.dataset.sgpaCheckboxAdded = 'true';
        }
      }
    });

    table.dataset.sgpaInitialized = 'true';
  }

  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
         shouldRun = true;
         break;
      }
    }

    if (shouldRun) {
      if (!isProvisionalPage()) return;
      const table = findResultsTable();
      if (table && !table.dataset.sgpaCalculated) {
        initializeCheckboxes(table);
        recalculateAndRender(table);
        table.dataset.sgpaCalculated = 'true';
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    if (!isProvisionalPage()) return;
    const table = findResultsTable();
    if (table && !table.dataset.sgpaCalculated) {
      initializeCheckboxes(table);
      recalculateAndRender(table);
      table.dataset.sgpaCalculated = 'true';
    }
  }, 1000);
})();
