<div align="center">

<img src="logo.png" alt="srmsgpa logo" width="88" style="border-radius:16px; margin-bottom:8px"/>

# srmsgpa

**SGPA Calculator for the SRM Student Portal**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4f46e5?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![Version](https://img.shields.io/badge/version-1.1-059669?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-gray?style=flat-square)](#legal)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-coming%20soon-f59e0b?style=flat-square)](#install)

Instantly see your SGPA on the SRM provisional results page — no copy-pasting, no spreadsheets.

[Install](#install) · [How It Works](#how-it-works) · [Run Locally](#run-locally) · [Project Structure](#project-structure)

</div>

---

## Overview

**srmsgpa** is a lightweight browser extension that injects a live SGPA dashboard directly into your SRM portal results page. Select which courses to include, and the calculator updates in real time.

- Reads grades directly from the page — **nothing leaves your browser**
- Works on Chrome, Edge, Brave, and any Chromium-based browser
- Clean, modern UI with dark mode support

---

## Features

| Feature | Description |
|---------|-------------|
| **Live SGPA dashboard** | A card appears above your results showing overall SGPA and total credits |
| **Per-course toggle** | Each row gets an **Include** checkbox — exclude electives or dropped subjects instantly |
| **Real-time recalculation** | Uncheck a course and SGPA updates on the spot |
| **On/Off toggle** | Disable the extension from the toolbar popup without uninstalling |
| **Dark mode** | Respects your system preference, with a manual theme toggle in the popup |
| **Privacy-first** | No analytics, no external requests — all logic runs locally |

---

## How It Works

1. Open the **Provisional Results** page on [sp.srmist.edu.in](https://sp.srmist.edu.in/)
2. The extension detects the grades table and injects an **Include** checkbox column
3. A **SGPA Calculator** card appears above the table — all courses are checked by default
4. Uncheck any course to exclude it; the SGPA and credit totals update immediately

### SGPA Formula

```
SGPA = Σ (credit × grade point) / Σ (credits)    ← included courses only
```

### Grade Point Scale

| Grade | Points | | Grade | Points |
|-------|--------|-|-------|--------|
| O | 10 | | B+ | 7 |
| A+ | 9 | | B | 6 |
| A | 8 | | C | 5 |
| — | — | | W / F / Ab / I | 0 |

---

## Install

### Chrome Web Store *(coming soon)*

> The extension will be published on the Chrome Web Store. Link will appear here once available.
>
> **[→ Add to Chrome](#)** *(placeholder — update with store link on publish)*

---

### Run Locally

Install the unpacked extension in any Chromium browser in a few steps.

**1. Get the code**

```bash
git clone https://github.com/balatharunr/srm-sgpa.git
cd srm-sgpa
```

Or [download the ZIP](../../archive/refs/heads/main.zip) and extract it.

**2. Open your browser's extensions page**

| Browser | URL |
|---------|-----|
| Chrome | `chrome://extensions` |
| Edge | `edge://extensions` |
| Brave | `brave://extensions` |

**3. Enable Developer Mode**

Toggle **Developer mode** on (top-right corner of the extensions page).

**4. Load the extension**

Click **Load unpacked** → select the `extension/` folder inside this repo.

```
srm-sgpa/
└── extension/   ← select this folder
```

The **srmsgpa** icon will appear in your browser toolbar.

**5. Use it**

Navigate to [sp.srmist.edu.in](https://sp.srmist.edu.in/) → log in → open **Provisional Results**. The dashboard appears automatically.

> **Tip:** If the table loads slowly, refresh the page. The extension retries after 1 second.

---

## Usage Tips

- **What-if mode** — Toggle individual courses on/off to simulate different SGPA scenarios
- **Turn off anytime** — Use the popup toggle to pause the extension without uninstalling
- **Refresh if needed** — If you toggled the extension back on, refresh the Provisional Results page

---

## Project Structure

```
srm-sgpa/
├── logo.png
└── extension/
    ├── manifest.json              # Manifest V3 config
    ├── assets/
    │   ├── icons/                 # 16 / 48 / 128 px icons
    │   └── legal/
    │       ├── privacy-policy.html
    │       ├── terms-of-service.html
    │       └── legal.css
    └── src/
        ├── content/               # Scripts injected into the portal page
        │   ├── config.js          # Grade-point mapping
        │   ├── parser.js          # DOM inspection & table detection
        │   ├── calculator.js      # SGPA calculation logic
        │   ├── ui.js              # Dashboard rendering & checkbox injection
        │   ├── orchestrator.js    # Lifecycle, MutationObserver, storage sync
        │   └── content.css        # Dashboard styles
        └── popup/                 # Toolbar popup UI
            ├── popup.html
            ├── popup.js           # Toggle state & theme switching
            └── popup.css
```

### Module Responsibilities

Scripts are injected in dependency order: `config → parser → calculator → ui → orchestrator`.

| Module | Namespace | Role |
|--------|-----------|------|
| `config.js` | `SrmSgpa.Config` | Grade-point lookup table |
| `parser.js` | `SrmSgpa.Parser` | Detect provisional results page, find grades table, extract grade/credit values |
| `calculator.js` | `SrmSgpa.Calculator` | Compute SGPA from checked rows |
| `ui.js` | `SrmSgpa.UI` | Inject dashboard card and checkbox column; handle cleanup |
| `orchestrator.js` | *(IIFE)* | Bootstrap lifecycle, MutationObserver, storage toggle listener |

---

## Privacy

- Grades are read from the page and calculated entirely in your browser
- The only data stored is your toggle state and theme preference (`chrome.storage.local`)
- No tracking, no telemetry, no external requests

See [Privacy Policy](extension/assets/legal/privacy-policy.html) and [Terms of Service](extension/assets/legal/terms-of-service.html).

---

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 88+ | ✅ |
| Edge 88+ | ✅ |
| Brave | ✅ |
| Opera (Chromium) | ✅ |
| Firefox | ❌ Requires separate manifest adjustments |

---

## Disclaimer

This tool is **not affiliated with SRM Institute of Science and Technology**. Always verify your GPA with official university records. Grade parsing depends on the portal's table layout; if SRM updates the results page structure, the extension may need an update.

---

## Legal

Copyright © 2026 **srmsgpa**. All rights reserved.

- [Privacy Policy](extension/assets/legal/privacy-policy.html)
- [Terms of Service](extension/assets/legal/terms-of-service.html)
