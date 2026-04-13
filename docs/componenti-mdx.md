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
  lightSrc="/immagini/schema-light.png"
  darkSrc="/immagini/schema-dark.png"
  alt="Schema del processo di compilazione"
/>
```

### Props

| Prop | Tipo | Obbligatorio | Descrizione |
|---|---|---|---|
| `lightSrc` | `string` | sì | Path immagine tema chiaro |
| `darkSrc` | `string` | sì | Path immagine tema scuro |
| `alt` | `string` | sì | Testo alternativo |
| `className` | `string` | no | Classi CSS aggiuntive |

Usa path relativi alla cartella `public/` (es. `/immagini/foto.png` → `public/immagini/foto.png`).

---

## `<CodeBlock>` (implicito)

I blocchi di codice fenced (` ``` `) vengono automaticamente renderizzati da `CodeBlock`,
che aggiunge:

- Label con il linguaggio in alto a sinistra
- Pulsante **copia** in alto a destra (appare all'hover)

```mdx
```c
int main() {
    return 0;
}
```
```

Non è necessario usare `<CodeBlock>` esplicitamente.

---

## Markdown esteso

Oltre ai componenti personalizzati, sono disponibili tutte le estensioni GFM:

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

### Formule matematiche

Inline: `$E = mc^2$`

Blocco:
```mdx
$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$
```

Renderizzate con KaTeX. Vedi la [documentazione KaTeX](https://katex.org/docs/supported.html) per i simboli supportati.
