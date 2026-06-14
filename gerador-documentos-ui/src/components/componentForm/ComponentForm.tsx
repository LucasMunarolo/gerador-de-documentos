import { useState } from "react";
import type {
  DocumentComponent,
  Paragraph,
  Clause,
  LineBreak,
  UnorderedList,
  Title,
  Loop,
  Conditional,
  Signature,
  Header,
  Image,
  TextRun,
  LoopRun,
  MarkType,
  Alignment,
} from "../../types";
import type { ComponentFormProps } from "./ComponentForm.types";
import { useImageUpload } from "../../hooks/useImageUpload";
import styles from "./ComponentForm.module.css";

// ── Constantes ────────────────────────────────────────────────────────────────

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

const ALIGNMENTS: Alignment[] = ["LEFT", "CENTER", "RIGHT"];
const ALIGNMENT_LABELS: Record<Alignment, string> = {
  LEFT: "Esquerda",
  CENTER: "Centro",
  RIGHT: "Direita",
};

const MARKS: MarkType[] = ["BOLD", "ITALIC", "UNDERLINE"];
const MARK_LABELS: Record<MarkType, string> = {
  BOLD: "N",
  ITALIC: "I",
  UNDERLINE: "S",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyRun(): TextRun {
  return { text: "", marks: [] };
}

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
      return `${(component.items ?? []).length} iteração(ões), ${(component.components ?? []).length} elemento(s)`;
    case "CONDITIONAL":
      return `{{${component.variable}}} = "${component.value}" — ${(component.components ?? []).length} elemento(s)`;
    case "SIGNATURE":
      return `${component.name} / ${component.document}`;
    case "HEADER":
      return `${(component.components ?? []).length} elemento(s), borda: ${component.border ? "sim" : "não"}`;
    case "IMAGE":
      return `${component.width}x${component.height}pt`;
  }
}

// ── RunsEditor ────────────────────────────────────────────────────────────────

interface RunsEditorProps {
  runs: TextRun[];
  onChange: (runs: TextRun[]) => void;
}

function RunsEditor({ runs, onChange }: RunsEditorProps) {
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

  function updateLoopRun(index: number, loopRun: LoopRun) {
    updateRun(index, { loopRun });
  }

  return (
    <>
      {runs.map((run, i) => (
        <div key={i} className={styles.runItem}>
          <div className={styles.runHeader}>
            <span className={styles.runLabel}>Trecho {i + 1}</span>
            {runs.length > 1 && (
              <button
                className={styles.removeRunButton}
                onClick={() => onChange(runs.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            )}
          </div>

          {!run.loopRun ? (
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
                    className={`${styles.markToggle} ${run.marks.includes(mark) ? styles.active : ""}`}
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
          ) : (
            <LoopRunEditor
              loopRun={run.loopRun}
              onChange={(lr) => updateLoopRun(i, lr)}
              onRemove={() => toggleLoopRun(i, false)}
            />
          )}
        </div>
      ))}
      <button
        className={styles.addRunButton}
        onClick={() => onChange([...runs, emptyRun()])}
      >
        + Adicionar trecho
      </button>
    </>
  );
}

// ── LoopRunEditor ─────────────────────────────────────────────────────────────

interface LoopRunEditorProps {
  loopRun: LoopRun;
  onChange: (loopRun: LoopRun) => void;
  onRemove: () => void;
}

function LoopRunEditor({ loopRun, onChange, onRemove }: LoopRunEditorProps) {
  function updateRuns(runs: TextRun[]) {
    onChange({ ...loopRun, runs });
  }

  return (
    <div className={styles.loopRunBox}>
      <div className={styles.runHeader}>
        <span className={styles.runLabel}>↻ Loop de trechos</span>
        <button
          className={styles.removeRunButton}
          onClick={onRemove}
          title="Remover loop"
        >
          ×
        </button>
      </div>

      <p className={styles.hint}>
        Use <code>{"{{variavel}}"}</code> nos trechos abaixo — cada uma se torna
        uma variável de loop, preenchida com uma lista de valores na geração do
        documento.
      </p>

      <RunsEditor runs={loopRun.runs} onChange={updateRuns} />
    </div>
  );
}

// ── InnerComponentList ────────────────────────────────────────────────────────

interface InnerComponentListProps {
  title: string;
  components: DocumentComponent[];
  onChange: (components: DocumentComponent[]) => void;
}

function InnerComponentList({
  title,
  components,
  onChange,
}: InnerComponentListProps) {
  function handleAdd(component: DocumentComponent) {
    onChange([...components, component]);
  }

  function handleRemove(index: number) {
    onChange(components.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.innerSection}>
      <p className={styles.innerSectionTitle}>{title}</p>

      {components.length > 0 && (
        <div className={styles.innerComponentList}>
          {components.map((c, i) => (
            <div key={i} className={styles.innerComponentItem}>
              <span className={styles.innerComponentTag}>
                {c.type.replace(/_/g, " ")}
              </span>
              <span className={styles.innerComponentSummary}>
                {summarizeComponent(c)}
              </span>
              <button
                className={styles.removeInnerButton}
                onClick={() => handleRemove(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form aninhado — sem Loop/Conditional para evitar recursão infinita */}
      <ComponentForm onAdd={handleAdd} excludeTypes={["LOOP", "CONDITIONAL"]} />
    </div>
  );
}

// ── Forms por tipo ────────────────────────────────────────────────────────────

function TitleForm({ onAdd }: { onAdd: (c: Title) => void }) {
  const [alignment, setAlignment] = useState<Alignment>("CENTER");
  const [runs, setRuns] = useState<TextRun[]>([emptyRun()]);

  function handleAdd() {
    onAdd({ type: "TITLE", runs, alignment });
    setRuns([emptyRun()]);
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Alinhamento</label>
        <select
          className={styles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {ALIGNMENT_LABELS[a]}
            </option>
          ))}
        </select>
      </div>
      <RunsEditor runs={runs} onChange={setRuns} />
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={runs.every((r) => !r.text.trim())}
      >
        Adicionar Título
      </button>
    </div>
  );
}

function ParagraphForm({ onAdd }: { onAdd: (c: Paragraph) => void }) {
  const [alignment, setAlignment] = useState<Alignment>("LEFT");
  const [marginLeft, setMarginLeft] = useState("");
  const [runs, setRuns] = useState<TextRun[]>([emptyRun()]);

  function handleAdd() {
    onAdd({
      type: "PARAGRAPH",
      alignment,
      marginLeft: marginLeft ? Number(marginLeft) : undefined,
      runs,
    });
    setRuns([emptyRun()]);
    setMarginLeft("");
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Alinhamento</label>
        <select
          className={styles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {ALIGNMENT_LABELS[a]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Margem esquerda (pt)</label>
        <input
          className={styles.input}
          type="number"
          placeholder="Ex: 24"
          value={marginLeft}
          onChange={(e) => setMarginLeft(e.target.value)}
        />
      </div>
      <RunsEditor runs={runs} onChange={setRuns} />
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={runs.every((r) => !r.text.trim())}
      >
        Adicionar Parágrafo
      </button>
    </div>
  );
}

function ClauseForm({ onAdd }: { onAdd: (c: Clause) => void }) {
  const [numberStr, setNumberStr] = useState("");
  const [runs, setRuns] = useState<TextRun[]>([emptyRun()]);

  function handleAdd() {
    const number = numberStr
      .split(".")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    onAdd({ type: "CLAUSE", number, runs });
    setRuns([emptyRun()]);
    setNumberStr("");
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Número (ex: 1.2.3)</label>
        <input
          className={styles.input}
          type="text"
          placeholder="1.1"
          value={numberStr}
          onChange={(e) => setNumberStr(e.target.value)}
        />
      </div>
      <RunsEditor runs={runs} onChange={setRuns} />
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={!numberStr.trim() || runs.every((r) => !r.text.trim())}
      >
        Adicionar Cláusula
      </button>
    </div>
  );
}

function LineBreakForm({ onAdd }: { onAdd: (c: LineBreak) => void }) {
  const [points, setPoints] = useState("12");
  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Tamanho (pt)</label>
        <input
          className={styles.input}
          type="number"
          value={points}
          min={1}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <button
        className={styles.addButton}
        onClick={() => onAdd({ type: "LINE_BREAK", points: Number(points) })}
      >
        Adicionar Quebra de Linha
      </button>
    </div>
  );
}

function UnorderedListForm({ onAdd }: { onAdd: (c: UnorderedList) => void }) {
  const [items, setItems] = useState<string[]>([""]);

  function handleAdd() {
    const elements: Paragraph[] = items
      .filter((t) => t.trim())
      .map((text) => ({
        type: "PARAGRAPH",
        alignment: "LEFT",
        runs: [{ text, marks: [] }],
      }));
    onAdd({ type: "UNORDERED_LIST", elements });
    setItems([""]);
  }

  return (
    <div className={styles.form}>
      {items.map((item, i) => (
        <div key={i} className={styles.runItem}>
          <div className={styles.runHeader}>
            <span className={styles.runLabel}>Item {i + 1}</span>
            {items.length > 1 && (
              <button
                className={styles.removeRunButton}
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            )}
          </div>
          <input
            className={styles.input}
            placeholder="Texto do item..."
            value={item}
            onChange={(e) =>
              setItems(
                items.map((it, idx) => (idx === i ? e.target.value : it)),
              )
            }
          />
        </div>
      ))}
      <button
        className={styles.addRunButton}
        onClick={() => setItems([...items, ""])}
      >
        + Adicionar item
      </button>
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={items.every((t) => !t.trim())}
      >
        Adicionar Lista
      </button>
    </div>
  );
}

function LoopForm({ onAdd }: { onAdd: (c: Loop) => void }) {
  const [innerComponents, setInnerComponents] = useState<DocumentComponent[]>(
    [],
  );

  function handleAdd() {
    // items fica vazio — as variáveis disponíveis são as usadas em {{...}} dentro dos elementos,
    // e os valores são preenchidos na geração do documento (loopVariables).
    onAdd({ type: "LOOP", items: [], components: innerComponents });
    setInnerComponents([]);
  }

  return (
    <div className={styles.form}>
      <p className={styles.hint}>
        Use <code>{"{{variavel}}"}</code> nos elementos abaixo — cada uma se
        torna uma variável de loop, preenchida com uma lista de valores na
        geração do documento.
      </p>

      <InnerComponentList
        title="Elementos de cada iteração"
        components={innerComponents}
        onChange={setInnerComponents}
      />

      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={innerComponents.length === 0}
      >
        Adicionar Loop
      </button>
    </div>
  );
}

function ConditionalForm({ onAdd }: { onAdd: (c: Conditional) => void }) {
  const [variable, setVariable] = useState("");
  const [value, setValue] = useState("");
  const [innerComponents, setInnerComponents] = useState<DocumentComponent[]>(
    [],
  );

  function handleAdd() {
    onAdd({
      type: "CONDITIONAL",
      variable,
      value,
      components: innerComponents,
    });
    setVariable("");
    setValue("");
    setInnerComponents([]);
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Variável</label>
        <input
          className={styles.input}
          placeholder="Ex: tipo_contrato"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Valor esperado</label>
        <input
          className={styles.input}
          placeholder="Ex: PJ"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <p className={styles.hint}>
        Renderiza os elementos abaixo somente quando{" "}
        <code>{`{{${variable || "variavel"}}}`}</code> = "{value || "..."}"
      </p>

      <InnerComponentList
        title="Elementos exibidos quando a condição for verdadeira"
        components={innerComponents}
        onChange={setInnerComponents}
      />

      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={!variable.trim() || !value.trim()}
      >
        Adicionar Condicional
      </button>
    </div>
  );
}

function SignatureForm({ onAdd }: { onAdd: (c: Signature) => void }) {
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");

  function handleAdd() {
    onAdd({ type: "SIGNATURE", name, document: doc });
    setName("");
    setDoc("");
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Nome</label>
        <input
          className={styles.input}
          placeholder="Ex: {{nome}}"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Documento (CPF/CNPJ)</label>
        <input
          className={styles.input}
          placeholder="Ex: {{cpf}}"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
        />
      </div>
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={!name.trim()}
      >
        Adicionar Assinatura
      </button>
    </div>
  );
}

function HeaderForm({ onAdd }: { onAdd: (c: Header) => void }) {
  const [border, setBorder] = useState(false);
  const [innerComponents, setInnerComponents] = useState<DocumentComponent[]>(
    [],
  );

  function handleAdd() {
    onAdd({ type: "HEADER", components: innerComponents, border });
    setInnerComponents([]);
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={border}
            onChange={(e) => setBorder(e.target.checked)}
          />{" "}
          Exibir borda inferior
        </label>
      </div>
      <InnerComponentList
        title="Elementos do cabeçalho"
        components={innerComponents}
        onChange={setInnerComponents}
      />
      <button className={styles.addButton} onClick={handleAdd}>
        Adicionar Cabeçalho
      </button>
    </div>
  );
}

function ImageForm({ onAdd }: { onAdd: (c: Image) => void }) {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState("200");
  const [height, setHeight] = useState("100");
  const [alignment, setAlignment] = useState<Alignment>("LEFT");
  const { upload, uploading, error: uploadError } = useImageUpload();

  function handleAdd() {
    onAdd({
      type: "IMAGE",
      url,
      width: Number(width),
      height: Number(height),
      alignment,
    });
    setUrl("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await upload(file);
    if (uploadedUrl) setUrl(uploadedUrl);
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Upload de arquivo</label>
        <input
          className={styles.input}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <span className={styles.hint}>Enviando...</span>}
        {uploadError && (
          <span className={styles.hint} style={{ color: "#e53e3e" }}>
            {uploadError}
          </span>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>URL da imagem</label>
        <input
          className={styles.input}
          placeholder="https://... ou {{url_variavel}}"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Largura (pt)</label>
        <input
          className={styles.input}
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Altura (pt)</label>
        <input
          className={styles.input}
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Alinhamento</label>
        <select
          className={styles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {(["LEFT", "CENTER", "RIGHT"] as Alignment[]).map((a) => (
            <option key={a} value={a}>
              {a === "LEFT"
                ? "Esquerda"
                : a === "CENTER"
                  ? "Centro"
                  : "Direita"}
            </option>
          ))}
        </select>
      </div>
      <button
        className={styles.addButton}
        onClick={handleAdd}
        disabled={!url.trim() || uploading}
      >
        Adicionar Imagem
      </button>
    </div>
  );
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

      {activeType === "TITLE" && <TitleForm onAdd={onAdd} />}
      {activeType === "PARAGRAPH" && <ParagraphForm onAdd={onAdd} />}
      {activeType === "CLAUSE" && <ClauseForm onAdd={onAdd} />}
      {activeType === "LINE_BREAK" && <LineBreakForm onAdd={onAdd} />}
      {activeType === "UNORDERED_LIST" && <UnorderedListForm onAdd={onAdd} />}
      {activeType === "LOOP" && <LoopForm onAdd={onAdd} />}
      {activeType === "CONDITIONAL" && <ConditionalForm onAdd={onAdd} />}
      {activeType === "SIGNATURE" && <SignatureForm onAdd={onAdd} />}
      {activeType === "HEADER" && <HeaderForm onAdd={onAdd} />}
      {activeType === "IMAGE" && <ImageForm onAdd={onAdd} />}
    </div>
  );
}
