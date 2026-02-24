import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface HeaderProps {
  onSignIn: () => void
  signedInAs: string | null
}

export function Header({ onSignIn, signedInAs }: HeaderProps) {
  const { resolved, setTheme } = useTheme()

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/95 dark:shadow-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          <img src={`${import.meta.env.BASE_URL}icon.png`} alt="" className="h-8 w-8 rounded-full object-contain" aria-hidden />
          AGT3510 Platform Evaluator
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            Dashboard
          </Link>
          <Link to="/form" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            New evaluation
          </Link>
          <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            About
          </Link>
          <button
            type="button"
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolved === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {signedInAs ? (
            <span className="ml-2 rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {signedInAs}
            </span>
          ) : (
            <button type="button" onClick={onSignIn} className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
