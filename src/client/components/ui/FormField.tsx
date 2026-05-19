import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FormField({ label, id, className = "", ...props }: FormFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-neutral-800 dark:text-neutral-200" htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        className={`rounded border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 outline-none ring-[#0d9488] focus:ring-2 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 ${className}`.trim()}
        {...props}
      />
    </label>
  );
}
