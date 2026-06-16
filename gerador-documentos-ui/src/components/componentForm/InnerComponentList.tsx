import type { DocumentComponent } from "../../types";
import { ComponentForm } from "./ComponentForm";
import { summarizeComponent } from "./componentSummary";
import { Button } from "../Button";

interface InnerComponentListProps {
  title: string;
  components: DocumentComponent[];
  onChange: (components: DocumentComponent[]) => void;
}

export function InnerComponentList({
  title,
  components,
  onChange,
}: InnerComponentListProps) {
  return (
    <>
      {components.map((c, i) => (
        // ...
      ))}

      <ComponentForm
        onAdd={(c) => onChange([...components, c])}
        excludeTypes={["LOOP", "CONDITIONAL"]}
      />
    </>
  );
}