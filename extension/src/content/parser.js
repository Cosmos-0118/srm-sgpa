// parser.js
window.SrmSgpa = window.SrmSgpa || {};

SrmSgpa.Parser = {
  isProvisionalPage() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-header, .card-title');
    for (let h of headings) {
      if (h.innerText.toUpperCase().includes('PROVISIONAL RESULTS')) {
        return true;
      }
    }
    if (document.title.toUpperCase().includes('PROVISIONAL RESULTS')) return true;
    return false;
  },

  findResultsTable() {
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
  },

  getStableMountPoint(table) {
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
  },

  extractGradeAndCredit(cells) {
    let grade = null;
    let credit = null;
    const gradePoints = SrmSgpa.Config.gradePoints;

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
};
