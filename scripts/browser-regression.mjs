// 搜索框首次自动聚焦 — 最小浏览器回归检查（TB1 首页闭环）。
//
// 覆盖：
//   A. 成功首入：焦点落到搜索框、无滚动副作用、输入与 URL 同步、无二次抢焦点
//   B. 带 ?q= 首入：不清空不全选，光标在已有文本末尾，追加输入
//   C. 提前交互取消：慢加载期间 Tab 到链接 → 之后不跳到搜索框
//   D. 站内不重聚焦：切页/回首页/刷新均不再自动聚焦
//
// 运行：pnpm build && node scripts/browser-regression.mjs
// 依赖：系统 chromium（headless）+ Node 内置 WebSocket/CDP，无新增依赖。
// 可覆盖浏览器路径：CHROMIUM_BIN=/path/to/chromium

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 4322;
const BASE = `http://localhost:${PORT}`;
const CHROMIUM_BIN = process.env.CHROMIUM_BIN ?? "chromium";

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html 不存在，请先运行 pnpm build");
  process.exit(2);
}

// ---------- 启动 astro preview ----------
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
const persistentHandlers = new Map(); // "sessionId:method" -> 持续监听器

function onEvent(sessionId, method, handler) {
  persistentHandlers.set(`${sessionId}:${method}`, handler);
}

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

async function poll(sessionId, expression, timeoutMs = 10000, intervalMs = 50) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = await evaluate(sessionId, expression);
    if (value) return value;
    if (Date.now() > deadline) return null;
    await sleep(intervalMs);
  }
}

async function newPage() {
  const { browserContextId } = await send("Target.createBrowserContext");
  const { targetId } = await send("Target.createTarget", {
    url: "about:blank",
    browserContextId,
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  return { sessionId, targetId, browserContextId };
}

async function navigate(sessionId, url, { waitLoad = true } = {}) {
  const loaded = waitLoad
    ? waitEvent(sessionId, "Page.loadEventFired")
    : Promise.resolve();
  await send("Page.navigate", { url }, sessionId);
  await loaded;
}

const isSearchFocused = `document.activeElement && document.activeElement.id === "search"`;

// ---------- 场景 ----------
const results = [];

async function scenarioFirstEntry() {
  const { sessionId } = await newPage();
  const t0 = Date.now();
  await navigate(sessionId, `${BASE}/`);
  const focused = await poll(sessionId, isSearchFocused, 1000, 20);
  const elapsed = Date.now() - t0;
  const scrollY = await evaluate(sessionId, "window.scrollY");
  const inViewport = await evaluate(
    sessionId,
    `(() => {
      const r = document.querySelector("#search").getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight;
    })()`
  );

  let ok = Boolean(focused) && scrollY === 0 && inViewport;
  let detail = `focus=${elapsed}ms scrollY=${scrollY} inViewport=${inViewport}`;

  if (ok) {
    await send("Input.insertText", { text: "hello" }, sessionId);
    const value = await evaluate(
      sessionId,
      `document.querySelector("#search").value`
    );
    const qSynced = await poll(
      sessionId,
      `window.location.search.includes("q=hello")`,
      2000,
      100
    );
    await sleep(1500); // 等搜索数据完成，观察无二次抢焦点
    const stillFocused = await evaluate(sessionId, isSearchFocused);
    ok = value === "hello" && Boolean(qSynced) && Boolean(stillFocused);
    detail += ` typed="${value}" qSynced=${Boolean(qSynced)} stillFocused=${Boolean(stillFocused)}`;
  }
  return { ok, detail };
}

async function scenarioQueryCaret() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/en/?q=python`);
  const focused = await poll(sessionId, isSearchFocused, 1000, 20);
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
  const qSynced = await poll(
    sessionId,
    `window.location.search.includes("q=pythonx")`,
    2000,
    100
  );
  const ok =
    Boolean(focused) &&
    before.value === "python" &&
    before.start === 6 &&
    before.end === 6 &&
    after.value === "pythonx" &&
    after.start === 7 &&
    Boolean(qSynced);
  return {
    ok,
    detail: JSON.stringify({ before, after, qSynced: Boolean(qSynced) }),
  };
}

async function scenarioEarlyInteraction() {
  const { sessionId } = await newPage();
  await send(
    "Fetch.enable",
    { patterns: [{ urlPattern: "*.js", requestStage: "Request" }] },
    sessionId
  );
  const held = [];
  onEvent(sessionId, "Fetch.requestPaused", (p) => held.push(p.requestId));

  await navigate(sessionId, `${BASE}/`, { waitLoad: false });
  // 文档解析完成、链接可用，但脚本被持有 → 用户开始 Tab
  const linkReady = await poll(
    sessionId,
    `document.readyState === "interactive" && !!document.querySelector("header a")`,
    10000,
    50
  );
  await sleep(200);
  const tab = (type) =>
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
  await tab("rawKeyDown");
  await tab("keyUp");
  const activeIsLink = await evaluate(
    sessionId,
    `document.activeElement && document.activeElement.tagName === "A"`
  );

  for (const id of held) {
    await send("Fetch.continueRequest", { requestId: id }, sessionId).catch(
      () => {}
    );
  }
  await waitEvent(sessionId, "Page.loadEventFired", 20000);
  await sleep(600);
  const notStolen = await evaluate(
    sessionId,
    `!(document.activeElement && document.activeElement.id === "search")`
  );

  const ok = Boolean(linkReady) && Boolean(activeIsLink) && Boolean(notStolen);
  return {
    ok,
    detail: `linkReady=${Boolean(linkReady)} tabMovedFocus=${Boolean(activeIsLink)} notStolen=${Boolean(notStolen)}`,
  };
}

async function scenarioNoRefocus() {
  const { sessionId } = await newPage();
  await navigate(sessionId, `${BASE}/`);
  const focused = await poll(sessionId, isSearchFocused, 1000, 20);

  // 站内切到标签页（也有搜索框）
  await evaluate(
    sessionId,
    `document.querySelector('a[href="/en/tags"]').click()`
  );
  const tagsHydrated = await poll(
    sessionId,
    `window.location.pathname === "/en/tags" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("tags")`,
    10000,
    50
  );
  await sleep(400);
  const tagsNotFocused = await evaluate(
    sessionId,
    `!(document.activeElement && document.activeElement.id === "search")`
  );

  // 回到首页
  await evaluate(sessionId, `document.querySelector('a[href="/en/"]').click()`);
  const homeHydrated = await poll(
    sessionId,
    `window.location.pathname === "/en/" && document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
    10000,
    50
  );
  await sleep(400);
  const homeNotFocused = await evaluate(
    sessionId,
    `!(document.activeElement && document.activeElement.id === "search")`
  );

  // 刷新（同一标签页会话）
  await navigate(sessionId, `${BASE}/`);
  await sleep(500);
  const reloadNotFocused = await evaluate(
    sessionId,
    `!(document.activeElement && document.activeElement.id === "search")`
  );

  const ok =
    Boolean(focused) &&
    Boolean(tagsHydrated) &&
    Boolean(tagsNotFocused) &&
    Boolean(homeHydrated) &&
    Boolean(homeNotFocused) &&
    Boolean(reloadNotFocused);
  return {
    ok,
    detail: `firstFocus=${Boolean(focused)} tagsNotFocused=${Boolean(tagsNotFocused)} homeNotFocused=${Boolean(homeNotFocused)} reloadNotFocused=${Boolean(reloadNotFocused)}`,
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
      const key = `${msg.sessionId ?? ""}:${msg.method}`;
      const handler = persistentHandlers.get(key);
      if (handler) {
        handler(msg.params);
        return;
      }
      const q = eventQueues.get(key);
      if (q?.length) q.shift().resolve(msg.params);
    }
  });

  const scenarios = [
    ["A 成功首入 + 输入/URL同步/无二次抢焦点", scenarioFirstEntry],
    ["B 带 ?q= 首入（不清空不全选，光标在末尾）", scenarioQueryCaret],
    ["C 提前交互取消（慢加载期间 Tab）", scenarioEarlyInteraction],
    ["D 站内不重聚焦（切页/回首页/刷新）", scenarioNoRefocus],
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
