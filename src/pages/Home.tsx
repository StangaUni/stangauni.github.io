import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Command, Search, SlidersHorizontal, X } from 'lucide-react'
import { SubjectCard } from '../components/home/SubjectCard'
import { SkeletonCard } from '../components/home/SkeletonCard'
import { FilterDrawer } from '../components/home/FilterDrawer'
import { SEO } from '../components/ui/SEO'
import {
  getAllSubjects,
  getAllNotes,
  getNoteCountsBySubject,
} from '@/lib/content'
import type { Subject } from '@/types/subject'

const SEMESTER_LABELS: Record<number, string> = {
  1: 'I Semestre',
  2: 'II Semestre',
  3: 'III Semestre',
}

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)

function SemesterSection({
  year, semester, showYear, subjects, noteCountsBySubject, index,
}: {
  year: number; semester: number; showYear: boolean
  subjects: Subject[]
  noteCountsBySubject: Record<string, { riassunto: number; esercitazione: number; altro: number }>
  index: number
}) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-3 mb-5 border-b border-border pb-2">
        <span className="font-sans text-sm font-semibold text-foreground">
          {showYear ? `Anno ${year}` : SEMESTER_LABELS[semester]}
        </span>
        {showYear && (
          <span className="text-xs text-muted-foreground">
            {SEMESTER_LABELS[semester]}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject, i) => (
          <motion.div
            key={subject.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: (index + i) * 0.04, ease: 'easeOut' }}
            className="flex"
          >
            <div className="flex flex-col w-full">
              <SubjectCard subject={subject} noteCounts={noteCountsBySubject[subject.slug]} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function Home() {
  const subjects = getAllSubjects()
  const notes = getAllNotes()
  const noteCountsBySubject = useMemo(() => getNoteCountsBySubject(), [])
  const [searchParams, setSearchParams] = useSearchParams()
  const [drawerCollapsed, setDrawerCollapsed] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const urlYear     = searchParams.get('year')     ? Number(searchParams.get('year'))     : null
  const urlSemester = searchParams.get('semester') ? Number(searchParams.get('semester')) : null
  const showAbandoned = searchParams.get('abbandonati') === '1'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') searchRef.current?.blur()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const years = useMemo(
    () => Array.from(new Set(subjects.map((s) => s.year))).sort(),
    [subjects],
  )

  const visibleCount = useMemo(() => {
    if (showAbandoned) return subjects.length
    return subjects.filter((s) => s.status !== 'abbandonato').length
  }, [subjects, showAbandoned])

  const filtered = useMemo(() => {
    let base = subjects
    if (!showAbandoned) base = base.filter((s) => s.status !== 'abbandonato')
    if (urlYear     !== null) base = base.filter((s) => s.year     === urlYear)
    if (urlSemester !== null) base = base.filter((s) => s.semester === urlSemester)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      base = base.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q),
      )
    }
    return base
  }, [subjects, urlYear, urlSemester, query, showAbandoned])

  const bySemester = useMemo(() => {
    const map = new Map<string, Subject[]>()
    filtered.forEach((s) => {
      const key = `${s.year}-${s.semester}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        const [ay, as_] = a.split('-').map(Number)
        const [by, bs]  = b.split('-').map(Number)
        return ay !== by ? ay - by : as_ - bs
      })
      .map(([key, subs]) => {
        const [year, semester] = key.split('-').map(Number)
        return { year, semester, subs }
      })
  }, [filtered])

  const semesterOffsets = useMemo(() => {
    const offsets: number[] = []
    let acc = 0
    bySemester.forEach(({ subs }) => { offsets.push(acc); acc += subs.length })
    return offsets
  }, [bySemester])

  function setYearFilter(year: number | null) {
    const params = new URLSearchParams(searchParams)
    if (year === null) { params.delete('year'); params.delete('semester') }
    else { params.set('year', String(year)); params.delete('semester') }
    setSearchParams(params, { replace: true })
  }

  function setSemesterFilter(year: number, semester: number | null) {
    const params = new URLSearchParams(searchParams)
    params.set('year', String(year))
    if (semester === null) params.delete('semester')
    else params.set('semester', String(semester))
    setSearchParams(params, { replace: true })
  }

  function setShowAbandoned(value: boolean) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('abbandonati', '1')
    else params.delete('abbandonati')
    setSearchParams(params, { replace: true })
  }

  // silence unused - notes available if needed later
  void notes

  return (
    <>
      <SEO />

      <div className="flex flex-1 gap-0 -mx-6 sm:-mx-8">
        {years.length > 0 && (
          <FilterDrawer
            years={years}
            selectedYear={urlYear}
            selectedSemester={urlSemester}
            onSelectYear={setYearFilter}
            onSelectSemester={setSemesterFilter}
            showAbandoned={showAbandoned}
            onToggleAbandoned={setShowAbandoned}
            collapsed={drawerCollapsed}
            onToggleCollapse={() => setDrawerCollapsed((c) => !c)}
            mobileOpen={mobileDrawerOpen}
            onMobileClose={() => setMobileDrawerOpen(false)}
          />
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="px-6 sm:px-8 py-6 border-b border-border/60">
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary/70 pointer-events-none transition-colors duration-200"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cerca tra ${visibleCount} materie…`}
                className="w-full rounded-2xl border border-border bg-background pl-11 pr-28 py-3.5 text-sm shadow-sm placeholder:text-muted-foreground/45 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/15 focus:shadow-md transition-all duration-200"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Cancella"
                >
                  <X size={13} />
                </button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
                  <kbd className="inline-flex items-center rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/35">
                    {isMac ? <Command size={9} /> : 'Ctrl'}
                  </kbd>
                  <kbd className="inline-flex items-center rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/35">
                    K
                  </kbd>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 pb-1 px-6 sm:px-8 lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filtra
              {(urlYear !== null || showAbandoned) && <span className="rounded-full bg-primary w-1.5 h-1.5" />}
            </button>
          </div>

          <div className="px-6 sm:px-8 pt-4 pb-6">
            {subjects.length === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">
                Nessuna materia trovata.
              </p>
            ) : (
              bySemester.map(({ year, semester, subs }, i) => (
                <SemesterSection
                  key={`${year}-${semester}`}
                  year={year}
                  semester={semester}
                  showYear={urlYear === null}
                  subjects={subs}
                  noteCountsBySubject={noteCountsBySubject}
                  index={semesterOffsets[i]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
