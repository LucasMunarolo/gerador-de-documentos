import { useState, useEffect, useRef } from "react";
import type { DocumentComponent, Variables } from "../types";
import { renderDocumentComponent } from "../utils/renderDocumentComponent";
import ReactDOM from "react-dom/client";

const PAGE_HEIGHT_PX = 1123;
const PAGE_PADDING_PX = 192; // 96px top + 96px bottom
const CONTENT_HEIGHT = PAGE_HEIGHT_PX - PAGE_PADDING_PX;
const PAGE_WIDTH_PX = 602; // 794px - 2*96px padding

function paginate(
  components: DocumentComponent[],
  heights: number[],
): DocumentComponent[][] {
  if (heights.length !== components.length) return [components];

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

export function usePagination(
  components: DocumentComponent[],
  variables: Variables,
) {
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<number[]>([]);

  // Create and attach ghost container once
  useEffect(() => {
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "absolute",
      top: "0",
      left: "-9999px",
      width: `${PAGE_WIDTH_PX}px`,
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: "12pt",
      lineHeight: "1.5",
      visibility: "hidden",
    });
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);
    ghostRef.current = container;

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Re-measure whenever components or variables change
  useEffect(() => {
    const container = ghostRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = "";

    // Render each component into its own wrapper div
    components.forEach((component, i) => {
      const wrapper = document.createElement("div");
      wrapper.dataset.index = String(i);
      container.appendChild(wrapper);
      const root = ReactDOM.createRoot(wrapper);
      root.render(
        renderDocumentComponent(component, 0, variables) as React.ReactElement,
      );
    });

    // Measure after paint
    const frameId = requestAnimationFrame(() => {
      const wrappers = Array.from(container.children) as HTMLElement[];
      const next = wrappers.map((el) => el.getBoundingClientRect().height);
      setHeights((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    });

    return () => cancelAnimationFrame(frameId);
  }, [components, variables]);

  const pages = paginate(components, heights);

  return { pages, ghostRef };
}
