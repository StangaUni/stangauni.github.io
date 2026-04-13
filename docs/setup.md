# Setup e avvio

## Requisiti

- Node.js ≥ 18
- npm ≥ 9

## Installazione

```bash
npm install
```

## Comandi

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il dev server su `http://localhost:5173` |
| `npm run build` | Compila TypeScript e genera `dist/` |
| `npm run preview` | Serve `dist/` in locale per verificare la build |

## Stack

| Layer | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 6 |
| Contenuto | MDX 3 (`@mdx-js/rollup`) |
| Stili | Tailwind CSS 3 + `@tailwindcss/typography` |
| Routing | React Router 6 |
| Animazioni | Framer Motion |
| Math | KaTeX (`remark-math` + `rehype-katex`) |
| Deploy | GitHub Pages (branch `gh-pages`) |

## Note sulla pipeline MDX

Vite processa i file `.mdx` tramite il plugin `@mdx-js/rollup` configurato in `vite.config.ts`.
I plugin attivi nella pipeline sono, nell'ordine:

1. `remark-frontmatter` — fa sì che il frontmatter YAML non venga emesso come contenuto
2. `remark-mdx-frontmatter` — esporta il frontmatter come named export `frontmatter`
3. `remark-gfm` — tabelle, task list, autolink, strikethrough
4. `remark-math` — sintassi `$...$` e `$$...$$` per le formule
5. `rehype-slug` — aggiunge `id` automatici agli heading (usati dal TableOfContents)
6. `rehype-katex` — renderizza le formule math in HTML

I file `.mdx` vengono caricati lazy con `import.meta.glob` e importati dinamicamente al momento della navigazione.
