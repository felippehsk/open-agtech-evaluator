export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">About</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        This platform supports Olds College (Alberta, Canada) course AGT3510. Students evaluate
        off-the-shelf precision agriculture software. Data is stored in GitHub; the dashboard
        visualizes and compares platforms. Evaluations are educational and not an endorsement.
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        © Olds College — Werklund School of Agriculture Technology. Code: MIT. Data: CC BY-NC-SA 4.0.
      </p>
    </div>
  )
}
