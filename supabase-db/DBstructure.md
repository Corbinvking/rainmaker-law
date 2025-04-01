# Legal Assistant Database Structure

## Overview
The database structure is designed to support a legal practice management system with AI assistance capabilities. The system needs to handle user authentication, client management, document management, and AI interactions.

## Tables Structure

### 1. users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'attorney',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. clients
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. matters
```sql
CREATE TABLE matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    matter_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_id UUID REFERENCES matters(id),
    client_id UUID REFERENCES clients(id),
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    content_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. ai_conversations
```sql
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    matter_id UUID REFERENCES matters(id),
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. ai_messages
```sql
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id),
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. document_templates
```sql
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. document_versions
```sql
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Key Features Supported

1. **User Management**
   - User authentication and authorization
   - Role-based access control
   - User profile management

2. **Client Management**
   - Client information storage
   - Client-matter relationship
   - Client status tracking

3. **Document Management**
   - File upload and storage
   - Version control
   - Document metadata
   - Template management
   - File categorization

4. **AI Integration**
   - Conversation history tracking
   - Message storage
   - Context preservation
   - Document generation from templates

5. **Matter Management**
   - Case/matter tracking
   - Matter-client relationship
   - Matter status management

## Security Considerations

1. **Row Level Security (RLS)**
   - Implement RLS policies for each table
   - Ensure users can only access their own data
   - Restrict client data access to authorized users

2. **Data Encryption**
   - Encrypt sensitive client information
   - Secure file storage
   - Encrypted communication

3. **Audit Trails**
   - Track all data modifications
   - Log user actions
   - Maintain version history

## Indexes and Performance

```sql
-- Recommended indexes for performance
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_matter_id ON documents(matter_id);
CREATE INDEX idx_matters_client_id ON matters(client_id);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
```

## Next Steps

1. **Implementation**
   - Set up Supabase project
   - Create tables and relationships
   - Implement RLS policies
   - Set up storage buckets for documents

2. **Integration**
   - Connect frontend components to database
   - Implement authentication flow
   - Set up file upload/download system
   - Integrate AI conversation system

3. **Testing**
   - Test data relationships
   - Verify security policies
   - Performance testing
   - User acceptance testing
