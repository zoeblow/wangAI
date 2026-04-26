#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function insertSection(filePath, sectionText, versionLine) {
  const raw = fs.readFileSync(filePath, "utf8");
  if (raw.includes(versionLine)) {
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
  const root = process.cwd();
  const pkgPath = path.join(root, "package.json");
  const enPath = path.join(root, "CHANGELOG.md");
  const cnPath = path.join(root, "CHANGELOG-cn.md");

  if (!fs.existsSync(pkgPath) || !fs.existsSync(enPath) || !fs.existsSync(cnPath)) {
    console.error("Required files not found: package.json / CHANGELOG.md / CHANGELOG-cn.md");
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8").replace(/^\uFEFF/, ""));
  const version = pkg.version;
  const date = today();
  const versionLine = `## [${version}] - ${date}`;

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

  const enChanged = insertSection(enPath, enSection, versionLine);
  const cnChanged = insertSection(cnPath, cnSection, versionLine);
  if (!enChanged && !cnChanged) {
    console.log(`No change: version ${version} already exists.`);
    return;
  }
  console.log(`Changelog updated for version ${version}.`);
}

main();

