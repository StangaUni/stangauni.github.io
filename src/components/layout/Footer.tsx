export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} StangaUni — Appunti universitari open source
        </p>
        <a
          href="https://github.com/stangauni/stangauni.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
