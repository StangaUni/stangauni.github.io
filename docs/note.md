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
tags: ["tag1", "tag2"]
excerpt: "Breve descrizione mostrata nella lista."
readingTime: 12
difficulty: 2
hasSolution: true
week: 3
---
```

### Campi del frontmatter

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `title` | `string` | sì | Titolo della nota |
| `type` | `NoteType` | sì | Categoria (vedi sotto) |
| `tags` | `string[]` | sì | Tag tematici; alcuni hanno significato speciale (vedi sotto) |
| `excerpt` | `string` | no | Testo anteprima nella lista |
| `readingTime` | `number` | no | Minuti di lettura stimati |
| `difficulty` | `1 \| 2 \| 3` | no | Difficoltà (mostrata come pallini nelle esercitazioni) |
| `hasSolution` | `boolean` | no | Se l'esercizio ha soluzione completa |
| `week` | `number` | no | Settimana del corso (raggruppa gli esercizi per settimana) |

### Tipi di nota (`type`)

| Valore | Label nel sito | Uso |
|---|---|---|
| `riassunto` | Riassunti | Riassunti teorici del corso |
| `esercitazione` | Esercizi | Esercizi svolti |
| `appunti` | Strategie Esame | Consigli e strategie d'esame |
| `extra` | Materiale Extra | Tutto il resto (compitini, dispense, ecc.) |

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
tags: ["puntatori", "memoria", "dereferenziazione"]
excerpt: "Concetto di puntatore, operatori & e *, aritmetica dei puntatori."
readingTime: 10
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
