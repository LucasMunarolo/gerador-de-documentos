import { NormalVariablesSection } from "./NormalVariablesSection";
import { LoopVariablesSection } from "./LoopVariablesSection";
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

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Preencher variáveis</p>

      {!hasAny ? (
        <p className={styles.empty}>
          Selecione um template para preencher as variáveis.
        </p>
      ) : (
        <>
          <NormalVariablesSection
            vars={normalVars}
            values={variables}
            onChange={onVariableChange}
          />
          <LoopVariablesSection
            vars={loopVars}
            values={loopVariables}
            onChange={onLoopVariableChange}
          />
        </>
      )}
    </div>
  );
}
