import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id={id}
            className={cn(
              "mt-1 w-4 h-4 border-neutral-300 rounded text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0",
              error && "border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className="text-sm text-secondary-700 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
