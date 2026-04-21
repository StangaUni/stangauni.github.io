import { useEffect, useRef, useState } from 'react'
import { BookOpen, Moon, Sun, Zap } from 'lucide-react'

export type Theme = 'default' | 'carta' | 'notte' | 'carbon'

const THEMES: { id: Theme; label: string; icon: React.ElementType; dark: boolean }[] = [
  { id: 'default', label: 'Default', icon: Sun,      dark: false },
  { id: 'carta',   label: 'Carta',   icon: BookOpen, dark: false },
  { id: 'notte',   label: 'Notte',   icon: Moon,     dark: true  },
  { id: 'carbon',  label: 'Carbon',  icon: Zap,      dark: true  },
]

export function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.classList.remove('dark', 'theme-carta', 'theme-carbon')
  if (theme === 'notte')  html.classList.add('dark')
  if (theme === 'carbon') html.classList.add('dark', 'theme-carbon')
  if (theme === 'carta')  html.classList.add('theme-carta')
  localStorage.setItem('theme', theme)
}

function getActiveTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved && THEMES.find((t) => t.id === saved)) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'notte' : 'default'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getActiveTheme)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const current = THEMES.find((t) => t.id === theme)!
  const Icon = current.icon

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Cambia tema"
      >
        <Icon size={13} />
        <span>{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-36 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
          {THEMES.map((t) => {
            const TIcon = t.icon
            const active = t.id === theme
            return (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <TIcon size={12} />
                <span>{t.label}</span>
                {t.dark && (
                  <span className="ml-auto text-[9px] font-mono uppercase tracking-wider opacity-40">dark</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
