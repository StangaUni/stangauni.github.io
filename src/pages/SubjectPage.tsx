import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Github, BookOpen, FlaskConical, Target, Paperclip,
  CheckCircle, Circle, ChevronRight, User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '../components/note/Breadcrumbs'
import { Badge } from '../components/ui/Badge'
import { SEO } from '../components/ui/SEO'
import { useSubjects } from '../hooks/useSubjects'
import { useNotes } from '../hooks/useNotes'
import { NotFound } from './NotFound'
import type { Note, NoteType } from '../types/note'

// ─── Tab config ──────────────────────────────────────────────────────────────

const TABS: { key: NoteType; label: string; Icon: React.ElementType }[] = [
  { key: 'riassunto',     label: 'Riassunti',       Icon: BookOpen    },
  { key: 'esercitazione', label: 'Esercizi',         Icon: FlaskConical },
  { key: 'extra',         label: 'Materiale Extra',  Icon: Paperclip   },
  { key: 'appunti',       label: 'Strategie Esame',  Icon: Target      },
]

// ─── Small helpers ────────────────────────────────────────────────────────────

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1" title={`Difficoltà: ${level}/3`}>
      {([1, 2, 3] as const).map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i <= level ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Riassunti list ──────────────────────────────────────────────────────────

function RiassuntiList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  return (
    <div className="divide-y divide-border">
      {notes.map((note, i) => (
        <motion.div
          key={note.slug}
          id={note.slug}
          className="scroll-mt-28"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
        >
          <Link
            to={`/materia/${subjectSlug}/${note.slug}`}
            className="group flex items-start justify-between gap-4 px-3 py-4 rounded-md transition-colors hover:bg-secondary/50"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                {note.title}
              </h3>
              {note.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{note.excerpt}</p>
              )}
              {note.tags.length > 0 && (
                <p className="mt-1.5 text-xs text-muted-foreground/70">
                  {note.tags.slice(0, 5).join(' · ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              {note.readingTime && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {note.readingTime} min
                </span>
              )}
              <ChevronRight
                size={15}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Esercizi list ───────────────────────────────────────────────────────────

const EXERCISE_TYPE_LABELS: Record<string, { label: string; className: string }> = {
  esame:       { label: 'Esercizio d\'esame',    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  aula:        { label: 'Esercitazione in aula', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  quiz:        { label: 'Quiz a crocette',        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
}

function EserciziCard({ note, subjectSlug, delay }: { note: Note; subjectSlug: string; delay: number }) {
  const exerciseType = note.tags.find((t) => Object.keys(EXERCISE_TYPE_LABELS).includes(t))
  const typeCfg = exerciseType ? EXERCISE_TYPE_LABELS[exerciseType] : null

  return (
    <motion.div
      id={note.slug}
      className="scroll-mt-28"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <Link
        to={`/materia/${subjectSlug}/${note.slug}`}
        className="group flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center gap-3 shrink-0">
              {note.difficulty && <DifficultyDots level={note.difficulty} />}
              {typeCfg && (
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${typeCfg.className}`}>
                  {typeCfg.label}
                </span>
              )}
              {note.hasSolution !== undefined && (
                note.hasSolution ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle size={12} /> Soluzione completa
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Circle size={12} /> Solo risultato
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <ChevronRight
          size={15}
          className="shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
        />
      </Link>
    </motion.div>
  )
}

function EserciziList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  const hasWeeks = notes.some((n) => n.week !== undefined)

  if (!hasWeeks) {
    return (
      <div className="space-y-2">
        {notes.map((note, i) => (
          <EserciziCard key={note.slug} note={note} subjectSlug={subjectSlug} delay={i * 0.04} />
        ))}
      </div>
    )
  }

  // Group by week, preserving order
  const weeks = new Map<number, Note[]>()
  for (const note of notes) {
    const w = note.week ?? 0
    if (!weeks.has(w)) weeks.set(w, [])
    weeks.get(w)!.push(note)
  }

  let globalIdx = 0
  return (
    <div className="space-y-8">
      {Array.from(weeks.entries()).map(([week, weekNotes]) => (
        <div key={week}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {week === 0 ? 'Altro' : `Settimana ${week}`}
          </h2>
          <div className="space-y-2">
            {weekNotes.map((note) => {
              const delay = globalIdx++ * 0.04
              return (
                <EserciziCard key={note.slug} note={note} subjectSlug={subjectSlug} delay={delay} />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Strategie list ──────────────────────────────────────────────────────────

function StrategieList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  return (
    <div className="space-y-4">
      {notes.map((note, i) => (
        <motion.div
          key={note.slug}
          id={note.slug}
          className="scroll-mt-28"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
        >
          <Link
            to={`/materia/${subjectSlug}/${note.slug}`}
            className="group block rounded-xl border border-amber-300/60 bg-amber-50/60 dark:border-amber-700/40 dark:bg-amber-900/10 px-5 py-4 transition-all hover:border-amber-400 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {note.title}
                </h3>
                {note.excerpt && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{note.excerpt}</p>
                )}
              </div>
              <ChevronRight
                size={15}
                className="shrink-0 mt-1 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Generic (Extra) list ─────────────────────────────────────────────────────

function ExtraList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  return (
    <div className="space-y-2">
      {notes.map((note, i) => (
        <motion.div
          key={note.slug}
          id={note.slug}
          className="scroll-mt-28"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
        >
          <Link
            to={`/materia/${subjectSlug}/${note.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                {note.title}
              </h3>
              {note.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{note.excerpt}</p>
              )}
            </div>
            <ChevronRight
              size={15}
              className="shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Quick Nav sidebar ───────────────────────────────────────────────────────

function QuickNav({ notes, hasTabs }: { notes: Note[]; hasTabs?: boolean }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault()
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="flex flex-col flex-1 min-h-0">
      <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0 ${hasTabs ? 'mt-3' : ''}`}>
        In questa sezione
      </p>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-0.5">
        {notes.map((note) => (
          <a
            key={note.slug}
            href={`#${note.slug}`}
            onClick={(e) => handleClick(e, note.slug)}
            className="block rounded-md px-2 py-1.5 text-xs leading-snug text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {note.title}
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border py-14 text-center text-muted-foreground">
      <p className="font-medium">Nessun materiale disponibile</p>
      <p className="mt-1 text-sm">
        Vuoi contribuire?{' '}
        <a
          href="https://github.com/stangauni/stangauni.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          Apri una pull request
        </a>
        .
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SubjectPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const { subjects, loading: loadingSubject } = useSubjects()
  const { notes, loading: loadingNotes } = useNotes(subjectSlug)
  const [activeTab, setActiveTab] = useState<NoteType | null>(null)

  // Default tab = first type that has notes
  useEffect(() => {
    if (!loadingNotes && notes.length > 0 && activeTab === null) {
      const first = TABS.map((t) => t.key).find((k) => notes.some((n) => n.type === k))
      if (first) setActiveTab(first)
    }
  }, [loadingNotes, notes, activeTab])

  if (loadingSubject) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="skeleton h-4 w-48 rounded" />
        <div className="skeleton h-8 w-72 rounded" />
        <div className="skeleton h-4 w-full max-w-lg rounded" />
      </div>
    )
  }

  const subject = subjects.find((s) => s.slug === subjectSlug)
  if (!subject) return <NotFound />

  const availableTabs = TABS.filter(
    (t) => notes.some((n) => n.type === t.key) && !subject.hiddenSections?.includes(t.key)
  )
  const visibleNotes = activeTab ? notes.filter((n) => n.type === activeTab) : []
  const showTabs = availableTabs.length > 1
  const showQuickNav = visibleNotes.length >= 5

  return (
    <>
      <SEO title={subject.title} description={subject.description} />

      <Breadcrumbs items={[{ label: subject.title }]} />

      {/* ── Subject Header ── */}
      <div className="mb-8 pb-8 border-b border-border">
        {/* Chips row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="primary">{subject.code}</Badge>
          <span className="text-xs text-muted-foreground bg-secondary border border-border/60 rounded px-2 py-0.5">
            Anno {subject.year} · Sem. {subject.semester}
          </span>
          {subject.cfu && (
            <span className="text-xs text-muted-foreground bg-secondary border border-border/60 rounded px-2 py-0.5">
              {subject.cfu} CFU
            </span>
          )}
        </div>

        {/* Title + GitHub icon */}
        <div className="flex items-center gap-2">
          <h1 className="font-sans text-2xl font-bold text-foreground leading-tight">
            {subject.title}
          </h1>
          {subject.github && (
            <a
              href={subject.github}
              target="_blank"
              rel="noopener noreferrer"
              title="Repository GitHub"
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Github size={18} />
            </a>
          )}
        </div>

        {/* Description */}
        {subject.description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {subject.description}
          </p>
        )}

        {/* Professor */}
        {subject.professor && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <User size={11} />
            {subject.professor}
          </p>
        )}
      </div>

      {/* ── Category Tab Bar (conditional) ── */}
      {!loadingNotes && showTabs && (
        <div className="flex flex-wrap gap-2 mb-6">
          {availableTabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon size={13} />
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono tabular-nums ${
                activeTab === key
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-border text-muted-foreground'
              }`}>
                {notes.filter((n) => n.type === key).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Main content + left Quick Nav ── */}
      {loadingNotes ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex gap-8">
          {/* Left Quick Nav (5+ notes) */}
          {showQuickNav && (
            <aside className="hidden lg:flex flex-col w-44 shrink-0">
              <div className="sticky top-28 flex flex-col max-h-[calc(100vh-8rem)]">
                <QuickNav notes={visibleNotes} hasTabs={showTabs} />
              </div>
            </aside>
          )}

          {/* Note list */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'riassunto' && (
                  <RiassuntiList notes={visibleNotes} subjectSlug={subjectSlug!} />
                )}
                {activeTab === 'esercitazione' && (
                  <EserciziList notes={visibleNotes} subjectSlug={subjectSlug!} />
                )}
                {activeTab === 'appunti' && (
                  <StrategieList notes={visibleNotes} subjectSlug={subjectSlug!} />
                )}
                {activeTab === 'extra' && (
                  <ExtraList notes={visibleNotes} subjectSlug={subjectSlug!} />
                )}
                {activeTab === null && <EmptyState />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-border">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Torna alle materie
        </Link>
      </div>
    </>
  )
}
