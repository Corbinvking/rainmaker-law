export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  created_at: Date
  attachments?: string[]
}

export interface OpenRouterMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface OpenRouterConfig {
  model: string
  temperature: number
  max_tokens: number
  stream: boolean
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  system_prompt?: string
  apiKey: string
  useRealAI: boolean
}

export interface AIResponse {
  id: string
  created: number
  model: string
  choices: Array<{
    message: OpenRouterMessage
    finish_reason: string
  }>
}

export interface AIError {
  message: string
  code?: string
  type?: string
} 