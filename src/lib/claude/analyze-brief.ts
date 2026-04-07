import Anthropic from '@anthropic-ai/sdk'

export async function analyzeBrief(briefText: string): Promise<{
  summary: string
  flags: string[]
  budget_estimate?: string
  timeline_notes?: string
} | { error: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[Claude stub] Would analyze brief, no API key set')
    return {
      summary: '[Claude analysis not yet configured — add ANTHROPIC_API_KEY to environment]',
      flags: [],
    }
  }

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an independent production advisory expert reviewing a production brief for a client.

Analyze the following brief and return a structured JSON response with:
- summary: 2-3 sentence summary of what is being produced
- flags: array of strings listing any concerns (unclear scope, missing information, unrealistic timeline, potential cost risks)
- budget_estimate: if budget information is present, note it; otherwise null
- timeline_notes: key dates or timeline concerns

Brief:
${briefText}

Return ONLY valid JSON, no markdown.`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') return { error: 'Unexpected response type' }

    const parsed = JSON.parse(content.text)
    return parsed
  } catch (err) {
    console.error('[Claude] Analysis failed:', err)
    return { error: 'Brief analysis failed' }
  }
}
