# Content layer

Il content layer è il cuore della struttura dati del sito. Vive in un solo file:

```
src/lib/content.ts
```

## Perché esiste

Nella versione precedente i glob MDX erano ripetuti in più hook e in `NotePage`, con caricamento async finto su dati statici. Ora:

1. **Un solo posto** conosce i path dei file MDX.
2. I **metadati** sono disponibili in modo sincrono (eager).
3. Il **corpo** di una nota è lazy e viene scaricato solo quando serve.
4. Il contenuto didattico sta in `content/`, separato da `src/`.

## Contratto

```ts
getAllSubjects(): Subject[]
getSubject(slug: string): Subject | undefined

getAllNotes(): Note[]
getNotesBySubject(subjectSlug: string): Note[]
getNote(subjectSlug: string, noteSlug: string): Note | undefined

loadNoteModule(subjectSlug: string, noteSlug: string): Promise<MdxModule | null>

getChangelog(subjectSlug: string): SubjectChangelog | null
getNoteCountsBySubject(): Record<string, NoteTypeCounts>
```

Le pagine e i componenti **non** devono chiamare `import.meta.glob` direttamente.

## Path e slug

Lo slug della materia è derivato dal segmento dopo `materie/` nel path del file:

```
content/materie/analisi-matematica/_subject.mdx  →  slug "analisi-matematica"
content/materie/analisi-matematica/01-limiti.mdx →  subject "analisi-matematica", note "01-limiti"
```

I file `_subject.mdx` e `_changelog.mdx` non sono trattati come note.

## Aggiungere una sorgente di dati

Se in futuro serve un nuovo tipo di file MDX (es. `_meta.mdx` per l’organizzazione):

1. Aggiungi il glob **solo** in `src/lib/content.ts`.
2. Esponi una funzione pure (`getX` / `loadX`).
3. Aggiorna `docs/struttura.md` e, se rilevante, i template di contributo.
