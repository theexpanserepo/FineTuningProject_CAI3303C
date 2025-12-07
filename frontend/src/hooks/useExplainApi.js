// frontend/src/hooks/useExplainApi.js

export default function useExplainApi() {
  const explain = async ({ userMessage, schedule, failReason }) => {
    try {
      const res = await fetch('/llm/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          schedule,
          fail_reason: failReason,
        }),
      })

      const data = await res.json()
      return data.explanation || ''
    } catch (err) {
      console.error('Explain API error:', err)
      return ''
    }
  }

  return { explain }
}
