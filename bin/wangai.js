#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const args = process.argv.slice(2);
const command = args[0];

const I18N = {
  en: {
    helpTitle: "wangai CLI",
    usage: "Usage:",
    commands: "Commands:",
    initDesc: "Initialize AI workflow configs in current project",
    initOptions: "Init options:",
    unknownCommand: "Unknown command",
    helpHint: "Run `wangai --help` to see available commands.",
    chooseLang: "Choose language [en/zh] [en]: ",
    initBanner: "WangAI project initializer",
    chooseWorkflow: "Choose AI workflow:",
    selectWorkflow: "Select workflow [1]: ",
    chooseStack: "Choose stack:",
    selectStack: "Select stack [1]: ",
    askRouter: "Use router? (y/n) [y]: ",
    askTs: "Use TypeScript? (y/n) [y]: ",
    askEslint: "Use ESLint? (y/n) [y]: ",
    askStateVue: "State manager [pinia/none] [pinia]: ",
    askStateReact: "State manager [redux/zustand/none] [redux]: ",
    askExclude: "Add .claude/.codex/.gemini to local git exclude? (y/n) [y]: ",
    askProjectName: "Project name [TBD]: ",
    askProjectSummary: "Project summary [TBD]: ",
    askFramework: "Framework",
    askLanguage: "Language [TypeScript]: ",
    askStyling: "Styling [Tailwind CSS]: ",
    done: "Init completed.",
    workflows: "workflows",
    stack: "stack",
    state: "state",
    created: "created",
    reminder: "reminder: missing fields",
    tbd: "TBD",
    fieldProjectName: "project name",
    fieldProjectSummary: "project summary",
    fieldFramework: "framework",
    fieldLanguage: "language",
    fieldStyling: "styling",
    contextTitle: "## Project Context (injected by wangai init)",
    contextProjectName: "Project",
    contextProjectSummary: "Summary",
    contextTechStack: "Tech stack",
    contextRouter: "Router",
    contextTs: "TypeScript",
    contextEslint: "ESLint",
    contextState: "State",
    contextPlatformLimit: "Platform limits",
    limitClaude:
      "Constrained by Claude tool permissions and command patterns; keep .claude rules aligned.",
    limitCodex:
      "Constrained by Codex AGENTS/tool model behavior; prioritize project-level .codex rules.",
    limitGemini:
      "Gemini templates are a compatibility layer; adjust tools and permission details to your runtime.",
  },
  zh: {
    helpTitle: "wangai CLI",
    usage: "用法:",
    commands: "命令:",
    initDesc: "在当前项目初始化 AI 工作流配置",
    initOptions: "init 参数:",
    unknownCommand: "未知命令",
    helpHint: "运行 `wangai --help` 查看可用命令。",
    chooseLang: "选择语言 [en/zh] [zh]: ",
    initBanner: "WangAI 项目初始化向导",
    chooseWorkflow: "选择 AI 工作流:",
    selectWorkflow: "选择 workflow [1]: ",
    chooseStack: "选择技术栈:",
    selectStack: "选择技术栈 [1]: ",
    askRouter: "是否启用 router? (y/n) [y]: ",
    askTs: "是否启用 TypeScript? (y/n) [y]: ",
    askEslint: "是否启用 ESLint? (y/n) [y]: ",
    askStateVue: "状态管理 [pinia/none] [pinia]: ",
    askStateReact: "状态管理 [redux/zustand/none] [redux]: ",
    askExclude: "是否写入本地 git exclude（.claude/.codex/.gemini）? (y/n) [y]: ",
    askProjectName: "项目名 [待补充]: ",
    askProjectSummary: "项目概述 [待补充]: ",
    askFramework: "框架",
    askLanguage: "语言 [TypeScript]: ",
    askStyling: "样式方案 [Tailwind CSS]: ",
    done: "初始化完成。",
    workflows: "workflows",
    stack: "技术栈",
    state: "状态管理",
    created: "已生成",
    reminder: "提醒: 以下字段待补充",
    tbd: "待补充",
    fieldProjectName: "项目名",
    fieldProjectSummary: "项目概述",
    fieldFramework: "框架",
    fieldLanguage: "语言",
    fieldStyling: "样式方案",
    contextTitle: "## 项目上下文（由 wangai init 注入）",
    contextProjectName: "项目名",
    contextProjectSummary: "项目概述",
    contextTechStack: "技术栈",
    contextRouter: "路由",
    contextTs: "TypeScript",
    contextEslint: "ESLint",
    contextState: "状态管理",
    contextPlatformLimit: "平台限制",
    limitClaude: "受 Claude 工具权限与命令格式约束，建议按 .claude 规范维护。",
    limitCodex: "受 Codex AGENTS/工具模型约束，优先使用项目级 .codex 规则。",
    limitGemini: "Gemini 模板为兼容层，需按实际插件能力补充工具与权限细节。",
  },
};

function parseInitOptions(rawArgs) {
  const options = {};
  for (let i = 0; i < rawArgs.length; i += 1) {
    const token = rawArgs[i];
    const next = rawArgs[i + 1];
    if (token === "--workflow" && next) {
      options.workflow = next;
      i += 1;
    } else if (token === "--stack" && next) {
      options.stack = next;
      i += 1;
    } else if (token === "--router" && next) {
      options.router = next;
      i += 1;
    } else if (token === "--ts" && next) {
      options.ts = next;
      i += 1;
    } else if (token === "--eslint" && next) {
      options.eslint = next;
      i += 1;
    } else if (token === "--state" && next) {
      options.state = next;
      i += 1;
    } else if (token === "--git-exclude" && next) {
      options.gitExclude = next;
      i += 1;
    } else if (token === "--project-name" && next) {
      options.projectName = next;
      i += 1;
    } else if (token === "--project-summary" && next) {
      options.projectSummary = next;
      i += 1;
    } else if (token === "--framework" && next) {
      options.framework = next;
      i += 1;
    } else if (token === "--language" && next) {
      options.language = next;
      i += 1;
    } else if (token === "--styling" && next) {
      options.styling = next;
      i += 1;
    } else if (token === "--lang" && next) {
      options.lang = next.toLowerCase();
      i += 1;
    } else if (token === "--yes") {
      options.yes = true;
    }
  }
  return options;
}

function resolveLang(options) {
  if (options.lang === "zh" || options.lang === "en") {
    return options.lang;
  }
  const env = process.env.LANG || process.env.LC_ALL || "";
  if (env.toLowerCase().includes("zh")) {
    return "zh";
  }
  return "en";
}

function msg(lang, key) {
  const table = I18N[lang] || I18N.en;
  return table[key] || I18N.en[key] || key;
}

function printHelp(lang) {
  console.log(msg(lang, "helpTitle"));
  console.log("");
  console.log(msg(lang, "usage"));
  console.log("  wangai init");
  console.log("  wangai --help");
  console.log("");
  console.log(msg(lang, "commands"));
  console.log(`  init    ${msg(lang, "initDesc")}`);
  console.log("");
  console.log(msg(lang, "initOptions"));
  console.log("  --workflow <claude|codex|gemini|all>");
  console.log("  --stack <react|vue|next|nuxt>");
  console.log("  --router <y|n> --ts <y|n> --eslint <y|n> --state <...>");
  console.log("  --project-name <name> --project-summary <text>");
  console.log("  --framework <name> --language <name> --styling <name>");
  console.log("  --lang <zh|en> --git-exclude <y|n> --yes");
}

function ask(rl, question, fallback) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const v = answer.trim();
      if (!v && typeof fallback === "string") {
        resolve(fallback);
        return;
      }
      resolve(v);
    });
  });
}

function ensureDirSync(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileSync(rootDir, relativePath, content) {
  const abs = path.join(rootDir, relativePath);
  ensureDirSync(path.dirname(abs));
  fs.writeFileSync(abs, content, "utf8");
}

function appendUniqueLine(filePath, line) {
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";
  if (!existing.includes(line)) {
    const next = `${existing}${existing.endsWith("\n") || !existing ? "" : "\n"}${line}\n`;
    ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, next, "utf8");
  }
}

function renderTemplate(text, context) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    if (!(key in context)) {
      return "";
    }
    const value = context[key];
    return typeof value === "string" ? value : String(value);
  });
}

function fallbackTodo(value, lang) {
  return value && String(value).trim() ? String(value).trim() : msg(lang, "tbd");
}

function platformLimitText(platform, lang) {
  if (platform === "claude") return msg(lang, "limitClaude");
  if (platform === "codex") return msg(lang, "limitCodex");
  if (platform === "gemini") return msg(lang, "limitGemini");
  return msg(lang, "tbd");
}

function appendProjectContextIfNeeded(content, target, context) {
  const isAgentOrCommandOrSkill =
    /(^|[\\/])\.(claude|codex|gemini)[\\/](agents|commands|skills)[\\/].+\.md$/.test(
      target,
    );
  if (!isAgentOrCommandOrSkill) {
    return content;
  }

  const platform = target.includes(".claude")
    ? "claude"
    : target.includes(".codex")
      ? "codex"
      : "gemini";

  const lang = context.ui_lang || "en";
  const block = [
    "",
    msg(lang, "contextTitle"),
    `- ${msg(lang, "contextProjectName")}: ${context.project_name}`,
    `- ${msg(lang, "contextProjectSummary")}: ${context.project_summary}`,
    `- ${msg(lang, "contextTechStack")}: ${context.framework} + ${context.language} + ${context.styling}`,
    `- ${msg(lang, "contextRouter")}: ${context.router_enabled}`,
    `- ${msg(lang, "contextTs")}: ${context.ts_enabled}`,
    `- ${msg(lang, "contextEslint")}: ${context.eslint_enabled}`,
    `- ${msg(lang, "contextState")}: ${context.state}`,
    `- ${msg(lang, "contextPlatformLimit")}: ${platformLimitText(platform, lang)}`,
  ].join("\n");

  if (content.includes(msg(lang, "contextTitle"))) {
    return content;
  }
  return `${content.replace(/\s*$/, "")}\n${block}\n`;
}

function loadRegistry() {
  const registryPath = path.join(__dirname, "..", "templates", "registry.json");
  const raw = fs.readFileSync(registryPath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function shouldRenderEntry(entry, workflows) {
  if (!entry.workflows || entry.workflows.length === 0) {
    return true;
  }
  return entry.workflows.some((w) => workflows.includes(w));
}

function generateFromTemplates(cwd, workflows, context) {
  const registry = loadRegistry();
  const templatesRoot = path.join(__dirname, "..", "templates");
  for (const entry of registry.files) {
    if (!shouldRenderEntry(entry, workflows)) {
      continue;
    }
    const templatePath = path.join(templatesRoot, entry.template);
    const tpl = fs.readFileSync(templatePath, "utf8");
    let rendered = renderTemplate(tpl, context);
    rendered = appendProjectContextIfNeeded(rendered, entry.target, context);
    writeFileSync(cwd, entry.target, rendered);
  }
}

function normalizeWorkflow(input) {
  if (input === "codex") return ["codex"];
  if (input === "gemini") return ["gemini"];
  if (input === "all") return ["claude", "codex", "gemini"];
  return ["claude"];
}

function normalizeStack(input) {
  const allowed = ["react", "vue", "next", "nuxt"];
  if (allowed.includes(input)) return input;
  return "react";
}

async function initProject(cliOptions) {
  const cwd = process.cwd();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const usePrompt = !cliOptions.yes;
  let uiLang = resolveLang(cliOptions);

  if (usePrompt && !cliOptions.lang) {
    const def = uiLang === "zh" ? "zh" : "en";
    const selected = (await ask(rl, msg(uiLang, "chooseLang"), def)).toLowerCase();
    uiLang = selected === "zh" ? "zh" : "en";
  }

  let workflowInput = cliOptions.workflow;
  if (!workflowInput && usePrompt) {
    console.log(msg(uiLang, "initBanner"));
    console.log("");
    console.log(msg(uiLang, "chooseWorkflow"));
    console.log("  1) claude");
    console.log("  2) codex");
    console.log("  3) gemini");
    console.log("  4) all");
    const workflowChoice = await ask(rl, msg(uiLang, "selectWorkflow"), "1");
    workflowInput =
      workflowChoice === "2"
        ? "codex"
        : workflowChoice === "3"
          ? "gemini"
          : workflowChoice === "4"
            ? "all"
            : "claude";
  }
  if (!workflowInput) workflowInput = "claude";

  let stackInput = cliOptions.stack;
  if (!stackInput && usePrompt) {
    console.log("");
    console.log(msg(uiLang, "chooseStack"));
    console.log("  1) react");
    console.log("  2) vue");
    console.log("  3) next");
    console.log("  4) nuxt");
    const stackChoice = await ask(rl, msg(uiLang, "selectStack"), "1");
    stackInput =
      stackChoice === "2"
        ? "vue"
        : stackChoice === "3"
          ? "next"
          : stackChoice === "4"
            ? "nuxt"
            : "react";
  }
  const stack = normalizeStack(stackInput || "react");

  const getBoolean = async (value, promptText, defaultValue) => {
    if (value === "y" || value === "yes" || value === "true") return true;
    if (value === "n" || value === "no" || value === "false") return false;
    if (!usePrompt) return defaultValue;
    return (await ask(rl, promptText, defaultValue ? "y" : "n")).toLowerCase() === "y";
  };

  const useRouter = await getBoolean(cliOptions.router, msg(uiLang, "askRouter"), true);
  const useTs = await getBoolean(cliOptions.ts, msg(uiLang, "askTs"), true);
  const useEslint = await getBoolean(cliOptions.eslint, msg(uiLang, "askEslint"), true);

  let state = cliOptions.state;
  if (!state && usePrompt) {
    if (stack === "vue" || stack === "nuxt") {
      const v = await ask(rl, msg(uiLang, "askStateVue"), "pinia");
      state = v === "none" ? "none" : "pinia";
    } else {
      const v = await ask(rl, msg(uiLang, "askStateReact"), "redux");
      state = v === "zustand" || v === "none" ? v : "redux";
    }
  }
  if (!state) state = stack === "vue" || stack === "nuxt" ? "pinia" : "redux";

  const addGitExclude = await getBoolean(
    cliOptions.gitExclude,
    msg(uiLang, "askExclude"),
    true,
  );

  const workflows = normalizeWorkflow(workflowInput);
  const projectName =
    cliOptions.projectName ||
    (usePrompt ? await ask(rl, msg(uiLang, "askProjectName"), msg(uiLang, "tbd")) : msg(uiLang, "tbd"));
  const projectSummary =
    cliOptions.projectSummary ||
    (usePrompt ? await ask(rl, msg(uiLang, "askProjectSummary"), msg(uiLang, "tbd")) : msg(uiLang, "tbd"));
  const framework =
    cliOptions.framework ||
    (usePrompt ? await ask(rl, `${msg(uiLang, "askFramework")} [${stack}]: `, stack) : stack);
  const language =
    cliOptions.language ||
    (usePrompt ? await ask(rl, msg(uiLang, "askLanguage"), "TypeScript") : "TypeScript");
  const styling =
    cliOptions.styling ||
    (usePrompt ? await ask(rl, msg(uiLang, "askStyling"), "Tailwind CSS") : "Tailwind CSS");

  const context = {
    ui_lang: uiLang,
    stack,
    router_enabled: useRouter ? "enabled" : "disabled",
    ts_enabled: useTs ? "enabled" : "disabled",
    eslint_enabled: useEslint ? "enabled" : "disabled",
    state,
    workflows: workflows.join(", "),
    project_name: fallbackTodo(projectName, uiLang),
    project_summary: fallbackTodo(projectSummary, uiLang),
    framework: fallbackTodo(framework, uiLang),
    language: fallbackTodo(language, uiLang),
    styling: fallbackTodo(styling, uiLang),
  };

  generateFromTemplates(cwd, workflows, context);

  const config = {
    generatedBy: "@wangai/cli",
    version: "0.1.0",
    workflows,
    stack,
    language: uiLang,
    features: {
      router: useRouter,
      typescript: useTs,
      eslint: useEslint,
      state,
    },
    createdAt: new Date().toISOString(),
  };
  writeFileSync(cwd, "wangai.config.json", `${JSON.stringify(config, null, 2)}\n`);

  if (addGitExclude && fs.existsSync(path.join(cwd, ".git"))) {
    const excludePath = path.join(cwd, ".git", "info", "exclude");
    appendUniqueLine(excludePath, ".claude/");
    appendUniqueLine(excludePath, ".codex/");
    appendUniqueLine(excludePath, ".gemini/");
  }

  console.log("");
  console.log(msg(uiLang, "done"));
  console.log(`${msg(uiLang, "workflows")}: ${workflows.join(", ")}`);
  console.log(`${msg(uiLang, "stack")}: ${stack}`);
  console.log(`${msg(uiLang, "state")}: ${state}`);
  console.log(`${msg(uiLang, "created")}: wangai.config.json`);

  const reminders = [];
  if (context.project_name === msg(uiLang, "tbd")) reminders.push(msg(uiLang, "fieldProjectName"));
  if (context.project_summary === msg(uiLang, "tbd")) reminders.push(msg(uiLang, "fieldProjectSummary"));
  if (context.framework === msg(uiLang, "tbd")) reminders.push(msg(uiLang, "fieldFramework"));
  if (context.language === msg(uiLang, "tbd")) reminders.push(msg(uiLang, "fieldLanguage"));
  if (context.styling === msg(uiLang, "tbd")) reminders.push(msg(uiLang, "fieldStyling"));

  if (reminders.length > 0) {
    console.log(`${msg(uiLang, "reminder")}: ${reminders.join(", ")}`);
  }

  rl.close();
}

const baseLang = resolveLang(parseInitOptions(args.slice(1)));

if (!command || command === "--help" || command === "-h") {
  printHelp(baseLang);
  process.exit(0);
}

if (command === "init") {
  initProject(parseInitOptions(args.slice(1))).catch((err) => {
    console.error(err);
    process.exit(1);
  });
  return;
}

console.error(`${msg(baseLang, "unknownCommand")}: ${command}`);
console.error(msg(baseLang, "helpHint"));
process.exit(1);

