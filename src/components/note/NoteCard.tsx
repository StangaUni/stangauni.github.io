import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Note } from '../../types/note'

interface NoteCardProps {
  note: Note
  subjectSlug: string
}

export function NoteCard({ note, subjectSlug }: NoteCardProps) {
  const contributors = note.contributors ?? []

  return (
    <Link
      to={`/materia/${subjectSlug}/${note.slug}`}
      className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-foreground group-hover:text-primary transition-colors text-sm">
          {note.title}
        </p>
        {note.excerpt && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{note.excerpt}</p>
        )}
        {contributors.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex -space-x-1">
              {contributors.slice(0, 4).map((c, i) => (
                c.github ? (
                  <img
                    key={i}
                    src={`https://github.com/${c.github}.png?size=24`}
                    alt={c.name}
                    title={c.name}
                    className="w-4 h-4 rounded-full border border-background object-cover"
                  />
                ) : (
                  <span
                    key={i}
                    title={c.name}
                    className="w-4 h-4 rounded-full border border-background bg-secondary flex items-center justify-center text-[8px] font-semibold text-muted-foreground"
                  >
                    {c.name[0].toUpperCase()}
                  </span>
                )
              ))}
            </div>
            {contributors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{contributors.length - 4}</span>
            )}
          </div>
        )}
      </div>
      <ChevronRight
        size={14}
        className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  )
}
