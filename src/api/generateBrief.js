const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

export async function generateBrief(checkpoint, elapsedMinutes = 0) {
  const key = import.meta.env.VITE_ANTHROPIC_KEY
  if (!key) {
    return 'Set VITE_ANTHROPIC_KEY in .env to enable AI briefs.'
  }

  const prompt = `You are a clinical assistant helping a nurse resume a task after an interruption. Patient: ${checkpoint.patient}, Bed ${checkpoint.bed}. Task: ${checkpoint.taskType}. Progress: Step ${checkpoint.step} of ${checkpoint.totalSteps}. Nurse's notes: ${checkpoint.notes}. Time away: ${elapsedMinutes} minutes. Write exactly 2 sentences. First: what they completed. Second: what to do next. Be specific and clinical. No preamble.`

  const body = {
    model: MODEL,
    max_tokens: 120,
    messages: [{ role: 'user', content: prompt }],
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || res.statusText)
  }

  const data = await res.json()
  const textBlock = data.content?.find((c) => c.type === 'text')
  return textBlock?.text?.trim() || 'No brief generated.'
}
