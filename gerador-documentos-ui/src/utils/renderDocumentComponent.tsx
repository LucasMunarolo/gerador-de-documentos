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
} from "../types";
import type { LoopVariables } from "../../public/variablesFiller/VariablesFiller.types";
import { resolveText } from "./resolveVariables";
import styles from "../components/preview/Preview.module.css";

// ── TextRun renderers ─────────────────────────────────────────────────────────

function renderRun(
  run: TextRun,
  index: number,
  variables: Variables,
): React.ReactNode {
  if (run.loopRun) {
    const items = run.loopRun.items ?? [];
    const runs = run.loopRun.runs ?? [];
    return items.map((itemVars, i) => (
      <span key={i}>{renderRuns(runs, { ...variables, ...itemVars })}</span>
    ));
  }

  const text = resolveText(run.text, variables);
  const marks = run.marks ?? [];
  let node: React.ReactNode = text;
  if (marks.includes("UNDERLINE")) node = <u>{node}</u>;
  if (marks.includes("ITALIC")) node = <em>{node}</em>;
  if (marks.includes("BOLD")) node = <strong>{node}</strong>;

  return <span key={index}>{node}</span>;
}

export function renderRuns(
  runs: TextRun[],
  variables: Variables,
): React.ReactNode {
  return runs.map((run, i) => renderRun(run, i, variables));
}

// ── Component renderers ───────────────────────────────────────────────────────

function renderTitle(
  c: Title,
  index: number,
  variables: Variables,
): React.ReactNode {
  const align = c.alignment.toLowerCase() as "left" | "center" | "right";
  return (
    <p key={index} className={styles.docTitle} style={{ textAlign: align }}>
      {renderRuns(c.runs, variables)}
    </p>
  );
}

function renderParagraph(
  c: Paragraph,
  index: number,
  variables: Variables,
): React.ReactNode {
  const align = c.alignment.toLowerCase() as "left" | "center" | "right";
  const marginLeft = c.marginLeft ? `${c.marginLeft}pt` : undefined;
  return (
    <p
      key={index}
      className={styles.docParagraph}
      style={{ textAlign: align, marginLeft }}
    >
      {renderRuns(c.runs, variables)}
    </p>
  );
}

function renderClause(
  c: Clause,
  index: number,
  variables: Variables,
): React.ReactNode {
  const prefix = c.number.join(".") + ".";
  return (
    <p key={index} className={styles.docClause}>
      <span className={styles.clauseNumber}>{prefix} </span>
      {renderRuns(c.runs, variables)}
    </p>
  );
}

function renderLineBreak(c: LineBreak, index: number): React.ReactNode {
  return (
    <span
      key={index}
      className={styles.lineBreak}
      style={{ marginBottom: `${c.points}pt` }}
    />
  );
}

function renderUnorderedList(
  c: UnorderedList,
  index: number,
  variables: Variables,
): React.ReactNode {
  return (
    <ul key={index} className={styles.list}>
      {c.elements.map((item, i) => (
        <li key={i} className={styles.listItem}>
          {renderRuns(item.runs, variables)}
        </li>
      ))}
    </ul>
  );
}

function renderLoop(
  c: Loop,
  index: number,
  variables: Variables,
  loopVars: LoopVariables,
): React.ReactNode {
  const keys = Object.keys(loopVars);
  const size =
    keys.length > 0 ? (loopVars[keys[0]]?.length ?? 0) : (c.items ?? []).length;

  const iterations = Array.from(
    { length: size },
    (_, i) =>
      c.items?.[i] ??
      Object.fromEntries(keys.map((k) => [k, loopVars[k]?.[i] ?? ""])),
  );

  return (
    <div key={index}>
      {iterations.map((itemVars, i) => {
        const merged: Variables = { ...variables, ...itemVars };
        return (
          <div key={i}>
            {(c.components ?? []).map((child, ci) =>
              renderDocumentComponent(child, ci, merged, loopVars),
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderConditional(
  c: Conditional,
  index: number,
  variables: Variables,
  loopVars: LoopVariables,
): React.ReactNode {
  if ((variables[c.variable] ?? "") !== c.value) return null;
  return (
    <div key={index}>
      {(c.components ?? []).map((child, ci) =>
        renderDocumentComponent(child, ci, variables, loopVars),
      )}
    </div>
  );
}

function renderSignature(
  c: Signature,
  index: number,
  variables: Variables,
): React.ReactNode {
  return (
    <div key={index} style={{ marginTop: "48pt", textAlign: "center" }}>
      <div
        style={{ borderTop: "1px solid black", width: "60%", margin: "0 auto" }}
      />
      <p style={{ margin: "4pt 0 0" }}>{resolveText(c.name, variables)}</p>
      <p style={{ margin: "2pt 0 0" }}>{resolveText(c.document, variables)}</p>
    </div>
  );
}

function renderHeader(
  c: Header,
  index: number,
  variables: Variables,
  loopVars: LoopVariables,
): React.ReactNode {
  const borderStyle = c.border
    ? {
        borderBottom: "1px solid black",
        marginBottom: "24pt",
        paddingBottom: "12pt",
      }
    : { marginBottom: "24pt" };
  return (
    <div key={index} style={borderStyle}>
      {(c.components ?? []).map((child, i) =>
        renderDocumentComponent(child, i, variables, loopVars),
      )}
    </div>
  );
}

function renderImage(
  c: Image,
  index: number,
  variables: Variables,
): React.ReactNode {
  const url = resolveText(c.url, variables);
  const align = (c.alignment ?? "LEFT").toLowerCase() as
    | "left"
    | "center"
    | "right";
  return (
    <div key={index} style={{ textAlign: align }}>
      <img
        src={url}
        style={{ width: `${c.width}pt`, height: `${c.height}pt` }}
        alt=""
      />
    </div>
  );
}

// ── Main dispatcher ───────────────────────────────────────────────────────────

export function renderDocumentComponent(
  component: DocumentComponent,
  index: number,
  variables: Variables,
  loopVars: LoopVariables = {},
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
