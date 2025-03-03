import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function useSearchParams() {
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });

  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (debouncedQuery !== params.get("q")) {
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      } else {
        params.delete("q");
      }

      window.history.replaceState(
        { ...window.history.state, q: debouncedQuery },
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return {
    query,
    debouncedQuery,
    setQuery,
  };
}
