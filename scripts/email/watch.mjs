import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const forwardedArgs = process.argv.slice(2);
const watchedPaths = [
  "scripts/email/render.ts",
  "scripts/email/watch.mjs",
  "scripts/email/examples/welcome.json",
  "scripts/theme/build-tokens.mjs",
  "src/lib/server/email/renderMjml.ts",
  "src/lib/server/email/templates/index.ts",
  "src/lib/server/email/templates/welcome.ts",
  "src/lib/theme/tokens.js",
  "static/branding/letsworm-logo-stacked.svg",
  "tsconfig.email.json",
  "package.json",
];

let activeProcess = null;
let shouldRerun = false;
let debounceTimer = null;

const runPreview = () => {
  if (activeProcess) {
    shouldRerun = true;
    return;
  }

  activeProcess = spawn("npm", ["run", "email:preview", "--", ...forwardedArgs], {
    cwd,
    stdio: "inherit",
    shell: true,
  });

  activeProcess.on("exit", () => {
    activeProcess = null;

    if (shouldRerun) {
      shouldRerun = false;
      runPreview();
    }
  });
};

const scheduleRun = (changedPath) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    console.log(`\n[watch] change detected: ${changedPath}`);
    runPreview();
  }, 150);
};

for (const watchedPath of watchedPaths) {
  const absolutePath = path.join(cwd, watchedPath);

  watch(absolutePath, (_eventType, filename) => {
    const changedPath = filename ? path.join(path.dirname(watchedPath), filename) : watchedPath;
    scheduleRun(changedPath);
  }).on("error", (error) => {
    console.error(`[watch] failed on ${watchedPath}: ${error.message}`);
  });
}

console.log("[watch] watching email files");
console.log("[watch] press Ctrl+C to stop");
runPreview();
