import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterDrawerProps {
  years: number[]
  selectedYear: number | null
  selectedSemester: number | null
  onSelectYear: (year: number | null) => void
  onSelectSemester: (year: number, semester: number | null) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const SEMESTER_LABELS: Record<number, string> = {
  1: 'I Semestre',
  2: 'II Semestre',
  3: 'III Semestre',
}


function YearSection({
  year,
  isYearActive,
  selectedSemester,
  onSelectYear,
  onSelectSemester,
}: {
  year: number
  isYearActive: boolean
  selectedSemester: number | null
  onSelectYear: (year: number | null) => void
  onSelectSemester: (year: number, semester: number | null) => void
}) {
  const [open, setOpen] = useState(isYearActive)

  const toggle = () => {
    setOpen((o) => !o)
    if (!open) onSelectYear(year)
    else onSelectYear(null)
  }

  return (
    <div className="border-b border-border last:border-0">
      {/* Year header */}
      <button
        onClick={toggle}
        className={`relative flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
          isYearActive ? 'text-foreground bg-secondary/40' : 'text-foreground hover:bg-secondary/60'
        }`}
      >
        {isYearActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-primary" />
        )}
        <span>Anno {year}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Semesters */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-2 px-3 flex flex-col gap-0.5">
              {/* "Tutti" option */}
              <button
                onClick={() => onSelectSemester(year, null)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                  isYearActive && selectedSemester === null
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                Tutti i semestri
              </button>
              {[1, 2].map((sem) => (
                <button
                  key={sem}
                  onClick={() => onSelectSemester(year, sem)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                    isYearActive && selectedSemester === sem
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                  {SEMESTER_LABELS[sem]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Collapsed (icon-only) strip ─────────────────────────────────────────────

function CollapsedStrip({ onExpand }: { onExpand: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4 w-10">
      <button
        onClick={onExpand}
        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        title="Apri filtri"
      >
        <ChevronRight size={16} />
      </button>
      <SlidersHorizontal size={14} className="text-muted-foreground/50 rotate-90" />
    </div>
  )
}

// ─── Main drawer panel ───────────────────────────────────────────────────────

function DrawerPanel({
  years,
  selectedYear,
  selectedSemester,
  onSelectYear,
  onSelectSemester,
  onCollapse,
}: Omit<FilterDrawerProps, 'mobileOpen' | 'onMobileClose'> & { onCollapse: () => void }) {
  return (
    <div className="w-48 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Filtra
        </span>
        <button
          onClick={onCollapse}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Chiudi filtri"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Year sections */}
      <div className="flex-1 overflow-y-auto">
        {/* "Tutte" option */}
        <button
          onClick={() => onSelectYear(null)}
          className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors border-b border-border ${
            selectedYear === null
              ? 'text-primary font-semibold bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          Tutte le materie
        </button>

        {years.map((year) => (
          <YearSection
            key={year}
            year={year}
            isYearActive={selectedYear === year}
            selectedSemester={selectedYear === year ? selectedSemester : null}
            onSelectYear={onSelectYear}
            onSelectSemester={onSelectSemester}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export function FilterDrawer(props: FilterDrawerProps & { collapsed: boolean; onToggleCollapse: () => void }) {
  const { mobileOpen, onMobileClose, collapsed, onToggleCollapse, ...rest } = props

  return (
    <>
      {/* ── Desktop drawer ── */}
      <aside className="hidden lg:flex flex-col shrink-0 border-r border-border min-h-0 self-start sticky top-[3.6rem] max-h-[calc(100vh-3.6rem)] overflow-y-auto">
        <AnimatePresence initial={false} mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CollapsedStrip onExpand={onToggleCollapse} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 192, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DrawerPanel {...rest} onCollapse={onToggleCollapse} />
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onMobileClose}
            />
            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 h-full w-56 bg-background border-r border-border shadow-xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Filtra
                </span>
                <button
                  onClick={onMobileClose}
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <button
                  onClick={() => { rest.onSelectYear(null); onMobileClose() }}
                  className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors border-b border-border ${
                    rest.selectedYear === null
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  Tutte le materie
                </button>
                {props.years.map((year) => (
                  <YearSection
                    key={year}
                    year={year}
                    isYearActive={rest.selectedYear === year}
                    selectedSemester={rest.selectedYear === year ? rest.selectedSemester : null}
                    onSelectYear={(y) => { rest.onSelectYear(y) }}
                    onSelectSemester={(y, s) => { rest.onSelectSemester(y, s) }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
