// frontend/src/App.jsx

import React, { useState } from 'react'
import CourseEntryPanel from './components/CourseEntryPanel.jsx'
import ConstraintPanel from './components/ConstraintPanel.jsx'
import ScheduleViewer from './components/ScheduleViewer.jsx'
import ExplanationPanel from './components/ExplanationPanel.jsx'
import useExplainApi from './hooks/useExplainApi.js'
import useScheduleApi from './hooks/useScheduleApi.js'

function App() {
  const [selectedCourses, setSelectedCourses] = useState([])
  const [lockedCourses, setLockedCourses] = useState([])
  const [constraintText, setConstraintText] = useState('')

  const [schedule, setSchedule] = useState([])
  const [failReason, setFailReason] = useState(null)

  const [userMessage, setUserMessage] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isExplaining, setIsExplaining] = useState(false)

  const { explain } = useExplainApi()
  const { generate } = useScheduleApi()

  const handleGenerateSchedule = async () => {
    const message = `
Selected courses: ${selectedCourses.join(', ') || '(none)'}
Locked courses: ${lockedCourses.join(', ') || '(none)'}
Constraints: ${constraintText || '(none)'}
`
    setUserMessage(message.trim())

    const data = await generate({
      selectedCourses,
      lockedCourses,
      constraintText,
    })

    if (data.success) {
      setSchedule(data.schedule || [])
      setFailReason(null)
    } else {
      setSchedule([])
      setFailReason(data.fail_reason || 'Schedule generation failed.')
    }
  }

  const handleReexplain = async () => {
    if (isExplaining) return

    try {
      setIsExplaining(true)

      const result = await explain({
        userMessage,
        schedule,
        failReason,
      })

      setExplanation(result)
    } catch (err) {
      console.error('Error during explanation:', err)
      setExplanation('An error occurred while generating the explanation.')
    } finally {
      setIsExplaining(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-semibold">
            Student Schedule Planner{' '}
            <span className="text-xs font-normal text-slate-400">
              (Minimum Viable Product – MVP)
            </span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-sm font-semibold">Courses - Add one course code at a time</h2>
            <CourseEntryPanel
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-sm font-semibold">Constraints</h2>
            <ConstraintPanel
              constraintText={constraintText}
              setConstraintText={setConstraintText}
            />
          </div>
        </section>

        <section className="space-y-2">
          <button
            onClick={handleGenerateSchedule}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium"
          >
            Generate schedule
          </button>

          <p className="text-xs text-amber-400">
            Note: This is a demo MVP. The fine-tuned T5 model has reliable JSON syntax but low
            semantic accuracy, so schedules are guaranteed conflict-free but may not fully match all
            written preferences.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-2 text-sm font-semibold">Schedule</h2>

            {failReason && (
              <p className="mb-3 text-xs text-amber-400">
                Unable to generate a conflict-free schedule that includes every requested course.
                The blocking issue was: <span className="font-semibold">{failReason}</span>
              </p>
            )}

            <ScheduleViewer
              schedule={schedule}
              lockedCourses={lockedCourses}
              setLockedCourses={setLockedCourses}
            />
          </div>
        </section>

        <ExplanationPanel
          explanation={explanation}
          isLoading={isExplaining}
          onReexplain={handleReexplain}
        />
      </main>
    </div>
  )
}

export default App
