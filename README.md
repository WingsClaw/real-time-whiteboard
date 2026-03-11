# Real-Time Collaborative Whiteboard Platform

A web-based collaborative whiteboard platform that allows multiple users to draw, brainstorm, and collaborate in real-time.

## Tech Stack

- **Frontend:** Next.js 14 + React 18
- **Styling:** TailwindCSS
- **Canvas:** Fabric.js
- **Backend:** Supabase (PostgreSQL + Realtime + Storage)
- **Deployment:** Vercel

## Features

- Real-time drawing canvas with pressure sensitivity
- Multi-user collaboration with visible cursors
- Drawing tools: pen, eraser, shapes, text, sticky notes, images
- Layer management
- Export/Import boards
- History/Undo-Redo
- Room management
- User presence
- Built-in chat

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Project Structure

```
real-time-whiteboard/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── tests/           # Test files
├── docs/            # Documentation
└── README.md
```

## Deployment

This project is deployed on Vercel.

- **Frontend:** [Vercel URL]
- **Backend:** Supabase (PostgreSQL + Realtime + Storage)

## License

MIT
