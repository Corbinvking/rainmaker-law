# AI Integration Refactoring Plan

## 1. Core Types and Interfaces (`types/ai.ts`)
```typescript
// Current Message interface
interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: Date
  attachments?: string[]
}

// New interfaces to add:
interface OpenRouterMessage {
  role: "user" | "assistant"
  content: string
}

interface OpenRouterConfig {
  model: string
  temperature: number
  max_tokens: number
  stream: boolean
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  system_prompt?: string
}

interface AIContextState {
  messages: Message[]
  isProcessing: boolean
  error: Error | null
  activeConversation: Conversation | null
  activeTool: string | null
}

interface AIResponse {
  id: string
  created: number
  model: string
  choices: {
    message: OpenRouterMessage
    finish_reason: string
  }[]
}

interface AIError {
  type: 'api_error' | 'stream_error' | 'validation_error'
  message: string
  details?: any
}

// Add these components
interface AIErrorDisplayProps {
  error: AIError
  onRetry: () => void
}

interface AITypingIndicatorProps {
  isVisible: boolean
}

interface AIMessageActionsProps {
  onCopy: () => void
  onSave?: () => void
  onReference?: () => void
}
```

## 1.5 Mock to Real API Transition Strategy

### Current Mock Implementation
```typescript
// Current mock response in AIChat
setTimeout(() => {
  const aiMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: "I'm analyzing your question...",
    role: "assistant",
    created_at: new Date(),
  }
  setMessages((prev) => [...prev, aiMessage])
}, 1000)
```

### Transition Steps

1. **API Integration Layer**
```typescript
// New real implementation in AIChat
const handleSendMessage = async () => {
  if (!input.trim()) return

  // 1. Create user message (keep existing)
  const userMessage: Message = {
    id: Date.now().toString(),
    content: input,
    role: "user",
    created_at: new Date(),
  }
  setMessages((prev) => [...prev, userMessage])
  setInput("")
  setIsProcessing(true)

  try {
    // 2. Prepare messages for API
    const messageHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // 3. Send to OpenRouter API
    const response = await aiService.streamMessage(
      messageHistory,
      {
        model: "openrouter/anthropic/claude-2",
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      },
      (chunk) => {
        // Handle streaming updates
        setStreamingContent(prev => prev + chunk)
      }
    )

    // 4. Create final AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: streamingContent,
      role: "assistant",
      created_at: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
  } catch (error) {
    // Handle error state
    setError(error as AIError)
  } finally {
    setIsProcessing(false)
    setStreamingContent("")
  }
}
```

2. **Feature Flag Implementation**
```typescript
// Add to environment variables
USE_REAL_AI=true
OPENROUTER_API_KEY=your_key

// Add to AIService
class AIService {
  private useRealAI: boolean

  constructor() {
    this.useRealAI = process.env.USE_REAL_AI === 'true'
  }

  async sendMessage(messages: OpenRouterMessage[], config: OpenRouterConfig) {
    if (!this.useRealAI) {
      return this.sendMockMessage()
    }
    return this.sendRealMessage(messages, config)
  }
}
```

3. **Gradual Rollout Strategy**
- Phase A: Implement side-by-side testing
  - Log both mock and real responses
  - Compare response quality and timing
  - Monitor error rates

- Phase B: Progressive enablement
  - Enable real API for specific tools first
  - Gradually increase real API usage percentage
  - Maintain mock fallback for errors

- Phase C: Full transition
  - Complete switch to real API
  - Remove mock implementation
  - Maintain error logging and monitoring

4. **Error Handling During Transition**
```typescript
async sendMessage(messages: OpenRouterMessage[], config: OpenRouterConfig) {
  try {
    if (!this.useRealAI) {
      return this.sendMockMessage()
    }
    return await this.sendRealMessage(messages, config)
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock during transition period
    return this.sendMockMessage()
  }
}
```

## 2. AI Service Layer (`lib/ai-service.ts`)
```typescript
class AIService {
  // OpenRouter API integration
  async sendMessage(messages: OpenRouterMessage[], config: OpenRouterConfig)
  
  // Conversation management
  async createConversation(matterId: string | null, title: string)
  async loadConversation(conversationId: string)
  async saveConversation(conversation: Conversation)
  
  // Tool-specific handlers
  async handleToolPrompt(toolId: string, input: string)

  // Add these methods
  async initializeAPI(apiKey: string): Promise<void>
  
  async validateConfig(config: OpenRouterConfig): Promise<boolean>
  
  async streamMessage(
    messages: OpenRouterMessage[], 
    config: OpenRouterConfig,
    onChunk: (chunk: string) => void
  ): Promise<void>

  // Add retry logic
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T>
}
```

## 3. Component Refactoring

### 3.1 AIChat Component Updates
- Current state:
  - Uses mock data for conversations
  - Has simulated AI responses
  - Handles matter selection and conversation management

- Refactoring needed:
  ```typescript
  // Add new hooks and state
  const { sendMessage, isStreaming } = useAI()
  const [streamingContent, setStreamingContent] = useState("")
  
  // Update handleSendMessage
  const handleSendMessage = async () => {
    // Keep existing UI state management
    setMessages((prev) => [...prev, userMessage])
    
    // Add streaming support
    try {
      const stream = await sendMessage(messages)
      for await (const chunk of stream) {
        setStreamingContent(prev => prev + chunk)
      }
      // Update final message
    } catch (error) {
      // Handle error state
    }
  }
  ```

### 3.2 AIAssistantView Component Updates
- Current state:
  - Has tool selection UI
  - Uses mock data for tools and responses
  - Handles different view states (home/chat/tool)

- Refactoring needed:
  ```typescript
  // Add tool-specific configurations
  const toolConfigs = {
    'draft-contract': {
      model: 'openrouter/anthropic/claude-2',
      temperature: 0.7,
      systemPrompt: 'You are a legal contract drafting assistant...',
      category: TOOL_CATEGORIES.DOCUMENT,
      maxTokens: 4000
    },
    'legal-research': {
      model: 'openrouter/anthropic/claude-2',
      temperature: 0.3,
      systemPrompt: 'You are a legal research assistant...',
      category: TOOL_CATEGORIES.RESEARCH,
      maxTokens: 4000
    }
    // ... other tool configs
  }
  
  // Update handleToolSelection
  const handleToolSelect = async (toolId: string) => {
    setActiveTool(toolId)
    setActiveView('tool')
    
    // Initialize tool-specific context
    const config = toolConfigs[toolId]
    await initializeTool(config)
  }
  ```

## 4. New Components to Add

### 4.1 AIStreamingMessage
```typescript
interface AIStreamingMessageProps {
  content: string
  isStreaming: boolean
}

function AIStreamingMessage({ content, isStreaming }: AIStreamingMessageProps) {
  // Implement streaming message UI with typing indicator
}
```

### 4.2 AIToolContext
```typescript
interface AIToolContextProps {
  toolId: string
  config: OpenRouterConfig
  children: React.ReactNode
}

function AIToolContext({ toolId, config, children }: AIToolContextProps) {
  // Provide tool-specific context and configuration
}
```

## 5. Implementation Phases

### Phase 1: Core Infrastructure
1. Set up OpenRouter API client
2. Implement basic message streaming
3. Add error handling and retry logic

### Phase 2: Message Management
1. Update message interfaces
2. Implement conversation persistence
3. Add streaming message component

### Phase 3: Tool Integration
1. Configure tool-specific prompts
2. Implement tool context providers
3. Add tool-specific error handling

### Phase 4: UI Enhancements
1. Add loading states
2. Implement error messages
3. Add retry functionality
4. Enhance streaming UI

## 6. Testing Strategy
1. Unit tests for AI service
2. Component tests for streaming
3. Integration tests for tool workflows
4. E2E tests for conversation flows

## 7. Migration Strategy
1. Keep existing mock data as fallback
2. Implement feature flags for gradual rollout
3. Add telemetry for monitoring
4. Plan for A/B testing

Would you like to start with any specific phase of this implementation? I recommend beginning with the core infrastructure to set up the OpenRouter API client and basic message streaming.

## Additional Changes

### Add tool categories and configurations
const TOOL_CATEGORIES = {
  DOCUMENT: 'document',
  RESEARCH: 'research',
  ANALYSIS: 'analysis',
  CLIENT: 'client'
} as const

### Enhanced tool configs
const toolConfigs = {
  'draft-contract': {
    model: 'openrouter/anthropic/claude-2',
    temperature: 0.7,
    systemPrompt: 'You are a legal contract drafting assistant...',
    category: TOOL_CATEGORIES.DOCUMENT,
    maxTokens: 4000
  },
  'legal-research': {
    model: 'openrouter/anthropic/claude-2',
    temperature: 0.3,
    systemPrompt: 'You are a legal research assistant...',
    category: TOOL_CATEGORIES.RESEARCH,
    maxTokens: 4000
  }
  // ... other tool configs
}

## 8. Implementation Waves

### Wave 1: Foundation Setup (Minimal Risk)
1. Create new files without modifying existing ones:
```typescript
// lib/ai-service.ts
export class AIService {
  private apiKey: string | null = null
  private useRealAI: boolean = false

  constructor() {
    this.useRealAI = process.env.USE_REAL_AI === 'true'
    this.apiKey = process.env.OPENROUTER_API_KEY || null
  }

  // Start with basic message sending
  async sendMessage(messages: OpenRouterMessage[]): Promise<AIResponse> {
    if (!this.useRealAI) {
      return this.sendMockMessage()
    }
    return this.sendMockMessage() // Still use mock for now
  }

  private async sendMockMessage(): Promise<AIResponse> {
    // Replicate current mock behavior
    return {
      id: Date.now().toString(),
      created: Date.now(),
      model: "mock",
      choices: [{
        message: {
          role: "assistant",
          content: "I'm analyzing your question..."
        },
        finish_reason: "stop"
      }]
    }
  }
}

// types/ai.ts
export * from '../interfaces/already/defined'
```

2. Add environment variables:
```env
# .env.local
NEXT_PUBLIC_USE_REAL_AI=false
OPENROUTER_API_KEY=your_key_here
```

### Wave 2: Parallel Implementation (No Production Impact)
1. Create parallel AI chat component:
```typescript
// components/ai-chat-next.tsx
// Copy of current AIChat but with AIService integration
// Not used in production yet
```

2. Implement basic OpenRouter API call:
```typescript
// lib/ai-service.ts
async sendRealMessage(messages: OpenRouterMessage[]): Promise<AIResponse> {
  if (!this.apiKey) throw new Error('API key not configured')
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "openrouter/anthropic/claude-2",
      messages: messages
    })
  })
  
  if (!response.ok) {
    throw new Error('API request failed')
  }
  
  return response.json()
}
```

### Wave 3: Safe Integration (Controlled Testing)
1. Add feature flag component:
```typescript
// components/ai-chat-wrapper.tsx
export function AIChatWrapper(props: AIChatProps) {
  const useNewImplementation = process.env.NEXT_PUBLIC_USE_REAL_AI === 'true'
  
  if (useNewImplementation) {
    return <AIChat {...props} />
  }
  
  return <AIChat {...props} />  // Original component
}
```

2. Update message handling with fallback:
```typescript
// components/ai-chat.tsx
const handleSendMessage = async () => {
  try {
    const response = await aiService.sendMessage(messages)
    // New implementation
  } catch (error) {
    console.error('Falling back to mock implementation:', error)
    // Original implementation
  }
}
```

### Wave 4: Streaming Support (Progressive Enhancement)
1. Add streaming capabilities:
```typescript
// lib/ai-service.ts
async streamMessage(
  messages: OpenRouterMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!this.useRealAI) {
    // Simulate streaming with mock
    onChunk("I'm ")
    await new Promise(resolve => setTimeout(resolve, 100))
    onChunk("analyzing ")
    await new Promise(resolve => setTimeout(resolve, 100))
    onChunk("your question...")
    return
  }
  
  // Implement real streaming
}
```

### Wave 5: Tool Integration (Feature Extension)
1. Add tool-specific configurations without removing existing ones
2. Implement parallel tool handlers
3. Test each tool individually before enabling

### Success Criteria for Each Wave:
- No disruption to existing functionality
- Error rates remain at baseline
- Performance metrics maintained
- Successful fallback to mock when needed
- Clean rollback path available

### Monitoring During Waves:
- Error rates in logs
- Response times
- User feedback/complaints
- System stability metrics
- API usage and costs

Would you like to proceed with Wave 1? We can start by creating the foundation files without modifying any existing functionality.