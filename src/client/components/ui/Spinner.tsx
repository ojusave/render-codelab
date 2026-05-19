type SpinnerProps = {
  size?: "sm" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-5 w-5 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ size = "sm", className = "" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-solid border-[#1a73e8] border-t-transparent ${sizeClass[size]} ${className}`.trim()}
    />
  );
}
