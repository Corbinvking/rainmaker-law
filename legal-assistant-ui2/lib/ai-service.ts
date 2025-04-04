import { OpenRouterMessage, AIResponse, OpenRouterConfig } from '@/types/ai'

export class AIService {
  private apiKey: string | null = null
  private useRealAI: boolean = false
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions'

  private readonly SYSTEM_PROMPT = `You are a highly knowledgeable legal AI assistant with expertise in various areas of law. 
Your role is to help legal professionals with tasks such as document drafting, legal research, case analysis, and client matters.
Always maintain professional ethics and confidentiality. If you're unsure about any legal advice, make it clear that your responses 
should be reviewed by a qualified legal professional.`

  constructor() {
    if (typeof window !== 'undefined') {
      this.useRealAI = localStorage.getItem('USE_REAL_AI') === 'true'
      this.apiKey = localStorage.getItem('OPENROUTER_API_KEY')
    }
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('OPENROUTER_API_KEY', key)
  }

  setUseRealAI(use: boolean) {
    this.useRealAI = use
    localStorage.setItem('USE_REAL_AI', use.toString())
  }

  isUsingRealAI(): boolean {
    return this.useRealAI && this.apiKey !== null
  }

  private async makeRequest(options: {
    key: string;
    messages: OpenRouterMessage[];
    maxTokens?: number;
  }) {
    const { key, messages, maxTokens = 4000 } = options

    const headers = {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      'X-Title': 'Rainmaker Law AI Assistant'
    }

    const body = {
      model: 'openai/gpt-3.5-turbo',  // Using GPT-3.5 as confirmed working
      messages,
      max_tokens: maxTokens,
      temperature: 0.7
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('API Error:', data)
        throw new Error(data.error?.message || `Request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async verifyApiKey(key: string): Promise<{ isValid: boolean; error?: string }> {
    if (!key?.trim()) {
      return { isValid: false, error: 'API key is required' }
    }

    if (!key.startsWith('sk-or-')) {
      return { isValid: false, error: 'Invalid API key format. Key should start with "sk-or-"' }
    }

    try {
      await this.makeRequest({
        key,
        messages: [{ role: 'user' as const, content: 'Test' }],
        maxTokens: 1
      })
      return { isValid: true }
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Failed to verify API key'
      }
    }
  }

  async sendMessage(messages: OpenRouterMessage[]): Promise<AIResponse> {
    if (!this.useRealAI || !this.apiKey) {
      return this.sendMockMessage()
    }

    try {
      // Add system prompt if not present
      const messageHistory = messages[0]?.role === 'system' 
        ? messages 
        : [{ role: 'system' as const, content: this.SYSTEM_PROMPT }, ...messages]

      return await this.makeRequest({
        key: this.apiKey,
        messages: messageHistory
      })
    } catch (error) {
      console.error('Error sending message:', error)
      return this.sendMockMessage()
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
} 