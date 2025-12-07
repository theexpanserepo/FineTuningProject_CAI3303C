// frontend/src/components/ScheduleViewer.jsx

import React from 'react'

function ScheduleViewer({ schedule, lockedCourses, setLockedCourses }) {
  // Toggle lock/unlock for a course
  const toggleLock = (course) => {
    if (lockedCourses.includes(course)) {
      setLockedCourses(lockedCourses.filter((c) => c !== course))
    } else {
      setLockedCourses([...lockedCourses, course])
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Current Schedule</h3>

      {schedule.length === 0 ? (
        <p className="text-xs text-slate-500">No schedule generated yet.</p>
      ) : (
        <div className="space-y-2">
          {schedule.map((cls, idx) => (
            <div key={idx} className="rounded-md border border-slate-700 bg-slate-900 p-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-100 text-sm">
                  {cls.course} — {cls.day} {cls.start_time}–{cls.end_time}
                </p>

                <button
                  onClick={() => toggleLock(cls.course)}
                  className={`text-xs px-2 py-1 rounded-md ${
                    lockedCourses.includes(cls.course)
                      ? 'bg-emerald-600 text-emerald-50'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {lockedCourses.includes(cls.course) ? 'Locked' : 'Lock'}
                </button>
              </div>

              {/* Optional details (only if present in CSV) */}
              {cls.location && (
                <p className="text-xs text-slate-400 mt-1">Location: {cls.location}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScheduleViewer
