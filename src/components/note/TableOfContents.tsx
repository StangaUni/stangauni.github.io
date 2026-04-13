import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface Group {
  parent: Heading
  children: Heading[]
}

function buildGroups(headings: Heading[]): Group[] {
  const groups: Group[] = []
  for (const h of headings) {
    if (h.level === 2) {
      groups.push({ parent: h, children: [] })
    } else if (h.level === 3 && groups.length > 0) {
      groups[groups.length - 1].children.push(h)
    }
  }
  return groups
}

interface TableOfContentsProps {
  collapsible?: boolean
}

export function TableOfContents({ collapsible = false }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.prose-academic h2, .prose-academic h3'))
    setHeadings(
      els.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: Number(el.tagName[1]),
      }))
    )
  }, [])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (headings.length === 0) return null

  const linkClass = (h: Heading) =>
    `block rounded-md py-1 text-xs leading-snug transition-colors ${
      h.level === 3 ? 'pl-4' : 'pl-2'
    } ${active === h.id ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`

  if (!collapsible) {
    return (
      <nav className="flex flex-col gap-0.5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          In questa pagina
        </p>
        {headings.map((h) => (
          <a key={h.id} href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)} className={linkClass(h)}>
            {h.text}
          </a>
        ))}
      </nav>
    )
  }

  const groups = buildGroups(headings)

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        In questa pagina
      </p>
      {groups.map((g) => {
        const isCollapsed = collapsed.has(g.parent.id)
        const hasChildren = g.children.length > 0
        return (
          <div key={g.parent.id}>
            <div className="flex items-center gap-0.5">
              <a
                href={`#${g.parent.id}`}
                onClick={(e) => handleClick(e, g.parent.id)}
                className={`flex-1 ${linkClass(g.parent)}`}
              >
                {g.parent.text}
              </a>
              {hasChildren && (
                <button
                  onClick={() => toggleGroup(g.parent.id)}
                  className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isCollapsed ? 'Espandi sezione' : 'Comprimi sezione'}
                >
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                  />
                </button>
              )}
            </div>
            {hasChildren && !isCollapsed && (
              <div className="flex flex-col gap-0.5">
                {g.children.map((child) => (
                  <a
                    key={child.id}
                    href={`#${child.id}`}
                    onClick={(e) => handleClick(e, child.id)}
                    className={linkClass(child)}
                  >
                    {child.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
