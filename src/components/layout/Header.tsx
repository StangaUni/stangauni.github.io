import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'

const navItems = [
  { to: '/',     label: 'Materie', end: true },
  { to: '/info', label: 'Info',    end: false },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-sans font-bold text-base text-primary hover:opacity-80 transition-opacity"
        >
          <GraduationCap size={18} />
          StangaUni
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          <ul className="flex gap-1">
            {navItems.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-6 pb-3 sm:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {navItems.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
