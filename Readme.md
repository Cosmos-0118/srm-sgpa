# srmsgpa — SRM SGPA Calculator

<p align="center">
  <img src="logo.jpeg" alt="srmsgpa logo" width="96">
</p>

A browser extension that calculates **SGPA** (Semester Grade Point Average) directly on the SRM student portal. Enable the extension, open your provisional results, choose which courses to include, and see your SGPA on the page — no manual math required.

**© 2026 srmsgpa. All rights reserved.**

---

## Features

- **On-page SGPA display** — A dashboard card appears above your results table with overall SGPA and total credits.
- **Course selection** — Each course row gets an **Include** checkbox so you can include or exclude specific subjects from the calculation (useful for electives, dropped courses, or what-if scenarios).
- **Live updates** — Unchecking or rechecking a course instantly recalculates SGPA.
- **On/off toggle** — Use the toolbar popup to enable or disable the calculator without uninstalling the extension.
- **Automatic detection** — Activates only on the SRM portal **Provisional Results** page and finds the grades table automatically.

---

## How It Works

1. Install and enable the extension (see [Installation](#installation) below).
2. Click the **srmsgpa** icon in your browser toolbar to open the popup. The extension is **On** by default.
3. Log in to the [SRM student portal](https://sp.srmist.edu.in/) and open your **Provisional Results** page.
4. The extension injects an **Include** column into the results table. All courses are checked by default.
5. Uncheck any course you want to exclude — that row dims and is left out of the calculation.
6. A **SGPA Calculator** card appears above the table showing:
   - **Overall SGPA** — weighted average across all included courses
   - **Total Credits** — sum of credits for included courses

### SGPA Formula

```
SGPA (overall) = Σ (credit × grade point) / Σ (credits)  [all included courses]
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

### Extension Popup

Click the srmsgpa icon in the toolbar to:

- **Toggle the extension on or off** — when off, the dashboard and checkboxes are removed from the page.
- Open the **Privacy Policy** and **Terms of Service**.

After turning the extension back on, refresh the Provisional Results page if the calculator does not appear.

---

## Project Structure

```
SrmSgpa/
├── Readme.md
├── logo.jpeg                  # Source logo asset (renamed to proper)
└── extension/
    ├── manifest.json          # Extension config (Manifest V3)
    ├── assets/                # Static assets and documents
    │   ├── icons/             # Extension icons
    │   │   ├── logo.jpeg
    │   │   ├── icon16.png
    │   │   ├── icon48.png
    │   │   └── icon128.png
    │   └── legal/             # Legal documentation pages
    │       ├── privacy-policy.html
    │       ├── terms-of-service.html
    │       └── legal.css
    └── src/                   # Extension source code
        ├── content/           # Content script module (runs on provisional results page)
        │   ├── config.js      # Global config mappings
        │   ├── parser.js      # Page parser utilities
        │   ├── calculator.js  # Pure SGPA calculations
        │   ├── ui.js          # Injected UI rendering & events
        │   ├── orchestrator.js # Lifecycle events and listeners
        │   └── content.css    # Dashboard card stylesheet
        └── popup/             # Extension popup UI
            ├── popup.html
            ├── popup.css
            └── popup.js
```

### `manifest.json`

- **Manifest V3** extension named **SRM SGPA Calculator** (`srmsgpa`, v1.1).
- Toolbar popup, extension icons, and `storage` permission for the on/off toggle.
- Injects the content script modules (config, parser, calculator, ui, orchestrator) and styles on `*://sp.srmist.edu.in/*` when the page is idle.

### Content Script Modules (`extension/src/content/`)

To separate concerns and make maintenance/scaling easier, `content.js` has been split into five domain-specific modules:

| Module | Purpose |
|--------|---------|
| `config.js` | Holds global configuration like grade points mappings (`SrmSgpa.Config`). |
| `parser.js` | Contains DOM inspection and scraping functions to parse page headings, detect results tables, locate mount points, and extract cell contents (`SrmSgpa.Parser`). |
| `calculator.js` | Pure business logic to calculate SGPA based on courses selection (`SrmSgpa.Calculator`). |
| `ui.js` | Injected UI components rendering, checkbox initialization, and extension DOM cleanup (`SrmSgpa.UI`). |
| `orchestrator.js` | Main lifecycle entrypoint. Binds mutation observers, handles delays, watches local storage toggle, and orchestrates other modules. |

The script uses a `MutationObserver` plus a short initial delay so it still works if the results table loads dynamically.

### Privacy & Data

- **No data leaves your browser.** Grades are read from the page and calculated locally.
- The only stored preference is whether the extension is on or off (`chrome.storage.local`).
- See [extension/assets/legal/privacy-policy.html](extension/assets/legal/privacy-policy.html) and [extension/assets/legal/terms-of-service.html](extension/assets/legal/terms-of-service.html) for full details.

---

## Usage Tips

- **All courses included by default** — Uncheck only the ones you want to exclude.
- **What-if calculations** — Toggle courses on/off to see how your SGPA would change.
- **Turn off anytime** — Use the popup toggle to pause the extension without uninstalling.
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

## Legal

- [Privacy Policy](extension/assets/legal/privacy-policy.html)
- [Terms of Service](extension/assets/legal/terms-of-service.html)

Copyright © 2026 **srmsgpa**. All rights reserved.
