import { useState } from "react";

const BASE_URL = "http://localhost:8080/images";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao fazer upload");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
