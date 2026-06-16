import type { NormalVariablesSectionProps } from "./NormalVariablesSection.types";
import styles from "./VariablesFiller.module.css";

export function NormalVariablesSection({
  vars,
  values,
  onChange,
}: NormalVariablesSectionProps) {
  if (vars.length === 0) return null;

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Variáveis</p>
      {vars.map((name) => (
        <div key={name} className={styles.field}>
          <span className={styles.tag}>{`{{${name}}}`}</span>
          <input
            className={styles.input}
            placeholder={name}
            value={values[name] ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
