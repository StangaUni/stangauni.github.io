import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism'
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  className?: string
}

function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const dark = useIsDark()
  const language = className?.replace('language-', '') ?? 'text'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-1.5">
        <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider">
          {language !== 'text' ? language : ''}
        </span>
        <button
          onClick={handleCopy}
          className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-secondary transition-all"
          aria-label="Copia codice"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={dark ? vscDarkPlus : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.78rem',
          lineHeight: '1.6',
          padding: '0.75rem 1rem',
          background: 'transparent',
        }}
        codeTagProps={{ style: { fontFamily: 'inherit' } }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
