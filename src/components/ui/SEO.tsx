import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
}

const SITE_NAME = 'StangaUni'
const DEFAULT_DESC = 'Appunti universitari — riassunti, esercizi e materiale di studio.'

export function SEO({ title, description = DEFAULT_DESC }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
