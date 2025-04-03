export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
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
}

export interface AIResponse {
  id: string
  created: number
  model: string
  choices: {
    message: OpenRouterMessage
    finish_reason: string
  }[]
}

export interface AIError {
  type: 'api_error' | 'stream_error' | 'validation_error'
  message: string
  details?: any
} 