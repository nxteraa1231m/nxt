import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm",
            "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
            "transition-all duration-200 bg-white placeholder:text-gray-400",
            error && "border-red-400 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-400 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
