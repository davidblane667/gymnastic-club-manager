# CLAUDE.md - Project Context for Claude Code

## Project Overview
Yasna - web app for managing a rhythmic gymnastics club (children, groups, schedule, attendance, payments).

## Tech Stack
- **Frontend** (client/): Nuxt 3 (SPA), Vue 3 + TypeScript, Vuetify 3, Nuxt UI + Tailwind, Pinia, SCSS
- **Backend** (server/): Node.js + Express, TypeScript, MongoDB + Mongoose, JWT auth

## Commands
```bash
# Root - run everything
npm run dev              # Start MongoDB + client + server

# Client (from client/)
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
npm run typecheck        # Type checking

# Server (from server/)
npm run dev              # Dev server with hot reload (localhost:3001)
npm run build            # Compile TypeScript
npm run seed             # Seed DB with test data
```

## Project Structure
- `client/` - Nuxt 3 frontend
- `server/` - Express backend
- Client runs on port 3000, Server on port 3001

## Environment Variables
- Server: PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL
- Client: NUXT_PUBLIC_API_BASE_URL

## Custom Instructions
<!-- Add your instructions for Claude below this line -->
