const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FORBIDDEN = [
  { name: "@/ import", re: /from\s+["']@\// },
  { name: "composition import", re: /from\s+["'][^"']*\/composition\// },
  { name: "@/services import", re: /from\s+["']@\/services\// },
];

// Built at runtime so this script file does not itself match the scanner.
const FORBIDDEN_SYMBOL = ["Enterprise", "Knowledge", "Access", "Service"].join("");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "docs", "scripts", "tests", "certification"].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.includes(".test.")) out.push(full);
  }
  return out;
}

let failed = false;
if (fs.existsSync(path.join(ROOT, "supercontab"))) {
  console.error("LINT FAIL: supercontab/ folder must not exist in guardian-core");
  failed = true;
}

for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, "utf8");
  for (const rule of FORBIDDEN) {
    if (rule.re.test(src)) {
      console.error(`LINT FAIL: ${path.relative(ROOT, file)} matches ${rule.name}`);
      failed = true;
    }
  }
  if (src.includes(FORBIDDEN_SYMBOL)) {
    console.error(`LINT FAIL: ${path.relative(ROOT, file)} references ${FORBIDDEN_SYMBOL}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log("LINT_PASS=true (no SuperContab / product coupling)");