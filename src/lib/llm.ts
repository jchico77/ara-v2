import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function llm(
  system: string,
  user: string,
  opts?: { maxTokens?: number }
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: opts?.maxTokens ?? 2048,
    system,
    messages: [{ role: 'user', content: user }],
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type')
  return block.text
}
