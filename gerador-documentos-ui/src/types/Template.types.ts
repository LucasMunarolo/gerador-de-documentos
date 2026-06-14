import type { Document } from "./Document.types";

export interface TemplateResponse {
  id: number;
  name: string;
  document: Document;
  variables: string[];
  loopVariables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRequest {
  name: string;
  document: Document;
}
