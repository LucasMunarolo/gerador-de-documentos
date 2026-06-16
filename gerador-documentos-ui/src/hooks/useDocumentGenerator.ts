import { useState } from "react";
import type { TemplateResponse, Variables } from "../types";
import type { LoopVariables } from "../../public/variablesFiller/VariablesFiller.types";

export function useDocumentGenerator() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateResponse | null>(null);
  const [variables, setVariables] = useState<Variables>({});
  const [loopVariables, setLoopVariables] = useState<LoopVariables>({});

  function selectTemplate(template: TemplateResponse) {
    setSelectedTemplate(template);
    setVariables({});
    setLoopVariables({});
  }

  function setVariable(key: string, value: string) {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }

  function setLoopVariable(key: string, values: string[]) {
    setLoopVariables((prev) => ({ ...prev, [key]: values }));
  }

  return {
    selectedTemplate,
    variables,
    loopVariables,
    selectTemplate,
    setVariable,
    setLoopVariable,
  };
}
