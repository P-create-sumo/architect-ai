# 🏗️ Architect AI

**AI-powered project management for architects, designers, and creative professionals.**

Architect AI helps you manage your projects from draft to delivery — with AI assistance at every stage. Track progress, manage revisions, and deliver on time.

---

## ✨ Features

- 📁 **Project dashboard** — full overview of all your projects and their status
- 🔄 **Status workflow** — Draft → In Progress → Review → Delivered
- 🤖 **AI-assisted planning** — smart suggestions for project structure
- 📊 **Progress tracking** — real-time stats on active, pending, and delivered work
- ⚡ **Powered by Base44** — instant setup, no backend required

## 🚀 Getting Started

```bash
git clone https://github.com/P-create-sumo/architect-ai.git
cd architect-ai
npm install
```

Create a `.env.local` file:

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

Run locally:

```bash
npm run dev
```

## 🛠 Tech Stack

- **React 18** + Vite
- **Tailwind CSS** + Radix UI
- **Base44 SDK** — entities, auth, AI
- **React Query** — data fetching

## 📦 Project Structure

```
src/
├── pages/          # Dashboard, Architect, ProjectDetail
├── components/     # Dashboard components, modals
├── api/            # Base44 client & entity bindings
└── hooks/          # Custom React hooks
```

## 📄 License

MIT — open source, free to use and modify.
