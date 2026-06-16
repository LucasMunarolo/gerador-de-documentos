import { useState, useEffect } from "react";
import type { Variables } from "../types";
import type { LoopVariables } from "../../public/variablesFiller/VariablesFiller.types";

const BASE_URL = "http://localhost:8080/documents";
const DEBOUNCE_MS = 500;

export function useDocumentPreview(
  templateId: number | null,
  variables: Variables,
  loopVariables: LoopVariables,
) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setHtml("");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      fetch(`${BASE_URL}/${templateId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables, loopVariables }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res
              .json()
              .catch(() => ({ message: `HTTP ${res.status}` }));
            throw new Error(err.message);
          }
          return res.text();
        })
        .then(setHtml)
        .catch((e) => {
          if (e.name !== "AbortError")
            setError(e.message ?? "Erro ao gerar preview");
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [templateId, JSON.stringify(variables), JSON.stringify(loopVariables)]);

  return { html, loading, error };
}
