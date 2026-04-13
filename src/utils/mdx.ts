import type { Subject } from '../types/subject'
import type { Note } from '../types/note'

type MdxModule = {
  frontmatter: Record<string, unknown>
  default: React.ComponentType
}

type GlobModules = Record<string, () => Promise<MdxModule>>

export function slugFromPath(path: string): string {
  return path
    .split('/')
    .pop()!
    .replace(/\.mdx$/, '')
}

export function subjectSlugFromPath(path: string): string {
  // path like: ../content/materie/programmazione/_subject.mdx
  const parts = path.split('/')
  // folder before _subject.mdx
  return parts[parts.length - 2]
}

export function noteSubjectFromPath(path: string): string {
  // path like: ../content/materie/programmazione/01-intro.mdx
  const parts = path.split('/')
  return parts[parts.length - 2]
}

export async function loadAllSubjects(modules: GlobModules): Promise<Subject[]> {
  const entries = Object.entries(modules)
  const subjects = await Promise.all(
    entries.map(async ([path, loader]) => {
      const mod = await loader()
      const slug = subjectSlugFromPath(path)
      return { slug, ...mod.frontmatter } as Subject
    })
  )
  return subjects
    .filter((s) => !s.hidden)
    .sort((a, b) => a.year - b.year || a.semester - b.semester)
}

export async function loadAllNotes(
  modules: GlobModules,
  subjectSlug?: string
): Promise<Note[]> {
  const entries = Object.entries(modules).filter(
    ([path]) => !path.endsWith('_subject.mdx')
  )
  const notes = await Promise.all(
    entries.map(async ([path, loader]) => {
      const mod = await loader()
      const slug = slugFromPath(path)
      const subject = noteSubjectFromPath(path)
      return { slug, subject, ...mod.frontmatter } as Note
    })
  )
  const filtered = subjectSlug
    ? notes.filter((n) => n.subject === subjectSlug)
    : notes
  return filtered.sort((a, b) => a.slug.localeCompare(b.slug))
}
