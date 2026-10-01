# Struttura del progetto

```
.
├── content/                       # Contenuto didattico (fuori da src/)
│   └── materie/
│       └── <slug-materia>/
│           ├── _subject.mdx       # Metadati materia (solo frontmatter)
│           ├── _changelog.mdx     # Changelog materia (solo frontmatter)
│           └── <slug-nota>.mdx    # Nota (riassunto, esercizi, …)
│
├── public/                        # Asset statici serviti così come sono
│   ├── 404.html                   # Redirect SPA per GitHub Pages
│   ├── favicon.svg
│   └── assets/                    # Immagini / SVG per materia
│
├── src/
│   ├── App.tsx                    # Router principale
│   ├── main.tsx                   # Entry point React + tema iniziale
│   │
│   ├── lib/
│   │   └── content.ts             # UNICO punto di accesso ai dati MDX
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── SubjectPage.tsx
│   │   ├── NotePage.tsx
│   │   ├── InfoPage.tsx
│   │   ├── NotFound.tsx
│   │   └── DevShowcase.tsx        # Solo in dev: /_dev
│   │
│   ├── components/
│   │   ├── layout/                # Header, Footer, Layout, Sidebar
│   │   ├── mdx/                   # CodeBlock, Collapsible, ThemedImage
│   │   ├── note/                  # Breadcrumbs, NoteCard, TableOfContents
│   │   ├── home/                  # SubjectCard, FilterDrawer, SearchBar, …
│   │   └── ui/                    # Badge, SEO, ThemeToggle
│   │
│   ├── types/                     # Subject, Note, Changelog
│   └── styles/
│       └── index.css              # Tailwind + temi + prose-academic
│
├── docs/                          # Documentazione developer
├── .github/                       # Actions, issue/PR templates
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig*.json
```

## Routing

| URL | Componente | Descrizione |
|---|---|---|
| `/` | `Home` | Lista di tutte le materie |
| `/materia/:subjectSlug` | `SubjectPage` | Note della materia, divise per tipo |
| `/materia/:subjectSlug/:noteSlug` | `NotePage` | Nota singola renderizzata |
| `/info` | `InfoPage` | Info progetto + repository collegati |
| `/_dev` | `DevShowcase` | Showcase componenti (solo `import.meta.env.DEV`) |

## Come vengono caricati i dati

Nessun backend. Tutto è file-system statico risolto da Vite.

L’**unico** modulo che usa `import.meta.glob` è `src/lib/content.ts`:

```ts
// Metadati — eager (sincroni, disponibili subito)
import.meta.glob('../../content/materie/**/_subject.mdx', { eager: true })
import.meta.glob('../../content/materie/**/_changelog.mdx', { eager: true })
import.meta.glob('../../content/materie/**/*.mdx', { eager: true })  // frontmatter note

// Corpo nota — lazy (Promise, solo su NotePage)
import.meta.glob('../../content/materie/**/*.mdx')
```

API pubbliche:

| Funzione | Uso |
|----------|-----|
| `getAllSubjects()` | Lista materie (Home, filtri) |
| `getSubject(slug)` | Una materia |
| `getAllNotes()` / `getNotesBySubject(slug)` | Metadati note |
| `getNote(subject, note)` | Metadati di una nota |
| `loadNoteModule(subject, note)` | Body MDX lazy |
| `getChangelog(slug)` | Changelog materia |
| `getNoteCountsBySubject()` | Contatori per card Home |

Ordinamento materie: `year` poi `semester`.  
Ordinamento note: alfabetico per slug (prefisso numerico consigliato).
