# StangaUni

[![Deploy](https://github.com/StangaUni/stangauni.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/StangaUni/stangauni.github.io/actions/workflows/deploy.yml)

Raccolta open source di appunti universitari, costruita con React + MDX e pubblicata su GitHub Pages.

**[stangauni.github.io](https://stangauni.github.io)**

## Sviluppo locale

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # compila in dist/
npm run preview    # serve dist/ in locale
```

Requisiti: **Node.js ≥ 18**, **npm ≥ 9**.

## Struttura del contenuto

Il contenuto didattico vive **fuori da `src/`**:

```
content/materie/
└── <slug-materia>/
    ├── _subject.mdx          # metadati della materia
    ├── _changelog.mdx        # cronologia modifiche
    └── 01-nome-nota.mdx      # nota (riassunto, esercizi, …)
```

Il layer dati è centralizzato in `src/lib/content.ts`:

- metadati (`_subject`, `_changelog`, frontmatter note) caricati in modo **eager**
- corpo MDX delle note caricato in modo **lazy** solo alla navigazione

## Documentazione

| Documento | Contenuto |
|-----------|-----------|
| [docs/index.md](docs/index.md) | Indice developer |
| [docs/setup.md](docs/setup.md) | Setup, comandi, deploy |
| [docs/struttura.md](docs/struttura.md) | Albero del progetto e routing |
| [docs/materie.md](docs/materie.md) | Come aggiungere una materia |
| [docs/note.md](docs/note.md) | Come aggiungere una nota |
| [docs/componenti-mdx.md](docs/componenti-mdx.md) | Componenti MDX disponibili |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Linee guida per i contributi |

## Stack

React · TypeScript · Vite · MDX · Tailwind CSS · KaTeX · Framer Motion · GitHub Pages

## Licenza

[CC BY-NC 4.0](LICENSE) — Attribution-NonCommercial 4.0 International.
