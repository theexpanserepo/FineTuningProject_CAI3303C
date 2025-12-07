// frontend/src/components/CourseEntryPanel.jsx

import React, { useState } from 'react'

const AVAILABLE_COURSES = [
  'CAI1001C',
  'CAI2100C',
  'CAI3821C',
  'CAI3822C',
  'COP1000',
  'COP2210',
  'COP3530',
  'ENC1101',
  'ENC1102',
  'MAC1105',
  'STA2023',
]

function CourseEntryPanel({ selectedCourses, setSelectedCourses }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const addCourse = (e) => {
    e.preventDefault()
    setError('')

    const code = input.trim().toUpperCase()

    if (!code) {
      setError('Enter a course code.')
      return
    }

    if (!/^[A-Z]{3,4}\d{3,4}[A-Z0-9]*$/.test(code)) {
      setError('Invalid course code.')
      return
    }

    if (!AVAILABLE_COURSES.includes(code)) {
      setError('This MVP only supports a limited set of demo course codes (see list below).')
      return
    }

    if (selectedCourses.includes(code)) {
      setError('Already added.')
      return
    }

    setSelectedCourses([...selectedCourses, code])
    setInput('')
  }

  const removeCourse = (code) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== code))
  }

  return (
    <div className="space-y-3">
      <form onSubmit={addCourse} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="e.g. ENC1101"
          className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-500"
        >
          Add
        </button>
      </form>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <p className="text-xs text-slate-400">
        This MVP uses a synthetic dataset. Only the following course codes are available:{' '}
        <span className="font-mono">{AVAILABLE_COURSES.join(', ')}</span>.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-950/60 p-2">
        {selectedCourses.length === 0 ? (
          <p className="text-xs text-slate-500">No courses added yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {selectedCourses.map((code) => (
              <li
                key={code}
                className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-xs"
              >
                <span className="text-slate-100">{code}</span>
                <button
                  onClick={() => removeCourse(code)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CourseEntryPanel
