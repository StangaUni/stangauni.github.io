import { useEffect, useState } from 'react'
import { loadAllSubjects } from '../utils/mdx'
import type { Subject } from '../types/subject'

const mdxModules = import.meta.glob('../content/materie/**/_subject.mdx')

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllSubjects(mdxModules as Parameters<typeof loadAllSubjects>[0]).then((s) => {
      setSubjects(s)
      setLoading(false)
    })
  }, [])

  return { subjects, loading }
}
