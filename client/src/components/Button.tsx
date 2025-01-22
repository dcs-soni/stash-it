import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon: ReactElement;
}

const variantClasses = {
  primary: "bg-blue-400 text-white-200",
  secondary: "bg-blue-100 text-white-600",
};

const defaultStyles = "px-9 py-2 rounded-md flex items-center ";

export function Button({ variant, text, startIcon }: ButtonProps) {
  return (
    <button className={`${variantClasses[variant] + " " + defaultStyles}`}>
      <div className="pr-2">{startIcon}</div>
      {text}
    </button>
  );
}
