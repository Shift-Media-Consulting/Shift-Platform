import Anthropic from '@anthropic-ai/sdk'

interface BidLineItem {
  section_name: string
  name: string
  quantity: number
  days: number
  rate: number
  amount: number
}

interface BidAnalysisInput {
  partnerName: string
  director?: string | null
  totalNet: number
  lineItems: BidLineItem[]
}

export async function analyzeBid(input: BidAnalysisInput): Promise<{
  summary: string
  flags: string[]
} | { error: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      summary: '[Claude analysis not yet configured — add ANTHROPIC_API_KEY to environment]',
      flags: [],
    }
  }

  // Build a structured budget summary for the prompt
  const sectionMap: Record<string, number> = {}
  for (const item of input.lineItems) {
    sectionMap[item.section_name] = (sectionMap[item.section_name] ?? 0) + item.amount
  }
  const sectionBreakdown = Object.entries(sectionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => `  ${name}: €${amount.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`)
    .join('\n')

  const prompt = `You are an independent production advisory expert reviewing a production budget submitted by a production company.

Partner: ${input.partnerName}${input.director ? `\nDirector: ${input.director}` : ''}
Total Net Budget: €${input.totalNet.toLocaleString('de-DE', { maximumFractionDigits: 0 })}

Section breakdown:
${sectionBreakdown}

Line items (${input.lineItems.length} total):
${input.lineItems.slice(0, 40).map(i => `  ${i.section_name} / ${i.name}: €${i.amount.toFixed(0)} (${i.quantity} × ${i.days}d × €${i.rate})`).join('\n')}

Analyze this budget and return a JSON object with:
- summary: 2-3 sentence overview of the budget structure, key cost drivers, and overall impression
- flags: array of strings listing any concerns (missing sections like insurance, unusually high/low rates, unexpected omissions, social charges not included, etc.)

Return ONLY valid JSON, no markdown.`

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') return { error: 'Unexpected response type' }

    const parsed = JSON.parse(content.text)
    return parsed
  } catch (err) {
    console.error('[Claude] Bid analysis failed:', err)
    return { error: 'Bid analysis failed' }
  }
}
