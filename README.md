# Extraction Config Viewer

A React-based tool for Integration Engineers to visualize, understand, and modify ERP extraction configs without needing to read raw JSON.

## What it does

1. **Parses** extraction config JSON and auto-detects the ERP type (SAP HANA, SAP B1)
2. **Displays** tables and columns with human-readable names, grouped by functional category
3. **Shows filters** (hardcoded WHERE conditions) in a readable format
4. **Modifies configs** via plain English prompts (powered by Claude AI)
5. **Flags unmapped** tables/fields that aren't in the dictionary yet

## Architecture

```
src/
├── dictionaries/           # ERP-specific table/field name mappings
│   ├── index.js            # Registry: auto-detection + unified lookup
│   ├── sap-hana.js         # SAP HANA (S/4HANA) dictionary
│   └── sap-b1.js           # SAP Business One dictionary
├── lib/
│   ├── config-parser.js    # Core logic: merge tables, extract filters, apply ops
│   └── ai-modifier.js      # AI engine: English → structured operations
├── components/             # React components (future extraction)
└── App.jsx                 # Main React application (single-file artifact)
```

## How to add a new ERP

### Step 1: Create the dictionary file

Create `src/dictionaries/your-erp.js`:

```javascript
// Table name → Human readable name
export const TABLES = {
  ra_customer_trx_all: "AR Transaction Headers",
  ra_customer_trx_lines_all: "AR Transaction Lines",
  // ...
};

// Field name → Human readable name
export const FIELDS = {
  customer_trx_id: "Transaction ID",
  trx_date: "Transaction Date",
  // ...
};

// Categorize tables into functional groups
export function categorize(tableName) {
  if (["ra_customer_trx_all", "ra_customer_trx_lines_all"].includes(tableName))
    return "Accounts Receivable";
  // ...
  return "Other";
}

// Example prompts for the Modify tab
export const EXAMPLE_PROMPTS = [
  "Remove the transaction date column from AR headers",
  // ...
];
```

### Step 2: Register it

In `src/dictionaries/index.js`:

```javascript
import * as oracleFusion from "./oracle-fusion";

const DICTIONARIES = {
  "SAP HANA": sapHana,
  "SAP B1": sapB1,
  "Oracle Fusion": oracleFusion,  // ← add this
};
```

Add detection patterns in `detectERP()` if needed.

### Step 3: Done

The viewer will automatically:
- Detect configs from your ERP
- Display human-readable names
- Show ERP-specific example prompts
- Flag any unmapped fields

## How the AI modification works

Instead of asking the AI to return the entire modified JSON (which truncates on large configs), we use a **two-step approach**:

1. **AI translates** English → small operation objects:
   ```json
   [{"op": "remove_column", "table": "BKPF", "column": "KURSF"}]
   ```

2. **JavaScript applies** the operations programmatically to the config

This means:
- AI responses are always small (no truncation)
- Operations are deterministic and auditable
- The change history shows exactly what was modified

### Supported operations

| Operation | JSON | What it does |
|-----------|------|-------------|
| Remove column | `{"op":"remove_column","table":"X","column":"Y"}` | Removes column Y from all config entries sourced from table X |
| Remove table | `{"op":"remove_table","table":"X"}` | Removes all config entries for table X, including cascading dependencies |
| Add filter | `{"op":"add_filter","table":"X","column":"Y","operator":"IN","values":["v1"]}` | Adds a WHERE condition to the first matching config entry |

## Handling unmapped fields

When the viewer encounters a table or field not in the dictionary:
- It displays the technical name with an amber "unmapped" indicator
- The summary card shows a count of unmapped tables/fields
- **Future**: For unmapped fields, trigger an AI call to look up the field description from SAP documentation, then cache the result in the dictionary

## Development

This is currently a single-file React artifact (`App.jsx`) that runs in the Claude.ai artifact renderer. To use in a standalone React project:

1. Split the imports from `App.jsx` to use the modular files in `src/`
2. Install dependencies: `react`, `tailwindcss`
3. The Anthropic API call in `ai-modifier.js` needs the Claude.ai context (API key is handled by the platform). For standalone use, add your API key to the headers.

## Config JSON format

The viewer expects a JSON object with a `tables` array:

```json
{
  "tables": [
    {
      "name": "BKPF",
      "fromTable": { "name": "BKPF", "alias": "t" },
      "select": [
        { "name": "BUKRS", "persist": true },
        { "name": "BELNR", "persist": true }
      ],
      "where": [
        {
          "booleanOperator": "AND",
          "listOfExpr": [
            {
              "expr": {
                "column": { "alias": "t", "name": "BUKRS" },
                "operator": "IN",
                "value": ["8854"]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Category icons

Each ERP category gets a visual icon in the UI:

| Category | Icon |
|----------|------|
| Accounting / General Ledger | 📒 |
| Billing & Sales / AR | 🧾 |
| Purchasing / AP | 📦 |
| Business Partners | 🤝 |
| India Localization | 🇮🇳 |
| Tax Configuration | 🧮 |
| Payments | 💳 |
| Fixed Assets | 🏗️ |
| Config & Reference Data | ⚙️ |
