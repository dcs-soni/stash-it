import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses = {
  primary: "bg-blue-400 text-white-200",
  secondary: "bg-blue-100 text-white-600",
};

const defaultStyles = "px-9 py-2 rounded-md flex items-center justify-center ";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-slate-950 font-medium  ${variantClasses[variant]} ${
        fullWidth ? "w-full" : ""
      } ${loading ? "opacity-45" : ""} + ${defaultStyles} 
      `}
      disabled={loading}>
      <div className="pr-2">{startIcon}</div>
      {text}
    </button>
  );
}
