import { useEffect, useState } from 'react'
import { loadAllNotes } from '../utils/mdx'
import type { Note } from '../types/note'

const mdxModules = import.meta.glob('../content/materie/**/*.mdx')

export function useNotes(subjectSlug?: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadAllNotes(mdxModules as Parameters<typeof loadAllNotes>[0], subjectSlug).then((n) => {
      setNotes(n)
      setLoading(false)
    })
  }, [subjectSlug])

  return { notes, loading }
}
