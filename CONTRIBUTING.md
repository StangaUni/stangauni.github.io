# Contribuire a StangaUni

Grazie per voler contribuire. Questa guida spiega come aggiungere o correggere contenuti e come proporre modifiche al codice del sito.

## Prima di iniziare

1. Apri una [issue](https://github.com/StangaUni/stangauni.github.io/issues) se stai proponendo un argomento nuovo o una modifica ampia.
2. Per errori puntuali puoi aprire direttamente una Pull Request.
3. Leggi la documentazione in [`docs/`](docs/index.md).

## Contenuto vs codice

| Cosa | Dove |
|------|------|
| Appunti, materie, note | `content/materie/<slug>/` |
| Codice del sito (React, stili, routing) | `src/` |
| Asset statici (immagini, SVG) | `public/` |

**Non mettere file di appunti dentro `src/`.**

## Aggiungere o modificare una nota

1. Vai in `content/materie/<slug-materia>/`.
2. Crea o modifica un file `.mdx` (es. `03-limiti.mdx`).
3. Rispetta il frontmatter e le convenzioni descritte in [docs/note.md](docs/note.md).
4. Non includere materiale didattico ufficiale protetto (slide del corso, testi d’esame, registrazioni).

## Aggiungere una materia

1. Crea `content/materie/<slug>/`.
2. Aggiungi `_subject.mdx` e `_changelog.mdx`.
3. Segui [docs/materie.md](docs/materie.md).

## Sviluppo locale

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verifica che la build passi prima della PR
```

Requisiti: Node.js ≥ 18, npm ≥ 9.

## Pull Request

- Usa il template PR precompilato.
- Una PR = un obiettivo chiaro (una materia, una correzione, un miglioramento UI).
- Se tocchi solo contenuto MDX, non serve rebuild manuale oltre a `npm run build` per sicurezza.
- Se tocchi TypeScript/React, assicurati che `npm run build` termini senza errori.

## Stile del codice

- TypeScript strict, componenti funzionali.
- Tailwind per gli stili; evita CSS ad hoc se non necessario.
- Il layer dati del contenuto è **solo** in `src/lib/content.ts`: non aggiungere nuovi `import.meta.glob` sparsi.

## Licenza

Contribuendo accetti che il materiale sia pubblicato sotto [CC BY-NC 4.0](LICENSE).
