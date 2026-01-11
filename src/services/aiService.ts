import Groq from 'groq-sdk'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'
import { TherapistSettings } from '@/types/therapist'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // OK for dev
})

// Add this temporarily
console.log('Groq API Key present?', !!import.meta.env.VITE_GROQ_API_KEY)
console.log('First 10 chars:', import.meta.env.VITE_GROQ_API_KEY?.substring(0, 10))

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

/* ---------------- SYSTEM PROMPT ---------------- */

function buildSystemPrompt(settings: TherapistSettings): string {
  return `
You are ${settings.name}, an AI therapist providing support between professional therapy sessions.

CRITICAL CRISIS RESPONSE PROTOCOL:
If the user expresses suicidal thoughts, self-harm intent, or immediate danger:

1. DO NOT say "I cannot continue this conversation"
2. DO NOT abandon them
3. DO stay present and caring
4. DO acknowledge their pain specifically
5. DO provide crisis resources
6. DO ask what would help right now

EXAMPLE CRISIS RESPONSE:
"I'm really glad you told me that. What you're feeling is serious, and I want you to get the immediate support you need. Right now, can you:

- Call 988 (Suicide & Crisis Lifeline) - they're available 24/7
- Text HELLO to 741741 (Crisis Text Line)
- Call a trusted friend or family member
- Go to your nearest emergency room

I care about your safety. While I'm here to talk, trained crisis counselors can provide the immediate help you need. Can you reach out to one of these resources right now?"

CORE PRINCIPLES:
- Respond ONLY to what the user explicitly says
- Never assume missing context
- No generic therapy language
- Be warm, human, and specific
- NEVER abandon someone in crisis

STYLE:
- Warmth: ${Math.round(settings.warmth / 20)}/5
- Directness: ${Math.round(settings.directness / 20)}/5
- Humor: ${settings.humor}
- Response length: ${Math.round(settings.responseLength / 20)}/5

SPECIALIZATIONS:
${settings.specializations.join(', ')}

PERSONALITY:
${settings.personalityTraits.join(', ')}

Remember: Stay present. Provide resources. Never say you can't continue.
`
}

export function detectCrisis(message: string): {
  level: 'none' | 'moderate' | 'severe' | 'immediate'
  keywords: string[]
} {
  const lowerMsg = message.toLowerCase()
  
  const immediateKeywords = [
    'kill myself',
    'end my life',
    'off myself',
    'suicide plan',
    'going to hurt myself',
  ]

  const severeKeywords = [
    'suicidal',
    'want to die',
    'better off dead',
    'no reason to live',
    'self harm',
  ]

  const moderateKeywords = [
    'hopeless',
    'worthless',
    'can\'t go on',
    'no way out',
  ]

  for (const keyword of immediateKeywords) {
    if (lowerMsg.includes(keyword)) {
      return { level: 'immediate', keywords: [keyword] }
    }
  }

  for (const keyword of severeKeywords) {
    if (lowerMsg.includes(keyword)) {
      return { level: 'severe', keywords: [keyword] }
    }
  }

  for (const keyword of moderateKeywords) {
    if (lowerMsg.includes(keyword)) {
      return { level: 'moderate', keywords: [keyword] }
    }
  }

  return { level: 'none', keywords: [] }
}

export async function generateQuickResponses(
  conversation: Message[]
): Promise<string[]> {
  try {
    const systemPrompt = `You are a helpful assistant that generates empathetic, natural quick response suggestions for a therapy chat.

Based on the conversation, suggest 4 SHORT prompts (4-7 words max) that the user might want to say next.

RULES:
- Keep responses conversational and natural
- Make them feel like something the user would actually say
- Focus on emotions, clarifications, or next steps
- NO therapeutic jargon
- NO questions that sound like a therapist would ask
- Make them personal and vulnerable

Examples of GOOD prompts:
- "I'm scared to talk about this"
- "That's exactly how I feel"
- "I don't know what to do"
- "Can we talk about something else?"

Examples of BAD prompts:
- "What coping strategies do you recommend?"
- "Can you help me process this?"
- "Tell me more about CBT"

Return ONLY a JSON array of 4 strings, nothing else. No markdown, no explanation.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversation.slice(-4).map(m => ({ // Last 4 messages for context
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user',
          content: 'Generate 4 quick response suggestions based on this conversation.',
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    })

    const text = response.choices[0].message?.content?.trim() || '[]'
    
    // Clean up response (remove markdown if present)
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const prompts = JSON.parse(cleaned) as string[]
    
    // Validate and return
    if (Array.isArray(prompts) && prompts.length > 0) {
      return prompts.slice(0, 4)
    }
    
    return getDefaultPrompts()
  } catch (error) {
    console.error('Error generating quick responses:', error)
    return getDefaultPrompts()
  }
}

function getDefaultPrompts(): string[] {
  return [
    "I'm not sure where to start",
    "I need to talk about something",
    "This is hard to share",
    "Can we change topics?",
  ]
}
/* ---------------- MAIN CALL ---------------- */

export async function generateTherapeuticResponse(
  conversation: Message[],
  settings: TherapistSettings,
  onStream?: (chunk: string) => void
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(settings) },
    ...conversation.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ]

  onStream?.('')

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.6,
    stream: true,
  })

  let full = ''

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) {
      full += delta
      onStream?.(delta)
    }
  }

  return full
}
