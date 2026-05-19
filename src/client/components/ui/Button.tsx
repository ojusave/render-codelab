import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "validate" | "outline" | "destructive" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border border-[#1a73e8] bg-[#1a73e8] text-white hover:bg-[#1765cc] hover:border-[#1765cc] shadow-sm",
  validate:
    "border border-[#1a73e8] bg-[#1a73e8] text-white hover:bg-[#1765cc] hover:border-[#1765cc] shadow-sm",
  outline:
    "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
  destructive:
    "border border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700",
  ghost:
    "border border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
};

const sizeClass = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "sm",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
