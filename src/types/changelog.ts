export type ChangelogEntryType = 'aggiunta' | 'revisione' | 'correzione' | 'nuovo'

export interface ChangelogEntry {
  date: string
  description: string
  type?: ChangelogEntryType
}

export interface SubjectChangelog {
  subject: string
  entries: ChangelogEntry[]
}
