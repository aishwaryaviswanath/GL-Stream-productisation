# Extraction Config Viewer

View and modify ERP extraction configs with human-readable names. Supports SAP HANA and SAP B1.

## Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) v18+ installed on your machine.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR-ORG/gl-stream-productization.git
cd gl-stream-productization/extraction-config-viewer

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser. You'll see the config viewer.

**To test immediately:** Copy the contents of `samples/sample-sap-b1.json` and paste into the viewer.

## What it does

1. **Paste** an extraction config JSON → auto-detects ERP type (SAP HANA vs SAP B1)
2. **View** tables and columns with English names, grouped by category (Accounting, AR, AP, etc.)
3. **See filters** — all WHERE conditions in one consolidated view
4. **Modify** via plain English (e.g., "Remove the Exchange Rate column from GL Headers")
5. **Export** the modified JSON

## Project Structure

```
extraction-config-viewer/
├── index.html                  # Entry HTML
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite config
├── tailwind.config.js          # Tailwind config
├── samples/                    # Sample configs for testing
│   └── sample-sap-b1.json
└── src/
    ├── main.jsx                # React entry point
    ├── index.css               # Tailwind imports
    ├── App.jsx                 # Main application (all-in-one)
    ├── dictionaries/           # ERP table/field name mappings
    │   ├── index.js            # Registry + auto-detection
    │   ├── sap-hana.js         # SAP HANA: 55 tables, 200+ fields
    │   └── sap-b1.js           # SAP B1: 70+ tables, 180+ fields
    └── lib/
        ├── config-parser.js    # Merge tables, extract filters, apply ops
        └── ai-modifier.js      # English → structured operations via Claude API
```

> **Note:** `App.jsx` is currently a self-contained single file with all logic and dictionaries inlined. The modular files in `dictionaries/` and `lib/` are the refactored versions for when you integrate into the SaaS platform. Both contain the same logic.

## How to Add a New ERP (e.g., Oracle Fusion, D365)

Estimated time: ~30 minutes per ERP if you have the table/field reference.

### Step 1: Create the dictionary

Create `src/dictionaries/oracle-fusion.js`:

```javascript
export const TABLES = {
  ra_customer_trx_all: "AR Transaction Headers",
  ra_customer_trx_lines_all: "AR Transaction Lines",
  // ... add all tables
};

export const FIELDS = {
  customer_trx_id: "Transaction ID",
  trx_date: "Transaction Date",
  // ... add all fields
};

export function categorize(tableName) {
  if (["ra_customer_trx_all"].includes(tableName)) return "Accounts Receivable";
  return "Other";
}

export const EXAMPLE_PROMPTS = [
  "Remove the transaction date from AR headers",
];
```

### Step 2: Register it

In `src/dictionaries/index.js`, add one import and one line:

```javascript
import * as oracleFusion from "./oracle-fusion";

const DICTIONARIES = {
  "SAP HANA": sapHana,
  "SAP B1": sapB1,
  "Oracle Fusion": oracleFusion,  // add this
};
```

### Step 3: Done

Auto-detection, UI grouping, and AI modification all work automatically for the new ERP.

## How AI Modification Works

Instead of asking AI to return the entire modified JSON (which truncates on large configs), we use an operation-based approach:

1. User types: "Remove the Exchange Rate column from GL Headers"
2. AI returns: `[{"op":"remove_column","table":"OJDT","column":"DocRate"}]`
3. JavaScript applies the operation to the config deterministically

Supported operations:

| Operation | Example |
|-----------|---------|
| `remove_column` | `{"op":"remove_column","table":"BKPF","column":"KURSF"}` |
| `remove_table` | `{"op":"remove_table","table":"ADRC"}` |
| `add_filter` | `{"op":"add_filter","table":"OINV","column":"CANCELED","operator":"=","values":["N"]}` |

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |

## Unmapped Fields

When the viewer encounters a table or field not in the dictionary, it shows an amber "unmapped" indicator. The summary card shows a count of gaps. This tells you exactly what to add to the dictionary files.

Future enhancement: AI fallback lookup for unmapped fields — call Claude to identify the field from SAP docs, then cache the result in the dictionary.
