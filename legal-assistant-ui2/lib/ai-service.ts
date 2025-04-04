import { OpenRouterMessage, AIResponse, OpenRouterConfig } from '@/types/ai'

export class AIService {
  private apiKey: string | null = null
  private useRealAI: boolean = false
  private readonly API_URL = 'https://api.openrouter.ai/api/v1/chat/completions'
  private readonly SYSTEM_PROMPT = `You are a highly knowledgeable legal AI assistant with expertise in various areas of law. 
Your role is to help legal professionals with tasks such as document drafting, legal research, case analysis, and client matters.
Always maintain professional ethics and confidentiality. If you're unsure about any legal advice, make it clear that your responses 
should be reviewed by a qualified legal professional.`

  constructor() {
    if (typeof window !== 'undefined') {
      this.useRealAI = window.localStorage.getItem('USE_REAL_AI') === 'true'
      this.apiKey = window.localStorage.getItem('OPENROUTER_API_KEY')
    }
  }

  setApiKey(key: string) {
    this.apiKey = key
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('OPENROUTER_API_KEY', key)
    }
  }

  setUseRealAI(use: boolean) {
    this.useRealAI = use
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('USE_REAL_AI', use.toString())
    }
  }

  isUsingRealAI(): boolean {
    return this.useRealAI && this.apiKey !== null
  }

  async sendMessage(messages: OpenRouterMessage[]): Promise<AIResponse> {
    if (!this.useRealAI || !this.apiKey) {
      return this.sendMockMessage()
    }

    try {
      // Add system message at the start if not present
      const messageHistory = messages[0]?.role === 'system' 
        ? messages 
        : [{ role: 'system', content: this.SYSTEM_PROMPT }, ...messages]

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': `${window?.location?.origin || 'https://rainmaker-law.com'}`,
          'X-Title': 'Rainmaker Law AI Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus-20240229',
          messages: messageHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.95,
          stream: false
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('OpenRouter API error:', error)
        throw new Error(error.error?.message || 'Failed to get AI response')
      }

      const data = await response.json()
      return {
        id: data.id,
        created: data.created,
        model: data.model,
        choices: data.choices
      }
    } catch (error) {
      console.error('Error calling OpenRouter API:', error)
      throw error
    }
  }

  private async sendMockMessage(): Promise<AIResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      id: Date.now().toString(),
      created: Date.now(),
      model: "mock",
      choices: [{
        message: {
          role: "assistant",
          content: "I'm analyzing your question and searching through relevant legal resources. As your legal AI assistant, I can help with document drafting, legal research, and providing insights on your matters. Would you like me to elaborate on any specific aspect of your query?"
        },
        finish_reason: "stop"
      }]
    }
  }

  async validateConfig(config: OpenRouterConfig): Promise<boolean> {
    if (!this.apiKey) return false
    return true
  }
} 