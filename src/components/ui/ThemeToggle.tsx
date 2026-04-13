import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label="Cambia tema"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
