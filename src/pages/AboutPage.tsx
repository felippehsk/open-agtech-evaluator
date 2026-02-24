export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">About</h1>
      <div className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <p className="text-slate-600 dark:text-slate-300">
          This platform supports Olds College (Alberta, Canada) course AGT3510. Students evaluate
          off-the-shelf precision agriculture software. Data is stored in GitHub; the dashboard
          visualizes and compares platforms.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Disclaimer</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <li><strong>Student work.</strong> Evaluations are completed by students, often with AI-assisted drafting. They are not professional audits or vendor-endorsed assessments.</li>
            <li><strong>Not endorsement or criticism.</strong> Inclusion or scoring of a platform does not constitute endorsement, criticism, or recommendation by Olds College or contributors. Verify any claims before making decisions.</li>
            <li><strong>Verify before acting.</strong> Information may be incomplete, outdated, or incorrect. Always confirm with official documentation or the vendor before relying on it.</li>
            <li><strong>Accuracy not guaranteed.</strong> No warranty is made as to the accuracy or completeness of the data. Use at your own risk.</li>
            <li><strong>No affiliation.</strong> Olds College and the contributors have no affiliation with the software vendors mentioned unless otherwise stated. Product names may be trademarks of their respective owners.</li>
          </ul>
        </section>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          © Olds College of Agriculture & Technology. Code: MIT. Evaluation data: CC BY-NC-SA 4.0.
        </p>
      </div>
    </div>
  )
}
