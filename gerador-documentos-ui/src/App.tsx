import { useState, useEffect } from "react";
import { Editor } from "./components/editor";
import { Preview } from "./components/preview";
import { TemplateList } from "./components/templateList";
import { VariablesFiller } from "./components/variablesFiller";
import type { LoopVariables } from "./components/variablesFiller/VariablesFiller.types";
import { useTemplates } from "./hooks/useTemplates";
import type {
  Document,
  DocumentComponent,
  Variables,
  TemplateResponse,
} from "./types";
import styles from "./App.module.css";

const EMPTY_DOCUMENT: Document = { components: [] };
type View = "templates" | "documents";

export function App() {
  const [view, setView] = useState<View>("templates");

  // ── Template editor state ──
  const [document, setDocument] = useState<Document>(EMPTY_DOCUMENT);
  const [templateName, setTemplateName] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Document generator state ──
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateResponse | null>(null);
  const [variables, setVariables] = useState<Variables>({});
  const [loopVariables, setLoopVariables] = useState<LoopVariables>({});

  const { templates, loading, error, fetchAll, create, update, remove } =
    useTemplates();

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Template editor handlers ──
  function handleAddComponent(component: DocumentComponent) {
    setDocument((prev) => ({ components: [...prev.components, component] }));
  }

  function handleRemoveComponent(index: number) {
    setDocument((prev) => ({
      components: prev.components.filter((_, i) => i !== index),
    }));
  }

  function handleMoveComponent(index: number, direction: "up" | "down") {
    setDocument((prev) => {
      const components = [...prev.components];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= components.length) return prev;
      [components[index], components[target]] = [
        components[target],
        components[index],
      ];
      return { components };
    });
  }

  function handleLoadTemplate(template: TemplateResponse) {
    setDocument(template.document);
    setTemplateName(template.name);
    setCurrentTemplateId(template.id);
  }

  async function handleSave() {
    setSaveError(null);
    if (!templateName.trim()) {
      setSaveError("Informe um nome para o template.");
      return;
    }
    const body = { name: templateName, document };
    const result = currentTemplateId
      ? await update(currentTemplateId, body)
      : await create(body);
    if (result) {
      setCurrentTemplateId(result.id);
      fetchAll();
    }
  }

  function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!parsed.components) throw new Error("JSON inválido");
        setDocument({ components: parsed.components });
        setTemplateName(file.name.replace(".json", ""));
        setCurrentTemplateId(null);
      } catch {
        alert("Arquivo JSON inválido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleClearTemplate() {
    if (confirm("Limpar o documento?")) {
      setDocument(EMPTY_DOCUMENT);
      setTemplateName("");
      setCurrentTemplateId(null);
    }
  }

  // ── Document generator handlers ──
  function handleSelectTemplate(template: TemplateResponse) {
    setSelectedTemplate(template);
    setVariables({});
    setLoopVariables({});
  }

  function handleVariableChange(key: string, value: string) {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }

  function handleLoopVariableChange(key: string, values: string[]) {
    setLoopVariables((prev) => ({ ...prev, [key]: values }));
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Gerador de Documentos</span>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${view === "templates" ? styles.navActive : ""}`}
            onClick={() => setView("templates")}
          >
            Templates
          </button>
          <button
            className={`${styles.navButton} ${view === "documents" ? styles.navActive : ""}`}
            onClick={() => {
              setView("documents");
              fetchAll();
            }}
          >
            Gerar Documento
          </button>
        </nav>
        {view === "templates" && (
          <div className={styles.saveRow}>
            {saveError && <span className={styles.saveError}>{saveError}</span>}
            <input
              className={styles.nameInput}
              placeholder="Nome do template..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={loading}
            >
              {currentTemplateId ? "Atualizar" : "Salvar"}
            </button>
            <label className={styles.importButton}>
              Importar JSON
              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportJson}
              />
            </label>
            <button
              className={styles.clearButton}
              onClick={handleClearTemplate}
            >
              Limpar
            </button>
          </div>
        )}
      </header>

      <main className={styles.main}>
        {view === "templates" ? (
          <>
            <TemplateList
              templates={templates}
              loading={loading}
              error={error}
              onLoad={handleLoadTemplate}
              onDelete={(id) => remove(id).then(() => fetchAll())}
              onRefresh={fetchAll}
              mode="manage"
            />
            <Editor
              document={document}
              variables={{}}
              onAddComponent={handleAddComponent}
              onRemoveComponent={handleRemoveComponent}
              onMoveComponent={handleMoveComponent}
            />
            <Preview
              document={document}
              variables={{}}
              templateId={currentTemplateId}
              templateName={templateName}
              mode="template"
            />
          </>
        ) : (
          <>
            <TemplateList
              templates={templates}
              loading={loading}
              error={error}
              onLoad={handleSelectTemplate}
              onDelete={(id) => remove(id).then(() => fetchAll())}
              onRefresh={fetchAll}
              mode="select"
            />
            <VariablesFiller
              normalVars={selectedTemplate?.variables ?? []}
              loopVars={selectedTemplate?.loopVariables ?? []}
              variables={variables}
              loopVariables={loopVariables}
              onVariableChange={handleVariableChange}
              onLoopVariableChange={handleLoopVariableChange}
            />
            <Preview
              document={selectedTemplate?.document ?? EMPTY_DOCUMENT}
              variables={variables}
              loopVariables={loopVariables}
              templateId={selectedTemplate?.id ?? null}
              templateName={selectedTemplate?.name ?? ""}
              mode="document"
            />
          </>
        )}
      </main>
    </div>
  );
}
