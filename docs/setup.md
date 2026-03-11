# Setup Instructions for Real-Time Collaborative Whiteboard

## GitHub Repository

**Repository:** https://github.com/WingsClaw/real-time-whiteboard
**Status:** ✅ Created and initialized

## Supabase Setup (Manual Steps Required)

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Project name: `whiteboard-app`
4. Database password: [Generate and save a strong password]
5. Region: Closest to your users (e.g., East US)
6. Click "Create new project"

### 2. Create Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boards table
CREATE TABLE boards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Board elements table (stores drawing data)
CREATE TABLE board_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'pen', 'eraser', 'shape', 'text', 'sticky', 'image'
    data JSONB NOT NULL, -- drawing coordinates, color, size, etc.
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaborators table
CREATE TABLE collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role TEXT DEFAULT 'editor', -- 'owner', 'editor', 'viewer'
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_board_elements_board_id ON board_elements(board_id);
CREATE INDEX idx_collaborators_board_id ON collaborators(board_id);
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Board read access for collaborators" ON boards FOR SELECT
USING (id IN (SELECT board_id FROM collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Board insert for anyone" ON boards FOR INSERT WITH CHECK (true);

CREATE POLICY "Board elements read for collaborators" ON board_elements FOR SELECT
USING (board_id IN (SELECT board_id FROM collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Board elements insert for collaborators" ON board_elements FOR INSERT
WITH CHECK (board_id IN (SELECT board_id FROM collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Board elements update for collaborators" ON board_elements FOR UPDATE
USING (board_id IN (SELECT board_id FROM collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Board elements delete for collaborators" ON board_elements FOR DELETE
USING (board_id IN (SELECT board_id FROM collaborators WHERE user_id = auth.uid()));

CREATE POLICY "Collaborators read access" ON collaborators FOR SELECT USING (true);
CREATE POLICY "Collaborators insert access" ON collaborators FOR INSERT WITH CHECK (true);
```

### 3. Enable Realtime

1. Go to Database → Replication
2. Enable Realtime for these tables:
   - `boards`
   - `board_elements`
3. Click "Save"

### 4. Create Storage Bucket

1. Go to Storage
2. Create a new bucket named `board-exports`
3. Make it public (if needed for sharing exports)

### 5. Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role secret key** (also starts with `eyJ...`)

## Vercel Setup (Manual Steps Required)

### 1. Connect GitHub Repo to Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repo: `WingsClaw/real-time-whiteboard`
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Add Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Deploy

Click "Deploy" to deploy the application to Vercel.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/WingsClaw/real-time-whiteboard.git
cd real-time-whiteboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Credentials Summary

**GitHub:**
- Repository: https://github.com/WingsClaw/real-time-whiteboard
- Token: [Stored in automation-team/config.md]

**Supabase:**
- Account Token: [Stored in automation-team/config.md] (full access)
- Project URL: [To be filled after manual setup]
- Anon Key: [To be filled after manual setup]
- Service Role Key: [To be filled after manual setup]

**Vercel:**
- Token: [Stored in automation-team/config.md] (full access)
- Project URL: [To be filled after manual setup]

## Notes

- All accounts have full access - agents can create/manage projects as needed
- After manual setup, update this document with the actual Supabase and Vercel URLs
- For production, ensure proper RLS policies and rate limiting are configured
