import { useState } from "react";

const BASE_URL = "http://localhost:8080/documents";

export function useDocumentGenerate() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(
    templateId: number,
    variables: Record<string, string>,
    loopVariables: Record<string, string[]>,
    fileName: string,
  ) {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/${templateId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables, loopVariables }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar PDF");
    } finally {
      setGenerating(false);
    }
  }

  return { generate, generating, error };
}
