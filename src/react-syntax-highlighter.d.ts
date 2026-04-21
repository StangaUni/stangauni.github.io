declare module 'react-syntax-highlighter/dist/esm/prism' {
  import SyntaxHighlighter from 'react-syntax-highlighter'
  export default SyntaxHighlighter
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  import { CSSProperties } from 'react'
  const styles: Record<string, Record<string, CSSProperties>>
  export const oneLight: Record<string, CSSProperties>
  export const vscDarkPlus: Record<string, CSSProperties>
  export default styles
}
