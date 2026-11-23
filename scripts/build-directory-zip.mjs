#!/usr/bin/env node

// Builds the upload ZIP for the ChatGPT plugin directory from
// directory/fidelity-studio-content-assistant. The package files sit at the
// ZIP's root, as the directory expects. Run the validator first.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = resolve(root, "directory/fidelity-studio-content-assistant");
const { name, version } = JSON.parse(readFileSync(resolve(packageDir, "plugin.json"), "utf8"));

execFileSync(process.execPath, [resolve(root, "scripts/validate-plugin.mjs")], { stdio: "inherit" });

const outDir = resolve(root, "dist");
const zipPath = resolve(outDir, `${name}-${version}.zip`);
mkdirSync(outDir, { recursive: true });
rmSync(zipPath, { force: true });
// -X drops extra file attributes; .DS_Store and other dot files stay out.
execFileSync("zip", ["-r", "-X", zipPath, ".", "-x", ".*", "-x", "*/.*"], { cwd: packageDir, stdio: "inherit" });
console.log(`Built ${zipPath}`);
