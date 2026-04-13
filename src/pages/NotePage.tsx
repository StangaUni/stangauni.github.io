import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../components/note/Breadcrumbs'
import { TableOfContents } from '../components/note/TableOfContents'
import { SEO } from '../components/ui/SEO'
import { Badge } from '../components/ui/Badge'
import { CodeBlock } from '../components/mdx/CodeBlock'
import { Collapsible } from '../components/mdx/Collapsible'
import { ThemedImage } from '../components/mdx/ThemedImage'
import { useSubjects } from '../hooks/useSubjects'
import { useNotes } from '../hooks/useNotes'
import { NotFound } from './NotFound'
import type { Note } from '../types/note'

const mdxModules = import.meta.glob('../content/materie/**/*.mdx')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MDX_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // suppress the leading # Title that duplicates the page header
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

// ─── Prev/Next navigation ────────────────────────────────────────────────────

interface NoteNavProps {
  prev: Note | null
  next: Note | null
  subjectSlug: string
  variant: 'top' | 'bottom'
}

function NoteNav({ prev, next, subjectSlug, variant }: NoteNavProps) {
  if (!prev && !next) return null

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

  if (variant === 'top') {
    return (
      <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground/70">
        {prev ? (
          <Link
            to={`/materia/${subjectSlug}/${prev.slug}`}
            onClick={scrollTop}
            className="flex items-center gap-1 hover:text-foreground transition-colors max-w-[45%] truncate"
          >
            <ChevronLeft size={13} className="shrink-0" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link
            to={`/materia/${subjectSlug}/${next.slug}`}
            onClick={scrollTop}
            className="flex items-center gap-1 hover:text-foreground transition-colors max-w-[45%] truncate"
          >
            <span className="truncate">{next.title}</span>
            <ChevronRight size={13} className="shrink-0" />
          </Link>
        ) : <span />}
      </div>
    )
  }

  return (
    <div className="mt-12 pt-6 border-t border-border flex gap-3">
      {prev && (
        <Link
          to={`/materia/${subjectSlug}/${prev.slug}`}
          onClick={scrollTop}
          className="flex-1 flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all group"
        >
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <ChevronLeft size={11} /> Precedente
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {prev.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          to={`/materia/${subjectSlug}/${next.slug}`}
          onClick={scrollTop}
          className="flex-1 flex flex-col gap-1 items-end rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all group text-right"
        >
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Successivo <ChevronRight size={11} />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {next.title}
          </span>
        </Link>
      )}
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
    if (!key) {
      setNotFound(true)
      setLoading(false)
      return
    }
    ;(mdxModules[key]() as Promise<NoteModule>).then((m) => {
      setMod(m)
      setLoading(false)
    })
  }, [subjectSlug, noteSlug])

  if (loading || loadingSubject) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="skeleton h-3 w-48 rounded" />
        <div className="skeleton h-7 w-80 rounded" />
        <div className="skeleton h-4 w-full max-w-lg rounded" />
        <div className="skeleton h-4 w-full max-w-md rounded" />
      </div>
    )
  }

  if (notFound || !mod) return <NotFound />

  const subject = subjects.find((s) => s.slug === subjectSlug)
  const { frontmatter: fm } = mod
  const Content = mod.default

  // Prev/next within same note type
  const sameType = notes.filter((n) => n.type === fm.type)
  const idx = sameType.findIndex((n) => n.slug === noteSlug)
  const prevNote = idx > 0 ? sameType[idx - 1] : null
  const nextNote = idx < sameType.length - 1 ? sameType[idx + 1] : null

  return (
    <>
      <SEO title={fm.title} description={fm.excerpt} />

      <Breadcrumbs
        items={[
          { label: subject?.title ?? subjectSlug!, href: `/materia/${subjectSlug}` },
          { label: fm.title },
        ]}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {fm.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="font-sans text-3xl font-bold text-foreground">{fm.title}</h1>
        {fm.excerpt && (
          <p className="mt-2 text-muted-foreground max-w-2xl">{fm.excerpt}</p>
        )}
        {(fm.date || fm.readingTime) && (
          <p className="mt-3 text-xs text-muted-foreground">
            {fm.date && new Date(fm.date).toLocaleDateString('it-IT', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
            {fm.date && fm.readingTime && ' · '}
            {fm.readingTime && `${fm.readingTime} min di lettura`}
          </p>
        )}
      </div>

      {/* Top nav — subtle */}
      <NoteNav prev={prevNote} next={nextNote} subjectSlug={subjectSlug!} variant="top" />

      {/* Content + ToC */}
      <div className="flex gap-10">
        <article className="flex-1 min-w-0 prose-academic">
          <Content components={MDX_COMPONENTS} />
        </article>

        {/* ToC sidebar — right */}
        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-24">
            <TableOfContents collapsible />
          </div>
        </aside>
      </div>

      {/* Bottom nav — prominent */}
      <NoteNav prev={prevNote} next={nextNote} subjectSlug={subjectSlug!} variant="bottom" />
    </>
  )
}
