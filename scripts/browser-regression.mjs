// 搜索框首次自动聚焦 — 浏览器回归检查（TB1 首页闭环 + TB2 真实入口与导航闭环）。
//
// TB1（G1–G4/G7 首页路径）：
//   A 成功首入：焦点 ≤1s、focus 调用计数 =1、focus 内同步滚动采样（前/后/+500ms）
//     零位移、输入/URL 同步、数据完成后无二次抢焦点、无运行时错误、
//     成功聚焦后 4 类 capture 监听器全部清理
//   B ?q= 首入：不清空不全选光标在末尾、追加输入、Ctrl+A 清空、实际过滤、计数=1
//   C 激活前点击空白处取消（哨兵写标记，激活后不补聚焦，计数=0）
//   D 激活前 Tab 到链接取消
//   E 激活前主动滚动取消
//   F 持有 *.css：就绪前无聚焦；放行后正常聚焦
//   G 持有 *.js：就绪前无聚焦；放行后正常聚焦
//   H 持有 *snapshots*：不等数据即可聚焦，输入保留，数据完成后过滤正确
//   I 站内不重聚焦：切页/回首页计数保持 1；刷新后新文档计数 0
// 真实激活次序（纠正“生产恒先 load 后激活”）：
//   J 激活早于 load（持有隐藏图片阻塞 load 事件，记录接管/load 时间戳）
//   L 激活晚于 load（持有 post-stack 岛屿 chunk，load 先行、激活后行）
// G4 补充：
//   M 激活前触摸取消；N 激活前其他输入已获得焦点
// TB2（G1–G8 全入口）：
//   O 中文首页 / 标签列表 / 单标签页 / 根 rewrite 入口均正常聚焦
//   P 先入文章（无搜索框）再回首页：不聚焦、机会不延后、无异常
//   Q 先入关于（无搜索框、有岛屿）再回首页：不聚焦、无异常
//   R 后台文档首入：不聚焦，转前台不补做
//   S sessionStorage 拒绝访问：不抛异常、不聚焦、手动搜索可用
//   T 换语言 / 前进 / 后退：不重聚焦，计数保持 1
//   U BFCache 恢复：浏览器恢复焦点不算新自动聚焦（计数不变）
//   V 加载未完离开再返回：旧页面待执行动作不抢新页面焦点
//   W 连续站内切换 10 次：无重复聚焦、无错误、监听器清零
//   X URL fragment 首入：跳过；手动搜索可用
//   Y 首入时非零滚动位置：跳过，滚动位置不被覆盖
//
// 运行：pnpm build && node scripts/browser-regression.mjs
// 依赖：系统 chromium（headless）+ Node 内置 WebSocket/CDP，无新增依赖。
// 可覆盖浏览器路径：CHROMIUM_BIN=/path/to/chromium

import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const CHROMIUM_BIN = process.env.CHROMIUM_BIN ?? "chromium";

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html 不存在，请先运行 pnpm build");
  process.exit(2);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.once("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

// ---------- 启动 astro preview（空闲端口） ----------
const PORT = await freePort();
const BASE = `http://localhost:${PORT}`;
const preview = spawn(
  "pnpm",
  ["exec", "astro", "preview", "--port", String(PORT)],
  { stdio: ["ignore", "pipe", "pipe"] }
);
let previewLog = "";
preview.stdout.on("data", (d) => (previewLog += d));
preview.stderr.on("data", (d) => (previewLog += d));

async function waitForHttp(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    if (Date.now() > deadline) {
      throw new Error(`preview 未就绪: ${previewLog}`);
    }
    await sleep(100);
  }
}

// ---------- 启动 headless chromium（CDP） ----------
const userDataDir = mkdtempSync(join(tmpdir(), "search-autofocus-regression-"));
const chrome = spawn(
  CHROMIUM_BIN,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"] }
);

async function cdpEndpoint() {
  const portFile = join(userDataDir, "DevToolsActivePort");
  const deadline = Date.now() + 15000;
  for (;;) {
    if (existsSync(portFile)) {
      const [port, path] = readFileSync(portFile, "utf8").trim().split("\n");
      return { port: Number(port), path };
    }
    if (Date.now() > deadline) throw new Error("chromium CDP 未就绪");
    await sleep(100);
  }
}

// ---------- 极简 CDP 客户端 ----------
let ws;
let nextId = 1;
const pending = new Map();
const eventQueues = new Map(); // "sessionId:method" -> resolver 队列

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(
      JSON.stringify({
        id,
        method,
        params,
        ...(sessionId ? { sessionId } : {}),
      })
    );
  });
}

function waitEvent(sessionId, method, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const key = `${sessionId}:${method}`;
    const timer = setTimeout(() => {
      const q = eventQueues.get(key) ?? [];
      const i = q.indexOf(entry);
      if (i >= 0) q.splice(i, 1);
      reject(new Error(`等待事件超时: ${method}`));
    }, timeoutMs);
    const entry = { resolve: (v) => (clearTimeout(timer), resolve(v)) };
    const q = eventQueues.get(key);
    if (q) q.push(entry);
    else eventQueues.set(key, [entry]);
  });
}

async function evaluate(sessionId, expression) {
  const res = await send(
    "Runtime.evaluate",
    { expression, returnByValue: true },
    sessionId
  );
  if (res.exceptionDetails) {
    throw new Error(
      `页面脚本异常: ${res.exceptionDetails.text} ${res.exceptionDetails.exception?.description ?? ""}`
    );
  }
  return res.result?.value;
}

// 需要 DevTools 命令行 API 的表达式（如 getEventListeners）
async function evaluateCmd(sessionId, expression) {
  const res = await send(
    "Runtime.evaluate",
    { expression, includeCommandLineAPI: true, returnByValue: true },
    sessionId
  );
  if (res.exceptionDetails) {
    throw new Error(
      `页面脚本异常: ${res.exceptionDetails.text} ${res.exceptionDetails.exception?.description ?? ""}`
    );
  }
  return res.result?.value;
}

async function rawPoll(sessionId, expression, timeoutMs, intervalMs) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = await evaluate(sessionId, expression);
    if (value) return value;
    if (Date.now() > deadline) return null;
    await sleep(intervalMs);
  }
}

// 超时即失败：激活/就绪类断言绝不允许悄悄超时后空转
async function mustPoll(
  sessionId,
  expression,
  label,
  timeoutMs = 8000,
  intervalMs = 50
) {
  const value = await rawPoll(sessionId, expression, timeoutMs, intervalMs);
  if (value === null) {
    throw new Error(`断言超时(${timeoutMs}ms): ${label}`);
  }
  return value;
}

// focus 调用计数 / 运行时错误 / 接管与 load 时间戳 / focus 内同步滚动采样
// （仅观测，不改变应用行为）
const PROBE = `(() => {
  const times = window.__autofocusProbe = {
    searchFocusCalls: 0,
    errors: [],
    load: null,
    takeover: null,
    readyAtTakeover: null,
    scrollAtFocus: [],
    docId: Math.random().toString(36).slice(2),
  };
  let takeover;
  Object.defineProperty(window, "__searchAutofocusTakeover", {
    configurable: true,
    get: () => takeover,
    set: (value) => {
      if (value === undefined && takeover) {
        times.takeover = performance.now();
        times.readyAtTakeover = document.readyState;
      }
      takeover = value;
    },
  });
  window.addEventListener("load", () => { times.load = performance.now(); });
  const snap = () => {
    const out = [[window.scrollX, window.scrollY]];
    for (let e = document.querySelector("#search")?.parentElement; e; e = e.parentElement) {
      out.push([e.scrollLeft, e.scrollTop]);
    }
    return out;
  };
  const orig = HTMLInputElement.prototype.focus;
  HTMLInputElement.prototype.focus = function (...args) {
    if (this.id !== "search") return orig.apply(this, args);
    times.searchFocusCalls++;
    times.scrollAtFocus.push(snap());
    const result = orig.apply(this, args);
    times.scrollAtFocus.push(snap());
    setTimeout(() => times.scrollAtFocus.push(snap()), 500);
    return result;
  };
  window.addEventListener("error", (e) => {
    if (e.target === window) times.errors.push(String(e.message));
  });
  window.addEventListener("unhandledrejection", (e) => {
    times.errors.push(String(e.reason));
  });
})();`;

async function newPage({ background = false, extraScripts = [] } = {}) {
  const { browserContextId } = await send("Target.createBrowserContext");
  const { targetId } = await send("Target.createTarget", {
    url: "about:blank",
    browserContextId,
    background,
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send(
    "Page.addScriptToEvaluateOnNewDocument",
    { source: PROBE },
    sessionId
  );
  for (const source of extraScripts) {
    await send("Page.addScriptToEvaluateOnNewDocument", { source }, sessionId);
  }
  return { sessionId, targetId, browserContextId };
}

async function navigate(sessionId, url, { waitLoad = true } = {}) {
  const loaded = waitLoad
    ? waitEvent(sessionId, "Page.loadEventFired")
    : Promise.resolve();
  await send("Page.navigate", { url }, sessionId);
  await loaded;
}

async function holdRequests(sessionId, pattern) {
  await send(
    "Fetch.enable",
    { patterns: [{ urlPattern: pattern, requestStage: "Request" }] },
    sessionId
  );
}

const releaseRequests = (sessionId) => send("Fetch.disable", {}, sessionId);

const isSearchFocused = `document.activeElement && document.activeElement.id === "search"`;
const notSearchFocused = `!(document.activeElement && document.activeElement.id === "search")`;
const consumedMarker = `window.sessionStorage.getItem("search-autofocus-consumed")`;
const enteredMarker = `window.sessionStorage.getItem("search-autofocus-entered")`;
const focusCalls = `window.__autofocusProbe.searchFocusCalls`;
const runtimeErrors = `JSON.stringify(window.__autofocusProbe.errors)`;
const hydrated = `document.readyState === "complete" && !window.__searchAutofocusTakeover`;
// 成功/取消/卸载后，window 上不应残留这 4 类 capture 监听器
const leftoverListeners = `JSON.stringify(Object.fromEntries(['pointerdown','keydown','touchstart','wheel'].map(t => [t, (getEventListeners(window)[t] || []).filter(l => l.useCapture).length])))`;
const CLEAN_LISTENERS =
  '{"pointerdown":0,"keydown":0,"touchstart":0,"wheel":0}';

const tab = async (sessionId) => {
  const ev = (type) =>
    send(
      "Input.dispatchKeyEvent",
      {
        type,
        key: "Tab",
        code: "Tab",
        windowsVirtualKeyCode: 9,
        nativeVirtualKeyCode: 9,
      },
      sessionId
    );
  await ev("rawKeyDown");
  await ev("keyUp");
};

const clickAt = async (sessionId, x, y) => {
  await send(
    "Input.dispatchMouseEvent",
    { type: "mousePressed", x, y, button: "left", clickCount: 1 },
    sessionId
  );
  await send(
    "Input.dispatchMouseEvent",
    { type: "mouseReleased", x, y, button: "left", clickCount: 1 },
    sessionId
  );
};

// 以真实点击方式手动聚焦搜索框（原生聚焦不经过 JS focus 方法，不计入探针）
async function clickSearchInput(sessionId) {
  const rect = await evaluate(
    sessionId,
    `(() => {
      const r = document.querySelector("#search").getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })()`
  );
  await clickAt(sessionId, rect.x, rect.y);
}

// ---------- 场景 ----------
const results = [];

async function scenarioFirstEntry() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/`);
  const t0 = Date.now();
  await mustPoll(sessionId, isSearchFocused, "首入聚焦", 1000, 20);
  const elapsed = Date.now() - t0;
  // focus 内同步采样：调用前 / 调用后 / +500ms 三次快照必须一致
  await mustPoll(
    sessionId,
    `window.__autofocusProbe.scrollAtFocus.length === 3`,
    "focus 同步滚动采样完成",
    2000
  );
  const samples = await evaluate(
    sessionId,
    `JSON.stringify(window.__autofocusProbe.scrollAtFocus)`
  );
  const [s0, s1, s2] = JSON.parse(samples);
  const stable =
    JSON.stringify(s0) === JSON.stringify(s1) &&
    JSON.stringify(s1) === JSON.stringify(s2);

  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const leftovers = await evaluateCmd(sessionId, leftoverListeners);

  let ok =
    elapsed <= 1000 &&
    stable &&
    calls === 1 &&
    errors === "[]" &&
    leftovers === CLEAN_LISTENERS;
  let detail = `focus=${elapsed}ms calls=${calls} errors=${errors} listeners=${leftovers} scrollStable=${stable}`;

  if (ok) {
    await send("Input.insertText", { text: "hello" }, sessionId);
    const value = await evaluate(
      sessionId,
      `document.querySelector("#search").value`
    );
    await mustPoll(
      sessionId,
      `window.location.search.includes("q=hello")`,
      "q=hello URL 同步",
      2000,
      100
    );
    await sleep(1500); // 等搜索数据完成，观察无二次抢焦点
    const stillFocused = await evaluate(sessionId, isSearchFocused);
    const callsAfter = await evaluate(sessionId, focusCalls);
    ok = value === "hello" && Boolean(stillFocused) && callsAfter === 1;
    detail += ` typed="${value}" stillFocused=${Boolean(stillFocused)} callsAfter=${callsAfter}`;
  }
  return { ok, detail };
}

async function scenarioQueryCaretClearFilter() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/?q=python`);
  await mustPoll(sessionId, isSearchFocused, "?q= 首入聚焦", 1000, 20);
  const before = await evaluate(
    sessionId,
    `(() => {
      const i = document.querySelector("#search");
      return { value: i.value, start: i.selectionStart, end: i.selectionEnd };
    })()`
  );
  await send("Input.insertText", { text: "x" }, sessionId);
  const after = await evaluate(
    sessionId,
    `(() => {
      const i = document.querySelector("#search");
      return { value: i.value, start: i.selectionStart, end: i.selectionEnd };
    })()`
  );
  await mustPoll(
    sessionId,
    `window.location.search.includes("q=pythonx")`,
    "q=pythonx URL 同步",
    2000,
    100
  );

  // 清空：Ctrl+A 全选 + Delete
  const key = (type, params) =>
    send("Input.dispatchKeyEvent", { type, ...params }, sessionId);
  const ctrlAParams = {
    key: "a",
    code: "KeyA",
    modifiers: 2,
    windowsVirtualKeyCode: 65,
    nativeVirtualKeyCode: 65,
  };
  await key("rawKeyDown", ctrlAParams);
  await key("keyUp", ctrlAParams);
  const delParams = {
    key: "Delete",
    code: "Delete",
    windowsVirtualKeyCode: 46,
    nativeVirtualKeyCode: 46,
  };
  await key("rawKeyDown", delParams);
  await key("keyUp", delParams);
  const cleared = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  await mustPoll(
    sessionId,
    `new URLSearchParams(window.location.search).get("q") === null`,
    "q 参数移除",
    2000,
    100
  );

  // 实际过滤正确性：vimgolf 命中（Fuse 模糊匹配，top-1 必为精确令牌），列表变化
  await send("Input.insertText", { text: "vimgolf" }, sessionId);
  await mustPoll(
    sessionId,
    `document.querySelectorAll('a[href*="/posts/"]').length > 0 && document.querySelectorAll('a[href*="/posts/"]').length < 6 && document.querySelector('a[href*="/posts/"]').href.includes("vimgolf")`,
    "vimgolf 过滤结果",
    5000,
    100
  );
  const valueNow = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  const stillFocused = await evaluate(sessionId, isSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  // 注：?q= 入口存在基线水合不一致错误（React #418，与自动聚焦无关，
  // 已单独复现于基线 e5c153e），此处不断言零错误。

  const ok =
    before.value === "python" &&
    before.start === 6 &&
    before.end === 6 &&
    after.value === "pythonx" &&
    after.start === 7 &&
    cleared === "" &&
    valueNow === "vimgolf" &&
    Boolean(stillFocused) &&
    calls === 1;
  return {
    ok,
    detail: JSON.stringify({ before, after, cleared, filtered: true, calls }),
  };
}

async function scenarioPreHydrationClick() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  await sleep(200);
  await clickAt(sessionId, 2, 2);
  // 激活前哨兵应已在无 JS 的情况下记录操作并写入会话标记
  const markerBefore = await evaluate(sessionId, consumedMarker);
  const bodyFocus = await evaluate(
    sessionId,
    `document.activeElement === document.body`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notStolen = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok =
    markerBefore === "1" &&
    Boolean(bodyFocus) &&
    Boolean(notStolen) &&
    calls === 0;
  return {
    ok,
    detail: `markerBeforeHydration=${markerBefore} bodyFocus=${Boolean(bodyFocus)} notStolen=${Boolean(notStolen)} focusCalls=${calls}`,
  };
}

async function scenarioPreHydrationTab() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("header a")`,
    "interactive + 链接存在",
    10000,
    50
  );
  await tab(sessionId);
  const activeIsLink = await evaluate(
    sessionId,
    `document.activeElement && document.activeElement.tagName === "A"`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notStolen = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok = Boolean(activeIsLink) && Boolean(notStolen) && calls === 0;
  return {
    ok,
    detail: `tabMovedFocus=${Boolean(activeIsLink)} notStolen=${Boolean(notStolen)} focusCalls=${calls}`,
  };
}

async function scenarioPreHydrationWheel() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  await send(
    "Input.dispatchMouseEvent",
    { type: "mouseWheel", x: 400, y: 300, deltaX: 0, deltaY: 120 },
    sessionId
  );
  await sleep(300); // wheel 经输入管线异步派发
  const markerBefore = await evaluate(sessionId, consumedMarker);
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notStolen = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok = markerBefore === "1" && Boolean(notStolen) && calls === 0;
  return {
    ok,
    detail: `wheelRecorded=${markerBefore === "1"} notStolen=${Boolean(notStolen)} focusCalls=${calls}`,
  };
}

async function scenarioPreHydrationTouch() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  // 触摸点选空白区域（避免点在卡片链接上触发原生导航）
  await send(
    "Input.dispatchTouchEvent",
    {
      type: "touchStart",
      touchPoints: [{ x: 2, y: 2, radiusX: 1, radiusY: 1 }],
    },
    sessionId
  );
  await send(
    "Input.dispatchTouchEvent",
    { type: "touchEnd", touchPoints: [] },
    sessionId
  );
  await sleep(200);
  const markerBefore = await evaluate(sessionId, consumedMarker);
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notStolen = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok = markerBefore === "1" && Boolean(notStolen) && calls === 0;
  return {
    ok,
    detail: `touchRecorded=${markerBefore === "1"} notStolen=${Boolean(notStolen)} focusCalls=${calls}`,
  };
}

async function scenarioOtherInputFocused() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  await evaluate(
    sessionId,
    `(() => { const i = document.createElement("input"); i.id = "qa-other"; document.body.append(i); i.focus(); })()`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const activeId = await evaluate(
    sessionId,
    `document.activeElement && document.activeElement.id`
  );
  const calls = await evaluate(sessionId, focusCalls);
  const ok = activeId === "qa-other" && calls === 0;
  return { ok, detail: `active=${activeId} focusCalls=${calls}` };
}

async function scenarioDelayedCss() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.css");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  // 样式表被持有时解析器停步（DOM 未建完）——这正是「就绪条件未满足」的状态
  await sleep(1200);
  const stateHeld = await evaluate(sessionId, "document.readyState");
  const markerHeld = await evaluate(sessionId, consumedMarker);
  const focusedHeld = await evaluate(sessionId, isSearchFocused);
  const callsHeld = await evaluate(sessionId, focusCalls);
  await releaseRequests(sessionId);
  await mustPoll(sessionId, isSearchFocused, "放行后聚焦", 5000, 20);
  const markerAfter = await evaluate(sessionId, consumedMarker);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const ok =
    stateHeld === "loading" &&
    markerHeld === null &&
    !focusedHeld &&
    callsHeld === 0 &&
    markerAfter === "1" &&
    calls === 1 &&
    errors === "[]";
  return {
    ok,
    detail: `stateHeld=${stateHeld} markerHeld=${markerHeld} focusedHeld=${Boolean(focusedHeld)} callsHeld=${callsHeld} markerAfter=${markerAfter} focusCalls=${calls} errors=${errors}`,
  };
}

async function scenarioDelayedJs() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  await sleep(700);
  const markerHeld = await evaluate(sessionId, consumedMarker);
  const focusedHeld = await evaluate(sessionId, isSearchFocused);
  await releaseRequests(sessionId);
  await mustPoll(sessionId, isSearchFocused, "放行后聚焦", 5000, 20);
  const markerAfter = await evaluate(sessionId, consumedMarker);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const ok =
    markerHeld === null &&
    !focusedHeld &&
    markerAfter === "1" &&
    calls === 1 &&
    errors === "[]";
  return {
    ok,
    detail: `markerHeld=${markerHeld} focusedHeld=${Boolean(focusedHeld)} markerAfter=${markerAfter} focusCalls=${calls} errors=${errors}`,
  };
}

async function scenarioDelayedSearchData() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*snapshots*");
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, isSearchFocused, "不等数据聚焦", 1000, 20);
  const callsFocused = await evaluate(sessionId, focusCalls);
  await send("Input.insertText", { text: "vimgolf" }, sessionId);
  const valueHeld = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  await releaseRequests(sessionId);
  await mustPoll(
    sessionId,
    `document.querySelectorAll('a[href*="/posts/"]').length > 0 && document.querySelectorAll('a[href*="/posts/"]').length < 6 && document.querySelector('a[href*="/posts/"]').href.includes("vimgolf")`,
    "数据完成后过滤",
    5000,
    100
  );
  const valueNow = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  const stillFocused = await evaluate(sessionId, isSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const ok =
    callsFocused === 1 &&
    valueHeld === "vimgolf" &&
    valueNow === "vimgolf" &&
    Boolean(stillFocused) &&
    calls === 1 &&
    errors === "[]";
  return {
    ok,
    detail: `valueHeld="${valueHeld}" valueNow="${valueNow}" stillFocused=${Boolean(stillFocused)} focusCalls=${calls} errors=${errors}`,
  };
}

async function scenarioNoRefocus() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, isSearchFocused, "首入聚焦", 1000, 20);

  await evaluate(
    sessionId,
    `document.querySelector('a[href="/en/tags"]').click()`
  );
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/tags" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("tags")`,
    "标签页激活",
    10000,
    50
  );
  await sleep(400);
  const tagsNotFocused = await evaluate(sessionId, notSearchFocused);

  await evaluate(sessionId, `document.querySelector('a[href="/en/"]').click()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    "回首页激活",
    10000,
    50
  );
  await sleep(400);
  const homeNotFocused = await evaluate(sessionId, notSearchFocused);
  const callsAfterNav = await evaluate(sessionId, focusCalls);

  // 刷新（同一标签页会话，新文档 → 探针计数重置）
  await navigate(sessionId, `${BASE}/`);
  await sleep(500);
  const reloadNotFocused = await evaluate(sessionId, notSearchFocused);
  const callsAfterReload = await evaluate(sessionId, focusCalls);

  const ok =
    Boolean(tagsNotFocused) &&
    Boolean(homeNotFocused) &&
    callsAfterNav === 1 &&
    Boolean(reloadNotFocused) &&
    callsAfterReload === 0;
  return {
    ok,
    detail: `tagsNotFocused=${Boolean(tagsNotFocused)} homeNotFocused=${Boolean(homeNotFocused)} focusCallsAfterNav=${callsAfterNav} reloadNotFocused=${Boolean(reloadNotFocused)} focusCallsAfterReload=${callsAfterReload}`,
  };
}

// J：真实「激活早于 load」——DOMContentLoaded 注入隐藏图片阻塞 load 事件，
//    模块脚本先执行、React 先激活；实现必须等 load 后才聚焦。
async function scenarioHydrationBeforeLoad() {
  const { sessionId } = await newPage({
    extraScripts: [
      `document.addEventListener('DOMContentLoaded', () => { const img = document.createElement('img'); img.style.display = 'none'; img.src = '/qa-held.png'; document.body.append(img); });`,
    ],
  });
  await holdRequests(sessionId, "*qa-held.png");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `window.__autofocusProbe.takeover !== null`,
    "激活早于 load（接管发生）",
    8000
  );
  const before = await evaluate(
    sessionId,
    `JSON.stringify({ state: document.readyState, calls: ${focusCalls}, times: { load: window.__autofocusProbe.load, takeover: window.__autofocusProbe.takeover, ready: window.__autofocusProbe.readyAtTakeover } })`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, isSearchFocused, "load 后聚焦", 2000, 20);
  const after = await evaluate(
    sessionId,
    `JSON.stringify({ times: { load: window.__autofocusProbe.load, takeover: window.__autofocusProbe.takeover }, calls: ${focusCalls}, errors: ${runtimeErrors} })`
  );
  const b = JSON.parse(before);
  const a = JSON.parse(after);
  const ok =
    b.state !== "complete" &&
    b.calls === 0 &&
    a.times.takeover < a.times.load &&
    a.calls === 1 &&
    a.errors === "[]";
  return { ok, detail: JSON.stringify({ before: b, after: a }) };
}

// L：真实「激活晚于 load」——持有 post-stack 岛屿 chunk（动态 import 不阻塞
//     load 事件），load 先行、激活后行；实现必须在激活后立即聚焦。
async function scenarioHydrationAfterLoad() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*post-stack*");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "complete" && window.__autofocusProbe.load !== null`,
    "load 完成",
    8000
  );
  await sleep(300);
  const before = await evaluate(
    sessionId,
    `JSON.stringify({ calls: ${focusCalls}, takeover: window.__autofocusProbe.takeover })`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, isSearchFocused, "激活后聚焦", 2000, 20);
  const times = await evaluate(
    sessionId,
    `JSON.stringify({ load: window.__autofocusProbe.load, takeover: window.__autofocusProbe.takeover, ready: window.__autofocusProbe.readyAtTakeover, calls: ${focusCalls}, errors: ${runtimeErrors} })`
  );
  const b = JSON.parse(before);
  const t = JSON.parse(times);
  const ok =
    b.takeover === null &&
    b.calls === 0 &&
    t.load < t.takeover &&
    t.ready === "complete" &&
    t.calls === 1 &&
    t.errors === "[]";
  return { ok, detail: JSON.stringify({ before: b, after: t }) };
}

// O：G1 全入口（中文首页、标签列表、单标签页、根 rewrite）
async function scenarioAllEntries() {
  const cases = [
    [`${BASE}/zh/`, "中文首页"],
    [`${BASE}/en/tags`, "标签列表"],
    [`${BASE}/en/tags/vim`, "单标签页"],
    [`${BASE}/tags`, "根 rewrite → 标签列表"],
  ];
  const outcomes = [];
  for (const [url, label] of cases) {
    const { sessionId } = await newPage();
    await navigate(sessionId, url);
    const t0 = Date.now();
    await mustPoll(sessionId, isSearchFocused, `${label} 聚焦`, 1000, 20);
    const elapsed = Date.now() - t0;
    const calls = await evaluate(sessionId, focusCalls);
    const scrollY = await evaluate(sessionId, "window.scrollY");
    const errors = await evaluate(sessionId, runtimeErrors);
    outcomes.push(
      `${label}=${elapsed}ms calls=${calls} scrollY=${scrollY} errors=${errors}`
    );
    if (!(elapsed <= 1000 && calls === 1 && scrollY === 0 && errors === "[]")) {
      return { ok: false, detail: outcomes.join(" | ") };
    }
  }
  return { ok: true, detail: outcomes.join(" | ") };
}

// P：先入文章（无搜索框）→ 机会当场结束，回首页不补聚焦
async function scenarioPostFirstThenHome() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/posts/a-very-interesting-vimgolf`);
  await mustPoll(
    sessionId,
    `${consumedMarker} === "1"`,
    "无搜索框首入消费机会（哨兵）",
    5000
  );
  const firstEntry = await evaluate(
    sessionId,
    `window.__searchAutofocusFirstEntry`
  );
  const errors = await evaluate(sessionId, runtimeErrors);
  await evaluate(sessionId, `document.querySelector('a[href="/en/"]').click()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    "回首页激活",
    10000,
    50
  );
  await sleep(400);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok =
    firstEntry === true &&
    errors === "[]" &&
    Boolean(notFocused) &&
    calls === 0;
  return {
    ok,
    detail: `firstEntry=${firstEntry} errors=${errors} notFocused=${Boolean(notFocused)} focusCalls=${calls}`,
  };
}

// Q：先入关于（无搜索框、有岛屿）→ 回首页不补聚焦
async function scenarioAboutFirstThenHome() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/about`);
  await mustPoll(
    sessionId,
    `${consumedMarker} === "1"`,
    "无搜索框首入消费机会（哨兵）",
    5000
  );
  const errors = await evaluate(sessionId, runtimeErrors);
  await evaluate(sessionId, `document.querySelector('a[href="/en/"]').click()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    "回首页激活",
    10000,
    50
  );
  await sleep(400);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const ok = errors === "[]" && Boolean(notFocused) && calls === 0;
  return {
    ok,
    detail: `errors=${errors} notFocused=${Boolean(notFocused)} focusCalls=${calls}`,
  };
}

// R：后台文档首入不聚焦，转前台不补做。
// headless 无真实后台标签（background:true 仍为 visible；frozen 会冻结脚本、
// 阻断激活），故用探针覆盖 visibilityState 构造「激活时处于后台」，并验证
// 转前台（恢复 getter + visibilitychange）后不补做。
async function scenarioBackgroundDocument() {
  const { sessionId } = await newPage({
    extraScripts: [
      `Object.defineProperty(document, "visibilityState", { configurable: true, get: () => window.__fakeVisible ? "visible" : "hidden" }); window.__fakeVisible = false;`,
    ],
  });
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const focusedBg = await evaluate(sessionId, isSearchFocused);
  const callsBg = await evaluate(sessionId, focusCalls);
  const marker = await evaluate(sessionId, consumedMarker);
  const visible = await evaluate(sessionId, `document.visibilityState`);
  // 转前台：不补做
  await evaluate(
    sessionId,
    `window.__fakeVisible = true; document.dispatchEvent(new Event("visibilitychange"));`
  );
  await sleep(500);
  const focusedFg = await evaluate(sessionId, isSearchFocused);
  const callsFg = await evaluate(sessionId, focusCalls);
  const ok =
    !focusedBg &&
    callsBg === 0 &&
    marker === "1" &&
    visible === "hidden" &&
    !focusedFg &&
    callsFg === 0;
  return {
    ok,
    detail: `visibility=${visible} focusedBg=${Boolean(focusedBg)} callsBg=${callsBg} marker=${marker} focusedFg=${Boolean(focusedFg)} callsFg=${callsFg}`,
  };
}

// S：sessionStorage 拒绝访问 → 不抛异常、不聚焦、手动搜索可用
async function scenarioStorageDenied() {
  const { sessionId } = await newPage({
    extraScripts: [
      `Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("denied", "SecurityError"); } });`,
    ],
  });
  await navigate(sessionId, `${BASE}/`);
  await sleep(800);
  const calls = await evaluate(sessionId, focusCalls);
  const focused = await evaluate(sessionId, isSearchFocused);
  const errors = await evaluate(sessionId, runtimeErrors);
  await clickSearchInput(sessionId);
  await send("Input.insertText", { text: "x" }, sessionId);
  const value = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  await mustPoll(
    sessionId,
    `new URLSearchParams(window.location.search).get("q") === "x"`,
    "手动搜索 URL 同步",
    2000,
    100
  );
  const ok = calls === 0 && !focused && errors === "[]" && value === "x";
  return {
    ok,
    detail: `calls=${calls} focused=${Boolean(focused)} errors=${errors} manualValue="${value}"`,
  };
}

// T：换语言 / 前进 / 后退均不重聚焦，计数保持 1
async function scenarioLangSwitchAndHistory() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/`);
  await mustPoll(sessionId, isSearchFocused, "首入聚焦", 1000, 20);

  await evaluate(sessionId, `document.querySelector('a[href="/zh/"]').click()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/zh/" && !!document.querySelector("#search")`,
    "切到中文",
    10000,
    50
  );
  await sleep(400);
  const zhNotFocused = await evaluate(sessionId, notSearchFocused);

  await evaluate(sessionId, `window.history.back()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/"`,
    "后退",
    10000,
    50
  );
  await sleep(400);
  const backNotFocused = await evaluate(sessionId, notSearchFocused);

  await evaluate(sessionId, `window.history.forward()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/zh/"`,
    "前进",
    10000,
    50
  );
  await sleep(400);
  const fwdNotFocused = await evaluate(sessionId, notSearchFocused);

  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const leftovers = await evaluateCmd(sessionId, leftoverListeners);
  const ok =
    Boolean(zhNotFocused) &&
    Boolean(backNotFocused) &&
    Boolean(fwdNotFocused) &&
    calls === 1 &&
    errors === "[]" &&
    leftovers === CLEAN_LISTENERS;
  return {
    ok,
    detail: `zh=${Boolean(zhNotFocused)} back=${Boolean(backNotFocused)} fwd=${Boolean(fwdNotFocused)} focusCalls=${calls} errors=${errors} listeners=${leftovers}`,
  };
}

// U：BFCache 恢复——浏览器恢复焦点不算新自动聚焦（计数不变或新文档为 0）
async function scenarioBfcacheRestore() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, isSearchFocused, "首入聚焦", 1000, 20);
  const callsBefore = await evaluate(sessionId, focusCalls);
  const docIdBefore = await evaluate(
    sessionId,
    `window.__autofocusProbe.docId`
  );

  await navigate(sessionId, `${BASE}/en/posts/a-very-interesting-vimgolf`);
  await sleep(300);
  const history = await send("Page.getNavigationHistory", {}, sessionId);
  const backEntry = history.entries[history.currentIndex - 1];
  if (!backEntry) {
    return { ok: false, detail: "无后退历史条目" };
  }
  await send(
    "Page.navigateToHistoryEntry",
    { entryId: backEntry.id },
    sessionId
  );
  await sleep(700);

  const docIdAfter = await evaluate(sessionId, `window.__autofocusProbe.docId`);
  const callsAfter = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const restoredFromCache = docIdAfter === docIdBefore;
  // 同一文档（BFCache 恢复）：不得新增 focus 调用（浏览器自行恢复焦点不计）；
  // 新文档（完整重载）：本功能新增调用必须为 0。
  const ok =
    (restoredFromCache && callsAfter === callsBefore) ||
    (!restoredFromCache && callsAfter === 0);
  const okErrors = errors === "[]";
  return {
    ok: ok && okErrors,
    detail: `bfcache=${restoredFromCache} callsBefore=${callsBefore} callsAfter=${callsAfter} errors=${errors}`,
  };
}

// V：加载未完离开再返回——中断首入后，任何后续页面不得自动聚焦
async function scenarioLeaveMidLoad() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive（加载未完）",
    10000,
    50
  );
  // 首入文档已标记会话（entered），但未消费机会（island 从未激活）
  const enteredBefore = await evaluate(sessionId, enteredMarker);
  await releaseRequests(sessionId);
  await navigate(sessionId, `${BASE}/en/posts/a-very-interesting-vimgolf`);
  // 等新文档完全就绪（路由可用）后再站内导航，避免未初始化路由导致的竞态
  await sleep(800);
  const firstEntryAfter = await evaluate(
    sessionId,
    `window.__searchAutofocusFirstEntry`
  );
  const consumedAfter = await evaluate(sessionId, consumedMarker);
  await evaluate(sessionId, `document.querySelector('a[href="/en/"]').click()`);
  await mustPoll(
    sessionId,
    `window.location.pathname === "/en/" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    "返回首页激活",
    10000,
    50
  );
  await sleep(400);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const ok =
    enteredBefore === "1" &&
    firstEntryAfter === false &&
    consumedAfter === null &&
    Boolean(notFocused) &&
    calls === 0 &&
    errors === "[]";
  return {
    ok,
    detail: `enteredBefore=${enteredBefore} firstEntryAfter=${firstEntryAfter} consumedAfter=${consumedAfter} notFocused=${Boolean(notFocused)} focusCalls=${calls} errors=${errors}`,
  };
}

// W：连续站内切换 10 次——无重复聚焦、无错误、监听器清零
async function scenarioTenNavigations() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, isSearchFocused, "首入聚焦", 1000, 20);
  const hops = [
    [
      "/en/tags",
      `a[href="/en/tags"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("tags")`,
    ],
    [
      "/en/tags/vim",
      `a[href="/en/tags/vim"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    ],
    [
      "/en/",
      `a[href="/en/"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    ],
    ["/zh/", `a[href="/zh/"]`, `!!document.querySelector("#search")`],
    [
      "/en/",
      `a[href="/en/"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    ],
    // 文章页：动态取当前首页第一张文章卡片（初始列表内容随排名变化）
    ["__post__", `a[href*="/posts/"]`, `!document.querySelector("#search")`],
    ["/en/about", `a[href="/en/about"]`, `!document.querySelector("#search")`],
    [
      "/en/",
      `a[href="/en/"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    ],
    [
      "/en/tags",
      `a[href="/en/tags"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("tags")`,
    ],
    [
      "/en/tags/vim",
      `a[href="/en/tags/vim"]`,
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    ],
  ];
  for (const [path, selector, ready] of hops) {
    if (path === "__post__") {
      // 记录实际目标路径再点击，ready 断言该路径
      const href = await evaluate(
        sessionId,
        `document.querySelector('a[href*="/posts/"]').getAttribute("href")`
      );
      await evaluate(
        sessionId,
        `document.querySelector('a[href*="/posts/"]').click()`
      );
      await mustPoll(
        sessionId,
        `window.location.pathname === "${href}" && (${ready})`,
        `导航到文章页 ${href}`,
        10000,
        50
      );
      await sleep(120);
      continue;
    }
    await evaluate(sessionId, `document.querySelector('${selector}').click()`);
    // 必须等内容交换完成（新页面 SSR 内容就绪）再继续，pathname 先于 DOM 交换变化
    await mustPoll(
      sessionId,
      `window.location.pathname === "${path}" && (${ready})`,
      `导航到 ${path}`,
      10000,
      50
    );
    await sleep(120);
  }
  await sleep(500);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const leftovers = await evaluateCmd(sessionId, leftoverListeners);
  const ok =
    Boolean(notFocused) &&
    calls === 1 &&
    errors === "[]" &&
    leftovers === CLEAN_LISTENERS;
  return {
    ok,
    detail: `hops=10 notFocused=${Boolean(notFocused)} focusCalls=${calls} errors=${errors} listeners=${leftovers}`,
  };
}

// X：URL fragment 首入跳过；手动搜索仍可用
async function scenarioFragmentEntry() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/#some-frag`);
  await sleep(600);
  const focused = await evaluate(sessionId, isSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  await clickSearchInput(sessionId);
  await send("Input.insertText", { text: "x" }, sessionId);
  const value = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  await mustPoll(
    sessionId,
    `new URLSearchParams(window.location.search).get("q") === "x"`,
    "手动搜索 URL 同步",
    2000,
    100
  );
  const callsAfter = await evaluate(sessionId, focusCalls);
  const ok = !focused && calls === 0 && value === "x" && callsAfter === 0;
  return {
    ok,
    detail: `focused=${Boolean(focused)} focusCalls=${calls} manualValue="${value}" callsAfter=${callsAfter}`,
  };
}

// Z1/Z2：不可见输入（opacity:0 / visibility:hidden，含祖先隐藏）→ 跳过、
// 消费机会且不补做；opacity 场景下输入仍可交互（手动搜索可用）。
async function scenarioHiddenInput(kind) {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*post-stack*");
  await navigate(sessionId, `${BASE}/`);
  await evaluate(
    sessionId,
    `(() => {
      const i = document.querySelector("#search");
      i.style.${kind === "opacity" ? "opacity" : "visibility"} = "${kind === "opacity" ? "0" : "hidden"}";
    })()`
  );
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(500);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const marker = await evaluate(sessionId, consumedMarker);
  const errors = await evaluate(sessionId, runtimeErrors);
  const exists = await evaluate(
    sessionId,
    `!!document.querySelector("#search")`
  );

  let ok =
    Boolean(notFocused) &&
    calls === 0 &&
    marker === "1" &&
    errors === "[]" &&
    exists;
  let manual = "n/a";
  if (ok && kind === "opacity") {
    await clickSearchInput(sessionId);
    await send("Input.insertText", { text: "x" }, sessionId);
    manual = await evaluate(
      sessionId,
      `document.querySelector("#search").value`
    );
    await mustPoll(
      sessionId,
      `new URLSearchParams(window.location.search).get("q") === "x"`,
      "手动搜索 URL 同步",
      2000,
      100
    );
    ok = manual === "x";
  }
  return {
    ok,
    detail: `${kind}: notFocused=${Boolean(notFocused)} calls=${calls} marker=${marker} errors=${errors} exists=${exists} manual="${manual}"`,
  };
}

// Z3：仅 consumed 键的存储读取抛 SecurityError → 保守跳过不卸载组件，
// 手动搜索（输入 + URL 同步）仍可用。
async function scenarioStorageReadDenied() {
  const { sessionId } = await newPage({
    extraScripts: [
      `const qaOriginalGet = Storage.prototype.getItem; Storage.prototype.getItem = function (key) { if (key === "search-autofocus-consumed") throw new DOMException("QA storage read denied", "SecurityError"); return qaOriginalGet.call(this, key); };`,
    ],
  });
  await navigate(sessionId, `${BASE}/`);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const calls = await evaluate(sessionId, focusCalls);
  const errors = await evaluate(sessionId, runtimeErrors);
  const exists = await evaluate(
    sessionId,
    `!!document.querySelector("#search")`
  );
  await clickSearchInput(sessionId);
  await send("Input.insertText", { text: "x" }, sessionId);
  const value = await evaluate(
    sessionId,
    `document.querySelector("#search").value`
  );
  await mustPoll(
    sessionId,
    `new URLSearchParams(window.location.search).get("q") === "x"`,
    "手动搜索 URL 同步",
    2000,
    100
  );
  const ok =
    Boolean(notFocused) &&
    calls === 0 &&
    errors === "[]" &&
    exists &&
    value === "x";
  return {
    ok,
    detail: `notFocused=${Boolean(notFocused)} calls=${calls} errors=${errors} exists=${exists} manual="${value}"`,
  };
}

// Y：首入时非零滚动位置（历史/程序性滚动）→ 跳过，滚动位置不被覆盖
async function scenarioNonZeroScroll() {
  const { sessionId } = await newPage();
  await holdRequests(sessionId, "*.js");
  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  await mustPoll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("#search")`,
    "interactive + 搜索框存在",
    10000,
    50
  );
  await evaluate(sessionId, `window.scrollTo(0, 500)`);
  // scroll-smooth：等待平滑滚动动画结束、位置稳定后采样
  await sleep(1500);
  const scrollBefore = await evaluate(sessionId, "window.scrollY");
  await releaseRequests(sessionId);
  await mustPoll(sessionId, hydrated, "React 激活完成", 10000);
  await sleep(400);
  const notFocused = await evaluate(sessionId, notSearchFocused);
  const scrollAfter = await evaluate(sessionId, "window.scrollY");
  const calls = await evaluate(sessionId, focusCalls);
  const ok =
    scrollBefore > 0 &&
    Boolean(notFocused) &&
    scrollAfter === scrollBefore &&
    calls === 0;
  return {
    ok,
    detail: `scrollBefore=${scrollBefore} scrollAfter=${scrollAfter} notFocused=${Boolean(notFocused)} focusCalls=${calls}`,
  };
}

// ---------- 主流程 ----------
let exitCode = 1;
try {
  await waitForHttp(`${BASE}/`);
  const { port, path } = await cdpEndpoint();
  ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error.message));
      else p.resolve(msg.result);
      return;
    }
    if (msg.method) {
      const q = eventQueues.get(`${msg.sessionId ?? ""}:${msg.method}`);
      if (q?.length) q.shift().resolve(msg.params);
    }
  });

  const scenarios = [
    [
      "A 成功首入（G1/G3/G7：focus 内同步滚动采样、计数=1、监听器清理）",
      scenarioFirstEntry,
    ],
    ["B ?q= 光标末尾/追加/清空/实际过滤（G3）", scenarioQueryCaretClearFilter],
    ["C 激活前点击空白处取消（G4）", scenarioPreHydrationClick],
    ["D 激活前 Tab 到链接取消（G4）", scenarioPreHydrationTab],
    ["E 激活前主动滚动取消（G4）", scenarioPreHydrationWheel],
    ["F 延迟文档资源 *.css（G2）", scenarioDelayedCss],
    ["G 延迟客户端脚本 *.js（G2）", scenarioDelayedJs],
    ["H 延迟搜索数据（G2）", scenarioDelayedSearchData],
    ["I 站内不重聚焦：切页/回首页/刷新（G5 首页路径）", scenarioNoRefocus],
    ["J 激活早于 load（真实次序，G2）", scenarioHydrationBeforeLoad],
    ["L 激活晚于 load（真实次序，G2）", scenarioHydrationAfterLoad],
    ["M 激活前触摸取消（G4）", scenarioPreHydrationTouch],
    ["N 激活前其他输入已获得焦点（G4）", scenarioOtherInputFocused],
    [
      "O 全入口：中文首页/标签列表/单标签页/根 rewrite（G1）",
      scenarioAllEntries,
    ],
    ["P 先入文章再回首页不补聚焦（G5）", scenarioPostFirstThenHome],
    ["Q 先入关于再回首页不补聚焦（G5）", scenarioAboutFirstThenHome],
    ["R 后台文档首入不聚焦、转前台不补做（G6）", scenarioBackgroundDocument],
    ["S sessionStorage 拒绝访问（G6）", scenarioStorageDenied],
    ["T 换语言/前进/后退不重聚焦（G5）", scenarioLangSwitchAndHistory],
    ["U BFCache 恢复（G5）", scenarioBfcacheRestore],
    ["V 加载未完离开再返回（G8）", scenarioLeaveMidLoad],
    ["W 连续站内切换 10 次（G8）", scenarioTenNavigations],
    ["X URL fragment 首入跳过、手动搜索可用（G6）", scenarioFragmentEntry],
    ["Y 首入非零滚动位置跳过（G6）", scenarioNonZeroScroll],
    [
      "Z1 不可见输入 opacity:0 跳过、手动搜索可用（G6）",
      () => scenarioHiddenInput("opacity"),
    ],
    [
      "Z2 不可见输入 visibility:hidden 跳过（G6）",
      () => scenarioHiddenInput("visibility"),
    ],
    ["Z3 存储读取失败保守跳过、手动搜索可用（G6）", scenarioStorageReadDenied],
  ];

  for (const [name, run] of scenarios) {
    try {
      const { ok, detail } = await run();
      results.push({ name, ok, detail });
      console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (${detail})`);
    } catch (err) {
      results.push({ name, ok: false, detail: err.message });
      console.log(`FAIL  ${name}  (${err.message})`);
    }
  }

  exitCode = results.every((r) => r.ok) ? 0 : 1;
  console.log(exitCode === 0 ? "\n全部通过" : "\n存在失败");
} finally {
  ws?.close();
  chrome.kill("SIGKILL");
  preview.kill("SIGKILL");
  rmSync(userDataDir, { recursive: true, force: true });
}
process.exit(exitCode);
