import { useState } from 'react'
import {
  BookOpen, CheckCircle, ChevronDown, ChevronRight,
  Circle, FlaskConical, Github, History, Paperclip, Target, User,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { SubjectCard } from '../components/home/SubjectCard'
import { SkeletonCard } from '../components/home/SkeletonCard'
import { FilterDrawer } from '../components/home/FilterDrawer'
import { SearchBar } from '../components/home/SearchBar'
import { NoteCard } from '../components/note/NoteCard'
import { Breadcrumbs } from '../components/note/Breadcrumbs'
import { CodeBlock } from '../components/mdx/CodeBlock'
import { Collapsible } from '../components/mdx/Collapsible'
import { ChangelogModal } from './SubjectPage'
import type { ChangelogEntryType } from '../types/changelog'

// ─── Sample data ──────────────────────────────────────────────────────────────

const SUBJECT_COMPLETE = {
  slug: 'analisi-matematica',
  title: 'Analisi Matematica I',
  code: 'MAT101',
  description: 'Limiti, derivate, integrali e serie numeriche. Fondamenti del calcolo differenziale e integrale per ingegneria.',
  year: 1,
  semester: 1,
  professor: 'Prof. Mario Rossi',
  cfu: 9,
  status: 'completo' as const,
  styleTags: ['teoria', 'calcolo'],
}

const SUBJECT_IN_CORSO = {
  slug: 'fisica-1',
  title: 'Fisica I',
  code: 'FIS101',
  description: 'Meccanica classica, termodinamica e onde. Corso introduttivo alla fisica per studenti di ingegneria.',
  year: 1,
  semester: 2,
  professor: 'Prof.ssa Lucia Bianchi',
  cfu: 6,
  status: 'in-corso' as const,
  styleTags: ['laboratorio'],
}

const SUBJECT_BOZZA = {
  slug: 'architettura-calcolatori',
  title: 'Architettura dei Calcolatori',
  code: 'INF201',
  description: 'Assembly, pipeline, cache e gerarchie di memoria. Struttura interna dei processori moderni.',
  year: 2,
  semester: 1,
  cfu: 9,
  status: 'bozza' as const,
}

const NOTE_WITH_CONTRIBUTORS = {
  slug: 'limiti-continuita',
  title: 'Limiti e Continuità',
  subject: 'analisi-matematica',
  type: 'riassunto' as const,
  tags: ['limiti', 'continuità'],
  excerpt: 'Definizione epsilon-delta, teoremi fondamentali sui limiti e classificazione delle discontinuità.',
  contributors: [
    { name: 'Marco', github: 'octocat' },
    { name: 'Sara' },
    { name: 'Luca', github: 'torvalds' },
  ],
}

const NOTE_SIMPLE = {
  slug: 'es-derivate',
  title: 'Esercizi sulle Derivate',
  subject: 'analisi-matematica',
  type: 'esercitazione' as const,
  tags: ['derivate'],
  excerpt: 'Raccolta di esercizi svolti su derivate di funzioni composte e regola di Leibniz.',
}

const CODE_SAMPLE_TS = `function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10)) // 55`

const CODE_SAMPLE_C = `#include <stdio.h>

int fibonacci(int n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void) {
  for (int i = 0; i < 10; i++)
    printf("%d ", fibonacci(i));
  return 0;
}`

// ─── SubjectPage mock data ────────────────────────────────────────────────────

const MOCK_CHANGELOG: { date: string; type: ChangelogEntryType; description: string }[] = [
  { date: '2025-04-18', type: 'aggiunta',   description: 'Aggiunti esercizi sulle serie di Fourier.' },
  { date: '2025-04-15', type: 'correzione', description: 'Corretta dimostrazione del teorema di Weierstrass.' },
  { date: '2025-04-10', type: 'revisione',  description: 'Rivisto capitolo sui limiti, aggiunti esempi.' },
  { date: '2025-04-05', type: 'nuovo',      description: 'Aggiunto riassunto sulle serie di potenze.' },
  { date: '2025-03-28', type: 'aggiunta',   description: 'Aggiunti esercizi d\'esame 2024 con soluzioni.' },
  { date: '2025-03-22', type: 'correzione', description: 'Corretta formula del teorema di Cauchy.' },
  { date: '2025-03-18', type: 'revisione',  description: 'Migliorata esposizione del metodo di sostituzione.' },
  { date: '2025-03-12', type: 'aggiunta',   description: 'Nuovi esercizi sugli sviluppi di Taylor.' },
  { date: '2025-03-08', type: 'nuovo',      description: 'Aggiunta sezione sulle forme indeterminate.' },
  { date: '2025-03-01', type: 'nuovo',      description: 'Aggiunto riassunto sulle equazioni differenziali.' },
  { date: '2025-02-24', type: 'correzione', description: 'Corretto errore nel calcolo del raggio di convergenza.' },
  { date: '2025-02-20', type: 'aggiunta',   description: 'Aggiunti controesempi per derivabilità vs continuità.' },
  { date: '2025-02-14', type: 'aggiunta',   description: 'Nuovi esercizi di riepilogo per il primo parziale.' },
  { date: '2025-02-10', type: 'revisione',  description: 'Riformulato il teorema del valor medio.' },
  { date: '2025-02-05', type: 'nuovo',      description: 'Aggiunta sezione sulle successioni di funzioni.' },
  { date: '2025-01-30', type: 'revisione',  description: 'Revisione generale del capitolo sugli integrali.' },
  { date: '2025-01-25', type: 'correzione', description: 'Corretti segni nella formula di integrazione per parti.' },
  { date: '2025-01-20', type: 'aggiunta',   description: 'Aggiunti esercizi su integrali impropri.' },
  { date: '2025-01-15', type: 'nuovo',      description: 'Prima versione del riassunto sulle derivate parziali.' },
  { date: '2025-01-10', type: 'revisione',  description: 'Rivista sezione su massimi e minimi relativi.' },
  { date: '2025-01-05', type: 'aggiunta',   description: 'Aggiunti grafici esplicativi per funzioni convesse.' },
  { date: '2024-12-20', type: 'nuovo',      description: 'Aggiunto schema riassuntivo criteri di convergenza.' },
  { date: '2024-12-15', type: 'correzione', description: 'Corretta enunciazione del teorema di Rolle.' },
  { date: '2024-12-10', type: 'aggiunta',   description: 'Aggiunta tabella delle primitive fondamentali.' },
  { date: '2024-12-05', type: 'revisione',  description: 'Revisione completa della sezione sui limiti notevoli.' },
  { date: '2024-11-28', type: 'nuovo',      description: 'Prima stesura del capitolo sulle serie numeriche.' },
  { date: '2024-11-20', type: 'aggiunta',   description: 'Aggiunti esercizi introduttivi con soluzioni commentate.' },
]

const MOCK_TABS = [
  { key: 'riassunto',     label: 'Teoria',         Icon: BookOpen,     count: 8  },
  { key: 'esercitazione', label: 'Esercizi',        Icon: FlaskConical, count: 12 },
  { key: 'appunti',       label: 'Strategie Esame', Icon: Target,       count: 2  },
  { key: 'extra',         label: 'Materiale Extra', Icon: Paperclip,    count: 3  },
]

const ENTRY_CFG: Record<string, { label: string; dot: string; text: string }> = {
  nuovo:      { label: 'Nuovo',      dot: 'bg-green-500',  text: 'text-green-600 dark:text-green-400' },
  aggiunta:   { label: 'Aggiunta',   dot: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-400'   },
  revisione:  { label: 'Revisione',  dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400' },
  correzione: { label: 'Correzione', dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400'     },
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DevShowcase() {
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [filterCollapsed, setFilterCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('riassunto')
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [changelogModalOpen, setChangelogModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          <span className="text-primary font-semibold">DEV</span> · Component Showcase
        </span>
        <ThemeToggle />
      </div>

      <div className="flex">
        {/* FilterDrawer on the left */}
        <FilterDrawer
          years={[1, 2, 3]}
          selectedYear={selectedYear}
          selectedSemester={selectedSemester}
          onSelectYear={(y) => { setSelectedYear(y); setSelectedSemester(null) }}
          onSelectSemester={(_, s) => setSelectedSemester(s)}
          mobileOpen={false}
          onMobileClose={() => {}}
          collapsed={filterCollapsed}
          onToggleCollapse={() => setFilterCollapsed((v) => !v)}
        />

        {/* Main content */}
        <main className="flex-1 px-8 py-8 space-y-10 max-w-3xl">

          <Section title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">MAT101</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge>
            </div>
          </Section>

          <Section title="SearchBar">
            <SearchBar value={search} onChange={setSearch} />
          </Section>

          <Section title="Breadcrumbs">
            <Breadcrumbs items={[
              { label: 'Analisi Matematica I', href: '/materia/analisi-matematica' },
              { label: 'Limiti e Continuità' },
            ]} />
          </Section>

          <Section title="SubjectCard">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SubjectCard
                subject={SUBJECT_COMPLETE}
                noteCounts={{ riassunto: 5, esercitazione: 3, altro: 1 }}
              />
              <SubjectCard
                subject={SUBJECT_IN_CORSO}
                noteCounts={{ riassunto: 2, esercitazione: 0, altro: 0 }}
              />
              <SubjectCard subject={SUBJECT_BOZZA} />
            </div>
          </Section>

          <Section title="SkeletonCard">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </Section>

          <Section title="NoteCard">
            <div className="space-y-2">
              <NoteCard note={NOTE_WITH_CONTRIBUTORS} subjectSlug="analisi-matematica" />
              <NoteCard note={NOTE_SIMPLE} subjectSlug="analisi-matematica" />
            </div>
          </Section>

          <Section title="Collapsible">
            <Collapsible title="Teorema di Lagrange" defaultOpen>
              <p className="text-muted-foreground">
                Se <em>f</em> è continua su [a,b] e derivabile in (a,b), allora esiste un punto
                c ∈ (a,b) tale che f'(c) = (f(b)−f(a)) / (b−a).
              </p>
            </Collapsible>
            <Collapsible title="Dimostrazione (chiusa di default)">
              <p className="text-muted-foreground">Contenuto nascosto di default.</p>
            </Collapsible>
          </Section>

          <Section title="CodeBlock">
            <CodeBlock className="language-typescript">{CODE_SAMPLE_TS}</CodeBlock>
            <CodeBlock className="language-c">{CODE_SAMPLE_C}</CodeBlock>
          </Section>

          {/* ── SubjectPage components ── */}

          <Section title="SubjectPage · Header">
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ background: 'radial-gradient(ellipse 55% 90% at 0% 50%, hsl(var(--primary)) 0%, transparent 70%)' }}
              />
              <div className="relative px-6 py-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="primary">MAT101</Badge>
                  <span className="text-xs text-muted-foreground bg-secondary border border-border/60 rounded px-2 py-0.5">Anno 1 · Sem. 1</span>
                  <span className="text-xs text-muted-foreground bg-secondary border border-border/60 rounded px-2 py-0.5">9 CFU</span>
                  <button
                    onClick={() => setChangelogOpen((v) => !v)}
                    className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-xs border transition-colors ${changelogOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary border-border/60 text-muted-foreground hover:text-foreground'}`}
                  >
                    <History size={11} />
                    Changelog
                    <ChevronDown size={10} className={`transition-transform duration-150 ${changelogOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <a href="#" className="ml-auto flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={12} /> Repository
                  </a>
                </div>
                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground leading-tight">Analisi Matematica I</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground/70"><User size={13} />Prof. Mario Rossi</p>
                <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Limiti, derivate, integrali e serie numeriche. Fondamenti del calcolo differenziale e integrale per ingegneria.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['teoria', 'calcolo', 'analisi'].map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="SubjectPage · Changelog (ultimi 5 + modal)">
            {changelogOpen && (
              <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
                <ol className="space-y-2">
                  {MOCK_CHANGELOG.slice(0, 5).map((e, i) => {
                    const cfg = ENTRY_CFG[e.type]
                    const date = (() => { const [y,m,d] = e.date.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}) })()
                    return (
                      <li key={i} className="flex flex-col gap-1">
                        <span className="text-sm text-foreground/85 leading-snug">{e.description}</span>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 text-[11px] font-medium ${cfg.text}`}>
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <time className="text-[11px] text-muted-foreground tabular-nums">{date}</time>
                        </div>
                      </li>
                    )
                  })}
                </ol>
                <button
                  onClick={() => setChangelogModalOpen(true)}
                  className="mt-3 pt-3 border-t border-border/60 w-full text-xs text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  Mostra tutte le {MOCK_CHANGELOG.length} modifiche →
                </button>
              </div>
            )}
            {!changelogOpen && (
              <p className="text-xs text-muted-foreground/50 italic">Apri il changelog dall'header sopra per visualizzarlo.</p>
            )}
          </Section>

          <Section title="SubjectPage · Tab bar">
            <div className="flex flex-wrap gap-2">
              {MOCK_TABS.map(({ key, label, Icon, count }) => {
                const active = activeTab === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium border transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary/50'}`}
                  >
                    <Icon size={13} />
                    {label}
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="SubjectPage · Note rows (Teoria)">
            <div className="divide-y divide-border/60">
              {[
                { title: 'Limiti e Continuità', excerpt: 'Definizione epsilon-delta, teoremi fondamentali e classificazione delle discontinuità.', tags: ['limiti', 'continuità', 'epsilon-delta'], readingTime: 12 },
                { title: 'Derivate', excerpt: 'Regole di derivazione, derivate di funzioni composte e teorema di Lagrange.', tags: ['derivate', 'lagrange'], readingTime: 8 },
                { title: 'Integrali', excerpt: 'Integrale di Riemann, metodo di sostituzione e integrazione per parti.', tags: ['integrali', 'riemann'], readingTime: 15 },
              ].map((note, i) => (
                <div key={i} className="group flex items-start justify-between gap-4 px-3 py-3.5 rounded-lg hover:bg-secondary/50 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug">{note.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1 leading-relaxed">{note.excerpt}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-xs text-muted-foreground/60 tabular-nums">{note.readingTime} min</span>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="SubjectPage · Esercizi cards">
            <div className="space-y-2">
              {[
                { title: 'Calcolo del limite di successioni', tags: ['esame'], difficulty: 2, hasSolution: true },
                { title: 'Studio di funzione completo',       tags: ['aula'], difficulty: 3, hasSolution: false },
                { title: 'Quiz teoria dei limiti',            tags: ['quiz'], difficulty: 1, hasSolution: true },
              ].map((ex, i) => {
                const typeTag = ex.tags[0]
                const typeCfg: Record<string, { label: string; className: string }> = {
                  esame: { label: 'Esame', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
                  aula:  { label: 'Aula',  className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                  quiz:  { label: 'Quiz',  className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                }
                return (
                  <div key={i} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug">{ex.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <div className="flex gap-1">
                          {[1,2,3].map((d) => <span key={d} className={`h-1.5 w-1.5 rounded-full ${d <= ex.difficulty ? 'bg-primary' : 'bg-border'}`} />)}
                        </div>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeCfg[typeTag].className}`}>{typeCfg[typeTag].label}</span>
                        {ex.hasSolution
                          ? <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400"><CheckCircle size={11} /> Soluzione</span>
                          : <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Circle size={11} /> Solo risultato</span>
                        }
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                )
              })}
            </div>
          </Section>

        </main>
      </div>

      {changelogModalOpen && (
        <ChangelogModal
          entries={MOCK_CHANGELOG}
          onClose={() => setChangelogModalOpen(false)}
        />
      )}
    </div>
  )
}
