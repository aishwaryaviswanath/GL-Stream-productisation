/**
 * Dictionary Registry
 *
 * Central registry for all ERP dictionaries. Handles:
 * 1. Auto-detection of ERP type from config JSON
 * 2. Unified lookup interface (getTable, getField, categorize)
 * 3. Tracking of unmapped tables/fields
 *
 * HOW TO ADD A NEW ERP:
 * 1. Create a new file in /dictionaries/ (e.g., oracle-fusion.js)
 *    exporting TABLES, FIELDS, categorize(), and EXAMPLE_PROMPTS
 * 2. Import it below and add to the DICTIONARIES map
 * 3. Add detection patterns to detectERP()
 *
 * That's it — the viewer will automatically support the new ERP.
 */

import * as sapHana from "./sap-hana";
import * as sapB1 from "./sap-b1";

/**
 * Registry of all supported ERP dictionaries.
 * Key = ERP display name, Value = dictionary module
 */
const DICTIONARIES = {
  "SAP HANA": sapHana,
  "SAP B1": sapB1,
  // "Oracle Fusion": oracleFusion,   // future
  // "D365 F&O": d365fo,              // future
  // "Tally": tally,                  // future
};

/**
 * Detect which ERP a config belongs to based on table names.
 * Returns the ERP name string (key in DICTIONARIES).
 */
export function detectERP(tables) {
  const names = tables.map((t) => t.fromTable?.name || t.name);

  // Score each ERP by how many table names match its dictionary
  const scores = {};
  for (const [erpName, dict] of Object.entries(DICTIONARIES)) {
    scores[erpName] = names.filter((n) => dict.TABLES[n]).length;
  }

  // Return highest-scoring ERP
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0] && sorted[0][1] > 0) return sorted[0][0];

  // Fallback: check for known patterns
  if (names.some((n) => /^(OINV|OPCH|OJDT|JDT1|ORIN|ORPC|ODPI|ORCT|OVPM|OCRD|OACT|NNM1)$/.test(n))) return "SAP B1";
  if (names.some((n) => /^(BKPF|BSEG|VBRK|VBRP|EKKO|EKPO)$/.test(n))) return "SAP HANA";

  return "Unknown ERP";
}

/**
 * Get the dictionary for a detected ERP.
 * Returns { tables, fields, categorize, examplePrompts }
 */
export function getDictionary(erpName) {
  const dict = DICTIONARIES[erpName];
  if (!dict) {
    // Return an empty dictionary for unknown ERPs
    return {
      tables: {},
      fields: {},
      categorize: () => "Other",
      examplePrompts: [
        "Remove a column from a table",
        "Stop extracting a table",
        "Add a filter condition",
      ],
    };
  }
  return {
    tables: dict.TABLES,
    fields: dict.FIELDS,
    categorize: dict.categorize,
    examplePrompts: dict.EXAMPLE_PROMPTS,
  };
}

/** Get all supported ERP names */
export function getSupportedERPs() {
  return Object.keys(DICTIONARIES);
}
