import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { SubjectPage } from './pages/SubjectPage'
import { NotePage } from './pages/NotePage'
import { InfoPage } from './pages/InfoPage'
import { NotFound } from './pages/NotFound'

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/materia/:subjectSlug" element={<SubjectPage />} />
          <Route path="/materia/:subjectSlug/:noteSlug" element={<NotePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
