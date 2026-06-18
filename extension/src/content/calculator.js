// calculator.js
window.SrmSgpa = window.SrmSgpa || {};

SrmSgpa.Calculator = {
  calculate(table) {
    let overallTotalCredits = 0;
    let overallTotalPoints = 0;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const checkbox = row.querySelector('.sgpa-checkbox');
      if (!checkbox) return;

      if (checkbox.checked) {
        row.classList.remove('sgpa-row-excluded');
        const cells = row.querySelectorAll('td, th');

        const { grade, credit } = SrmSgpa.Parser.extractGradeAndCredit(cells);

        if (grade !== null && credit !== null) {
          const gradePoint = SrmSgpa.Config.gradePoints[grade];
          overallTotalCredits += credit;
          overallTotalPoints += (credit * gradePoint);
        }
      } else {
        row.classList.add('sgpa-row-excluded');
      }
    });

    const overallSgpa = overallTotalCredits > 0 ? (overallTotalPoints / overallTotalCredits).toFixed(2) : '0.00';

    return {
      overallSgpa,
      totalOverallCredits: overallTotalCredits
    };
  }
};
