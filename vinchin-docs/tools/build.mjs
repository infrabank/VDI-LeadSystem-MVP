// One-command rebuild of the Korean site from the English mirror + translation memory.
//   node tools/build.mjs
// Runs: apply (translate site/ → dist/) → assets (copy images/css/js) → brand (Myloket banner).
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const TOOLS = fileURLToPath(new URL(".", import.meta.url));
const run = (script, args = []) => new Promise((res, rej) => {
  const p = spawn(process.execPath, [join(TOOLS, script), ...args], { stdio: "inherit" });
  p.on("exit", (c) => (c === 0 ? res() : rej(new Error(`${script} ${args.join(" ")} exited ${c}`))));
});

await run("i18n.mjs", ["apply"]);
await run("i18n.mjs", ["assets"]);
await run("brand.mjs");
console.log("\n✓ Build complete → dist/  (deploy this folder to vinchin.myloket.co.kr)");
