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
  Alignment,
} from "../../../types";
import { Button } from "../../Button";
import { FormField } from "../../FormField";
import { RunsEditor, emptyRun } from "../../RunsEditor";
import { InnerComponentList } from "../../InnerComponentList";
import { useImageUpload } from "../../../hooks/useImageUpload";
import formStyles from "./forms.module.css";
import { ALIGNMENT_LABELS, ALIGNMENTS, type BaseFormProps } from "./shared";

// ── TitleForm ─────────────────────────────────────────────────────────────────

export function TitleForm({ onAdd }: BaseFormProps) {
  const [alignment, setAlignment] = useState<Alignment>("CENTER");
  const [runs, setRuns] = useState([emptyRun()]);

  function handleAdd() {
    onAdd({ type: "TITLE", runs, alignment } as Title);
    setRuns([emptyRun()]);
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Alinhamento">
        <select
          className={formStyles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {ALIGNMENT_LABELS[a]}
            </option>
          ))}
        </select>
      </FormField>
      <RunsEditor runs={runs} onChange={setRuns} />
      <Button onClick={handleAdd} disabled={runs.every((r) => !r.text.trim())}>
        Adicionar Título
      </Button>
    </div>
  );
}

// ── ParagraphForm ─────────────────────────────────────────────────────────────

export function ParagraphForm({ onAdd }: BaseFormProps) {
  const [alignment, setAlignment] = useState<Alignment>("LEFT");
  const [marginLeft, setMarginLeft] = useState("");
  const [runs, setRuns] = useState([emptyRun()]);

  function handleAdd() {
    onAdd({
      type: "PARAGRAPH",
      alignment,
      marginLeft: marginLeft ? Number(marginLeft) : undefined,
      runs,
    } as Paragraph);
    setRuns([emptyRun()]);
    setMarginLeft("");
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Alinhamento">
        <select
          className={formStyles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {ALIGNMENT_LABELS[a]}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Margem esquerda (pt)">
        <input
          className={formStyles.input}
          type="number"
          placeholder="Ex: 24"
          value={marginLeft}
          onChange={(e) => setMarginLeft(e.target.value)}
        />
      </FormField>
      <RunsEditor runs={runs} onChange={setRuns} />
      <Button onClick={handleAdd} disabled={runs.every((r) => !r.text.trim())}>
        Adicionar Parágrafo
      </Button>
    </div>
  );
}

// ── ClauseForm ────────────────────────────────────────────────────────────────

export function ClauseForm({ onAdd }: BaseFormProps) {
  const [numberStr, setNumberStr] = useState("");
  const [runs, setRuns] = useState([emptyRun()]);

  function handleAdd() {
    const number = numberStr
      .split(".")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    onAdd({ type: "CLAUSE", number, runs } as Clause);
    setRuns([emptyRun()]);
    setNumberStr("");
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Número (ex: 1.2.3)">
        <input
          className={formStyles.input}
          type="text"
          placeholder="1.1"
          value={numberStr}
          onChange={(e) => setNumberStr(e.target.value)}
        />
      </FormField>
      <RunsEditor runs={runs} onChange={setRuns} />
      <Button
        onClick={handleAdd}
        disabled={!numberStr.trim() || runs.every((r) => !r.text.trim())}
      >
        Adicionar Cláusula
      </Button>
    </div>
  );
}

// ── LineBreakForm ─────────────────────────────────────────────────────────────

export function LineBreakForm({ onAdd }: BaseFormProps) {
  const [points, setPoints] = useState("12");

  return (
    <div className={formStyles.form}>
      <FormField label="Tamanho (pt)">
        <input
          className={formStyles.input}
          type="number"
          value={points}
          min={1}
          onChange={(e) => setPoints(e.target.value)}
        />
      </FormField>
      <Button
        onClick={() =>
          onAdd({ type: "LINE_BREAK", points: Number(points) } as LineBreak)
        }
      >
        Adicionar Quebra de Linha
      </Button>
    </div>
  );
}

// ── UnorderedListForm ─────────────────────────────────────────────────────────

export function UnorderedListForm({ onAdd }: BaseFormProps) {
  const [items, setItems] = useState<string[]>([""]);

  function handleAdd() {
    const elements = items
      .filter((t) => t.trim())
      .map((text) => ({
        type: "PARAGRAPH" as const,
        alignment: "LEFT" as Alignment,
        runs: [{ text, marks: [] as [] }],
      }));
    onAdd({ type: "UNORDERED_LIST", elements } as UnorderedList);
    setItems([""]);
  }

  return (
    <div className={formStyles.form}>
      {items.map((item, i) => (
        <div key={i} className={formStyles.listItem}>
          <div className={formStyles.listItemHeader}>
            <span className={formStyles.listItemLabel}>Item {i + 1}</span>
            {items.length > 1 && (
              <Button
                variant="icon-danger"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              >
                ×
              </Button>
            )}
          </div>
          <input
            className={formStyles.input}
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
      <Button variant="outline" onClick={() => setItems([...items, ""])}>
        + Adicionar item
      </Button>
      <Button onClick={handleAdd} disabled={items.every((t) => !t.trim())}>
        Adicionar Lista
      </Button>
    </div>
  );
}

// ── LoopForm ──────────────────────────────────────────────────────────────────

interface LoopFormProps extends BaseFormProps {
  renderNestedForm: (onAdd: (c: DocumentComponent) => void) => React.ReactNode;
  summarize: (c: DocumentComponent) => string;
}

export function LoopForm({
  onAdd,
  renderNestedForm,
  summarize,
}: LoopFormProps) {
  const [innerComponents, setInnerComponents] = useState<DocumentComponent[]>(
    [],
  );

  function handleAdd() {
    onAdd({ type: "LOOP", items: [], components: innerComponents } as Loop);
    setInnerComponents([]);
  }

  return (
    <div className={formStyles.form}>
      <FormField hint="Use <code>{{variavel}}</code> nos elementos abaixo — cada uma se torna uma variável de loop." />
      <InnerComponentList
        title="Elementos de cada iteração"
        components={innerComponents}
        onChange={setInnerComponents}
        renderForm={renderNestedForm}
        summarize={summarize}
      />
      <Button onClick={handleAdd} disabled={innerComponents.length === 0}>
        Adicionar Loop
      </Button>
    </div>
  );
}

// ── ConditionalForm ───────────────────────────────────────────────────────────

interface ConditionalFormProps extends BaseFormProps {
  renderNestedForm: (onAdd: (c: DocumentComponent) => void) => React.ReactNode;
  summarize: (c: DocumentComponent) => string;
}

export function ConditionalForm({
  onAdd,
  renderNestedForm,
  summarize,
}: ConditionalFormProps) {
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
    } as Conditional);
    setVariable("");
    setValue("");
    setInnerComponents([]);
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Variável">
        <input
          className={formStyles.input}
          placeholder="Ex: tipo_contrato"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
        />
      </FormField>
      <FormField label="Valor esperado">
        <input
          className={formStyles.input}
          placeholder="Ex: PJ"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </FormField>
      <FormField
        hint={`Renderiza os elementos abaixo somente quando <code>{{${variable || "variavel"}}}</code> = "${value || "..."}"`}
      />
      <InnerComponentList
        title="Elementos exibidos quando a condição for verdadeira"
        components={innerComponents}
        onChange={setInnerComponents}
        renderForm={renderNestedForm}
        summarize={summarize}
      />
      <Button onClick={handleAdd} disabled={!variable.trim() || !value.trim()}>
        Adicionar Condicional
      </Button>
    </div>
  );
}

// ── SignatureForm ─────────────────────────────────────────────────────────────

export function SignatureForm({ onAdd }: BaseFormProps) {
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");

  function handleAdd() {
    onAdd({ type: "SIGNATURE", name, document: doc } as Signature);
    setName("");
    setDoc("");
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Nome">
        <input
          className={formStyles.input}
          placeholder="Ex: {{nome}}"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <FormField label="Documento (CPF/CNPJ)">
        <input
          className={formStyles.input}
          placeholder="Ex: {{cpf}}"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
        />
      </FormField>
      <Button onClick={handleAdd} disabled={!name.trim()}>
        Adicionar Assinatura
      </Button>
    </div>
  );
}

// ── HeaderForm ────────────────────────────────────────────────────────────────

interface HeaderFormProps extends BaseFormProps {
  renderNestedForm: (onAdd: (c: DocumentComponent) => void) => React.ReactNode;
  summarize: (c: DocumentComponent) => string;
}

export function HeaderForm({
  onAdd,
  renderNestedForm,
  summarize,
}: HeaderFormProps) {
  const [border, setBorder] = useState(false);
  const [innerComponents, setInnerComponents] = useState<DocumentComponent[]>(
    [],
  );

  function handleAdd() {
    onAdd({ type: "HEADER", components: innerComponents, border } as Header);
    setInnerComponents([]);
  }

  return (
    <div className={formStyles.form}>
      <FormField>
        <label className={formStyles.checkboxLabel}>
          <input
            type="checkbox"
            checked={border}
            onChange={(e) => setBorder(e.target.checked)}
          />
          Exibir borda inferior
        </label>
      </FormField>
      <InnerComponentList
        title="Elementos do cabeçalho"
        components={innerComponents}
        onChange={setInnerComponents}
        renderForm={renderNestedForm}
        summarize={summarize}
      />
      <Button onClick={handleAdd}>Adicionar Cabeçalho</Button>
    </div>
  );
}

// ── ImageForm ─────────────────────────────────────────────────────────────────

export function ImageForm({ onAdd }: BaseFormProps) {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState("200");
  const [height, setHeight] = useState("100");
  const [alignment, setAlignment] = useState<Alignment>("LEFT");
  const { upload, uploading, error: uploadError } = useImageUpload();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await upload(file);
    if (uploadedUrl) setUrl(uploadedUrl);
  }

  function handleAdd() {
    onAdd({
      type: "IMAGE",
      url,
      width: Number(width),
      height: Number(height),
      alignment,
    } as Image);
    setUrl("");
  }

  return (
    <div className={formStyles.form}>
      <FormField label="Upload de arquivo">
        <input
          className={formStyles.input}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <span className={formStyles.hint}>Enviando...</span>}
        {uploadError && (
          <span className={formStyles.hintDanger}>{uploadError}</span>
        )}
      </FormField>
      <FormField label="URL da imagem">
        <input
          className={formStyles.input}
          placeholder="https://... ou {{url_variavel}}"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </FormField>
      <FormField label="Largura (pt)">
        <input
          className={formStyles.input}
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </FormField>
      <FormField label="Altura (pt)">
        <input
          className={formStyles.input}
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </FormField>
      <FormField label="Alinhamento">
        <select
          className={formStyles.select}
          value={alignment}
          onChange={(e) => setAlignment(e.target.value as Alignment)}
        >
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {ALIGNMENT_LABELS[a]}
            </option>
          ))}
        </select>
      </FormField>
      <Button onClick={handleAdd} disabled={!url.trim() || uploading}>
        Adicionar Imagem
      </Button>
    </div>
  );
}
