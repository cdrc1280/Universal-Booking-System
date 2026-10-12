import * as React from "react"
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster({ ...props }: ToasterProps) {
    return (
        <SonnerToaster
            position="bottom-right"
            richColors
            closeButton
            expand={false}
            toastOptions={{
                duration: 4000,
                className:
                    "rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] text-[#202124] dark:text-[#ffffff] shadow-lg text-xs font-sans",
                style: {
                    background: undefined,
                },
            }}
            {...props}
        />
    )
}
