import { useEffect, useRef, useState } from 'react'
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

export function TableOfContents({ collapsible = false }: { collapsible?: boolean }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.prose-academic h2, .prose-academic h3'))
    setHeadings(
      els.map((el) => {
        const clone = el.cloneNode(true) as Element
        clone.querySelectorAll('.katex-mathml').forEach((n) => n.remove())
        return {
          id: el.id,
          text: clone.textContent ?? '',
          level: Number(el.tagName[1]),
        }
      })
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

    const onScroll = () => {
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40
      if (nearBottom) setActive(headings[headings.length - 1].id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [headings])

  // Scroll active item into view within the nav
  useEffect(() => {
    if (!active || !navRef.current) return
    const el = navRef.current.querySelector(`[data-id="${active}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (headings.length === 0) return null

  const groups = collapsible ? buildGroups(headings) : null

  return (
    <nav ref={navRef} className="overflow-y-auto scrollbar-none max-h-[calc(100vh-8rem)]">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        In questa pagina
      </p>

      {/* Vertical rail */}
      <div className="relative pl-3 border-l border-border/50">
        {(groups ?? headings.map((h) => ({ parent: h, children: [] } as Group))).map((g) => {
          const isCollapsed = collapsed.has(g.parent.id)
          const hasChildren = g.children.length > 0
          const parentActive = active === g.parent.id
          const childActive = g.children.some((c) => c.id === active)

          return (
            <div key={g.parent.id} className="mb-0.5">
              {/* h2 row */}
              <div className="flex items-center gap-1 group/row">
                {/* Active indicator dot on the rail */}
                <span
                  className={`absolute -left-px w-[2px] rounded-full transition-all duration-200 ${
                    parentActive || (!isCollapsed && childActive)
                      ? 'bg-primary h-4 opacity-100'
                      : 'bg-transparent h-0 opacity-0'
                  }`}
                />
                <a
                  data-id={g.parent.id}
                  href={`#${g.parent.id}`}
                  onClick={(e) => handleClick(e, g.parent.id)}
                  className={`flex-1 block py-1 text-[11px] leading-snug transition-colors truncate ${
                    parentActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {g.parent.text}
                </a>
                {hasChildren && collapsible && (
                  <button
                    onClick={() => toggleGroup(g.parent.id)}
                    className="shrink-0 p-0.5 text-muted-foreground/40 hover:text-foreground opacity-0 group-hover/row:opacity-100 transition-all"
                  >
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* h3 children */}
              {hasChildren && !isCollapsed && (
                <div className="ml-2 flex flex-col">
                  {g.children.map((child) => (
                    <a
                      key={child.id}
                      data-id={child.id}
                      href={`#${child.id}`}
                      onClick={(e) => handleClick(e, child.id)}
                      className={`block py-0.5 text-[10.5px] leading-snug transition-colors truncate ${
                        active === child.id
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {child.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
