import { useState } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { FormStateProvider, useFormState } from '@/context/FormStateContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PATModal } from '@/components/PATModal'
import { getStoredUsername } from '@/components/PATModal'
import { DashboardPage } from '@/pages/DashboardPage'
import { FormPage } from '@/pages/FormPage'
import { AboutPage } from '@/pages/AboutPage'

function Layout() {
  const [signedInUser, setSignedInUser] = useState<string | null>(() => getStoredUsername())
  const [patOpen, setPatOpen] = useState(false)
  const { setEvaluator } = useFormState()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
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
            <Route path="form" element={<FormPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </FormStateProvider>
  )
}
