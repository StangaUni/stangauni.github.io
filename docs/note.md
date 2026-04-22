# Aggiungere una nota

## Posizione del file

```
src/content/materie/<slug-materia>/<slug-nota>.mdx
```

Lo slug-nota diventa il segmento URL: `/materia/<slug-materia>/<slug-nota>`.

**Convenzione di naming:** inizia con numero a due cifre per controllare l'ordinamento:
```
01-algoritmi.mdx
02-pseudocodice.mdx
...
extra-primo-compitino.mdx   ← file "extra" senza numero
```

Le note sono ordinate alfabeticamente per slug. Il prefisso numerico garantisce
che appaiano nell'ordine corretto nel TOC laterale e nella navigazione precedente/successiva.

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

### Campi del frontmatter

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `title` | `string` | sì | Titolo della nota |
| `type` | `NoteType` | sì | Categoria (vedi sotto) |
| `tags` | `string[]` | no | Tag tematici; alcuni hanno significato speciale per le esercitazioni (vedi sotto) |
| `date` | `string` | no | Data di creazione/aggiornamento (formato `YYYY-MM-DD`) |
| `excerpt` | `string` | no | Testo anteprima nella lista |
| `difficulty` | `1 \| 2 \| 3` | no | Difficoltà (mostrata come pallini nelle esercitazioni) |
| `hasSolution` | `boolean` | no | Se l'esercizio ha soluzione completa |
| `week` | `number` | no | Settimana del corso (raggruppa gli esercizi per settimana) |
| `section` | `string` | no | Sezione o modulo del corso di appartenenza |
| `contributors` | `Contributor[]` | no | Autori/contributori della nota (vedi sotto) |

### Tipi di nota (`type`)

| Valore | Label nel sito | Uso |
|---|---|---|
| `riassunto` | Teoria | Riassunti teorici del corso |
| `esercitazione` | Esercizi | Esercizi svolti |
| `appunti` | Strategie Esame | Consigli e strategie d'esame |
| `extra` | Materiale Extra | Tutto il resto (compitini, dispense, ecc.) |

### `contributors`

Lista di autori/contributori della nota. Ogni voce ha:

| Campo | Tipo | Descrizione |
|---|---|---|
| `name` | `string` | Nome visualizzato |
| `github` | `string` (opzionale) | Username GitHub |

```yaml
contributors:
  - name: "Enrico Stangherlin"
    github: "StangaUni"
  - name: "Altro Autore"
```

### Tag speciali per le esercitazioni

Nelle note di tipo `esercitazione`, il primo tag che corrisponde a una di queste chiavi
determina il badge colorato mostrato nella lista:

| Tag | Badge |
|---|---|
| `esame` | Esercizio d'esame (rosso) |
| `aula` | Esercitazione in aula (blu) |
| `quiz` | Quiz a crocette (viola) |

## Struttura del contenuto

Il contenuto MDX supporta tutto il Markdown esteso da GFM più:

- **Heading H1 (`#`)** → **soppresso**: non viene renderizzato. Il titolo della nota viene mostrato dall'header card (frontmatter `title`). Non usare `#` nel corpo.
- **Heading H2 (`##`)** → sezioni principali, appaiono nel TOC laterale come voci collassabili
- **Heading H3 (`###`)** → sottosezioni, appaiono come figli nel TOC
- **Formule** con `$formula$` (inline) e `$$formula$$` (blocco) — renderizzate da KaTeX
- **Tabelle** GFM
- **Componenti MDX** importati automaticamente (vedi [Componenti MDX](componenti-mdx.md))

### Esempio di nota completa

```mdx
---
title: "Puntatori"
type: "riassunto"
excerpt: "Concetto di puntatore, operatori & e *, aritmetica dei puntatori."
contributors:
  - name: "Enrico Stangherlin"
    github: "stangherlin-enrico"
---

## Cos'è un puntatore

Un puntatore è una variabile che contiene un **indirizzo di memoria**.

```c
int x = 42;
int *p = &x;   // p punta a x
```

## Operatori

| Operatore | Significato |
|---|---|
| `&` | Indirizzo di |
| `*` | Dereferenziazione |

### Aritmetica dei puntatori

<Collapsible title="Dettaglio: incremento di puntatore">

`p + 1` sposta il puntatore di `sizeof(*p)` byte, non di 1 byte.

</Collapsible>

## Formule

La dimensione di un array: $n \times \text{sizeof}(T)$
```

## Table of Contents laterale

Il TOC viene costruito automaticamente dagli heading H2 e H3 presenti nel documento.
È sempre abilitato il collapse delle sezioni H3 sotto il rispettivo H2.

Il TOC non è mostrato se la pagina non ha heading.
