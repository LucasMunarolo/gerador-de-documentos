import { useState } from "react";
import type { Document, DocumentComponent, TemplateResponse } from "../types";
import { useTemplates } from "./useTemplates";

const EMPTY_DOCUMENT: Document = { components: [] };

export function useTemplateEditor() {
  const [document, setDocument] = useState<Document>(EMPTY_DOCUMENT);
  const [templateName, setTemplateName] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const { loading, create, update, fetchAll } = useTemplates();

  function addComponent(component: DocumentComponent) {
    setDocument((prev) => ({ components: [...prev.components, component] }));
  }

  function removeComponent(index: number) {
    setDocument((prev) => ({
      components: prev.components.filter((_, i) => i !== index),
    }));
  }

  function moveComponent(index: number, direction: "up" | "down") {
    setDocument((prev) => {
      const components = [...prev.components];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= components.length) return prev;
      [components[index], components[target]] = [
        components[target],
        components[index],
      ];
      return { components };
    });
  }

  function loadTemplate(template: TemplateResponse) {
    setDocument(template.document);
    setTemplateName(template.name);
    setCurrentTemplateId(template.id);
  }

  function importJson(file: File, onError: (msg: string) => void) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!parsed.components) throw new Error("JSON inválido");
        setDocument({ components: parsed.components });
        setTemplateName(file.name.replace(".json", ""));
        setCurrentTemplateId(null);
      } catch {
        onError("Arquivo JSON inválido.");
      }
    };
    reader.readAsText(file);
  }

  function clear() {
    setDocument(EMPTY_DOCUMENT);
    setTemplateName("");
    setCurrentTemplateId(null);
  }

  async function save() {
    setSaveError(null);
    if (!templateName.trim()) {
      setSaveError("Informe um nome para o template.");
      return;
    }
    const body = { name: templateName, document };
    const result = currentTemplateId
      ? await update(currentTemplateId, body)
      : await create(body);
    if (result) {
      setCurrentTemplateId(result.id);
      fetchAll();
    }
  }

  return {
    document,
    templateName,
    setTemplateName,
    currentTemplateId,
    saveError,
    loading,
    addComponent,
    removeComponent,
    moveComponent,
    loadTemplate,
    importJson,
    clear,
    save,
  };
}
