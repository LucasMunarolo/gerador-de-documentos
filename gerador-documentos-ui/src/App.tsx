import { useEffect } from "react";
import { Editor } from "./components/editor";
import { Preview } from "./components/preview";
import { TemplateList } from "./components/templateList";
import { useTemplates } from "./hooks/useTemplates";
import { useTemplateEditor } from "./hooks/useTemplateEditor";
import { useDocumentGenerator } from "./hooks/useDocumentGenerator";
import { useView } from "./hooks/useView.ts";
import type { TemplateResponse } from "./types";
import styles from "./App.module.css";
import { VariablesFiller } from "./components/VariablesFiller/VariablesFiller.tsx";

const EMPTY_DOCUMENT = { components: [] };

export function App() {
  const { view, setView } = useView();

  const { templates, loading, error, fetchAll, remove } = useTemplates();

  const {
    document,
    templateName,
    setTemplateName,
    currentTemplateId,
    saveError,
    loading: saving,
    addComponent,
    removeComponent,
    moveComponent,
    loadTemplate,
    importJson,
    clear,
    save,
  } = useTemplateEditor();

  const {
    selectedTemplate,
    variables,
    loopVariables,
    selectTemplate,
    setVariable,
    setLoopVariable,
  } = useDocumentGenerator();

  useEffect(() => {
    fetchAll();
  }, []);

  function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importJson(file, alert);
    e.target.value = "";
  }

  function handleDelete(id: number) {
    remove(id).then(() => fetchAll());
  }

  function handleLoadForEdit(template: TemplateResponse) {
    loadTemplate(template);
  }

  function handleSwitchToDocuments() {
    setView("documents");
    fetchAll();
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
            onClick={handleSwitchToDocuments}
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
              onClick={save}
              disabled={saving}
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
              onClick={() => confirm("Limpar o documento?") && clear()}
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
              onLoad={handleLoadForEdit}
              onDelete={handleDelete}
              onRefresh={fetchAll}
              mode="manage"
            />
            <Editor
              document={document}
              variables={{}}
              onAddComponent={addComponent}
              onRemoveComponent={removeComponent}
              onMoveComponent={moveComponent}
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
              onLoad={selectTemplate}
              onDelete={handleDelete}
              onRefresh={fetchAll}
              mode="select"
            />
            <VariablesFiller
              normalVars={selectedTemplate?.variables ?? []}
              loopVars={selectedTemplate?.loopVariables ?? []}
              variables={variables}
              loopVariables={loopVariables}
              onVariableChange={setVariable}
              onLoopVariableChange={setLoopVariable}
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
