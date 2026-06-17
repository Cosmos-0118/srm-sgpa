# SRM SGPA Calculator

A browser extension that calculates **SGPA** (Semester Grade Point Average) and **CGPA** (Cumulative GPA) directly on the SRM student portal. Enable the extension, open your provisional results, choose which courses to include, and see your GPA on the page — no manual math required.

---

## Features

- **On-page GPA display** — A dashboard card appears above your results table with overall CGPA, total credits, and per-semester SGPA.
- **Course selection** — Each course row gets an **Include** checkbox so you can include or exclude specific subjects from the calculation (useful for electives, dropped courses, or what-if scenarios).
- **Live updates** — Unchecking or rechecking a course instantly recalculates SGPA and CGPA.
- **Automatic detection** — Activates only on the SRM portal **Provisional Results** page and finds the grades table automatically.
- **Semester breakdown** — Groups results by semester (e.g. `Jan - 2024`, `Semester 3`) and shows SGPA for each.

---

## How It Works

1. Install and enable the extension (see [Installation](#installation) below).
2. Log in to the [SRM student portal](https://sp.srmist.edu.in/) and open your **Provisional Results** page.
3. The extension injects an **Include** column into the results table. All courses are checked by default.
4. Uncheck any course you want to exclude — that row dims and is left out of the GPA.
5. A **SGPA / CGPA Calculator** card appears above the table showing:
   - **Overall CGPA** — weighted average across all included courses
   - **Total Credits** — sum of credits for included courses
   - **Semester Breakdown** — SGPA for each semester block in the table

### GPA Formula

```
SGPA (per semester) = Σ (credit × grade point) / Σ (credits)
CGPA (overall)      = Σ (credit × grade point) / Σ (credits)  [all included courses]
```

### Grade Point Mapping

| Grade | Points |
|-------|--------|
| O     | 10     |
| A+    | 9      |
| A     | 8      |
| B+    | 7      |
| B     | 6      |
| C     | 5      |
| W, F, Ab, I | 0 |

---

## Installation

This extension is not published on the Chrome Web Store. Install it locally as an unpacked extension.

### Google Chrome / Microsoft Edge / Brave

1. Clone or download this repository.
2. Open your browser’s extensions page:
   - **Chrome:** `chrome://extensions`
   - **Edge:** `edge://extensions`
   - **Brave:** `brave://extensions`
3. Turn on **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `extension` folder inside this repo.
5. Visit [https://sp.srmist.edu.in/](https://sp.srmist.edu.in/), go to **Provisional Results**, and the calculator should appear.

---

## Project Structure

```
SrmCgpa/
├── Readme.md
└── extension/
    ├── manifest.json   # Extension config (Manifest V3)
    ├── content.js      # Core logic: table detection, checkboxes, GPA calculation
    └── styles.css      # Dashboard and checkbox styling
```

### `manifest.json`

- **Manifest V3** extension named **SRM SGPA Calculator** (v1.0).
- Injects `content.js` and `styles.css` on `*://sp.srmist.edu.in/*` when the page is idle.

### `content.js`

| Function | Purpose |
|----------|---------|
| `isProvisionalPage()` | Confirms the page is Provisional Results (via headings or title). |
| `findResultsTable()` | Locates the grades table (must have GRADE and CREDIT columns). |
| `initializeCheckboxes()` | Adds an **Include** column and checkbox to each course row. |
| `extractGradeAndCredit()` | Parses grade and credit from table cells. |
| `recalculateAndRender()` | Recomputes SGPA/CGPA from checked rows and updates the dashboard. |
| `renderDashboard()` | Builds and inserts the GPA summary card above the results table. |

The script uses a `MutationObserver` plus a short initial delay so it still works if the results table loads dynamically.

### `styles.css`

Styles for the dashboard card, stat boxes, semester breakdown grid, checkboxes, and dimmed excluded rows.

---

## Usage Tips

- **All courses included by default** — Uncheck only the ones you want to exclude.
- **What-if calculations** — Toggle courses on/off to see how your SGPA/CGPA would change.
- **Page must be Provisional Results** — The extension does not run on other portal pages.
- **Refresh if needed** — If the table loads slowly, refresh the page; the extension retries after 1 second.

---

## Browser Support

Any Chromium-based browser that supports **Manifest V3** extensions (Chrome, Edge, Brave, Opera, etc.).

Firefox is not supported out of the box — it would need a separate `manifest.json` adjustment for Firefox’s extension format.

---

## Disclaimer

This tool is unofficial and not affiliated with SRM Institute of Science and Technology. Always verify GPA figures with official university records. Grade parsing depends on the portal’s table layout; if SRM changes the results page structure, the extension may need an update.

---

## License

This project is provided as-is for personal use by SRM students.
