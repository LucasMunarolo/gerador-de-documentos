import { useEffect, useMemo, useRef, useState } from "react";
import { useDocumentGenerate } from "../../hooks/useDocumentGenerate";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";
import type {
  DocumentComponent,
  TextRun,
  Paragraph,
  Clause,
  Title,
  LineBreak,
  UnorderedList,
  Loop,
  Conditional,
  Signature,
  Header,
  Image,
  Variables,
} from "../../types";
import type { PreviewProps } from "./Preview.types";
import styles from "./Preview.module.css";

// ── Constantes A4 ─────────────────────────────────────────────────────────────

const PAGE_HEIGHT_PX = 1123; // altura A4 a 96dpi
const PAGE_PADDING_PX = 192; // 96px top + 96px bottom

const CONTENT_HEIGHT = PAGE_HEIGHT_PX - PAGE_PADDING_PX;

// ── Resolução de variáveis ────────────────────────────────────────────────────

function resolveText(text: string, variables: Variables): string {
  return Object.entries(variables).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value),
    text,
  );
}

// ── Renderizadores de TextRun ─────────────────────────────────────────────────

function renderTextRun(
  run: TextRun,
  index: number,
  variables: Variables,
): React.ReactNode {
  if (run.loopRun) {
    const items = run.loopRun.items ?? [];
    const runs = run.loopRun.runs ?? [];
    return items.map((itemVars, i) => {
      const merged = { ...variables, ...itemVars };
      return <span key={i}>{renderRuns(runs, merged)}</span>;
    });
  }
  const text = resolveText(run.text, variables);
  let className = "";
  const marks = run.marks ?? [];
  if (marks.includes("BOLD")) className += ` ${styles.bold}`;
  if (marks.includes("ITALIC")) className += ` ${styles.italic}`;
  if (marks.includes("UNDERLINE")) className += ` ${styles.underline}`;

  return (
    <span key={index} className={className.trim() || undefined}>
      {text}
    </span>
  );
}

function renderRuns(runs: TextRun[], variables: Variables) {
  return runs.map((run, i) => renderTextRun(run, i, variables));
}

// ── Renderizadores por tipo ───────────────────────────────────────────────────

function renderTitle(component: Title, index: number, variables: Variables) {
  const align = component.alignment.toLowerCase() as
    | "left"
    | "center"
    | "right";
  return (
    <p key={index} className={styles.title} style={{ textAlign: align }}>
      {renderRuns(component.runs, variables)}
    </p>
  );
}

function renderParagraph(
  component: Paragraph,
  index: number,
  variables: Variables,
) {
  const align = component.alignment.toLowerCase() as
    | "left"
    | "center"
    | "right";
  const marginLeft = component.marginLeft
    ? `${component.marginLeft}pt`
    : undefined;
  return (
    <p
      key={index}
      className={styles.paragraph}
      style={{ textAlign: align, marginLeft }}
    >
      {renderRuns(component.runs, variables)}
    </p>
  );
}

function renderClause(component: Clause, index: number, variables: Variables) {
  const prefix = component.number.join(".") + ".";
  return (
    <p key={index} className={styles.clause}>
      <span className={styles.clauseNumber}>{prefix} </span>
      {renderRuns(component.runs, variables)}
    </p>
  );
}

function renderLineBreak(component: LineBreak, index: number) {
  return (
    <span
      key={index}
      className={styles.lineBreak}
      style={{ marginBottom: `${component.points}pt` }}
    />
  );
}

function renderUnorderedList(
  component: UnorderedList,
  index: number,
  variables: Variables,
) {
  return (
    <ul key={index} className={styles.list}>
      {component.elements.map((item, i) => (
        <li key={i} className={styles.listItem}>
          {renderRuns(item.runs, variables)}
        </li>
      ))}
    </ul>
  );
}

function renderLoop(
  component: Loop,
  index: number,
  variables: Variables,
  loopVars: Record<string, string[]> = {},
) {
  const items = component.items ?? [];
  const components = component.components ?? [];
  // Usa items do componente se preenchidos, senão usa loopVariables externos
  const keys = Object.keys(loopVars);
  const size =
    keys.length > 0 ? (loopVars[keys[0]]?.length ?? 0) : items.length;
  const iterations = Array.from({ length: size }, (_, i) => {
    if (items[i]) return items[i];
    return Object.fromEntries(keys.map((k) => [k, loopVars[k]?.[i] ?? ""]));
  });
  return (
    <div key={index}>
      {iterations.map((itemVars, i) => {
        const merged: Variables = { ...variables, ...itemVars };
        return (
          <div key={i}>
            {components.map((c, ci) =>
              renderComponent(c, ci, merged, loopVars),
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderConditional(
  component: Conditional,
  index: number,
  variables: Variables,
  loopVars: Record<string, string[]> = {},
) {
  const actual = variables[component.variable] ?? "";
  if (actual !== component.value) return null;
  return (
    <div key={index}>
      {(component.components ?? []).map((c, ci) =>
        renderComponent(c, ci, variables, loopVars),
      )}
    </div>
  );
}

function renderSignature(
  component: Signature,
  index: number,
  variables: Variables,
) {
  const name = resolveText(component.name, variables);
  const doc = resolveText(component.document, variables);
  return (
    <div key={index} style={{ marginTop: "48pt", textAlign: "center" }}>
      <div
        style={{ borderTop: "1px solid black", width: "60%", margin: "0 auto" }}
      />
      <p style={{ margin: "4pt 0 0" }}>{name}</p>
      <p style={{ margin: "2pt 0 0" }}>{doc}</p>
    </div>
  );
}

function renderHeader(
  component: Header,
  index: number,
  variables: Variables,
  loopVars: Record<string, string[]> = {},
) {
  const borderStyle = component.border
    ? {
        borderBottom: "1px solid black",
        marginBottom: "24pt",
        paddingBottom: "12pt",
      }
    : { marginBottom: "24pt" };
  return (
    <div key={index} style={borderStyle}>
      {(component.components ?? []).map((c, i) =>
        renderComponent(c, i, variables, loopVars),
      )}
    </div>
  );
}

function renderImage(component: Image, index: number, variables: Variables) {
  const url = resolveText(component.url, variables);
  const align = (component.alignment ?? "LEFT").toLowerCase() as
    | "left"
    | "center"
    | "right";
  return (
    <div key={index} style={{ textAlign: align }}>
      <img
        src={url}
        style={{
          width: `${component.width}pt`,
          height: `${component.height}pt`,
        }}
        alt=""
      />
    </div>
  );
}

function renderComponent(
  component: DocumentComponent,
  index: number,
  variables: Variables,
  loopVars: Record<string, string[]> = {},
): React.ReactNode {
  switch (component.type) {
    case "TITLE":
      return renderTitle(component, index, variables);
    case "PARAGRAPH":
      return renderParagraph(component, index, variables);
    case "CLAUSE":
      return renderClause(component, index, variables);
    case "LINE_BREAK":
      return renderLineBreak(component, index);
    case "UNORDERED_LIST":
      return renderUnorderedList(component, index, variables);
    case "LOOP":
      return renderLoop(component, index, variables, loopVars);
    case "CONDITIONAL":
      return renderConditional(component, index, variables, loopVars);
    case "SIGNATURE":
      return renderSignature(component, index, variables);
    case "HEADER":
      return renderHeader(component, index, variables, loopVars);
    case "IMAGE":
      return renderImage(component, index, variables);
  }
}

// ── Hook: mede altura de cada componente ─────────────────────────────────────

function useMeasuredHeights(
  components: DocumentComponent[],
  variables: Variables,
): number[] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Aguarda o DOM pintar para medir
    requestAnimationFrame(() => {
      const children = Array.from(container.children) as HTMLElement[];
      const next = children.map((el) => el.getBoundingClientRect().height);
      setHeights((prev) => {
        if (prev.length === next.length && prev.every((v, i) => v === next[i]))
          return prev;
        return next;
      });
    });
  }, [components, variables]);

  return heights;
}

// ── Distribuição de componentes em páginas ───────────────────────────────────

function paginate(
  components: DocumentComponent[],
  heights: number[],
): DocumentComponent[][] {
  if (heights.length !== components.length) {
    return [components]; // ainda medindo — coloca tudo em uma página
  }

  const pages: DocumentComponent[][] = [];
  let current: DocumentComponent[] = [];
  let usedHeight = 0;

  components.forEach((component, i) => {
    const h = heights[i] ?? 0;

    if (usedHeight + h > CONTENT_HEIGHT && current.length > 0) {
      pages.push(current);
      current = [];
      usedHeight = 0;
    }

    current.push(component);
    usedHeight += h;
  });

  if (current.length > 0) pages.push(current);

  return pages.length > 0 ? pages : [[]];
}

// ── Componente fantasma para medir ───────────────────────────────────────────

interface GhostMeasurerProps {
  components: DocumentComponent[];
  variables: Variables;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function GhostMeasurer({
  components,
  variables,
  containerRef,
}: GhostMeasurerProps) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: "-9999px",
        width: "602px", // 794px - 2*96px padding
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "12pt",
        lineHeight: 1.5,
        visibility: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {components.map((component, index) => (
        <div key={index}>{renderComponent(component, 0, variables)}</div>
      ))}
    </div>
  );
}

// ── Preview ───────────────────────────────────────────────────────────────────

export function Preview({
  document,
  variables,
  loopVariables = {},
  templateId,
  templateName,
  mode = "template",
}: PreviewProps) {
  const { generate, generating, error: generateError } = useDocumentGenerate();
  const ghostRef = useRef<HTMLDivElement>(null);

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

  const heights = useMeasuredHeights(bodyComponents, variables);
  const pages = paginate(bodyComponents, heights);

  function handleExport() {
    const payload = { ...document, variables };
    const json = JSON.stringify(payload, null, 2);
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
      {/* Container fantasma para medir alturas (apenas no modo template) */}
      {!isDocumentMode && (
        <GhostMeasurer
          components={bodyComponents}
          variables={variables}
          containerRef={ghostRef}
        />
      )}

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
          {mode === "document" && templateId && (
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
          {mode === "template" && (
            <button className={styles.exportButton} onClick={handleExport}>
              Exportar JSON
            </button>
          )}
        </div>
      </div>

      {isDocumentMode ? (
        templateId === null ? (
          <div className={styles.page}>
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📄</span>
              <span className={styles.emptyText}>
                Selecione um template para visualizar
              </span>
            </div>
          </div>
        ) : previewLoading && !previewHtml ? (
          <div className={styles.page}>
            <div className={styles.empty}>
              <span className={styles.emptyText}>Carregando preview...</span>
            </div>
          </div>
        ) : previewError ? (
          <div className={styles.page}>
            <div className={styles.empty}>
              <span className={styles.emptyText} style={{ color: "#e53e3e" }}>
                {previewError}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.previewFrameWrapper}>
            <iframe
              className={styles.previewFrame}
              srcDoc={previewHtml}
              title="Preview do documento"
              style={{ opacity: previewLoading ? 0.6 : 1 }}
            />
            {previewLoading && (
              <span className={styles.previewLoadingBadge}>Atualizando...</span>
            )}
          </div>
        )
      ) : document.components.length === 0 ? (
        <div className={styles.page}>
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📄</span>
            <span className={styles.emptyText}>
              Adicione elementos no painel ao lado
            </span>
          </div>
        </div>
      ) : (
        pages.map((pageComponents, pageIndex) => (
          <div key={pageIndex} className={styles.pageWrapper}>
            {pages.length > 1 && (
              <div className={styles.pageLabel}>Página {pageIndex + 1}</div>
            )}
            <div className={styles.page}>
              {header && renderHeader(header, -1, variables, loopVariables)}
              {pageComponents.map((component, index) =>
                renderComponent(component, index, variables),
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
