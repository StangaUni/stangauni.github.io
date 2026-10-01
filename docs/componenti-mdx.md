# Componenti MDX

I componenti seguenti sono registrati globalmente per tutti i file `.mdx`
tramite `MDX_COMPONENTS` in `NotePage.tsx`. Non serve importarli manualmente.

---

## `<Collapsible>`

Sezione espandibile/collassabile.

```mdx
<Collapsible title="Titolo della sezione">

Contenuto nascosto di default. Può contenere Markdown, codice, formule.

</Collapsible>
```

```mdx
<Collapsible title="Aperta di default" defaultOpen>

Questo contenuto è visibile al caricamento.

</Collapsible>
```

### Props

| Prop | Tipo | Default | Descrizione |
|---|---|---|---|
| `title` | `string` | — | Testo del pulsante |
| `defaultOpen` | `boolean` | `false` | Se aperto al primo render |

---

## `<ThemedImage>`

Immagine che cambia sorgente in base al tema light/dark.

```mdx
<ThemedImage
  lightSrc="/assets/mia-materia/schema.svg"
  darkSrc="/assets/mia-materia/schema_scuro.svg"
  alt="Schema del processo"
/>
```

### Props

| Prop | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `lightSrc` | `string` | sì | Path immagine tema chiaro |
| `darkSrc` | `string` | sì | Path immagine tema scuro |
| `alt` | `string` | sì | Testo alternativo |
| `className` | `string` | no | Classi CSS aggiuntive |

I path sono relativi a `public/` (es. `/assets/foto.png` → `public/assets/foto.png`).

---

## `<CodeBlock>` (implicito)

I blocchi di codice fenced vengono renderizzati da `CodeBlock`:

- syntax highlighting (Prism): `oneLight` / `vscDarkPlus`
- label linguaggio
- pulsante copia

Non è necessario usare `<CodeBlock>` esplicitamente nel MDX.

---

## Markdown esteso (GFM + math)

### Tabelle

```mdx
| Colonna A | Colonna B |
|---|---|
| Valore 1  | Valore 2  |
```

### Task list

```mdx
- [x] Completato
- [ ] Da fare
```

### Formule

Inline: `$E = mc^2$`

Blocco:

```mdx
$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$
```

Vedi la [documentazione KaTeX](https://katex.org/docs/supported.html) per i simboli supportati.
