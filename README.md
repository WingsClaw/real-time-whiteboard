# Real-Time Collaborative Whiteboard Platform

A web-based collaborative whiteboard platform that allows multiple users to draw, brainstorm, and collaborate in real-time.

## 🚀 Status: Active Development

This project is currently in active development. Core features have been implemented, with authentication and advanced real-time sync still in progress.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** TailwindCSS
- **Canvas:** Fabric.js
- **Backend:** Supabase (PostgreSQL + Realtime + Storage)
- **Testing:** Playwright
- **Deployment:** Vercel

## ✨ Features Implemented

### ✅ Core Features
- [x] Drawing canvas with Fabric.js
- [x] Drawing tools: Pen, Eraser, Shapes, Text, Sticky Notes
- [x] Color picker and brush size controls
- [x] Export board to PNG
- [x] Board management (create, list, delete)
- [x] Responsive design
- [x] Real-time subscription setup (ready for Supabase connection)

### 🚧 Features In Progress
- [ ] User authentication
- [ ] Real-time multi-user collaboration
- [ ] User presence and cursor tracking
- [ ] Undo/Redo functionality
- [ ] Image upload
- [ ] Board sharing and permissions

### 📋 Planned Features
- [ ] Layer management
- [ ] Grid and snap-to-grid
- [ ] Keyboard shortcuts
- [ ] Built-in chat
- [ ] Board templates
- [ ] Version history

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/WingsClaw/real-time-whiteboard.git
cd real-time-whiteboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Follow the detailed setup instructions in [docs/setup.md](docs/setup.md):
- Create a Supabase project
- Run the SQL schema provided
- Enable Realtime on tables
- Create storage bucket

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

5. **Run development server**
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🧪 Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

Tests are written with Playwright and cover:
- Home page functionality (drawing tools, color picker, export)
- Boards page functionality (create, list, delete)

## 📁 Project Structure

```
real-time-whiteboard/
├── app/                   # Next.js app directory
│   ├── boards/           # Board management page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home/Whiteboard page
├── components/           # Reusable components (to be added)
├── lib/                 # Utility functions
│   ├── canvas.ts        # Fabric.js helper functions
│   └── supabase.ts      # Supabase client & types
├── tests/               # Playwright tests
│   ├── boards.spec.ts   # Boards page tests
│   └── home.spec.ts     # Home page tests
├── docs/                # Documentation
│   └── setup.md         # Detailed setup instructions
├── public/              # Static assets
├── .env.example         # Environment variables template
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies
├── playwright.config.ts  # Playwright configuration
├── tailwind.config.ts    # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run Playwright tests
npm run test:ui  # Run tests with UI
```

### Database Schema

The application uses Supabase PostgreSQL with the following tables:

- **users** - User information
- **boards** - Whiteboard boards
- **board_elements** - Drawing elements (strokes, shapes, text)
- **collaborators** - Board access control

See [docs/setup.md](docs/setup.md) for the complete SQL schema.

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 📚 Documentation

- [Setup Instructions](docs/setup.md) - Detailed Supabase and Vercel setup
- [Supabase Docs](https://supabase.com/docs) - Backend platform documentation
- [Fabric.js Docs](http://fabricjs.com/docs/) - Canvas library documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) - Powerful canvas library
- [Supabase](https://supabase.com/) - Backend as a service
- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation in the docs/ folder

---

**Built with ❤️ by WingsClaw Automation Team**
