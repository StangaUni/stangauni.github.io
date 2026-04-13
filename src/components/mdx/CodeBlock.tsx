import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  children: string
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') ?? ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      {language && (
        <span className="absolute left-4 top-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-2.5 rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-secondary transition-all"
        aria-label="Copia codice"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  )
}
