const BASE_URL = "http://localhost:8080";

export const API_ROUTES = {
  templates: `${BASE_URL}/templates`,
  template: (id: number) => `${BASE_URL}/templates/${id}`,
  generateDocument: (id: number) => `${BASE_URL}/documents/${id}/generate`,
  previewDocument: (id: number) => `${BASE_URL}/documents/${id}/preview`,
  uploadImage: `${BASE_URL}/images/upload`,
} as const;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseError(res: Response): Promise<never> {
  const body = await res
    .json()
    .catch(() => ({ message: `HTTP ${res.status}` }));
  throw new ApiError(res.status, body.message ?? `HTTP ${res.status}`);
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) await parseError(res);
  return res.status === 204 ? (null as T) : res.json();
}

export async function apiFetchBlob(
  url: string,
  options?: RequestInit,
): Promise<Blob> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) await parseError(res);
  return res.blob();
}

export async function apiFetchText(
  url: string,
  options?: RequestInit,
): Promise<string> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) await parseError(res);
  return res.text();
}

export async function apiFetchFormData<T>(
  url: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) await parseError(res);
  return res.json();
}
