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

## Aggiungere contenuto

La struttura del contenuto è:

```
src/content/materie/
└── <slug-materia>/
    ├── _subject.mdx          # metadati della materia
    ├── _changelog.mdx        # cronologia modifiche
    └── 01-nome-nota.mdx      # nota
```

**Nuova materia** — crea la cartella e il file `_subject.mdx` con il frontmatter:

```yaml
---
title: "Nome Materia [2025/2026]"
code: "INF/01"
description: "Descrizione breve."
year: 1
semester: 1
professor: "Cognome Nome"
cfu: 9
status: "in-corso"
github: "https://github.com/StangaUni/<repo>"   # opzionale
---
```

**Nuova nota** — crea un file `.mdx` nella cartella della materia:

```yaml
---
title: "Titolo"
type: "riassunto"          # riassunto | esercitazione | appunti | extra
excerpt: "Anteprima nella lista."
contributors:
  - name: "Nome Cognome"
    github: "username"
---
```

Per la documentazione completa vedi [`docs/`](docs/index.md).

## Stack

React · TypeScript · Vite · MDX · Tailwind CSS · KaTeX · GitHub Pages

## Licenza

[CC BY-NC 4.0](LICENSE)
