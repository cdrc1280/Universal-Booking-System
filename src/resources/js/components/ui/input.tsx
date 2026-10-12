import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#5f6368] dark:placeholder:text-[#9aa0a6] selection:bg-emerald-500 selection:text-white flex h-9 w-full min-w-0 rounded-lg border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] px-3 py-1 text-xs text-[#202124] dark:text-[#ffffff] shadow-xs transition-colors outline-hidden file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500",
        "aria-invalid:ring-rose-500/20 aria-invalid:border-rose-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
