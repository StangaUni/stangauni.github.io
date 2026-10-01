# Aggiungere una materia

## 1. Creare la cartella

```
content/materie/<slug>/
```

Lo `<slug>` diventa il segmento URL: `/materia/<slug>`.  
Usa kebab-case, tutto minuscolo (es. `analisi-matematica`).

## 2. Creare `_subject.mdx`

Il file deve contenere solo il frontmatter YAML. Il corpo è ignorato.

```yaml
---
title: "Analisi Matematica 1 [2025/2026]"
code: "MAT/05"
description: "Breve descrizione del contenuto del corso."
year: 1
semester: 1
professor: "Cognome Nome"
cfu: 12
status: "in-corso"
github: "https://github.com/StangaUni/<repo>"
---
```

### Campi del frontmatter

| Campo | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `title` | `string` | sì | Titolo mostrato nell'intestazione |
| `code` | `string` | sì | Codice SSD (es. `INF/01`) |
| `description` | `string` | sì | Testo descrittivo breve |
| `year` | `number` | sì | Anno di corso (1, 2, 3…) |
| `semester` | `number` | sì | Semestre (1 o 2) |
| `professor` | `string` | no | Docente o lista docenti |
| `cfu` | `number` | no | Crediti formativi |
| `status` | `string` | no | `in-corso` \| `completo` \| `revisionato` \| `bozza` \| `abbandonato` |

> **`abbandonato`**: corsi non più proseguiti sul sito. Di default **non** compaiono in Home; si attivano dal filtro laterale «Corsi abbandonati» (`?abbandonati=1`).
| `github` | `string` | no | URL del repository GitHub della materia |
| `hidden` | `boolean` | no | Se `true`, la materia non compare da nessuna parte |
| `hiddenSections` | `NoteType[]` | no | Tab nascosti nella pagina materia |
| `styleTags` | `string[]` | no | Tag visivi aggiuntivi |

### `hiddenSections`

```yaml
hiddenSections: ["appunti", "extra"]
```

Valori validi: `riassunto`, `esercitazione`, `appunti`, `extra`.

### `github`

Se presente, compare un'icona GitHub nella pagina materia e la materia viene elencata in `/info`.

## 3. Creare `_changelog.mdx`

```yaml
---
entries:
  - date: "2025-10-15"
    type: "aggiunta"
    description: "Aggiunti riassunti sui puntatori (cap. 10-11)."
  - date: "2025-10-01"
    type: "revisione"
    description: "Revisione nota sulle funzioni."
---
```

Il corpo del file è ignorato; la materia di appartenenza è derivata dal path della cartella.

### Tipo di voce (`type`)

| Valore | Significato |
|---|---|
| `aggiunta` | Nuovo contenuto aggiunto |
| `revisione` | Contenuto esistente revisionato |
| `correzione` | Correzione di errori |
| `nuovo` | Prima pubblicazione della materia |

## 4. Aggiungere note

Vedi [Aggiungere una nota](note.md).

## Ordinamento nella Home

Le materie sono ordinate prima per `year` (crescente), poi per `semester` (crescente).
