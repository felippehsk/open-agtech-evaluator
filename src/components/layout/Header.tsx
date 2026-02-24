import { Link } from 'react-router-dom'

interface HeaderProps {
  onSignIn: () => void
  signedInAs: string | null
}

export function Header({ onSignIn, signedInAs }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          AGT3510 Platform Evaluator
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            Dashboard
          </Link>
          <Link to="/form" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            New evaluation
          </Link>
          <Link to="/about" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            About
          </Link>
          {signedInAs ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">{signedInAs}</span>
          ) : (
            <button type="button" onClick={onSignIn} className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90">
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
