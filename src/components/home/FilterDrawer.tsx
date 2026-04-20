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

// ─── Year + semester accordion ────────────────────────────────────────────────

function YearSection({
  year, isYearActive, selectedSemester, onSelectYear, onSelectSemester,
}: {
  year: number
  isYearActive: boolean
  selectedSemester: number | null
  onSelectYear: (year: number | null) => void
  onSelectSemester: (year: number, semester: number | null) => void
}) {
  const [open, setOpen] = useState(isYearActive)

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) onSelectYear(year)
    else onSelectYear(null)
  }

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={toggle}
        className={`select-none relative flex w-full items-center justify-between px-5 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-none ${
          isYearActive
            ? 'text-foreground font-medium bg-primary/[0.05]'
            : 'text-foreground/65 hover:text-foreground hover:bg-secondary/40'
        }`}
      >
        {isYearActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary/55" />
        )}
        <span>Anno {year}</span>
        <ChevronDown
          size={12}
          className={`text-muted-foreground/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="py-1.5 px-3 flex flex-col gap-px">
              <button
                onClick={() => onSelectSemester(year, null)}
                className={`select-none flex items-center rounded-md px-3 py-1.5 text-[12px] transition-colors duration-150 focus-visible:outline-none ${
                  isYearActive && selectedSemester === null
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Tutti i semestri
              </button>
              {[1, 2].map((sem) => {
                const isActive = isYearActive && selectedSemester === sem
                return (
                  <button
                    key={sem}
                    onClick={() => onSelectSemester(year, sem)}
                    className={`select-none flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] transition-colors duration-150 focus-visible:outline-none ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <span className={`h-[5px] w-[5px] rounded-full shrink-0 transition-colors duration-150 ${
                      isActive ? 'bg-primary/50' : 'bg-muted-foreground/25'
                    }`} />
                    {SEMESTER_LABELS[sem]}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Collapsed strip ──────────────────────────────────────────────────────────

function CollapsedStrip({ onExpand, hasActiveFilter }: { onExpand: () => void; hasActiveFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 py-5 w-10">
      <button
        onClick={onExpand}
        className="select-none relative rounded-lg p-1.5 text-muted-foreground/45 hover:text-foreground hover:bg-secondary/60 transition-colors duration-150 focus-visible:outline-none"
        title="Apri filtri"
      >
        <ChevronRight size={14} />
        {hasActiveFilter && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </button>
      <SlidersHorizontal size={12} className="text-muted-foreground/20 rotate-90" />
    </div>
  )
}

// ─── Drawer panel ─────────────────────────────────────────────────────────────

function DrawerPanel({
  years, selectedYear, selectedSemester, onSelectYear, onSelectSemester, onCollapse,
}: Omit<FilterDrawerProps, 'mobileOpen' | 'onMobileClose'> & { onCollapse: () => void }) {
  return (
    <div className="w-52 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="select-none text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/45">
            Filtri
          </span>
          <AnimatePresence>
            {selectedYear !== null && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-primary/65"
              />
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onCollapse}
          className="select-none rounded-md p-1 text-muted-foreground/35 hover:text-foreground hover:bg-secondary/60 transition-colors duration-150 focus-visible:outline-none"
          title="Chiudi filtri"
        >
          <ChevronLeft size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => onSelectYear(null)}
          className={`select-none relative flex w-full items-center px-5 py-2.5 text-sm transition-colors duration-150 border-b border-border/40 focus-visible:outline-none ${
            selectedYear === null
              ? 'text-primary font-medium bg-primary/[0.05]'
              : 'text-muted-foreground/65 hover:text-foreground hover:bg-secondary/40'
          }`}
        >
          {selectedYear === null && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary/55" />
          )}
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
      {/* ── Desktop ── */}
      <aside className="hidden lg:flex flex-col shrink-0 border-r border-border/50 self-stretch">
        <div className="sticky top-[3.6rem] max-h-[calc(100vh-3.6rem)] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            {collapsed ? (
              <motion.div
                key="collapsed"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <CollapsedStrip onExpand={onToggleCollapse} hasActiveFilter={rest.selectedYear !== null} />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 208, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <DrawerPanel {...rest} onCollapse={onToggleCollapse} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              key="panel"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 top-0 z-50 h-full w-56 bg-background border-r border-border/50 shadow-xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="select-none text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/45">
                    Filtri
                  </span>
                  {rest.selectedYear !== null && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/65" />
                  )}
                </div>
                <button
                  onClick={onMobileClose}
                  className="select-none rounded-md p-1 text-muted-foreground/45 hover:text-foreground hover:bg-secondary/60 transition-colors focus-visible:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <button
                  onClick={() => { rest.onSelectYear(null); onMobileClose() }}
                  className={`select-none relative flex w-full items-center px-5 py-2.5 text-sm transition-colors duration-150 border-b border-border/40 focus-visible:outline-none ${
                    rest.selectedYear === null
                      ? 'text-primary font-medium bg-primary/[0.05]'
                      : 'text-muted-foreground/65 hover:text-foreground hover:bg-secondary/40'
                  }`}
                >
                  {rest.selectedYear === null && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary/55" />
                  )}
                  Tutte le materie
                </button>
                {props.years.map((year) => (
                  <YearSection
                    key={year}
                    year={year}
                    isYearActive={rest.selectedYear === year}
                    selectedSemester={rest.selectedYear === year ? rest.selectedSemester : null}
                    onSelectYear={rest.onSelectYear}
                    onSelectSemester={rest.onSelectSemester}
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
