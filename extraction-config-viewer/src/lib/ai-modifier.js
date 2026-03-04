/**
 * AI Modification Engine
 *
 * Translates plain-English modification requests into structured operations
 * using the Anthropic API. Returns small operation objects (not full JSON),
 * which are then applied programmatically by config-parser.js.
 *
 * This approach ensures:
 * - No JSON truncation (operations are tiny, config can be huge)
 * - Deterministic application (operations are applied by our code, not AI)
 * - Auditability (each operation is logged with what it did)
 *
 * CONFIGURATION:
 * - Model: claude-sonnet-4-20250514
 * - Max tokens: 1000 (more than enough for operation arrays)
 * - The API key is handled by the Anthropic platform (no key needed in code)
 */

/**
 * Build a summary of the current config for the AI prompt.
 * Lists each merged table with its columns so the AI knows what's available.
 */
export function buildConfigSummary(mergedTables) {
  return mergedTables
    .map((t) => {
      const cols = Array.from(t.columns.values())
        .map((c) => `${c.name} (${c.humanName})`)
        .join(", ");
      return `Table: ${t.sourceName} (${t.humanName}) — Columns: ${cols}`;
    })
    .join("\n");
}

/**
 * Call the AI to translate an English prompt into structured operations.
 *
 * @param {string} prompt - The user's English modification request
 * @param {string} configSummary - Output of buildConfigSummary()
 * @param {string} erpName - e.g. "SAP HANA" or "SAP B1"
 * @returns {Promise<Array>} Array of operation objects
 * @throws {Error} If the API call fails or response can't be parsed
 */
export async function translateToOperations(prompt, configSummary, erpName) {
  const systemPrompt = `You translate English modification requests into structured JSON operations for an ${erpName} extraction config.

Here are the available tables and their columns:
${configSummary}

Return ONLY a JSON array of operations. No markdown, no backticks, no explanation.

Available operations:
1. Remove a column: {"op":"remove_column","table":"<TABLE>","column":"<COLUMN>"}
2. Remove a table: {"op":"remove_table","table":"<TABLE>"}
3. Add a filter: {"op":"add_filter","table":"<TABLE>","column":"<COLUMN>","operator":"IN","values":["val1"]}

The user may use English names or technical names. You must resolve to the technical names using the table/column list above.

Valid operators for filters: =, !=, >, <, >=, <=, IN, NOT IN

Return ONLY the JSON array. Example: [{"op":"remove_column","table":"BKPF","column":"KURSF"}]`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = (data.content || []).map((b) => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();

  const operations = JSON.parse(clean);
  if (!Array.isArray(operations)) {
    throw new Error("AI did not return an operations array");
  }

  return operations;
}
