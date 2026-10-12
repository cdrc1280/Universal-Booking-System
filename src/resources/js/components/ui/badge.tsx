import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive text-white border-transparent",
    outline: "text-foreground border-zinc-800",
    success: "bg-emerald-950/70 text-emerald-300 border-emerald-800/50",
  }

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
