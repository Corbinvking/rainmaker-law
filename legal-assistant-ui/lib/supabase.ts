import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your database tables
export type User = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: string
  created_at: string
  updated_at: string
}

export type Client = {
  id: string
  user_id: string
  full_name: string
  email?: string
  phone?: string
  company?: string
  status: string
  created_at: string
  updated_at: string
}

export type Matter = {
  id: string
  client_id: string
  title: string
  description?: string
  status: string
  matter_type: string
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  matter_id?: string
  client_id?: string
  user_id: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  content_type: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type AIConversation = {
  id: string
  user_id: string
  matter_id?: string
  title?: string
  created_at: string
}

export type AIMessage = {
  id: string
  conversation_id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export type DocumentTemplate = {
  id: string
  name: string
  description?: string
  content: string
  category: string
  created_by: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export type DocumentVersion = {
  id: string
  document_id: string
  version_number: number
  file_path: string
  created_by: string
  created_at: string
} 