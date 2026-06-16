import type { InnerComponentListProps } from "./InnerComponentList.types";
import styles from "./InnerComponentList.module.css";
import { Button } from "../Button";

export function InnerComponentList({
  title,
  components,
  onChange,
  renderForm,
  summarize,
}: InnerComponentListProps) {
  function handleAdd(component: Parameters<typeof onChange>[0][number]) {
    onChange([...components, component]);
  }

  function handleRemove(index: number) {
    onChange(components.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>

      {components.length > 0 && (
        <div className={styles.list}>
          {components.map((c, i) => (
            <div key={i} className={styles.item}>
              <span className={styles.itemTag}>
                {c.type.replace(/_/g, " ")}
              </span>
              <span className={styles.itemSummary}>{summarize(c)}</span>
              <Button variant="icon-danger" onClick={() => handleRemove(i)}>
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {renderForm(handleAdd)}
    </div>
  );
}
