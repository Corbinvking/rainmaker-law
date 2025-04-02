# Legal Assistant UI

A modern web application built with Next.js, TypeScript, and Tailwind CSS, featuring a comprehensive UI component library based on Radix UI and Supabase authentication.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm (comes with Node.js)
- A Supabase account and project

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd legal-assistant-ui
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:3000
```

## Authentication Flow

The application uses Supabase Authentication with the following flow:

1. **Initial Load**:
   - Checks for existing session
   - Redirects to login if no valid session exists
   - Handles token refresh automatically

2. **Login Process**:
   - Email/Password authentication
   - Session management
   - Remember me functionality
   - Rate limiting protection
   - Automatic token refresh

3. **Session Management**:
   - Persistent sessions with Supabase
   - Automatic token refresh
   - Secure session storage

To reset the authentication state:
1. Clear site data:
   ```
   Chrome: DevTools (F12) -> Application -> Clear Site Data
   ```
2. Restart the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run start` - Runs the production build
- `npm run lint` - Runs the linter to check code quality

## Project Structure

```
legal-assistant-ui/
├── app/              # Next.js app directory
│   ├── login/       # Authentication pages
│   └── dashboard/   # Protected routes
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
│   └── use-auth.ts  # Authentication hook
├── lib/             # Utility functions and shared logic
├── public/          # Static assets
└── styles/          # Global styles and Tailwind configuration
```

## Key Features

- **Authentication**:
  - Secure email/password login
  - Session persistence
  - Remember me functionality
  - Rate limiting protection
  - Automatic token refresh

- **UI Components**:
  - Modern UI components built with Radix UI
  - Responsive design with Tailwind CSS
  - Dark mode support with next-themes
  - Toast notifications with Sonner
  - Form handling with React Hook Form and Zod validation

- **Security Features**:
  - Secure session management
  - Protected routes
  - Rate limiting
  - Input validation
  - Error handling

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Troubleshooting

### Authentication Issues
- Clear site data in browser
- Check Supabase credentials in .env.local
- Verify network connectivity
- Check console for error messages

### Development Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check environment variables
- Verify Supabase service status

## License

[Your License Here]
