import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { User, Lock } from "lucide-react";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: "user" | "lock";
  error?: string;
}

const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, error, ...props }, ref) => {
    const IconComponent = icon === "user" ? User : Lock;

    return (
      <div className="relative animate-fadeIn">
        <div className="relative">
          <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            className={twMerge(
              "flex h-12 w-full rounded-md border border-input bg-background pl-11 pr-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-400",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1 animate-fadeIn">{error}</p>
        )}
      </div>
    );
  }
);

export { InputWithIcon };
