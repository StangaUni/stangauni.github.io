# Aggiungere una nota

## Posizione del file

```
content/materie/<slug-materia>/<slug-nota>.mdx
```

URL risultante: `/materia/<slug-materia>/<slug-nota>`.

**Convenzione di naming:** prefisso numerico a due cifre per l’ordinamento:

```
01-algoritmi.mdx
02-pseudocodice.mdx
...
extra-primo-compitino.mdx   ← senza numero se “extra”
```

Le note sono ordinate alfabeticamente per slug.

## Frontmatter

```yaml
---
title: "Titolo della nota"
type: "riassunto"
date: "2025-10-01"
excerpt: "Breve descrizione mostrata nella lista."
difficulty: 2
hasSolution: true
week: 3
section: "Algebra"
contributors:
  - name: "Nome Cognome"
    github: "username"
---
```

### Campi

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `title` | `string` | sì | Titolo della nota |
| `type` | `NoteType` | sì | Categoria (vedi sotto) |
| `tags` | `string[]` | no | Tag tematici; alcuni hanno significato speciale per le esercitazioni |
| `date` | `string` | no | `YYYY-MM-DD` |
| `excerpt` | `string` | no | Anteprima nella lista |
| `difficulty` | `1 \| 2 \| 3` | no | Difficoltà (pallini nelle esercitazioni) |
| `hasSolution` | `boolean` | no | Se l'esercizio ha soluzione completa |
| `week` | `number` | no | Settimana del corso |
| `section` | `string` | no | Sezione o modulo |
| `contributors` | `Contributor[]` | no | Autori della nota |

### Tipi di nota (`type`)

| Valore | Label nel sito | Uso |
|---|---|---|
| `riassunto` | Teoria | Riassunti teorici |
| `esercitazione` | Esercizi | Esercizi svolti |
| `appunti` | Strategie Esame | Consigli e strategie d'esame |
| `extra` | Materiale Extra | Compitini, dispense, altro |

### Tag speciali per le esercitazioni

| Tag | Badge |
|---|---|
| `esame` | Esercizio d'esame (rosso) |
| `aula` | Esercitazione in aula (blu) |
| `quiz` | Quiz a crocette (viola) |

## Struttura del contenuto

- **Heading H1 (`#`)** → soppresso (il titolo viene dall’header card)
- **H2 / H3** → sezioni nel Table of Contents
- **Formule** `$...$` / `$$...$$` (KaTeX)
- **Tabelle** GFM
- **Componenti MDX** — vedi [componenti-mdx.md](componenti-mdx.md)

### Esempio

```mdx
---
title: "Puntatori"
type: "riassunto"
excerpt: "Concetto di puntatore, operatori & e *."
contributors:
  - name: "Enrico Stangherlin"
    github: "stangherlin-enrico"
---

## Cos'è un puntatore

Un puntatore è una variabile che contiene un **indirizzo di memoria**.

```c
int x = 42;
int *p = &x;
```

## Operatori

| Operatore | Significato |
|---|---|
| `&` | Indirizzo di |
| `*` | Dereferenziazione |

### Aritmetica

<Collapsible title="Dettaglio: incremento di puntatore">

`p + 1` sposta il puntatore di `sizeof(*p)` byte.

</Collapsible>
```
