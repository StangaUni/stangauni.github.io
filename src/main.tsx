import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './styles/index.css'
import { App } from './App'

// Apply saved theme before first paint
const saved = localStorage.getItem('theme')
if (saved === 'notte' || saved === 'carbon') {
  document.documentElement.classList.add('dark')
  if (saved === 'carbon') document.documentElement.classList.add('theme-carbon')
} else if (saved === 'carta') {
  document.documentElement.classList.add('theme-carta')
} else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)
