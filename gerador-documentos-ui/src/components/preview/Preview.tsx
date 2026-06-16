import { useMemo } from "react";
import { useDocumentGenerate } from "../../hooks/useDocumentGenerate";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";
import { usePagination } from "../../hooks/usePagination";
import { renderDocumentComponent } from "../../utils/renderDocumentComponent";
import type { Header } from "../../types";
import type { PreviewProps } from "./Preview.types";
import styles from "./Preview.module.css";

export function Preview({
  document,
  variables,
  loopVariables = {},
  templateId,
  templateName,
  mode = "template",
}: PreviewProps) {
  const { generate, generating, error: generateError } = useDocumentGenerate();
  const isDocumentMode = mode === "document";

  const {
    html: previewHtml,
    loading: previewLoading,
    error: previewError,
  } = useDocumentPreview(
    isDocumentMode ? templateId : null,
    variables,
    loopVariables,
  );

  const header = useMemo(
    () => document.components.find((c): c is Header => c.type === "HEADER"),
    [document.components],
  );

  const bodyComponents = useMemo(
    () => document.components.filter((c) => c.type !== "HEADER"),
    [document.components],
  );

  const { pages } = usePagination(
    isDocumentMode ? [] : bodyComponents,
    variables,
  );

  function handleExport() {
    const json = JSON.stringify({ ...document, variables }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = "documento.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Header bar ── */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          {isDocumentMode
            ? "Pré-visualização do documento"
            : "Pré-visualização A4"}
          {!isDocumentMode && pages.length > 1 && (
            <span className={styles.pageCount}> — {pages.length} páginas</span>
          )}
        </span>

        <div className={styles.headerActions}>
          {generateError && (
            <span className={styles.generateError}>{generateError}</span>
          )}
          {isDocumentMode && templateId && (
            <button
              className={styles.generateButton}
              onClick={() =>
                generate(
                  templateId,
                  variables,
                  loopVariables,
                  templateName || "documento",
                )
              }
              disabled={generating}
            >
              {generating ? "Gerando..." : "⬇ Gerar PDF"}
            </button>
          )}
          {!isDocumentMode && (
            <button className={styles.exportButton} onClick={handleExport}>
              Exportar JSON
            </button>
          )}
        </div>
      </div>

      {/* ── Document mode: iframe preview ── */}
      {isDocumentMode && (
        <>
          {templateId === null && (
            <EmptyPage message="Selecione um template para visualizar" />
          )}
          {templateId !== null && previewLoading && !previewHtml && (
            <EmptyPage message="Carregando preview..." />
          )}
          {templateId !== null && previewError && (
            <EmptyPage message={previewError} danger />
          )}
          {templateId !== null && !previewError && previewHtml && (
            <div className={styles.previewFrameWrapper}>
              <iframe
                className={styles.previewFrame}
                srcDoc={previewHtml}
                title="Preview do documento"
                style={{ opacity: previewLoading ? 0.6 : 1 }}
              />
              {previewLoading && (
                <span className={styles.previewLoadingBadge}>
                  Atualizando...
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Template mode: paginated A4 render ── */}
      {!isDocumentMode && (
        <>
          {document.components.length === 0 ? (
            <EmptyPage message="Adicione elementos no painel ao lado" />
          ) : (
            pages.map((pageComponents, pageIndex) => (
              <div key={pageIndex} className={styles.pageWrapper}>
                {pages.length > 1 && (
                  <div className={styles.pageLabel}>Página {pageIndex + 1}</div>
                )}
                <div className={styles.page}>
                  {header &&
                    renderDocumentComponent(
                      header,
                      -1,
                      variables,
                      loopVariables,
                    )}
                  {pageComponents.map((component, index) =>
                    renderDocumentComponent(
                      component,
                      index,
                      variables,
                      loopVariables,
                    ),
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

// ── EmptyPage ─────────────────────────────────────────────────────────────────

interface EmptyPageProps {
  message: string;
  danger?: boolean;
}

function EmptyPage({ message, danger }: EmptyPageProps) {
  return (
    <div className={styles.page}>
      <div className={styles.emptyPage}>
        <span className={styles.emptyIcon}>📄</span>
        <span
          className={styles.emptyText}
          style={danger ? { color: "var(--color-danger)" } : undefined}
        >
          {message}
        </span>
      </div>
    </div>
  );
}
