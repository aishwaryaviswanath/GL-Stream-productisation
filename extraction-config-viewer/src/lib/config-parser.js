/**
 * Extraction Config Parser
 *
 * Core logic for:
 * - Merging columns by physical source table (deduplication across joins/unions)
 * - Extracting hardcoded filters from WHERE clauses
 * - Applying modification operations to config JSON
 */

/**
 * Merge all columns by physical source table.
 * If BKPF appears 3x in the config (as BKPF, BKPF_BSEC union, BKPF_UNION),
 * this returns ONE entry with the union of all columns.
 *
 * @param {Array} tables - The tables array from the config JSON
 * @param {Object} dict - { tables: {}, fields: {} } from the dictionary
 * @returns {Array} Merged table objects sorted alphabetically
 */
export function mergeBySourceTable(tables, dict) {
  const merged = {};

  for (const t of tables) {
    const src = t.fromTable?.name || t.name;

    if (!merged[src]) {
      merged[src] = {
        sourceName: src,
        humanName: dict.tables[src] || src,
        columns: new Map(),
        configEntries: [],
      };
    }

    merged[src].configEntries.push(t.name);

    for (const col of t.select || []) {
      if (!merged[src].columns.has(col.name)) {
        merged[src].columns.set(col.name, {
          name: col.name,
          humanName: dict.fields[col.name] || col.name,
          persist: col.persist || false,
        });
      } else if (col.persist) {
        merged[src].columns.get(col.name).persist = true;
      }
    }
  }

  return Object.values(merged).sort((a, b) =>
    a.sourceName.localeCompare(b.sourceName)
  );
}

/**
 * Extract all hardcoded filters from WHERE clauses (deduplicated).
 *
 * @param {Array} tables - The tables array from the config JSON
 * @param {Object} dict - { tables: {}, fields: {} } from the dictionary
 * @returns {Array} Filter objects with sourceTable, column, operator, values
 */
export function extractFilters(tables, dict) {
  const filters = [];
  const seen = new Set();

  const walkExprs = (list, tableName, srcTable) => {
    for (const item of list) {
      const e = item.expr;
      if (e && e.value && !e.reference_column) {
        const key = `${e.column?.name}|${e.operator}|${e.value.join(",")}`;
        if (!seen.has(key)) {
          seen.add(key);
          filters.push({
            sourceTable: srcTable,
            column: e.column?.name,
            columnHuman: dict.fields[e.column?.name] || e.column?.name,
            operator: e.operator,
            values: e.value,
          });
        }
      }
      if (item.listOfExpr) walkExprs(item.listOfExpr, tableName, srcTable);
    }
  };

  for (const t of tables) {
    if (!t.where) continue;
    const src = t.fromTable?.name || t.name;
    for (const clause of t.where) {
      if (clause.listOfExpr) walkExprs(clause.listOfExpr, t.name, src);
      if (clause.expr) walkExprs([clause], t.name, src);
    }
  }

  return filters;
}

/**
 * Apply structured operations to a config JSON.
 * Operations are small JSON objects like:
 *   { op: "remove_column", table: "BKPF", column: "KURSF" }
 *   { op: "remove_table", table: "ADRC" }
 *   { op: "add_filter", table: "BKPF", column: "BLART", operator: "IN", values: ["RE"] }
 *
 * @param {Object} config - The full config JSON
 * @param {Array} operations - Array of operation objects
 * @param {Object} dict - { tables: {}, fields: {} } from the dictionary
 * @returns {{ config: Object, summary: string[] }}
 */
export function applyOperations(config, operations, dict) {
  let c = JSON.parse(JSON.stringify(config)); // deep clone
  const summary = [];

  for (const op of operations) {
    switch (op.op) {
      case "remove_column": {
        let count = 0;
        for (const t of c.tables) {
          const src = t.fromTable?.name || t.name;
          if (src === op.table) {
            const before = t.select?.length || 0;
            t.select = (t.select || []).filter((s) => s.name !== op.column);
            count += before - (t.select?.length || 0);
          }
        }
        summary.push(
          `Removed column ${op.column} (${dict.fields[op.column] || op.column}) from ${op.table} — ${count} instance(s)`
        );
        break;
      }

      case "remove_table": {
        const before = c.tables.length;
        const toRemove = new Set();

        // Find direct entries
        for (const t of c.tables) {
          if ((t.fromTable?.name || t.name) === op.table) {
            toRemove.add(t.name);
          }
        }

        // Cascade: remove entries that depend on removed entries via fae
        let changed = true;
        while (changed) {
          changed = false;
          for (const t of c.tables) {
            if (!toRemove.has(t.name) && t.fae && toRemove.has(t.fae)) {
              toRemove.add(t.name);
              changed = true;
            }
          }
        }

        c.tables = c.tables.filter((t) => !toRemove.has(t.name));
        summary.push(
          `Removed table ${op.table} (${dict.tables[op.table] || op.table}) — ${before - c.tables.length} config entries removed`
        );
        break;
      }

      case "add_filter": {
        let applied = false;
        for (const t of c.tables) {
          const src = t.fromTable?.name || t.name;
          if (src === op.table && !t.fae) {
            if (!t.where) t.where = [];
            const newExpr = {
              expr: {
                column: { alias: t.fromTable?.alias || "t", name: op.column },
                operator: op.operator || "IN",
                value: op.values,
              },
            };
            if (t.where.length > 0 && t.where[0].listOfExpr) {
              t.where[0].listOfExpr.push(newExpr);
            } else {
              t.where.push({ booleanOperator: "AND", listOfExpr: [newExpr] });
            }
            applied = true;
            break;
          }
        }
        summary.push(
          applied
            ? `Added filter: ${op.column} (${dict.fields[op.column] || op.column}) ${op.operator || "IN"} [${op.values.join(", ")}] on ${op.table}`
            : `Could not find table ${op.table} to add filter`
        );
        break;
      }

      default:
        summary.push(`Unknown operation: ${op.op}`);
    }
  }

  return { config: c, summary };
}

/** Display-friendly operator labels */
export const OP_DISPLAY = {
  "=": "equals",
  "!=": "≠",
  ">=": "≥",
  "<=": "≤",
  ">": ">",
  "<": "<",
  IN: "in",
  "NOT IN": "not in",
};
