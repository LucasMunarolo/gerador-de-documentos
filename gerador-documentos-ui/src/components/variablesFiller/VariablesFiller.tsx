import type { VariablesFillerProps } from "./VariablesFiller.types";
import styles from "./VariablesFiller.module.css";

export function VariablesFiller({
  normalVars,
  loopVars,
  variables,
  loopVariables,
  onVariableChange,
  onLoopVariableChange,
}: VariablesFillerProps) {
  const hasAny = normalVars.length > 0 || loopVars.length > 0;

  function addLoopRow(key: string) {
    onLoopVariableChange(key, [...(loopVariables[key] ?? []), ""]);
  }

  function updateLoopRow(key: string, index: number, value: string) {
    const updated = [...(loopVariables[key] ?? [])];
    updated[index] = value;
    onLoopVariableChange(key, updated);
  }

  function removeLoopRow(key: string, index: number) {
    onLoopVariableChange(
      key,
      (loopVariables[key] ?? []).filter((_, i) => i !== index),
    );
  }

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Preencher variáveis</p>

      {!hasAny ? (
        <p className={styles.empty}>
          Selecione um template para preencher as variáveis.
        </p>
      ) : (
        <>
          {normalVars.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Variáveis</p>
              {normalVars.map((name) => (
                <div key={name} className={styles.field}>
                  <span className={styles.tag}>{`{{${name}}}`}</span>
                  <input
                    className={styles.input}
                    placeholder={name}
                    value={variables[name] ?? ""}
                    onChange={(e) => onVariableChange(name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {loopVars.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Variáveis de loop</p>
              <p className={styles.hint}>
                Cada linha corresponde a uma iteração.
              </p>
              {loopVars.map((name) => {
                const values = loopVariables[name] ?? [];
                return (
                  <div key={name} className={styles.loopField}>
                    <span className={styles.tag}>{`{{${name}}}`}</span>
                    {values.map((val, i) => (
                      <div key={i} className={styles.loopRow}>
                        <span className={styles.loopIndex}>#{i + 1}</span>
                        <input
                          className={styles.input}
                          placeholder={`${name} ${i + 1}`}
                          value={val}
                          onChange={(e) =>
                            updateLoopRow(name, i, e.target.value)
                          }
                        />
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeLoopRow(name, i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className={styles.addRowBtn}
                      onClick={() => addLoopRow(name)}
                    >
                      + iteração
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
