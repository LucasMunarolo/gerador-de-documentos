import { useState } from "react";

type View = "templates" | "documents";

export function useView(initial: View = "templates") {
  const [view, setView] = useState<View>(initial);
  return { view, setView };
}
