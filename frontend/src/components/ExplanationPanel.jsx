// frontend/src/components/ExplanationPanel.jsx

import React from 'react'

function ExplanationPanel({ explanation, isLoading, onReexplain }) {
  const hasExplanation = explanation && explanation.trim().length > 0

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Schedule Explanation</h2>

        <button
          type="button"
          onClick={onReexplain}
          disabled={isLoading}
          className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Re-explaining…' : 'Re-explain'}
        </button>
      </header>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-800">
        {isLoading && (
          <p className="italic text-slate-500">Generating a clear explanation for your schedule…</p>
        )}

        {!isLoading && hasExplanation && <p>{explanation}</p>}

        {!isLoading && !hasExplanation && (
          <p className="italic text-slate-500">
            No explanation yet. Generate a schedule first or ask for an explanation once your
            schedule is ready.
          </p>
        )}
      </div>
    </section>
  )
}

export default ExplanationPanel
