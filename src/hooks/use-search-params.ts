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

      // Construct the new URL with the updated query string
      // Remove the trailing question mark if no query string is present
      const qs = params.toString();
      const { pathname, hash } = window.location;
      const newUrl = qs
        ? `${pathname}?${qs}${hash || ""}`
        : `${pathname}${hash || ""}`;

      window.history.replaceState(
        { ...window.history.state, q: debouncedQuery },
        "",
        newUrl,
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
