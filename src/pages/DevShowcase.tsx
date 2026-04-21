import { useState } from 'react'
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

        </main>
      </div>
    </div>
  )
}
