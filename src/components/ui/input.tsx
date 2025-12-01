import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-0 bg-muted/50 px-4 py-2.5 text-sm",
          "ring-1 ring-border/50 ring-offset-0",
          "placeholder:text-muted-foreground/60",
          "transition-all duration-200 ease-out",
          "hover:bg-muted/70 hover:ring-border/70",
          "focus:bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
