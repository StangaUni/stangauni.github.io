import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-primary/20 font-mono">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Torna alla home
      </Link>
    </div>
  )
}
