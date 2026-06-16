import { useState } from "react";
import type { DocumentComponent } from "../../types";
import type { ComponentFormProps } from "./ComponentForm.types";
import {
  TitleForm,
  ParagraphForm,
  ClauseForm,
  LineBreakForm,
  UnorderedListForm,
  LoopForm,
  ConditionalForm,
  SignatureForm,
  HeaderForm,
  ImageForm,
} from "./forms";
import styles from "./ComponentForm.module.css";

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_TYPES: { type: DocumentComponent["type"]; label: string }[] = [
  { type: "TITLE", label: "Título" },
  { type: "PARAGRAPH", label: "Parágrafo" },
  { type: "CLAUSE", label: "Cláusula" },
  { type: "LINE_BREAK", label: "Quebra" },
  { type: "UNORDERED_LIST", label: "Lista" },
  { type: "LOOP", label: "Loop" },
  { type: "CONDITIONAL", label: "Condicional" },
  { type: "SIGNATURE", label: "Assinatura" },
  { type: "HEADER", label: "Cabeçalho" },
  { type: "IMAGE", label: "Imagem" },
];

const NESTED_EXCLUDED: DocumentComponent["type"][] = ["LOOP", "CONDITIONAL"];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function summarizeComponent(component: DocumentComponent): string {
  switch (component.type) {
    case "TITLE":
    case "PARAGRAPH":
    case "CLAUSE":
      return component.runs.map((r) => r.text).join("") || "—";
    case "LINE_BREAK":
      return `${component.points}pt`;
    case "UNORDERED_LIST":
      return `${component.elements.length} item(s)`;
    case "LOOP":
      return `${(component.components ?? []).length} elemento(s)`;
    case "CONDITIONAL":
      return `{{${component.variable}}} = "${component.value}"`;
    case "SIGNATURE":
      return `${component.name} / ${component.document}`;
    case "HEADER":
      return `${(component.components ?? []).length} elemento(s)`;
    case "IMAGE":
      return `${component.width}x${component.height}pt`;
  }
}

// ── ComponentForm ─────────────────────────────────────────────────────────────

export function ComponentForm({
  onAdd,
  excludeTypes = [],
}: ComponentFormProps) {
  const availableTypes = ALL_TYPES.filter(
    (t) => !excludeTypes.includes(t.type),
  );
  const [activeType, setActiveType] = useState<DocumentComponent["type"]>(
    availableTypes[0]?.type ?? "PARAGRAPH",
  );

  // Render prop passed down to forms that need nested component lists.
  // Breaks the circular dependency: forms don't import ComponentForm.
  function renderNestedForm(onAddNested: (c: DocumentComponent) => void) {
    return <ComponentForm onAdd={onAddNested} excludeTypes={NESTED_EXCLUDED} />;
  }

  const sharedNested = { renderNestedForm, summarize: summarizeComponent };

  const formMap: Record<DocumentComponent["type"], React.ReactNode> = {
    TITLE: <TitleForm onAdd={onAdd} />,
    PARAGRAPH: <ParagraphForm onAdd={onAdd} />,
    CLAUSE: <ClauseForm onAdd={onAdd} />,
    LINE_BREAK: <LineBreakForm onAdd={onAdd} />,
    UNORDERED_LIST: <UnorderedListForm onAdd={onAdd} />,
    LOOP: <LoopForm onAdd={onAdd} {...sharedNested} />,
    CONDITIONAL: <ConditionalForm onAdd={onAdd} {...sharedNested} />,
    SIGNATURE: <SignatureForm onAdd={onAdd} />,
    HEADER: <HeaderForm onAdd={onAdd} {...sharedNested} />,
    IMAGE: <ImageForm onAdd={onAdd} />,
  };

  return (
    <div className={styles.root}>
      <div className={styles.typeSelector}>
        {availableTypes.map(({ type, label }) => (
          <button
            key={type}
            className={`${styles.typeButton} ${activeType === type ? styles.active : ""}`}
            onClick={() => setActiveType(type)}
          >
            {label}
          </button>
        ))}
      </div>

      {formMap[activeType]}
    </div>
  );
}
