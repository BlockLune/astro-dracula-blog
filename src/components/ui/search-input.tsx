import { useEffect, useRef } from "react";
import { type Lang, useTranslations } from "@/utils/i18n";

// 每标签页会话最多一次自动聚焦机会（sessionStorage 会话级记录）。
// 键名与 base-layout.astro 的激活前哨兵脚本保持一致。
const AUTOFOCUS_SESSION_KEY = "search-autofocus-consumed";

export default function SearchInput({
  lang,
  query,
  onChange,
  totalCount,
  type,
}: {
  lang: Lang;
  query: string;
  onChange: (value: string) => void;
  totalCount: number;
  type: "post" | "tag";
}) {
  const t = useTranslations(lang);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    // 接管激活前哨兵（base-layout 内联脚本）：此后由组件负责监听与清理。
    const w = window as Window & { __searchAutofocusTakeover?: () => void };
    w.__searchAutofocusTakeover?.();
    w.__searchAutofocusTakeover = undefined;

    // 会话记录不可用（存储被禁/隐私模式）→ 保守跳过，手动搜索不受影响。
    let storage: Storage;
    try {
      storage = window.sessionStorage;
    } catch {
      return;
    }
    // 机会只消费一次；刷新、站内导航、再次挂载不再自动聚焦。
    // 激活前用户操作也会写入该标记（见 base-layout 哨兵）→ 不补聚焦。
    if (storage.getItem(AUTOFOCUS_SESSION_KEY) !== null) {
      return;
    }
    try {
      storage.setItem(AUTOFOCUS_SESSION_KEY, "1");
    } catch {
      return;
    }

    // 触摸主设备默认跳过，避免首屏弹出软键盘。
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return;
    }
    // URL fragment → 保留锚点，不聚焦。
    if (window.location.hash !== "") {
      return;
    }

    let finished = false;

    const cleanup = () => {
      window.removeEventListener("load", tryFocus);
      window.removeEventListener("pointerdown", cancel, { capture: true });
      window.removeEventListener("keydown", cancel, { capture: true });
      window.removeEventListener("touchstart", cancel, { capture: true });
      window.removeEventListener("wheel", cancel, { capture: true });
    };

    // 机会结束（成功或被安全条件拦截），不再补做。
    const finish = () => {
      finished = true;
      cleanup();
    };

    const tryFocus = () => {
      if (finished) {
        return;
      }
      // 就绪条件一：文档加载完成（激活早于 load 时等待 load 事件）。
      if (document.readyState !== "complete") {
        return;
      }
      const active = document.activeElement;
      const focusUntouched =
        active === null ||
        active === document.body ||
        active === document.documentElement;
      // 安全条件：后台文档 / 已有其他焦点 / 非初始滚动位置 / 输入不可用。
      if (
        document.visibilityState !== "visible" ||
        !focusUntouched ||
        window.scrollY !== 0 ||
        input.disabled
      ) {
        finish();
        return;
      }
      // 安全条件：目标不可见或不在可视区域（不滚动寻找）。
      const rect = input.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        rect.top < 0 ||
        rect.bottom > window.innerHeight ||
        rect.left < 0 ||
        rect.right > window.innerWidth
      ) {
        finish();
        return;
      }
      input.focus({ preventScroll: true });
      // 光标置于已有文本末尾：不清空、不全选。
      input.setSelectionRange(input.value.length, input.value.length);
      finish();
    };

    // 用户先行操作（键盘/指针/触摸/主动滚动）→ 取消自动聚焦，不补做。
    const cancel = () => {
      if (!finished) {
        finish();
      }
    };

    window.addEventListener("pointerdown", cancel, { capture: true });
    window.addEventListener("keydown", cancel, { capture: true });
    window.addEventListener("touchstart", cancel, { capture: true });
    window.addEventListener("wheel", cancel, { capture: true });

    if (document.readyState === "complete") {
      tryFocus();
    } else {
      window.addEventListener("load", tryFocus);
    }

    return cleanup;
  }, []);

  return (
    <div className="flex flex-col">
      <label className="sr-only" htmlFor="search">
        Search
      </label>
      <input
        ref={inputRef}
        id="search"
        type="text"
        placeholder={
          t("search.placeholder.firstPart") +
          totalCount +
          t(`search.placeholder.secondPart.${type}`)
        }
        className="card-input"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
