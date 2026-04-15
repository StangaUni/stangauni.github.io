export type NoteType = 'riassunto' | 'esercitazione' | 'appunti' | 'extra'

export interface Note {
  slug: string
  title: string
  subject: string
  type: NoteType
  date?: string
  tags: string[]
  excerpt?: string
  readingTime?: number
  difficulty?: 1 | 2 | 3
  hasSolution?: boolean
  week?: number
  section?: string
}
