import { Link } from 'react-router-dom'
import { BookOpen, FlaskConical, Target } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Subject, SubjectStatus } from '../../types/subject'

export interface NoteTypeCounts {
  riassunto: number
  esercitazione: number
  altro: number
}

interface SubjectCardProps {
  subject: Subject
  noteCounts?: NoteTypeCounts
}

const STATUS_CONFIG: Record<SubjectStatus, { label: string; className: string }> = {
  completo:    { label: 'Completo',    className: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400'  },
  'in-corso':  { label: 'In corso',    className: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400'   },
  revisionato: { label: 'Revisionato', className: 'bg-sky-100    text-sky-700    dark:bg-sky-900/30    dark:text-sky-400'    },
  bozza:       { label: 'Bozza',       className: 'bg-gray-100   text-gray-500   dark:bg-gray-800      dark:text-gray-400'   },
}

function TypeIndicator({
  icon: Icon, label, count, colorClass,
}: { icon: React.ElementType; label: string; count: number; colorClass: string }) {
  return (
    <div className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium ${colorClass}`}>
      <Icon size={12} />
      <span>{label}</span>
      <span className="text-[10px] opacity-50 font-normal tabular-nums">{count}</span>
    </div>
  )
}

export function SubjectCard({ subject, noteCounts }: SubjectCardProps) {
  const c = noteCounts ?? { riassunto: 0, esercitazione: 0, altro: 0 }
  const hasContent = c.riassunto > 0 || c.esercitazione > 0 || c.altro > 0
  const typesPresent = [c.riassunto > 0, c.esercitazione > 0, c.altro > 0].filter(Boolean).length
  const href = `/materia/${subject.slug}`

  const derivedStatus: SubjectStatus =
    typesPresent === 3 ? 'completo' : typesPresent > 0 ? 'in-corso' : 'bozza'
  const status = subject.status ?? derivedStatus
  const statusCfg = STATUS_CONFIG[status]

  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden h-full transition-shadow duration-200 hover:shadow-md hover:shadow-black/[0.06]">
      <Link to={href} className="flex flex-col gap-2.5 p-5 flex-1">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="primary">{subject.code}</Badge>
            {subject.cfu && (
              <span className="text-[10px] font-medium text-muted-foreground">
                {subject.cfu} CFU
              </span>
            )}
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-sans font-semibold text-[0.95rem] text-foreground group-hover:text-primary transition-colors leading-snug">
          {subject.title}
        </h2>

        {/* Professor */}
        {subject.professor && (
          <p className="text-xs text-muted-foreground/70 -mt-1 leading-snug">
            {subject.professor}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {subject.description}
        </p>

        {/* Style tags */}
        {subject.styleTags && subject.styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {subject.styleTags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Type indicators */}
      {hasContent && (
        <div className="flex border-t border-border divide-x divide-border">
          {!subject.hiddenSections?.includes('riassunto') && c.riassunto > 0 && (
            <TypeIndicator icon={BookOpen}     label="Teoria"  count={c.riassunto}     colorClass="text-primary/80" />
          )}
          {!subject.hiddenSections?.includes('esercitazione') && c.esercitazione > 0 && (
            <TypeIndicator icon={FlaskConical} label="Pratica" count={c.esercitazione} colorClass="text-emerald-600 dark:text-emerald-400" />
          )}
          {!(subject.hiddenSections?.includes('appunti') && subject.hiddenSections?.includes('extra')) && c.altro > 0 && (
            <TypeIndicator icon={Target}       label="Altro"   count={c.altro}         colorClass="text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  )
}
