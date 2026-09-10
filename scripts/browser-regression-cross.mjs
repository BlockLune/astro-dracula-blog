// 跨浏览器核心回归（G10）：Chromium / Firefox / WebKit 的成功首入、
// 激活前交互取消、站内不重聚焦。
//
// 运行：pnpm build && node scripts/browser-regression-cross.mjs
// 依赖：playwright（devDependency）及其 firefox/webkit 构建。
//   pnpm exec playwright install firefox webkit
// 注：本机为非官方支持发行版（Arch），WebKit 需 Ubuntu 侧 libicu74/
//   libxml2.so.2/libflite1（见 docs/search-autofocus-spec.md 环境备注与
//   交付报告），已软链进 playwright 缓存；PLAYWRIGHT_SKIP_VALIDATE_
//   HOST_REQUIREMENTS=1 跳过宿主校验。Chromium 使用系统 chromium。
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium, firefox, webkit } from "playwright";

const PORT = await new Promise((resolve, reject) => {
  const srv = createServer();
  srv.once("error", reject);
  srv.listen(0, "127.0.0.1", () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});
const BASE = `http://localhost:${PORT}`;

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html 不存在，请先运行 pnpm build");
  process.exit(2);
}

const preview = spawn(
  "pnpm",
  ["exec", "astro", "preview", "--port", String(PORT)],
  {
    stdio: "ignore",
  }
);
for (let i = 0; i < 300; i++) {
  try {
    const r = await fetch(`${BASE}/`);
    if (r.ok) break;
  } catch {}
  await sleep(100);
}

// focus 调用计数 / 运行时错误探针（仅观测，不改变应用行为）
const PROBE = `(() => {
  const times = window.__autofocusProbe = { searchFocusCalls: 0, errors: [] };
  const orig = HTMLInputElement.prototype.focus;
  HTMLInputElement.prototype.focus = function (...args) {
    if (this.id === "search") times.searchFocusCalls++;
    return orig.apply(this, args);
  };
  window.addEventListener("error", (e) => {
    if (e.target === window) times.errors.push(String(e.message));
  });
  window.addEventListener("unhandledrejection", (e) => {
    times.errors.push(String(e.reason));
  });
})();`;

const isSearchFocused = `document.activeElement && document.activeElement.id === "search"`;
const notSearchFocused = `!(document.activeElement && document.activeElement.id === "search")`;

async function runBrowser(name, launch) {
  const browser = await launch;
  const results = [];

  // 预热：冷启动（JIT/进程初始化）不属于「正常前台条件」，先做一次非计时加载
  {
    const warmup = await browser.newContext();
    const page = await warmup.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await sleep(500);
    await warmup.close();
  }

  async function scenarioFirstEntry() {
    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();
    await page.addInitScript(PROBE);
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const t0 = Date.now();
    const focused = await page
      .waitForFunction(isSearchFocused, { timeout: 1000 })
      .then(() => true)
      .catch(() => false);
    const elapsed = Date.now() - t0;
    await sleep(600);
    const state = await page.evaluate(`({
      calls: window.__autofocusProbe.searchFocusCalls,
      errors: window.__autofocusProbe.errors,
      scrollY: window.scrollY,
      focused: ${isSearchFocused},
    })`);
    const ok =
      focused &&
      elapsed <= 1000 &&
      state.calls === 1 &&
      state.errors.length === 0 &&
      state.scrollY === 0 &&
      state.focused;
    await context.close();
    return {
      ok,
      detail: `focus=${elapsed}ms calls=${state.calls} errors=${state.errors.length} scrollY=${state.scrollY}`,
    };
  }

  async function scenarioEarlyInteractionCancel() {
    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();
    await page.addInitScript(PROBE);
    // 延迟岛屿 chunk：激活前完成「点击空白处」交互
    let held = null;
    await page.route("**/post-stack*", (route) => {
      held = route;
    });
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#search", { timeout: 10000 });
    await sleep(300);
    await page.mouse.click(2, 2);
    const marker = await page.evaluate(
      `sessionStorage.getItem("search-autofocus-consumed")`
    );
    if (held) await held.continue();
    await page.waitForLoadState("load", { timeout: 15000 });
    await sleep(700);
    const state = await page.evaluate(`({
      calls: window.__autofocusProbe.searchFocusCalls,
      errors: window.__autofocusProbe.errors,
      focused: ${isSearchFocused},
    })`);
    const ok =
      marker === "1" &&
      state.calls === 0 &&
      state.errors.length === 0 &&
      !state.focused;
    await context.close();
    return {
      ok,
      detail: `markerBeforeHydration=${marker} calls=${state.calls} errors=${state.errors.length} focused=${state.focused}`,
    };
  }

  async function scenarioNoRefocus() {
    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();
    await page.addInitScript(PROBE);
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.waitForFunction(isSearchFocused, { timeout: 1000 });
    // 站内切到标签页（也有搜索框）→ 不重聚焦
    await page.click('a[href="/en/tags"]');
    await page.waitForFunction(
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("tags")`,
      { timeout: 10000 }
    );
    await sleep(400);
    const tagsNotFocused = await page.evaluate(notSearchFocused);
    // 回首页 → 不重聚焦
    await page.click('a[href="/en/"]');
    await page.waitForFunction(
      `document.querySelector("#search") && document.querySelector("#search").placeholder.includes("posts")`,
      { timeout: 10000 }
    );
    await sleep(400);
    const homeNotFocused = await page.evaluate(notSearchFocused);
    const callsAfterNav = await page.evaluate(
      `window.__autofocusProbe.searchFocusCalls`
    );
    // 刷新（同一标签页会话，新文档）→ 0 次新增聚焦
    await page.reload({ waitUntil: "load" });
    await sleep(700);
    const reloadNotFocused = await page.evaluate(notSearchFocused);
    const callsAfterReload = await page.evaluate(
      `window.__autofocusProbe.searchFocusCalls`
    );
    const errors = await page.evaluate(`window.__autofocusProbe.errors.length`);
    const ok =
      tagsNotFocused &&
      homeNotFocused &&
      callsAfterNav === 1 &&
      reloadNotFocused &&
      callsAfterReload === 0 &&
      errors === 0;
    await context.close();
    return {
      ok,
      detail: `tagsNotFocused=${tagsNotFocused} homeNotFocused=${homeNotFocused} callsAfterNav=${callsAfterNav} reloadNotFocused=${reloadNotFocused} callsAfterReload=${callsAfterReload} errors=${errors}`,
    };
  }

  const scenarios = [
    ["成功首入（≤1s、计数 1、scrollY 0）", scenarioFirstEntry],
    ["激活前点击空白处取消", scenarioEarlyInteractionCancel],
    ["站内不重聚焦（切页/回首页/刷新）", scenarioNoRefocus],
  ];
  for (const [label, run] of scenarios) {
    try {
      const { ok, detail } = await run();
      results.push({ label, ok, detail });
      console.log(`${ok ? "PASS" : "FAIL"}  ${name} ${label}  (${detail})`);
    } catch (err) {
      results.push({ label, ok: false, detail: err.message });
      console.log(`FAIL  ${name} ${label}  (${err.message.split("\n")[0]})`);
    }
  }
  await browser.close();
  return results;
}

const launchOptions = (channel) => ({
  headless: true,
  ...(channel === "chromium" ? { executablePath: "/usr/bin/chromium" } : {}),
});

const browsers = [
  ["Chromium", chromium.launch(launchOptions("chromium"))],
  ["Firefox", firefox.launch()],
  ["WebKit", webkit.launch()],
];

let exitCode = 1;
try {
  const all = [];
  for (const [name, launch] of browsers) {
    try {
      all.push(...(await runBrowser(name, launch)));
    } catch (err) {
      console.log(`FAIL  ${name} 启动失败: ${err.message.split("\n")[0]}`);
      all.push({ label: "launch", ok: false, detail: err.message });
    }
  }
  exitCode = all.every((r) => r.ok) ? 0 : 1;
  console.log(exitCode === 0 ? "\n全部通过" : "\n存在失败");
} finally {
  preview.kill("SIGKILL");
}
process.exit(exitCode);
