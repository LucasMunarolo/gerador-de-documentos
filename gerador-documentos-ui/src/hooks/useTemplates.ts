import { useState, useCallback } from "react";
import type { TemplateRequest, TemplateResponse } from "../types";

const BASE_URL = "http://localhost:8080/templates";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }
  return res.status === 204 ? (null as T) : res.json();
}

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchAll = useCallback(async () => {
    const data = await run(() => request<TemplateResponse[]>(BASE_URL));
    if (data) setTemplates(data);
  }, [run]);

  const fetchById = useCallback(
    (id: number) => run(() => request<TemplateResponse>(`${BASE_URL}/${id}`)),
    [run],
  );

  const create = useCallback(
    (body: TemplateRequest) =>
      run(() =>
        request<TemplateResponse>(BASE_URL, {
          method: "POST",
          body: JSON.stringify(body),
        }),
      ),
    [run],
  );

  const update = useCallback(
    (id: number, body: TemplateRequest) =>
      run(() =>
        request<TemplateResponse>(`${BASE_URL}/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        }),
      ),
    [run],
  );

  const remove = useCallback(
    async (id: number) => {
      const result = await run(() =>
        request<null>(`${BASE_URL}/${id}`, { method: "DELETE" }),
      );
      if (result === null && !error)
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      return result;
    },
    [run, error],
  );

  return {
    templates,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
}
