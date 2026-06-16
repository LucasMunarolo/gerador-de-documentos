import type { FormFieldProps } from "./FormField.types";
import styles from "./FormField.module.css";

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children && children}
      {hint && (
        <p className={styles.hint} dangerouslySetInnerHTML={{ __html: hint }} />
      )}
    </div>
  );
}
