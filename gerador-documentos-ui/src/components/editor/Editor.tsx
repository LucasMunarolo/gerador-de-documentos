import { useState } from "react";
import type { Variables } from "../../types";
import { ComponentForm, summarizeComponent } from "../componentForm";
import type { EditorProps } from "./Editor.types";
import styles from "./Editor.module.css";

// ── Variables Panel ───────────────────────────────────────────────────────────

interface VariablesPanelProps {
  variables: Variables;
  onAdd: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}

function VariablesPanel({ variables, onAdd, onRemove }: VariablesPanelProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!key.trim()) return;
    onAdd(key.trim(), value);
    setKey("");
    setValue("");
  }

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Variáveis de teste</p>
      <p className={styles.hint}>
        Valores apenas para preview — não são salvos no template. Use{" "}
        <code>{"{{nome}}"}</code> nos textos para interpolação.
      </p>

      <div className={styles.variableRow}>
        <input
          className={styles.input}
          placeholder="nome"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className={styles.addRunButton}
          onClick={handleAdd}
          disabled={!key.trim()}
        >
          +
        </button>
      </div>

      {Object.entries(variables).map(([k, v]) => (
        <div key={k} className={styles.componentItem}>
          <span className={styles.componentTag}>{`{{${k}}}`}</span>
          <span className={styles.componentSummary}>{v}</span>
          <button
            className={`${styles.iconButton} ${styles.danger}`}
            onClick={() => onRemove(k)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Editor ────────────────────────────────────────────────────────────────────

export function Editor({
  document,
  variables,
  onAddComponent,
  onRemoveComponent,
  onMoveComponent,
  onAddVariable,
  onRemoveVariable,
  showVariables = false,
}: EditorProps) {
  return (
    <aside className={styles.editor}>
      <p className={styles.title}>Editor de Documento</p>

      {showVariables && onAddVariable && onRemoveVariable && (
        <VariablesPanel
          variables={variables}
          onAdd={onAddVariable}
          onRemove={onRemoveVariable}
        />
      )}

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Adicionar elemento</p>
        {document.components.some((c) => c.type === "HEADER") && (
          <p className={styles.hint}>
            ⚠️ Já existe um cabeçalho para o documento.
          </p>
        )}
        <ComponentForm
          onAdd={onAddComponent}
          excludeTypes={
            document.components.some((c) => c.type === "HEADER")
              ? ["HEADER"]
              : []
          }
        />
      </div>

      {document.components.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            Elementos ({document.components.length})
          </p>
          <div className={styles.componentList}>
            {document.components.map((component, index) => (
              <div key={index} className={styles.componentItem}>
                <span className={styles.componentTag}>
                  {component.type.replace(/_/g, " ")}
                </span>
                <span className={styles.componentSummary}>
                  {summarizeComponent(component)}
                </span>
                <div className={styles.componentActions}>
                  <button
                    className={styles.iconButton}
                    onClick={() => onMoveComponent(index, "up")}
                    disabled={index === 0}
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onMoveComponent(index, "down")}
                    disabled={index === document.components.length - 1}
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    className={`${styles.iconButton} ${styles.danger}`}
                    onClick={() => onRemoveComponent(index)}
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
