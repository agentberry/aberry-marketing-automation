import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border-0 bg-muted/50 px-4 py-3 text-sm",
        "ring-1 ring-border/50 ring-offset-0",
        "placeholder:text-muted-foreground/60",
        "transition-all duration-200 ease-out",
        "hover:bg-muted/70 hover:ring-border/70",
        "focus:bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50",
        "resize-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
