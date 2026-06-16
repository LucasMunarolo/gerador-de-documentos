import type { TextRun, LoopRun, MarkType } from "../../types";
import type { RunsEditorProps } from "./RunsEditor.types";
import styles from "./RunsEditor.module.css";
import { Button } from "../Button";
import { FormField } from "../FormField";

const MARKS: MarkType[] = ["BOLD", "ITALIC", "UNDERLINE"];
const MARK_LABELS: Record<MarkType, string> = {
  BOLD: "N",
  ITALIC: "I",
  UNDERLINE: "S",
};

export function emptyRun(): TextRun {
  return { text: "", marks: [] };
}

// ── LoopRunEditor ─────────────────────────────────────────────────────────────

interface LoopRunEditorProps {
  loopRun: LoopRun;
  onChange: (loopRun: LoopRun) => void;
  onRemove: () => void;
}

function LoopRunEditor({ loopRun, onChange, onRemove }: LoopRunEditorProps) {
  return (
    <div className={styles.loopRunBox}>
      <div className={styles.runHeader}>
        <span className={styles.runLabel}>↻ Loop de trechos</span>
        <Button variant="icon-danger" onClick={onRemove} title="Remove loop">
          ×
        </Button>
      </div>
      <FormField hint="Use <code>{{variavel}}</code> nos trechos abaixo — cada uma se torna uma variável de loop." />
      <RunsEditor
        runs={loopRun.runs}
        onChange={(runs) => onChange({ ...loopRun, runs })}
      />
    </div>
  );
}

// ── RunsEditor ────────────────────────────────────────────────────────────────

export function RunsEditor({ runs, onChange }: RunsEditorProps) {
  function updateRun(index: number, patch: Partial<TextRun>) {
    onChange(runs.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function toggleMark(index: number, mark: MarkType) {
    const run = runs[index];
    const marks = run.marks.includes(mark)
      ? run.marks.filter((m) => m !== mark)
      : [...run.marks, mark];
    updateRun(index, { marks });
  }

  function toggleLoopRun(index: number, enabled: boolean) {
    updateRun(index, {
      loopRun: enabled ? { items: [], runs: [emptyRun()] } : undefined,
    });
  }

  return (
    <>
      {runs.map((run, i) => (
        <div key={i} className={styles.runItem}>
          <div className={styles.runHeader}>
            <span className={styles.runLabel}>Trecho {i + 1}</span>
            {runs.length > 1 && (
              <Button
                variant="icon-danger"
                onClick={() => onChange(runs.filter((_, idx) => idx !== i))}
              >
                ×
              </Button>
            )}
          </div>

          {run.loopRun ? (
            <LoopRunEditor
              loopRun={run.loopRun}
              onChange={(lr) => updateRun(i, { loopRun: lr })}
              onRemove={() => toggleLoopRun(i, false)}
            />
          ) : (
            <>
              <textarea
                className={styles.textarea}
                placeholder="Texto... use {{variavel}} para interpolação"
                value={run.text}
                onChange={(e) => updateRun(i, { text: e.target.value })}
              />
              <div className={styles.marksRow}>
                {MARKS.map((mark) => (
                  <button
                    key={mark}
                    className={run.marks.includes(mark) ? styles.markToggleActive : styles.markToggle}
                    onClick={() => toggleMark(i, mark)}
                  >
                    {MARK_LABELS[mark]}
                  </button>
                ))}
                <button
                  className={styles.markToggle}
                  onClick={() => toggleLoopRun(i, true)}
                  title="Converter em loop de trechos"
                >
                  ↻ Loop
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <Button variant="outline" onClick={() => onChange([...runs, emptyRun()])}>
        + Adicionar trecho
      </Button>
    </>
  );
}
