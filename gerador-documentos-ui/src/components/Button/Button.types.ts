export type ButtonVariant = 'primary' | 'outline' | 'icon' | 'icon-danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}