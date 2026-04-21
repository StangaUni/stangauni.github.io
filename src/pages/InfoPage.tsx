import { Link } from 'react-router-dom'
import {
  BookOpen, ExternalLink, FileText, FlaskConical,
  Github, GraduationCap, Heart, Target, Users,
} from 'lucide-react'
import type { Contributor } from '../types/note'
import { SEO } from '../components/ui/SEO'
import { Badge } from '../components/ui/Badge'
import { useSubjects } from '../hooks/useSubjects'
import { useNotes } from '../hooks/useNotes'

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon, title, children,
}: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Type row ─────────────────────────────────────────────────────────────────

function TypeRow({
  icon: Icon, label, colorClass, count,
}: { icon: React.ElementType; label: string; colorClass: string; count: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className={`flex items-center gap-2 text-sm ${colorClass}`}>
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <span className="text-xs font-mono text-muted-foreground tabular-nums">{count} note</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InfoPage() {
  const { subjects, loading: loadingSubjects } = useSubjects()
  const { notes, loading: loadingNotes } = useNotes()

  const visibleSubjects = subjects.filter((s) => !s.hidden)
  const subjectsWithGithub = visibleSubjects.filter((s) => s.github)

  const allContributors: Contributor[] = []
  const seen = new Set<string>()
  for (const note of notes) {
    for (const c of note.contributors ?? []) {
      const key = c.github ?? c.name
      if (!seen.has(key)) { seen.add(key); allContributors.push(c) }
    }
  }

  const notesByType = {
    riassunto:     notes.filter((n) => n.type === 'riassunto').length,
    esercitazione: notes.filter((n) => n.type === 'esercitazione').length,
    altro:         notes.filter((n) => n.type === 'appunti' || n.type === 'extra').length,
  }

  const loading = loadingSubjects || loadingNotes

  return (
    <>
      <SEO title="Info" description="Informazioni sul progetto StangaUni." />

      <div className="max-w-4xl mx-auto w-full space-y-10 py-4">

        {/* ── Hero ── */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden px-8 py-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 10% 50%, hsl(var(--primary)) 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={20} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">StangaUni</span>
            </div>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
              Appunti universitari,<br />
              <span className="text-primary">open source.</span>
            </h1>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              Una raccolta di riassunti, esercizi e appunti di lezione organizzata per anno
              e semestre. Libera, aggiornata, e aperta a contributi.
            </p>

          </div>
        </div>

        {/* ── Feature grid ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FeatureCard icon={BookOpen} title="Materiale disponibile">
            Riassunti scritti a mano, esercizi svolti con soluzioni commentate, appunti
            di lezione e strategie d'esame. Tutto organizzato per materia, anno e semestre.
          </FeatureCard>

          <FeatureCard icon={Users} title="Chi lo cura">
            Il progetto nasce per condividere gli appunti presi durante il corso di laurea.
            Il materiale è frutto di studio personale — segnala errori o imprecisioni aprendo
            una issue su GitHub.
          </FeatureCard>
        </div>

        {/* ── Contributors ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
              <Heart size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Contributori</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Persone che hanno contribuito al materiale del sito.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-8 w-28 rounded-full" />)}
            </div>
          ) : allContributors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun contributore registrato.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allContributors.map((c, i) => {
                const avatar = c.github ? `https://github.com/${c.github}.png?size=32` : null
                const inner = (
                  <span className="flex items-center gap-2">
                    {avatar
                      ? <img src={avatar} alt={c.name} className="w-5 h-5 rounded-full border border-border object-cover" />
                      : <span className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-semibold text-muted-foreground">{c.name[0].toUpperCase()}</span>
                    }
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </span>
                )
                return c.github ? (
                  <a
                    key={i}
                    href={`https://github.com/${c.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 pl-1 pr-3 py-1 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {inner}
                  </a>
                ) : (
                  <span key={i} className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 pl-1 pr-3 py-1">
                    {inner}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Note breakdown ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Distribuzione delle note</h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-9 rounded-lg" />)}
            </div>
          ) : (
            <div>
              <TypeRow icon={BookOpen}     label="Teoria / riassunti"    colorClass="text-primary"                          count={notesByType.riassunto} />
              <TypeRow icon={FlaskConical} label="Pratica / esercitazioni" colorClass="text-emerald-600 dark:text-emerald-400" count={notesByType.esercitazione} />
              <TypeRow icon={Target}       label="Appunti & extra"        colorClass="text-muted-foreground"                 count={notesByType.altro} />
            </div>
          )}
        </div>

        {/* ── Repository ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
              <Github size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Repository delle materie</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ogni materia ha un repo dedicato con i file sorgente delle note.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
            </div>
          ) : subjectsWithGithub.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun repository collegato.</p>
          ) : (
            <div className="space-y-2">
              {subjectsWithGithub.map((subject) => {
                const repoPath = subject.github!.replace('https://github.com/', '')
                return (
                  <div
                    key={subject.slug}
                    className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge variant="primary">{subject.code}</Badge>
                      <div className="min-w-0">
                        <Link
                          to={`/materia/${subject.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors leading-tight block truncate"
                        >
                          {subject.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5 truncate">
                          {repoPath}
                        </p>
                      </div>
                    </div>
                    <a
                      href={subject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Apri su GitHub"
                      className="shrink-0 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground border border-transparent hover:border-border hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <ExternalLink size={12} />
                      GitHub
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Contribute CTA ── */}
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-primary" />
            <h2 className="font-semibold text-foreground">Vuoi contribuire?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hai trovato un errore o vuoi aggiungere materiale? Apri una pull request
            sul repository della materia in questione. Le PR accettate vengono integrate
            nel sito manualmente — così il materiale pubblicato resta controllato e coerente.
          </p>
        </div>

      </div>
    </>
  )
}
