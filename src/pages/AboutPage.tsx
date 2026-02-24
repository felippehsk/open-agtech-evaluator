export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">About</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <p className="text-slate-600 dark:text-slate-300">
          This platform supports Olds College (Alberta, Canada) course AGT3510. Students evaluate
          off-the-shelf precision agriculture software. Data is stored in GitHub; the dashboard
          visualizes and compares platforms. Evaluations are educational and not an endorsement.
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          © Olds College — Werklund School of Agriculture Technology. Code: MIT. Data: CC BY-NC-SA 4.0.
        </p>
      </div>
    </div>
  )
}
