import type { TemplateListProps } from "./TemplateList.types";
import styles from "./TemplateList.module.css";

export function TemplateList({
  templates,
  loading,
  error,
  onLoad,
  onDelete,
  onRefresh,
  mode = "manage",
}: TemplateListProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <p className={styles.title}>Templates salvos</p>
        <button
          className={styles.refreshButton}
          onClick={onRefresh}
          disabled={loading}
          title="Atualizar"
        >
          {loading ? "…" : "↻"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!loading && templates.length === 0 && (
        <p className={styles.empty}>Nenhum template salvo.</p>
      )}

      <div className={styles.list}>
        {templates.map((t) => (
          <div key={t.id} className={styles.card}>
            <span className={styles.cardName}>{t.name}</span>
            <span className={styles.cardMeta}>
              Atualizado em {new Date(t.updatedAt).toLocaleDateString("pt-BR")}
            </span>

            <div className={styles.cardActions}>
              <button className={styles.loadButton} onClick={() => onLoad(t)}>
                Carregar
              </button>
              {mode === "manage" && (
                <button
                  className={styles.deleteButton}
                  onClick={() =>
                    confirm(`Excluir "${t.name}"?`) && onDelete(t.id)
                  }
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
