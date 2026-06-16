import { useLoopVariables } from "../../hooks/useLoopVariables";
import { Button } from "../Button";
import type { LoopVariablesSectionProps } from "./LoopVariablesSection.types";
import styles from "./VariablesFiller.module.css";

export function LoopVariablesSection({
  vars,
  values,
  onChange,
}: LoopVariablesSectionProps) {
  if (vars.length === 0) return null;

  const { addRow, updateRow, removeRow } = useLoopVariables(values, onChange);

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Variáveis de loop</p>
      <p className={styles.hint}>Cada linha corresponde a uma iteração.</p>

      {vars.map((name) => {
        const rows = values[name] ?? [];
        return (
          <div key={name} className={styles.loopField}>
            <span className={styles.tag}>{`{{${name}}}`}</span>
            {rows.map((val, i) => (
              <div key={i} className={styles.loopRow}>
                <span className={styles.loopIndex}>#{i + 1}</span>
                <input
                  className={styles.input}
                  placeholder={`${name} ${i + 1}`}
                  value={val}
                  onChange={(e) => updateRow(name, i, e.target.value)}
                />
                <Button
                  variant="icon-danger"
                  onClick={() => removeRow(name, i)}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => addRow(name)}>
              + iteração
            </Button>
          </div>
        );
      })}
    </div>
  );
}
