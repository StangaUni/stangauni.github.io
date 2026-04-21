import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../components/note/Breadcrumbs'
import { TableOfContents } from '../components/note/TableOfContents'
import { SEO } from '../components/ui/SEO'
import { CodeBlock } from '../components/mdx/CodeBlock'
import { Collapsible } from '../components/mdx/Collapsible'
import { ThemedImage } from '../components/mdx/ThemedImage'
import { useSubjects } from '../hooks/useSubjects'
import { useNotes } from '../hooks/useNotes'
import { NotFound } from './NotFound'
import type { Contributor, Note } from '../types/note'

const mdxModules = import.meta.glob('../content/materie/**/*.mdx')

// ─── Contributors ─────────────────────────────────────────────────────────────

function ContributorList({ contributors }: { contributors: Contributor[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground/60">di</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {contributors.map((c, i) => {
          const avatar = c.github ? `https://github.com/${c.github}.png?size=32` : null
          const inner = (
            <span className="flex items-center gap-1.5">
              {avatar && (
                <img src={avatar} alt={c.name} className="w-4 h-4 rounded-full border border-border object-cover" />
              )}
              <span className="text-xs font-medium text-foreground">{c.name}</span>
            </span>
          )
          return c.github ? (
            <a
              key={i}
              href={`https://github.com/${c.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 pl-1 pr-2.5 py-0.5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {inner}
            </a>
          ) : (
            <span key={i} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 pl-2 pr-2.5 py-0.5">
              <span className="text-xs font-medium text-foreground">{c.name}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── MDX components ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MDX_COMPONENTS: Record<string, React.ComponentType<any>> = {
  h1: () => null,
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    const code = (children as React.ReactElement<{ children: string; className?: string }>)
    return <CodeBlock className={code.props.className}>{code.props.children}</CodeBlock>
  },
  Collapsible,
  ThemedImage,
}

type NoteModule = {
  frontmatter: Omit<Note, 'slug' | 'subject'>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>
}

// ─── Prev / Next ──────────────────────────────────────────────────────────────

function PrevNext({ prev, next, subjectSlug, variant = 'subtle' }: {
  prev: Note | null; next: Note | null; subjectSlug: string; variant?: 'subtle' | 'prominent'
}) {
  if (!prev && !next) return null
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

  if (variant === 'subtle') {
    return (
      <div className="flex items-center justify-between text-xs text-muted-foreground/60">
        {prev ? (
          <Link to={`/materia/${subjectSlug}/${prev.slug}`} onClick={scrollTop}
            className="flex items-center gap-1 hover:text-foreground transition-colors max-w-[45%]">
            <ChevronLeft size={13} className="shrink-0" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/materia/${subjectSlug}/${next.slug}`} onClick={scrollTop}
            className="flex items-center gap-1 hover:text-foreground transition-colors max-w-[45%]">
            <span className="truncate">{next.title}</span>
            <ChevronRight size={13} className="shrink-0" />
          </Link>
        ) : <span />}
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {prev ? (
        <Link to={`/materia/${subjectSlug}/${prev.slug}`} onClick={scrollTop}
          className="flex-1 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-primary/40 hover:shadow-sm transition-all group">
          <ChevronLeft size={15} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-0.5">Precedente</p>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug truncate">{prev.title}</p>
          </div>
        </Link>
      ) : <div className="flex-1" />}
      {next ? (
        <Link to={`/materia/${subjectSlug}/${next.slug}`} onClick={scrollTop}
          className="flex-1 flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:border-primary/40 hover:shadow-sm transition-all group text-right">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-0.5">Successivo</p>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug truncate">{next.title}</p>
          </div>
          <ChevronRight size={15} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ) : <div className="flex-1" />}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function NotePage() {
  const { subjectSlug, noteSlug } = useParams<{ subjectSlug: string; noteSlug: string }>()
  const { subjects, loading: loadingSubject } = useSubjects()
  const { notes } = useNotes(subjectSlug)
  const [mod, setMod] = useState<NoteModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!subjectSlug || !noteSlug) return
    setLoading(true)
    setNotFound(false)
    const key = Object.keys(mdxModules).find(
      (k) => k.includes(`/materie/${subjectSlug}/`) && k.endsWith(`/${noteSlug}.mdx`) && !k.endsWith('_subject.mdx')
    )
    if (!key) { setNotFound(true); setLoading(false); return }
    ;(mdxModules[key]() as Promise<NoteModule>).then((m) => { setMod(m); setLoading(false) })
  }, [subjectSlug, noteSlug])

  if (loading || loadingSubject) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="skeleton h-3 w-48 rounded" />
        <div className="skeleton h-36 w-full rounded-2xl" />
      </div>
    )
  }

  if (notFound || !mod) return <NotFound />

  const subject = subjects.find((s) => s.slug === subjectSlug)
  const { frontmatter: fm } = mod
  const Content = mod.default

  const sameType = notes.filter((n) => n.type === fm.type)
  const idx = sameType.findIndex((n) => n.slug === noteSlug)
  const prevNote = idx > 0 ? sameType[idx - 1] : null
  const nextNote = idx < sameType.length - 1 ? sameType[idx + 1] : null

  return (
    <>
      <SEO title={fm.title} description={fm.excerpt} />

      <Breadcrumbs items={[
        { label: subject?.title ?? subjectSlug!, href: `/materia/${subjectSlug}` },
        { label: fm.title },
      ]} />

      {/* ── Header card ── */}
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden mb-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse 55% 90% at 0% 50%, hsl(var(--primary)) 0%, transparent 70%)' }}
        />
        <div className="relative px-6 py-5">
          {/* Meta row */}
          {fm.date && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {fm.date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary border border-border/60 rounded px-2 py-0.5">
                  <Calendar size={10} />
                  {new Date(fm.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {fm.title}
          </h1>

          {/* Excerpt */}
          {fm.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">{fm.excerpt}</p>
          )}

          {/* Contributors */}
          {fm.contributors && fm.contributors.length > 0 && (
            <div className="mt-4">
              <ContributorList contributors={fm.contributors} />
            </div>
          )}
        </div>
      </div>

      {/* ── Prev / Next ── */}
      <PrevNext prev={prevNote} next={nextNote} subjectSlug={subjectSlug!} />

      {/* ── Divider ── */}
      <hr className="my-6 border-border" />

      {/* ── Content + ToC ── */}
      <div className="flex gap-10">
        <article className="flex-1 min-w-0 prose-academic">
          <Content components={MDX_COMPONENTS} />
        </article>

        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-24">
            <TableOfContents collapsible />
          </div>
        </aside>
      </div>

      {/* ── Bottom prev/next ── */}
      <div className="mt-8 pt-6 border-t border-border">
        <PrevNext prev={prevNote} next={nextNote} subjectSlug={subjectSlug!} variant="prominent" />
      </div>
    </>
  )
}
