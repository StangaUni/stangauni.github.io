import { useEffect, useState } from 'react'
import { loadSubjectChangelog } from '../utils/mdx'
import type { SubjectChangelog } from '../types/changelog'

const mdxModules = import.meta.glob('../content/materie/**/_changelog.mdx')

export function useChangelog(subjectSlug: string | undefined) {
  const [changelog, setChangelog] = useState<SubjectChangelog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subjectSlug) { setLoading(false); return }
    setLoading(true)
    loadSubjectChangelog(
      mdxModules as Parameters<typeof loadSubjectChangelog>[0],
      subjectSlug
    ).then((c) => {
      setChangelog(c)
      setLoading(false)
    })
  }, [subjectSlug])

  return { changelog, loading }
}
