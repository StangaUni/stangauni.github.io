import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          size={15}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3 text-sm">
          {children}
        </div>
      )}
    </div>
  )
}
