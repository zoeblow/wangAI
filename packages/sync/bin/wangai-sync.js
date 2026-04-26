#!/usr/bin/env node

const fs = require('fs')
const fsp = require('fs/promises')
const os = require('os')
const path = require('path')
const readline = require('readline/promises')
const { stdin, stdout } = require('process')

const APP_DIR = path.join(os.homedir(), '.wangai', 'sync')
const CONFIG_FILE = path.join(APP_DIR, 'config.json')
const CREDENTIAL_FILE = path.join(APP_DIR, 'credentials.json')
const BASELINE_DIR = path.join(APP_DIR, 'baseline')
const BASELINE_FILE = path.join(BASELINE_DIR, 'baseline.json')
const HISTORY_DIR = path.join(BASELINE_DIR, 'history')

const DEFAULT_PLATFORMS = {
  codex: { root: path.join(os.homedir(), '.codex') },
  claude: { root: path.join(os.homedir(), '.claude') },
  gemini: { root: path.join(os.homedir(), '.gemini') },
  cursor: { root: path.join(os.homedir(), '.cursor') },
  openclaw: { root: path.join(os.homedir(), '.openclaw') }
}

const I18N = {
  zh: {
    cliPrefix: '[wangai-sync]',
    missingCredential: '缺少 WebDAV 凭据，请先执行 `wangai-sync login`。',
    unsupportedSnapshot: '不支持的快照格式。',
    emptySnapshot: '空快照。',
    commandUnknown: '未知命令',
    commandHint: '执行 `wangai-sync --help` 查看可用命令。',
    notLoggedIn: '尚未登录，请先执行 `wangai-sync login`。',
    configMissing: '缺少配置，请先执行 `wangai-sync login` 和 `wangai-sync init`。',
    baselineMissing: '缺少基线文件',
    pullFromInvalid: '无效的 --from，必须是 baseline 或 remote。',
    help: `
wangai-sync

用法:
  wangai-sync login
  wangai-sync init
  wangai-sync push
  wangai-sync pull [--from baseline|remote]
  wangai-sync status
  wangai-sync --help

全局参数:
  --lang <zh|en>   输出语言（默认 zh）

说明:
  - login: 仅登录并更新 WebDAV 连接信息
  - init: 初始化平台配置并重建统一 baseline
  - push: 重新生成 baseline 并推送到 WebDAV
  - pull: 拉取 baseline 并分发到各平台目录
`,
    promptBaseUrl: 'WebDAV 基础地址',
    promptFolder: 'WebDAV 目录',
    promptUsername: 'WebDAV 用户名',
    promptPassword: 'WebDAV 应用密码',
    promptPlatformEnabled: (name) => `${name} 是否启用? [Y/n]`,
    promptPlatformRoot: (name) => `${name} 根目录`,
    promptPullSource: '拉取来源 [baseline/remote] [baseline]: ',
    localStatus: '本地状态',
    remoteStatus: '远端状态',
    baselineExtracted: '基线已生成',
    configSaved: '配置已保存',
    loginSaved: '登录信息已保存',
    pushDone: '推送完成',
    pullDone: '拉取完成',
    applySkipped: (name) => `跳过 ${name}: 已禁用`,
    applyDone: (name, s, a) => `已应用 ${name}: skills=${s}, agents=${a}`,
    statusConfig: '配置文件',
    statusCredentials: '凭据文件',
    statusWebdav: 'WebDAV',
    statusBaselineExists: '基线存在',
    statusBaselineMode: '基线模式',
    statusBaselineCounts: '基线数量',
    statusPasswordSaved: '密码已保存',
    statusPlatform: (name, root, enabled) => `${name} root=${root} enabled=${enabled}`,
    statusPlatformKinds: (skills, agents) => `  skills=${skills} agents=${agents}`,
    mergeConflictNote: '检测到同名路径冲突，按平台顺序优先保留先出现内容。'
  },
  en: {
    cliPrefix: '[wangai-sync]',
    missingCredential: 'Missing WebDAV credentials. Run `wangai-sync login` first.',
    unsupportedSnapshot: 'Unsupported snapshot format.',
    emptySnapshot: 'Empty snapshot.',
    commandUnknown: 'Unknown command',
    commandHint: 'Run `wangai-sync --help` to see available commands.',
    notLoggedIn: 'Not logged in. Run `wangai-sync login` first.',
    configMissing: 'Missing config. Run `wangai-sync login` and `wangai-sync init` first.',
    baselineMissing: 'Missing baseline file',
    pullFromInvalid: 'Invalid --from. Use baseline or remote.',
    help: `
wangai-sync

Usage:
  wangai-sync login
  wangai-sync init
  wangai-sync push
  wangai-sync pull [--from baseline|remote]
  wangai-sync status
  wangai-sync --help

Global options:
  --lang <zh|en>   output language (default: zh)

Notes:
  - login: login only and update WebDAV connection settings
  - init: initialize platform settings and rebuild unified baseline
  - push: rebuild baseline and upload to WebDAV
  - pull: fetch baseline and fan-out to all platform roots
`,
    promptBaseUrl: 'WebDAV base URL',
    promptFolder: 'WebDAV folder',
    promptUsername: 'WebDAV username',
    promptPassword: 'WebDAV app password',
    promptPlatformEnabled: (name) => `${name} enabled? [Y/n]`,
    promptPlatformRoot: (name) => `${name} root`,
    promptPullSource: 'Pull source [baseline/remote] [baseline]: ',
    localStatus: 'Local status',
    remoteStatus: 'Remote status',
    baselineExtracted: 'Baseline extracted',
    configSaved: 'Config saved',
    loginSaved: 'Login saved',
    pushDone: 'Push complete',
    pullDone: 'Pull complete',
    applySkipped: (name) => `Skipped ${name}: disabled`,
    applyDone: (name, s, a) => `Applied ${name}: skills=${s}, agents=${a}`,
    statusConfig: 'Config file',
    statusCredentials: 'Credentials file',
    statusWebdav: 'WebDAV',
    statusBaselineExists: 'Baseline exists',
    statusBaselineMode: 'Baseline mode',
    statusBaselineCounts: 'Baseline counts',
    statusPasswordSaved: 'Password saved',
    statusPlatform: (name, root, enabled) => `${name} root=${root} enabled=${enabled}`,
    statusPlatformKinds: (skills, agents) => `  skills=${skills} agents=${agents}`,
    mergeConflictNote: 'Found duplicate paths with different content; first source wins by platform order.'
  }
}

function parseArgs(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    const next = argv[i + 1]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      if (!next || next.startsWith('--')) {
        out[key] = true
      } else {
        out[key] = next
        i += 1
      }
    } else {
      out._.push(token)
    }
  }
  return out
}

function resolveLang(args) {
  const raw = String(args.lang || process.env.WANGAI_SYNC_LANG || 'zh').toLowerCase()
  return raw === 'en' ? 'en' : 'zh'
}

function msg(lang, key, ...params) {
  const v = I18N[lang]?.[key] ?? I18N.zh[key] ?? key
  if (typeof v === 'function') {
    return v(...params)
  }
  return v
}

function log(lang, text) {
  stdout.write(`${msg(lang, 'cliPrefix')} ${text}\n`)
}

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true })
}

async function readJson(filePath, fallback = null) {
  try {
    const text = await fsp.readFile(filePath, 'utf8')
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath))
  await fsp.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function writeCredentials(data) {
  await writeJson(CREDENTIAL_FILE, data)
  if (process.platform !== 'win32') {
    try {
      await fsp.chmod(CREDENTIAL_FILE, 0o600)
    } catch {}
  }
}

function resolveWebdavPaths(config) {
  const base = config.webdav.baseUrl.replace(/\/+$/, '')
  const folder = config.webdav.folder.replace(/^\/+|\/+$/g, '')
  const rootUrl = `${base}/${folder}`
  return {
    rootUrl,
    latestUrl: `${rootUrl}/latest.json`,
    snapshotsUrl: `${rootUrl}/snapshots`
  }
}

function getAuthHeader(config, lang) {
  const user = process.env.WANGAI_SYNC_WEBDAV_USERNAME
    || config.credentials?.username
    || config.webdav?.username
  const pass = process.env.WANGAI_SYNC_WEBDAV_PASSWORD
    || config.credentials?.password
  if (!user || !pass) {
    throw new Error(msg(lang, 'missingCredential'))
  }
  const basic = Buffer.from(`${user}:${pass}`).toString('base64')
  return { Authorization: `Basic ${basic}` }
}

async function webdavRequest(url, method, config, lang, body = null, extraHeaders = {}) {
  const headers = {
    ...getAuthHeader(config, lang),
    ...extraHeaders
  }
  const response = await fetch(url, { method, headers, body })
  if (!response.ok && response.status !== 405 && response.status !== 409) {
    const text = await response.text()
    throw new Error(`WebDAV ${method} ${url} failed: ${response.status} ${text}`)
  }
  return response
}

async function ensureWebdavFolders(config, lang) {
  const { rootUrl, snapshotsUrl } = resolveWebdavPaths(config)
  await webdavRequest(rootUrl, 'MKCOL', config, lang)
  await webdavRequest(snapshotsUrl, 'MKCOL', config, lang)
}

async function walkFiles(rootDir) {
  const results = []
  async function walk(currentDir) {
    const entries = await fsp.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const abs = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(abs)
      } else {
        results.push(abs)
      }
    }
  }
  await walk(rootDir)
  return results
}

function toUnixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function isMarkdownFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.md'
}

async function collectKind(root, kind) {
  const target = path.join(root, kind)
  if (!fs.existsSync(target)) {
    return []
  }
  const files = await walkFiles(target)
  const out = []
  for (const abs of files) {
    if (!isMarkdownFile(abs)) {
      continue
    }
    try {
      const content = await fsp.readFile(abs, 'utf8')
      const relative = toUnixPath(path.relative(target, abs))
      out.push({ path: relative, content })
    } catch {}
  }
  return out
}

function upsertUnified(map, source, files, conflicts) {
  for (const item of files) {
    const key = item.path
    const existing = map.get(key)
    if (!existing) {
      map.set(key, { path: item.path, content: item.content, source })
      continue
    }
    if (existing.content !== item.content) {
      conflicts.push({ path: item.path, winner: existing.source, ignored: source })
    }
  }
}

async function collectUnifiedBaseline(platforms) {
  const entries = Object.entries(platforms).filter(([, info]) => info && info.enabled !== false)
  const skillMap = new Map()
  const agentMap = new Map()
  const conflicts = []

  for (const [name, info] of entries) {
    const skills = await collectKind(info.root, 'skills')
    const agents = await collectKind(info.root, 'agents')
    upsertUnified(skillMap, name, skills, conflicts)
    upsertUnified(agentMap, name, agents, conflicts)
  }

  return {
    version: 2,
    mode: 'unified',
    generatedAt: new Date().toISOString(),
    sourceOrder: entries.map(([name]) => name),
    skills: Array.from(skillMap.values()),
    agents: Array.from(agentMap.values()),
    stats: {
      skills: skillMap.size,
      agents: agentMap.size,
      conflicts: conflicts.length
    },
    conflicts
  }
}

async function applyKind(root, kind, files) {
  const targetRoot = path.join(root, kind)
  await ensureDir(targetRoot)
  for (const item of files) {
    const abs = path.join(targetRoot, item.path)
    await ensureDir(path.dirname(abs))
    await fsp.writeFile(abs, item.content, 'utf8')
  }
}

async function collectUnifiedBaselineFromLegacy(legacyPlatforms, platforms) {
  const order = Object.keys(platforms || {})
  const skillsMap = new Map()
  const agentsMap = new Map()
  const pickOrder = order.length > 0 ? order : Object.keys(legacyPlatforms)
  for (const name of pickOrder) {
    const bucket = legacyPlatforms[name]
    if (!bucket) continue
    upsertUnified(skillsMap, name, Array.isArray(bucket.skills) ? bucket.skills : [], [])
    upsertUnified(agentsMap, name, Array.isArray(bucket.agents) ? bucket.agents : [], [])
  }
  return {
    skills: Array.from(skillsMap.values()),
    agents: Array.from(agentsMap.values())
  }
}

async function normalizeSnapshot(snapshot, platforms, lang) {
  if (!snapshot) {
    throw new Error(msg(lang, 'emptySnapshot'))
  }
  if (Array.isArray(snapshot.skills) && Array.isArray(snapshot.agents)) {
    return {
      version: snapshot.version || 2,
      mode: snapshot.mode || 'unified',
      generatedAt: snapshot.generatedAt || new Date().toISOString(),
      skills: snapshot.skills,
      agents: snapshot.agents
    }
  }
  if (snapshot.platforms && typeof snapshot.platforms === 'object') {
    const unified = await collectUnifiedBaselineFromLegacy(snapshot.platforms, platforms)
    return {
      version: 2,
      mode: 'unified',
      generatedAt: snapshot.generatedAt || new Date().toISOString(),
      skills: unified.skills,
      agents: unified.agents
    }
  }
  throw new Error(msg(lang, 'unsupportedSnapshot'))
}

async function applySnapshot(snapshot, platforms, lang) {
  for (const [name, info] of Object.entries(platforms)) {
    if (!info || info.enabled === false) {
      log(lang, msg(lang, 'applySkipped', name))
      continue
    }
    await ensureDir(info.root)
    await applyKind(info.root, 'skills', snapshot.skills || [])
    await applyKind(info.root, 'agents', snapshot.agents || [])
    log(lang, msg(lang, 'applyDone', name, snapshot.skills?.length || 0, snapshot.agents?.length || 0))
  }
}

function getTimestamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

async function loadRuntimeConfig() {
  const config = (await readJson(CONFIG_FILE, {})) || {}
  const credentials = (await readJson(CREDENTIAL_FILE, {})) || {}

  if (config.webdav?.password) {
    const nextCredentials = {
      username: credentials.username || config.webdav.username || '',
      password: credentials.password || config.webdav.password || '',
      updatedAt: new Date().toISOString()
    }
    await writeCredentials(nextCredentials)
    const nextConfig = {
      ...config,
      webdav: { ...(config.webdav || {}) }
    }
    delete nextConfig.webdav.password
    await writeJson(CONFIG_FILE, nextConfig)
    return { ...nextConfig, credentials: nextCredentials }
  }

  return { ...config, credentials }
}

function assertLoggedIn(runtimeConfig, lang) {
  const username = process.env.WANGAI_SYNC_WEBDAV_USERNAME
    || runtimeConfig.credentials?.username
    || runtimeConfig.webdav?.username
  const password = process.env.WANGAI_SYNC_WEBDAV_PASSWORD
    || runtimeConfig.credentials?.password
  if (!username || !password) {
    throw new Error(msg(lang, 'notLoggedIn'))
  }
}

async function cmdLogin(lang) {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const runtimeConfig = await loadRuntimeConfig()
  const prev = runtimeConfig || {}

  const baseUrl = await rl.question(`${msg(lang, 'promptBaseUrl')} [${prev.webdav?.baseUrl || 'https://dav.jianguoyun.com/dav'}]: `)
  const folder = await rl.question(`${msg(lang, 'promptFolder')} [${prev.webdav?.folder || 'wangai-sync'}]: `)
  const username = await rl.question(`${msg(lang, 'promptUsername')} [${prev.credentials?.username || prev.webdav?.username || ''}]: `)
  const password = await rl.question(`${msg(lang, 'promptPassword')}: `)
  rl.close()

  const config = {
    version: 2,
    webdav: {
      baseUrl: baseUrl || prev.webdav?.baseUrl || 'https://dav.jianguoyun.com/dav',
      folder: folder || prev.webdav?.folder || 'wangai-sync',
      username: username || prev.credentials?.username || prev.webdav?.username || ''
    },
    platforms: prev.platforms || Object.fromEntries(
      Object.entries(DEFAULT_PLATFORMS).map(([name, defaults]) => [name, { root: defaults.root, enabled: true }])
    )
  }

  const credentials = {
    username: username || prev.credentials?.username || prev.webdav?.username || '',
    password: password || prev.credentials?.password || '',
    updatedAt: new Date().toISOString()
  }

  await writeJson(CONFIG_FILE, config)
  await writeCredentials(credentials)
  log(lang, `${msg(lang, 'loginSaved')}. config=${CONFIG_FILE} credentials=${CREDENTIAL_FILE}`)
}

async function cmdInit(lang) {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const runtimeConfig = await loadRuntimeConfig()
  assertLoggedIn(runtimeConfig, lang)
  const prev = runtimeConfig || {}

  const platforms = {}
  for (const [name, defaults] of Object.entries(DEFAULT_PLATFORMS)) {
    const prevEnabled = prev.platforms?.[name]?.enabled !== false
    const enabledText = await rl.question(`${msg(lang, 'promptPlatformEnabled', name)} [${prevEnabled ? 'Y' : 'n'}]: `)
    const enabledRaw = (enabledText || '').trim().toLowerCase()
    const enabled = enabledRaw
      ? !(enabledRaw === 'n' || enabledRaw === 'no' || enabledRaw === '0' || enabledRaw === 'false')
      : prevEnabled

    const prevRoot = prev.platforms?.[name]?.root || defaults.root
    if (!enabled) {
      platforms[name] = { root: prevRoot, enabled: false }
      continue
    }

    const root = await rl.question(`${msg(lang, 'promptPlatformRoot', name)} [${prevRoot}]: `)
    platforms[name] = { root: root || prevRoot, enabled: true }
  }
  rl.close()

  const config = {
    version: 2,
    webdav: {
      baseUrl: prev.webdav?.baseUrl || 'https://dav.jianguoyun.com/dav',
      folder: prev.webdav?.folder || 'wangai-sync',
      username: prev.webdav?.username || prev.credentials?.username || ''
    },
    platforms
  }

  await writeJson(CONFIG_FILE, config)
  log(lang, `${msg(lang, 'configSaved')}: ${CONFIG_FILE}`)

  const baseline = await collectUnifiedBaseline(config.platforms)
  await writeJson(BASELINE_FILE, baseline)
  await ensureDir(HISTORY_DIR)
  await writeJson(path.join(HISTORY_DIR, `baseline-${getTimestamp()}.json`), baseline)
  log(lang, `${msg(lang, 'baselineExtracted')}: ${BASELINE_FILE}`)
  if ((baseline.conflicts || []).length > 0) {
    log(lang, msg(lang, 'mergeConflictNote'))
  }
}

async function cmdPush(lang) {
  const runtimeConfig = await loadRuntimeConfig()
  if (!runtimeConfig || !runtimeConfig.webdav || !runtimeConfig.platforms) {
    throw new Error(msg(lang, 'configMissing'))
  }
  assertLoggedIn(runtimeConfig, lang)

  const snapshot = await collectUnifiedBaseline(runtimeConfig.platforms)
  await writeJson(BASELINE_FILE, snapshot)
  await ensureDir(HISTORY_DIR)
  const ts = getTimestamp()
  await writeJson(path.join(HISTORY_DIR, `push-${ts}.json`), snapshot)

  await ensureWebdavFolders(runtimeConfig, lang)
  const { latestUrl, snapshotsUrl } = resolveWebdavPaths(runtimeConfig)
  const body = JSON.stringify(snapshot, null, 2)
  await webdavRequest(latestUrl, 'PUT', runtimeConfig, lang, body, { 'Content-Type': 'application/json; charset=utf-8' })
  await webdavRequest(`${snapshotsUrl}/${ts}.json`, 'PUT', runtimeConfig, lang, body, { 'Content-Type': 'application/json; charset=utf-8' })

  log(lang, `${msg(lang, 'pushDone')}. latest=${latestUrl}`)
}

async function loadRemoteLatest(config, lang) {
  const { latestUrl } = resolveWebdavPaths(config)
  const response = await webdavRequest(latestUrl, 'GET', config, lang)
  return JSON.parse(await response.text())
}

async function cmdPull(flags, lang) {
  const runtimeConfig = await loadRuntimeConfig()
  if (!runtimeConfig || !runtimeConfig.platforms) {
    throw new Error(msg(lang, 'configMissing'))
  }
  assertLoggedIn(runtimeConfig, lang)

  let from = String(flags.from || '').toLowerCase()
  if (!from) {
    const rl = readline.createInterface({ input: stdin, output: stdout })
    const answer = await rl.question(msg(lang, 'promptPullSource'))
    rl.close()
    from = (answer || 'baseline').toLowerCase()
  }
  if (from !== 'baseline' && from !== 'remote') {
    throw new Error(msg(lang, 'pullFromInvalid'))
  }

  let snapshot
  if (from === 'baseline') {
    snapshot = await readJson(BASELINE_FILE)
    if (!snapshot) {
      throw new Error(`${msg(lang, 'baselineMissing')}: ${BASELINE_FILE}`)
    }
  } else {
    snapshot = await loadRemoteLatest(runtimeConfig, lang)
  }

  const normalized = await normalizeSnapshot(snapshot, runtimeConfig.platforms, lang)
  await writeJson(BASELINE_FILE, normalized)
  await ensureDir(HISTORY_DIR)
  await writeJson(path.join(HISTORY_DIR, `pull-${from}-${getTimestamp()}.json`), normalized)
  await applySnapshot(normalized, runtimeConfig.platforms, lang)
  log(lang, msg(lang, 'pullDone'))
}

async function cmdStatus(lang) {
  const runtimeConfig = await loadRuntimeConfig()
  if (!runtimeConfig || !runtimeConfig.webdav) {
    log(lang, msg(lang, 'configMissing'))
    return
  }
  const loggedIn = Boolean(process.env.WANGAI_SYNC_WEBDAV_PASSWORD || runtimeConfig.credentials?.password)
  log(lang, `${msg(lang, 'statusConfig')}: ${CONFIG_FILE}`)
  log(lang, `${msg(lang, 'statusCredentials')}: ${CREDENTIAL_FILE} (${msg(lang, 'statusPasswordSaved')}=${loggedIn})`)
  log(lang, `${msg(lang, 'statusWebdav')}: ${runtimeConfig.webdav.baseUrl}/${runtimeConfig.webdav.folder}`)
  for (const [name, info] of Object.entries(runtimeConfig.platforms || {})) {
    const skillsExist = fs.existsSync(path.join(info.root, 'skills'))
    const agentsExist = fs.existsSync(path.join(info.root, 'agents'))
    log(lang, msg(lang, 'statusPlatform', name, info.root, info.enabled !== false))
    log(lang, msg(lang, 'statusPlatformKinds', skillsExist, agentsExist))
  }
  const baseline = await readJson(BASELINE_FILE)
  log(lang, `${msg(lang, 'statusBaselineExists')}: ${fs.existsSync(BASELINE_FILE)}`)
  if (baseline) {
    let skills = baseline.skills?.length || 0
    let agents = baseline.agents?.length || 0
    let mode = baseline.mode || 'unknown'
    if (baseline.platforms && typeof baseline.platforms === 'object') {
      mode = 'legacy-platforms'
      for (const bucket of Object.values(baseline.platforms)) {
        skills += bucket?.skills?.length || 0
        agents += bucket?.agents?.length || 0
      }
    }
    log(lang, `${msg(lang, 'statusBaselineMode')}: ${mode} version=${baseline.version || 'unknown'}`)
    log(lang, `${msg(lang, 'statusBaselineCounts')}: skills=${skills} agents=${agents}`)
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const lang = resolveLang(args)
  const cmd = args._[0]

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    stdout.write(msg(lang, 'help'))
    return
  }

  if (cmd === 'login') return cmdLogin(lang)
  if (cmd === 'init') return cmdInit(lang)
  if (cmd === 'push') return cmdPush(lang)
  if (cmd === 'pull') return cmdPull(args, lang)
  if (cmd === 'status') return cmdStatus(lang)

  console.error(`${msg(lang, 'commandUnknown')}: ${cmd}`)
  console.error(msg(lang, 'commandHint'))
  process.exit(1)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
