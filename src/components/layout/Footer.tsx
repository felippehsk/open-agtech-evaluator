import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Open AgTech Evaluator — Olds College (AGT3510)</p>
        <p className="mt-1">
          Evaluations are student work; not an endorsement. Verify before acting.{' '}
          <Link to="/about" className="text-primary hover:underline">Disclaimer</Link>.
        </p>
        <p className="mt-1">Data: CC BY-NC-SA 4.0. Code: MIT.</p>
      </div>
    </footer>
  )
}
