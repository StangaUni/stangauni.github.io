import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Note } from '../../types/note'

interface NoteCardProps {
  note: Note
  subjectSlug: string
}

export function NoteCard({ note, subjectSlug }: NoteCardProps) {
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
      </div>
      <ChevronRight
        size={14}
        className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  )
}
