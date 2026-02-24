import { useState, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { FormStateProvider, useFormState } from '@/context/FormStateContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PATModal } from '@/components/PATModal'
import { getStoredUsername } from '@/components/PATModal'
import { DashboardPage } from '@/pages/DashboardPage'
import { AboutPage } from '@/pages/AboutPage'
import { ProtocolPage } from '@/pages/ProtocolPage'
import { EvaluationDetailPage } from '@/pages/EvaluationDetailPage'

const FormPage = lazy(() => import('@/pages/FormPage').then((m) => ({ default: m.FormPage })))

function Layout() {
  const [signedInUser, setSignedInUser] = useState<string | null>(() => getStoredUsername())
  const [patOpen, setPatOpen] = useState(false)
  const { setEvaluator } = useFormState()

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-900">
      <Header
        onSignIn={() => setPatOpen(true)}
        signedInAs={signedInUser}
      />
      <PATModal
        open={patOpen}
        onClose={() => setPatOpen(false)}
        onSuccess={(login) => {
          setSignedInUser(login)
          setEvaluator(login)
        }}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <FormStateProvider>
        <HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="form" element={<Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-slate-500">Loading form…</div>}><FormPage /></Suspense>} />
            <Route path="protocol" element={<ProtocolPage />} />
            <Route path="evaluation/:platformSlug/:evaluatorId" element={<EvaluationDetailPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </FormStateProvider>
    </ThemeProvider>
  )
}
