// frontend/src/components/ConstraintPanel.jsx

import React from 'react'

function ConstraintPanel({ constraintText, setConstraintText }) {
  return (
    <div className="space-y-2">
      <textarea
        value={constraintText}
        onChange={(e) => setConstraintText(e.target.value)}
        placeholder="Natural-language preferences, e.g. 'Avoid mornings. Prefer Tue/Thu.'"
        className="w-full min-h-[100px] rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <p className="text-xs text-slate-500">Describe your schedule preferences in plain English.</p>
    </div>
  )
}

export default ConstraintPanel
