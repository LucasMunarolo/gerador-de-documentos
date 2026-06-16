import { ComponentForm, summarizeComponent } from "../ComponentForm";
import { Button } from "../Button";
import { VariablesPanel } from "../VariablesPanel";
import type { EditorProps } from "./Editor.types";
import styles from "./Editor.module.css";

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
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Variáveis de teste</p>
          <VariablesPanel
            variables={variables}
            onAdd={onAddVariable}
            onRemove={onRemoveVariable}
          />
        </div>
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
                  <Button
                    variant="icon"
                    onClick={() => onMoveComponent(index, "up")}
                    disabled={index === 0}
                    title="Mover para cima"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="icon"
                    onClick={() => onMoveComponent(index, "down")}
                    disabled={index === document.components.length - 1}
                    title="Mover para baixo"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="icon-danger"
                    onClick={() => onRemoveComponent(index)}
                    title="Remover"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
