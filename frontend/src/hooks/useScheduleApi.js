// frontend/src/hooks/useScheduleApi.js

export default function useScheduleApi() {
  const generate = async ({ selectedCourses, lockedCourses, constraintText }) => {
    try {
      const res = await fetch('/schedule/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCourses,
          lockedCourses,
          constraintText,
        }),
      })

      const data = await res.json()
      return data
    } catch (err) {
      console.error('Schedule generation API error:', err)
      return {
        success: false,
        schedule: [],
        fail_reason: 'Server error.',
      }
    }
  }

  return { generate }
}
