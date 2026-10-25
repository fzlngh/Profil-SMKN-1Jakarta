/**
 * always kept. @media blocks are pruned inner-first and dropped when empty.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const corpusFiles = [...walk(srcDir)].filter((f) => /\.(tsx|ts|mjs|css)$/.test(f) && !f.endsWith("globals.css"));
const corpus = corpusFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const corpusTokens = new Set((corpus.toLowerCase().match(/[a-z0-9_-]{2,}/g) ?? []));

function classAlive(token) {
  token = token.toLowerCase();
  if (corpusTokens.has(token)) return true;
  // prefix match: selector .tone-0 with template "tone-${i}" in source
  for (const source of corpusTokens) {
    if (source.startsWith(token) && source.length > token.length) return true;
  }
  return false;
}

function selectorAlive(selector) {
  // Skip at-rules and comments
  if (selector.startsWith("@")) return true;
  const classes = [...selector.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
  if (!classes.length) return true; // element/id/attribute-only selector: keep
  return classes.every(classAlive);
}

// Split rules: returns array of {selector, body} plus a map for nested @media
function parseBlocks(css) {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    const selector = css.slice(i, open).trim();
    // find matching close brace
    let depth = 1, j = open + 1;
    while (j < css.length && depth > 0) {
      const ch = css[j];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    blocks.push({ selector, body, end: j });
    i = j;
  }
  return blocks;
}

const file = path.join(srcDir, "app", "globals.css");
const original = fs.readFileSync(file, "utf8");

const preambleEnd = original.indexOf("*/\n");
const preamble = preambleEnd !== -1 ? original.slice(0, preambleEnd + 3) : "";

let removed = 0, kept = 0, removedBytes = 0;
const out = [];

// Top-level pass
const blocks = parseBlocks(original);
// Reconstruct sequentially; header comments are part of `selector` strings between blocks — capture them via gaps
let cursor = 0;
const segments = [];
for (const block of blocks) {
  const gap = original.slice(cursor, original.indexOf(block.selector, cursor));
  segments.push({ gap, ...block });
  cursor = block.end;
}

for (const segment of segments) {
  out.push(segment.gap);
  const { selector, body } = segment;
  if (/^@(media|supports)/.test(selector)) {
    // prune inner rules of media/supports
    const inner = parseBlocks(body);
    const keptInner = [];
    let innerCursor = 0;
    let innerRemoved = 0;
    for (const ib of inner) {
      const igap = body.slice(innerCursor, body.indexOf(ib.selector, innerCursor));
      innerCursor = ib.end;
      if (!selectorAlive(ib.selector)) { innerRemoved += ib.selector.length + ib.body.length; continue; }
      keptInner.push(igap + ib.selector + "{" + ib.body + "}");
    }
    if (innerRemoved > 0) { removed++; removedBytes += innerRemoved; }
    if (keptInner.length) {
      kept++;
      out.push(selector + "{" + keptInner.join("\n") + "}\n");
    } else {
      // whole media block dead
      removedBytes += selector.length + body.length;
    }
  } else if (selector.startsWith("@")) {
    kept++;
    out.push(selector + "{" + body + "}\n");
  } else if (!selectorAlive(selector)) {
    removed++;
    removedBytes += selector.length + body.length;
  } else {
    kept++;
    out.push(selector + "{" + body + "}\n");
  }
}
out.push(original.slice(cursor));

const result = preamble + out.join("");
fs.writeFileSync(file, result);
console.log(JSON.stringify({
  event: "css.pruned",
  kept,
  removed,
  originalBytes: original.length,
  newBytes: result.length,
  savedKB: Math.round((original.length - result.length) / 1024)
}));
