import { useState } from "react";
import { Button } from "../Button";
import { FormField } from "../FormField";
import type { VariablesPanelProps } from "./VariablesPanel.types";
import styles from "./VariablesPanel.module.css";

export function VariablesPanel({
  variables,
  onAdd,
  onRemove,
}: VariablesPanelProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!key.trim()) return;
    onAdd(key.trim(), value);
    setKey("");
    setValue("");
  }

  return (
    <>
      <div className={styles.row}>
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
        <Button variant="outline" onClick={handleAdd} disabled={!key.trim()}>
          +
        </Button>
      </div>

      <FormField hint="Valores apenas para preview — use <code>{{nome}}</code> nos textos." />

      {Object.entries(variables).map(([k, v]) => (
        <div key={k} className={styles.item}>
          <span className={styles.itemTag}>{`{{${k}}}`}</span>
          <span className={styles.itemValue}>{v}</span>
          <Button variant="icon-danger" onClick={() => onRemove(k)}>
            ×
          </Button>
        </div>
      ))}
    </>
  );
}
