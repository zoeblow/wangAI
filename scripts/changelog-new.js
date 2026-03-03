#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === "--version" && next) {
      args.version = next;
      i += 1;
    } else if (token === "--date" && next) {
      args.date = next;
      i += 1;
    }
  }
  return args;
}

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function insertSection(filePath, sectionText) {
  const raw = fs.readFileSync(filePath, "utf8");
  const exists = raw.includes(sectionText.split("\n")[0]);
  if (exists) {
    return false;
  }
  const marker = "\n## [";
  const idx = raw.indexOf(marker);
  if (idx === -1) {
    const next = `${raw.trimEnd()}\n\n${sectionText}\n`;
    fs.writeFileSync(filePath, next, "utf8");
    return true;
  }
  const head = raw.slice(0, idx).trimEnd();
  const tail = raw.slice(idx);
  const next = `${head}\n\n${sectionText}\n${tail.replace(/^\n+/, "\n")}`;
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.version) {
    console.error("Missing required option: --version <x.y.z>");
    process.exit(1);
  }

  const date = args.date || today();
  const versionLine = `## [${args.version}] - ${date}`;

  const enSection = [
    versionLine,
    "",
    "### Added",
    "- TBD",
    "",
    "### Changed",
    "- TBD",
    "",
    "### Fixed",
    "- TBD",
  ].join("\n");

  const cnSection = [
    versionLine,
    "",
    "### 新增",
    "- 待补充",
    "",
    "### 变更",
    "- 待补充",
    "",
    "### 修复",
    "- 待补充",
  ].join("\n");

  const root = process.cwd();
  const enPath = path.join(root, "CHANGELOG.md");
  const cnPath = path.join(root, "CHANGELOG-cn.md");

  if (!fs.existsSync(enPath) || !fs.existsSync(cnPath)) {
    console.error("CHANGELOG.md or CHANGELOG-cn.md not found in current directory.");
    process.exit(1);
  }

  const enChanged = insertSection(enPath, enSection);
  const cnChanged = insertSection(cnPath, cnSection);

  if (!enChanged && !cnChanged) {
    console.log(`No change: version ${args.version} already exists.`);
    return;
  }
  console.log(`Created changelog sections for version ${args.version}.`);
}

main();

