export type SubjectStatus = 'completo' | 'in-corso' | 'revisionato' | 'bozza'

export interface Subject {
  slug: string
  title: string
  code: string
  description: string
  year: number
  semester: number
  professor?: string
  github?: string
  status?: SubjectStatus
  styleTags?: string[]
  cfu?: number
  hidden?: boolean
  hiddenSections?: import('./note').NoteType[]
}
