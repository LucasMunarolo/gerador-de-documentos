import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.css";

const variantClass = {
  primary: styles.primary,
  outline: styles.outline,
  icon: styles.icon,
  "icon-danger": styles.iconDanger,
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${variantClass[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
