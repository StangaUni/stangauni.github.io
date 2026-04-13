import { Link } from 'react-router-dom'
import { BookOpen, Github, GraduationCap, ExternalLink } from 'lucide-react'
import { SEO } from '../components/ui/SEO'
import { useSubjects } from '../hooks/useSubjects'

export function InfoPage() {
  const { subjects, loading } = useSubjects()
  const subjectsWithGithub = subjects.filter((s) => s.github && !s.hidden)

  return (
    <>
      <SEO title="Info" description="Informazioni sul progetto StangaUni." />

      <div className="max-w-2xl">
        <h1 className="font-sans text-3xl font-bold text-foreground mb-2">
          Cos'è StangaUni?
        </h1>
        <p className="text-muted-foreground mb-8">
          Una raccolta open source di appunti universitari.
        </p>

        <div className="space-y-6">
          <section className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen size={18} className="text-primary" />
              </div>
              <h2 className="font-sans font-semibold text-foreground">Materiale disponibile</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trovi riassunti, esercizi svolti, appunti di lezione e strategie d'esame per ogni
              materia. Il materiale è organizzato per anno e semestre.
            </p>
          </section>

          <section className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <GraduationCap size={18} className="text-primary" />
              </div>
              <h2 className="font-sans font-semibold text-foreground">Chi lo cura</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il progetto nasce per condividere gli appunti presi durante il corso di laurea.
              Tutto il materiale è frutto di studio personale e potrebbe contenere imprecisioni.
            </p>
          </section>

          {/* Repository per materia */}
          <section className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Github size={18} className="text-primary" />
              </div>
              <h2 className="font-sans font-semibold text-foreground">Repository delle materie</h2>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="skeleton h-12 rounded-lg" />
                ))}
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
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/30 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/materia/${subject.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {subject.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                          {repoPath}
                        </p>
                      </div>
                      <a
                        href={subject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Apri su GitHub"
                        className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={13} />
                        GitHub
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Github size={18} className="text-primary" />
              </div>
              <h2 className="font-sans font-semibold text-foreground">Contribuire</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il sito è open source. Se vuoi correggere un errore o aggiungere materiale,
              apri una pull request su GitHub.
            </p>
            <a
              href="https://github.com/stangauni/stangauni.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Github size={14} />
              stangauni/stangauni.github.io
            </a>
          </section>
        </div>
      </div>
    </>
  )
}
