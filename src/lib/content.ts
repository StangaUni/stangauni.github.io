/**
 * Single content layer for the whole app.
 *
 * - Subject / changelog / note frontmatter: eager (sync, available immediately)
 * - Note MDX body: lazy (loaded only when rendering a note page)
 *
 * Content lives outside src/ under /content/materie/<slug>/
 */

import type { Subject } from '@/types/subject'
import type { Note } from '@/types/note'
import type { SubjectChangelog, ChangelogEntry } from '@/types/changelog'

type MdxModule = {
  frontmatter: Record<string, unknown>
  default: React.ComponentType<{ components?: Record<string, React.ComponentType> }>
}

type EagerModules = Record<string, MdxModule>
type LazyModules = Record<string, () => Promise<MdxModule>>

// ─── Globs (only place in the codebase that touches import.meta.glob) ────────

const subjectModules = import.meta.glob<MdxModule>(
  '../../content/materie/**/_subject.mdx',
  { eager: true },
) as EagerModules

const changelogModules = import.meta.glob<MdxModule>(
  '../../content/materie/**/_changelog.mdx',
  { eager: true },
) as EagerModules

/** All note .mdx (including _subject / _changelog — filtered below) */
const noteBodyModules = import.meta.glob<MdxModule>(
  '../../content/materie/**/*.mdx',
) as LazyModules

const noteMetaModules = import.meta.glob<MdxModule>(
  '../../content/materie/**/*.mdx',
  { eager: true },
) as EagerModules

// ─── Path helpers ────────────────────────────────────────────────────────────

function subjectSlugFromPath(path: string): string {
  // .../content/materie/<slug>/_subject.mdx
  const match = path.match(/materie\/([^/]+)\//)
  if (!match) throw new Error(`Cannot parse subject slug from path: ${path}`)
  return match[1]
}

function noteSlugFromPath(path: string): string {
  const file = path.split('/').pop() ?? ''
  return file.replace(/\.mdx$/, '')
}

function isMetaFile(path: string): boolean {
  return path.endsWith('_subject.mdx') || path.endsWith('_changelog.mdx')
}

// ─── Subjects ────────────────────────────────────────────────────────────────

function buildSubjects(): Subject[] {
  return Object.entries(subjectModules)
    .map(([path, mod]) => {
      const slug = subjectSlugFromPath(path)
      return { slug, ...mod.frontmatter } as Subject
    })
    .filter((s) => !s.hidden)
    .sort((a, b) => a.year - b.year || a.semester - b.semester)
}

const ALL_SUBJECTS = buildSubjects()

export function getAllSubjects(): Subject[] {
  return ALL_SUBJECTS
}

export function getSubject(slug: string): Subject | undefined {
  return ALL_SUBJECTS.find((s) => s.slug === slug)
}

// ─── Notes (metadata) ────────────────────────────────────────────────────────

function buildNotes(): Note[] {
  return Object.entries(noteMetaModules)
    .filter(([path]) => !isMetaFile(path))
    .map(([path, mod]) => {
      const slug = noteSlugFromPath(path)
      const subject = subjectSlugFromPath(path)
      return { slug, subject, ...mod.frontmatter } as Note
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

const ALL_NOTES = buildNotes()

export function getAllNotes(): Note[] {
  return ALL_NOTES
}

export function getNotesBySubject(subjectSlug: string): Note[] {
  return ALL_NOTES.filter((n) => n.subject === subjectSlug)
}

export function getNote(subjectSlug: string, noteSlug: string): Note | undefined {
  return ALL_NOTES.find((n) => n.subject === subjectSlug && n.slug === noteSlug)
}

// ─── Note body (lazy) ────────────────────────────────────────────────────────

export async function loadNoteModule(
  subjectSlug: string,
  noteSlug: string,
): Promise<MdxModule | null> {
  const key = Object.keys(noteBodyModules).find((p) => {
    if (isMetaFile(p)) return false
    return p.includes(`/materie/${subjectSlug}/`) && p.endsWith(`/${noteSlug}.mdx`)
  })
  if (!key) return null
  return noteBodyModules[key]()
}

// ─── Changelog ───────────────────────────────────────────────────────────────

function buildChangelogs(): Record<string, SubjectChangelog> {
  const map: Record<string, SubjectChangelog> = {}
  for (const [path, mod] of Object.entries(changelogModules)) {
    const subject = subjectSlugFromPath(path)
    const entries = (mod.frontmatter.entries ?? []) as ChangelogEntry[]
    map[subject] = { subject, entries }
  }
  return map
}

const ALL_CHANGELOGS = buildChangelogs()

export function getChangelog(subjectSlug: string): SubjectChangelog | null {
  return ALL_CHANGELOGS[subjectSlug] ?? null
}

// ─── Derived helpers ─────────────────────────────────────────────────────────

export type NoteTypeCounts = {
  riassunto: number
  esercitazione: number
  altro: number
}

export function getNoteCountsBySubject(): Record<string, NoteTypeCounts> {
  const subjectMap = new Map(ALL_SUBJECTS.map((s) => [s.slug, s]))
  const map: Record<string, NoteTypeCounts> = {}

  for (const n of ALL_NOTES) {
    const subject = subjectMap.get(n.subject)
    if (subject?.hiddenSections?.includes(n.type)) continue
    if (!map[n.subject]) map[n.subject] = { riassunto: 0, esercitazione: 0, altro: 0 }
    if (n.type === 'riassunto') map[n.subject].riassunto++
    else if (n.type === 'esercitazione') map[n.subject].esercitazione++
    else map[n.subject].altro++
  }
  return map
}
