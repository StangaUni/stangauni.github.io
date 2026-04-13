# Struttura del progetto

```
src/
├── App.tsx                        # Router principale
├── main.tsx                       # Entry point React
│
├── content/
│   └── materie/
│       └── <slug-materia>/
│           ├── _subject.mdx       # Metadati della materia (frontmatter only)
│           └── <slug-nota>.mdx    # Nota (riassunto, esercizi, ecc.)
│
├── pages/
│   ├── Home.tsx                   # Lista materie
│   ├── SubjectPage.tsx            # Pagina materia con tab per tipo di nota
│   ├── NotePage.tsx               # Pagina singola nota
│   ├── InfoPage.tsx               # Pagina informazioni / repository
│   └── NotFound.tsx
│
├── components/
│   ├── layout/
│   │   ├── Layout.tsx             # Shell con sidebar e main
│   │   └── Sidebar.tsx            # Aside sticky (lg+)
│   ├── mdx/
│   │   ├── CodeBlock.tsx          # Blocchi codice con copia
│   │   ├── Collapsible.tsx        # Sezione espandibile
│   │   ├── ThemedImage.tsx        # Immagine light/dark
│   │   └── index.ts               # Re-export dei componenti MDX
│   ├── note/
│   │   ├── Breadcrumbs.tsx
│   │   ├── NoteCard.tsx
│   │   └── TableOfContents.tsx    # TOC laterale con collapse per H3
│   ├── home/
│   │   ├── SearchBar.tsx
│   │   └── SubjectCard.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── SEO.tsx
│       └── ThemeToggle.tsx
│
├── hooks/
│   ├── useSubjects.ts             # Carica tutti i _subject.mdx
│   └── useNotes.ts                # Carica le note (filtrabili per materia)
│
├── types/
│   ├── subject.ts                 # Interfaccia Subject
│   └── note.ts                    # Interfaccia Note + NoteType
│
├── utils/
│   └── mdx.ts                     # loadAllSubjects, loadAllNotes, helper slug
│
└── styles/
    └── index.css                  # Tailwind + custom classes
```

## Routing

| URL | Componente | Descrizione |
|---|---|---|
| `/` | `Home` | Lista di tutte le materie |
| `/materia/:subjectSlug` | `SubjectPage` | Note della materia, divise per tipo |
| `/materia/:subjectSlug/:noteSlug` | `NotePage` | Nota singola renderizzata |
| `/info` | `InfoPage` | Info progetto + repository GitHub collegati |

## Come vengono caricati i dati

Nessun backend. Tutto è file-system statico risolto a compile-time da Vite:

```ts
// useSubjects.ts
const mdxModules = import.meta.glob('../content/materie/**/_subject.mdx')

// useNotes.ts
const mdxModules = import.meta.glob('../content/materie/**/*.mdx')
```

Vite converte questi glob in un oggetto `{ path: () => Promise<Module> }`.
`loadAllSubjects` e `loadAllNotes` in `utils/mdx.ts` importano ogni modulo in parallelo,
estraggono il frontmatter esportato come `frontmatter` e derivano lo slug dal path.

L'ordinamento predefinito delle materie è per `year` poi `semester`.
L'ordinamento delle note è alfabetico per slug (che inizia con numero progressivo).
