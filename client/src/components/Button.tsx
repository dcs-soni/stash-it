import { ReactElement, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

const variantClasses = {
  primary: "bg-blue-400 text-white-200",
  secondary: "bg-blue-100 text-white-600",
};

const defaultStyles = "px-9 py-2 rounded-md flex items-center justify-center ";

export function Button({
  variant,
  children,
  startIcon,
  onClick,
  fullWidth,
  loading,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        `text-slate-950 font-medium  ${
          variant ? variantClasses[variant] : ""
        } ${fullWidth ? "w-full" : ""} ${
          loading ? "opacity-45" : ""
        } + ${defaultStyles} 
      `,
        className
      )}
      disabled={loading}>
      <div className="pr-2">{startIcon}</div>
      {children}
    </button>
  );
}
