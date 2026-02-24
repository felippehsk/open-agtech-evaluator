interface InfoTipProps {
  text: string
  className?: string
}

export function InfoTip({ text, className = '' }: InfoTipProps) {
  return (
    <span className={`group relative inline-flex cursor-help ${className}`}>
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 bg-slate-100 text-slate-600 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-400"
        aria-label="More information"
      >
        <span className="text-[10px] font-bold leading-none">i</span>
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 hidden max-w-[220px] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700 shadow-lg group-hover:block dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        {text}
      </span>
    </span>
  )
}
