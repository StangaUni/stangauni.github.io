import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Github, BookOpen, FlaskConical, Target, Paperclip,
  CheckCircle, Circle, ChevronLeft, ChevronRight, User, History, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '../components/note/Breadcrumbs'
import { Badge } from '../components/ui/Badge'
import { SEO } from '../components/ui/SEO'
import { useSubjects } from '../hooks/useSubjects'
import { useNotes } from '../hooks/useNotes'
import { useChangelog } from '../hooks/useChangelog'
import { NotFound } from './NotFound'
import type { Note, NoteType } from '../types/note'
import type { ChangelogEntry, ChangelogEntryType } from '../types/changelog'

// ─── Tab config ──────────────────────────────────────────────────────────────

const TABS: { key: NoteType; label: string; Icon: React.ElementType }[] = [
  { key: 'riassunto',     label: 'Teoria',          Icon: BookOpen     },
  { key: 'esercitazione', label: 'Esercizi',         Icon: FlaskConical },
  { key: 'extra',         label: 'Materiale Extra',  Icon: Paperclip    },
  { key: 'appunti',       label: 'Strategie Esame',  Icon: Target       },
]

// ─── Difficulty dots ──────────────────────────────────────────────────────────

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1" title={`Difficoltà: ${level}/3`}>
      {([1, 2, 3] as const).map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i <= level ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Note lists ───────────────────────────────────────────────────────────────

function NoteRow({ note, subjectSlug, delay }: { note: Note; subjectSlug: string; delay: number }) {
  return (
    <motion.div
      id={note.slug}
      className="scroll-mt-28"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <Link
        to={`/materia/${subjectSlug}/${note.slug}`}
        className="group flex items-start justify-between gap-4 px-3 py-3.5 rounded-lg transition-colors hover:bg-secondary/50"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {note.title}
          </h3>
          {note.excerpt && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1 leading-relaxed">
              {note.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <ChevronRight
            size={14}
            className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </Link>
    </motion.div>
  )
}

function sectionId(name: string) {
  return `section-${name.toLowerCase().replace(/\s+/g, '-')}`
}

function RiassuntiList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  const hasSections = notes.some((n) => n.section)

  if (!hasSections) {
    return (
      <div className="divide-y divide-border/60">
        {notes.map((note, i) => (
          <NoteRow key={note.slug} note={note} subjectSlug={subjectSlug} delay={i * 0.04} />
        ))}
      </div>
    )
  }

  const sections = new Map<string, Note[]>()
  for (const note of notes) {
    const s = note.section ?? 'Altro'
    if (!sections.has(s)) sections.set(s, [])
    sections.get(s)!.push(note)
  }

  let globalIdx = 0
  return (
    <div className="space-y-8">
      {Array.from(sections.entries()).map(([section, sectionNotes]) => (
        <div key={section}>
          <div id={sectionId(section)} className="scroll-mt-28 flex items-center gap-3 mb-1">
            <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {section}
            </h2>
            <div className="flex-1 h-px bg-border/60" />
          </div>
          <div className="divide-y divide-border/60">
            {sectionNotes.map((note) => {
              const delay = (globalIdx++) * 0.04
              return <NoteRow key={note.slug} note={note} subjectSlug={subjectSlug} delay={delay} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const EXERCISE_TYPE_LABELS: Record<string, { label: string; className: string }> = {
  esame: { label: "Esame",    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  aula:  { label: "Aula",     className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  quiz:  { label: "Quiz",     className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
}

function EserciziCard({ note, subjectSlug, delay }: { note: Note; subjectSlug: string; delay: number }) {
  const exerciseType = note.tags?.find((t) => Object.keys(EXERCISE_TYPE_LABELS).includes(t))
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
        className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
            {note.title}
          </h3>
          {note.excerpt && (
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1 leading-relaxed">{note.excerpt}</p>
          )}
          {(note.difficulty || typeCfg || note.hasSolution !== undefined) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {note.difficulty && <DifficultyDots level={note.difficulty} />}
              {typeCfg && (
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeCfg.className}`}>
                  {typeCfg.label}
                </span>
              )}
              {note.hasSolution !== undefined && (
                note.hasSolution ? (
                  <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                    <CheckCircle size={11} /> Soluzione
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Circle size={11} /> Solo risultato
                  </span>
                )
              )}
            </div>
          )}
        </div>
        <ChevronRight
          size={14}
          className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
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
          <div className="flex items-center gap-3 mb-2">
            <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {week === 0 ? 'Altro' : `Settimana ${week}`}
            </h2>
            <div className="flex-1 h-px bg-border/60" />
          </div>
          <div className="space-y-2">
            {weekNotes.map((note) => {
              const delay = globalIdx++ * 0.04
              return <EserciziCard key={note.slug} note={note} subjectSlug={subjectSlug} delay={delay} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function StrategieList({ notes, subjectSlug }: { notes: Note[]; subjectSlug: string }) {
  return (
    <div className="space-y-2">
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
            className="group flex items-start justify-between gap-3 rounded-xl border border-amber-300/50 bg-amber-50/50 dark:border-amber-700/30 dark:bg-amber-900/10 px-5 py-4 transition-all hover:border-amber-400/70 hover:shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-medium text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors leading-snug">
                {note.title}
              </h3>
              {note.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{note.excerpt}</p>
              )}
            </div>
            <ChevronRight
              size={14}
              className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

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
            className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                {note.title}
              </h3>
              {note.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{note.excerpt}</p>
              )}
            </div>
            <ChevronRight
              size={14}
              className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Quick Nav ────────────────────────────────────────────────────────────────

function QuickNav({ notes, collapsed, onToggle }: { notes: Note[]; collapsed: boolean; onToggle: () => void }) {
  const hasSections = notes.some((n) => n.section)

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const linkClass = "block rounded px-2 py-1.5 text-[11px] leading-snug text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors truncate"

  const sections = new Map<string, Note[]>()
  if (hasSections) {
    for (const note of notes) {
      const s = note.section ?? 'Altro'
      if (!sections.has(s)) sections.set(s, [])
      sections.get(s)!.push(note)
    }
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-1 w-7">
        <button
          onClick={onToggle}
          title="Espandi navigazione"
          className="rounded-md p-1 text-muted-foreground/40 hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronRight size={13} />
        </button>
        <span
          className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/20 select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Indice
        </span>
      </div>
    )
  }

  return (
    <nav className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          In questa sezione
        </p>
        <button
          onClick={onToggle}
          title="Comprimi navigazione"
          className="rounded-md p-0.5 text-muted-foreground/30 hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronLeft size={13} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        {hasSections ? (
          Array.from(sections.entries()).map(([section, sectionNotes]) => (
            <div key={section} className="mb-3">
              <a
                href={`#${sectionId(section)}`}
                onClick={(e) => scrollTo(e, sectionId(section))}
                className="block px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {section}
              </a>
              <div className="space-y-0.5">
                {sectionNotes.map((note) => (
                  <a key={note.slug} href={`#${note.slug}`} onClick={(e) => scrollTo(e, note.slug)} className={linkClass}>
                    {note.title}
                  </a>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-0.5">
            {notes.map((note) => (
              <a key={note.slug} href={`#${note.slug}`} onClick={(e) => scrollTo(e, note.slug)} className={linkClass}>
                {note.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ github }: { github?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-14 text-center text-muted-foreground">
      <p className="font-medium text-foreground">Nessun materiale disponibile</p>
      <p className="mt-1.5 text-sm">
        {github ? (
          <>
            Vuoi contribuire?{' '}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Apri una pull request sul repository.
            </a>
          </>
        ) : (
          'Il materiale per questa materia non è ancora stato aggiunto.'
        )}
      </p>
    </div>
  )
}

// ─── Changelog ───────────────────────────────────────────────────────────────

const ENTRY_TYPE_CFG: Record<ChangelogEntryType, { label: string; dot: string; text: string }> = {
  nuovo:      { label: 'Nuovo',      dot: 'bg-green-500',  text: 'text-green-600 dark:text-green-400' },
  aggiunta:   { label: 'Aggiunta',   dot: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400'   },
  revisione:  { label: 'Revisione',  dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400' },
  correzione: { label: 'Correzione', dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400'     },
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const PREVIEW_COUNT = 5

function ChangelogRow({ entry }: { entry: ChangelogEntry }) {
  const cfg = entry.type ? ENTRY_TYPE_CFG[entry.type] : null
  return (
    <li className="flex flex-col gap-0.5 py-2">
      <span className="text-sm text-foreground/85 leading-snug">{entry.description}</span>
      <div className="flex items-center gap-2">
        {cfg && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${cfg.text}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        )}
        <time className="text-[11px] text-muted-foreground tabular-nums">
          {formatDate(entry.date)}
        </time>
      </div>
    </li>
  )
}

const MODAL_PAGE_SIZE = 10

export function ChangelogModal({ entries, onClose }: { entries: ChangelogEntry[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const filtered = query.trim()
    ? sorted.filter((e) =>
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        e.date.includes(query) ||
        (e.type && ENTRY_TYPE_CFG[e.type]?.label.toLowerCase().includes(query.toLowerCase()))
      )
    : sorted

  const totalPages = Math.ceil(filtered.length / MODAL_PAGE_SIZE)
  const paginated = filtered.slice(page * MODAL_PAGE_SIZE, (page + 1) * MODAL_PAGE_SIZE)

  useEffect(() => { setPage(0) }, [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="relative z-10 w-full max-w-lg max-h-[82vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <History size={15} className="text-primary" />
              <h2 className="font-semibold text-foreground">Cronologia completa</h2>
              <span className="text-xs text-muted-foreground">({filtered.length}/{sorted.length})</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Chiudi"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-border shrink-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per descrizione, data o tipo…"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-colors"
            />
          </div>

          {/* List */}
          <ol className="overflow-y-auto px-5 py-4 divide-y divide-border/40 flex-1">
            {paginated.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">Nessun risultato.</li>
            ) : (
              paginated.map((entry, i) => <ChangelogRow key={i} entry={entry} />)
            )}
          </ol>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="rounded-md px-3 py-1.5 text-xs text-muted-foreground border border-border hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Precedente
              </button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="rounded-md px-3 py-1.5 text-xs text-muted-foreground border border-border hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Successiva →
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ChangelogDropdown({ entries, open }: { entries: ChangelogEntry[]; open: boolean }) {
  const [modalOpen, setModalOpen] = useState(false)
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const preview = sorted.slice(0, PREVIEW_COUNT)
  const hasMore = sorted.length > PREVIEW_COUNT

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 mb-6 rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <ol className="space-y-2">
                {preview.map((entry, i) => <ChangelogRow key={i} entry={entry} />)}
              </ol>
              {hasMore && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-3 pt-3 border-t border-border/60 w-full text-xs text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  Mostra tutte le {sorted.length} modifiche →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && <ChangelogModal entries={entries} onClose={() => setModalOpen(false)} />}
    </>
  )
}

// ─── Subject header card ──────────────────────────────────────────────────────

function SubjectHeader({
  subject, changelog, changelogOpen, onToggleChangelog,
}: {
  subject: ReturnType<typeof import('../hooks/useSubjects').useSubjects>['subjects'][number]
  changelog: import('../types/changelog').SubjectChangelog | null
  changelogOpen: boolean
  onToggleChangelog: () => void
}) {
  return (
    <div className={`relative rounded-2xl border border-border bg-card overflow-hidden ${changelogOpen ? 'mb-0' : 'mb-4'}`}>
      {/* Gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ background: 'radial-gradient(ellipse 55% 90% at 0% 50%, hsl(var(--primary)) 0%, transparent 70%)' }}
      />

      <div className="relative px-6 py-6">
        {/* Top meta row */}
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

          {changelog && changelog.entries.length > 0 && (
            <button
              onClick={onToggleChangelog}
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-xs border transition-colors ${
                changelogOpen
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-secondary border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <History size={11} />
              Changelog
              <ChevronDown size={10} className={`transition-transform duration-150 ${changelogOpen ? 'rotate-180' : ''}`} />
            </button>
          )}

          {subject.github && (
            <a
              href={subject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Github size={12} />
              Repository
            </a>
          )}
        </div>

        {/* Title */}
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {subject.title}
        </h1>

        {/* Professor */}
        {subject.professor && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground/70">
            <User size={13} />
            {subject.professor}
          </p>
        )}

        {/* Description */}
        {subject.description && (
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {subject.description}
          </p>
        )}

        {/* Style tags */}
        {subject.styleTags && subject.styleTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {subject.styleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function TabBar({
  tabs, activeTab, notes, onSelect,
}: {
  tabs: typeof TABS
  activeTab: NoteType | null
  notes: Note[]
  onSelect: (k: NoteType) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key
        const count = notes.filter((n) => n.type === key).length
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium border transition-colors ${
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/80 hover:bg-secondary/50'
            }`}
          >
            <Icon size={13} />
            {label}
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono tabular-nums ${
              active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SubjectPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const { subjects, loading: loadingSubject } = useSubjects()
  const { notes, loading: loadingNotes } = useNotes(subjectSlug)
  const { changelog } = useChangelog(subjectSlug)
  const [activeTab, setActiveTab] = useState<NoteType | null>(null)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)

  useEffect(() => {
    if (!loadingNotes && notes.length > 0 && activeTab === null) {
      const first = TABS.map((t) => t.key).find((k) => notes.some((n) => n.type === k))
      if (first) setActiveTab(first)
    }
  }, [loadingNotes, notes, activeTab])

  if (loadingSubject) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-48 w-full rounded-2xl" />
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

  return (
    <>
      <SEO title={subject.title} description={subject.description} />

      <Breadcrumbs items={[{ label: subject.title }]} />

      <SubjectHeader
        subject={subject}
        changelog={changelog}
        changelogOpen={changelogOpen}
        onToggleChangelog={() => setChangelogOpen((v) => !v)}
      />

      {changelog && changelog.entries.length > 0 && (
        <ChangelogDropdown entries={changelog.entries} open={changelogOpen} />
      )}

      {!loadingNotes && showTabs && (
        <TabBar tabs={availableTabs} activeTab={activeTab} notes={notes} onSelect={setActiveTab} />
      )}

      <div className={!loadingNotes && !showTabs ? 'mt-6' : ''} />

      {loadingNotes ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState github={subject.github} />
      ) : (
        <div className="flex gap-6">
          <aside className={`hidden lg:flex flex-col shrink-0 transition-all duration-200 ${navCollapsed ? 'w-7' : 'w-44'}`}>
            <div className="sticky top-28 flex flex-col max-h-[calc(100vh-8rem)]">
              <QuickNav notes={visibleNotes} collapsed={navCollapsed} onToggle={() => setNavCollapsed(v => !v)} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'riassunto'     && <RiassuntiList notes={visibleNotes} subjectSlug={subjectSlug!} />}
                {activeTab === 'esercitazione' && <EserciziList  notes={visibleNotes} subjectSlug={subjectSlug!} />}
                {activeTab === 'appunti'       && <StrategieList notes={visibleNotes} subjectSlug={subjectSlug!} />}
                {activeTab === 'extra'         && <ExtraList     notes={visibleNotes} subjectSlug={subjectSlug!} />}
                {activeTab === null            && <EmptyState github={subject.github} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  )
}
