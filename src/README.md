# 🏗️ Architect-AI — AI-powered assistant for designing scalable software architectures

---

## 🚀 NEXUS Intelligence Platform

> 📢 **BETA TESTERS WANTED:** Stiamo aprendo la piattaforma a un gruppo selezionato di tester esterni (Data Engineers, AI Architects, Power Users). Se vuoi testare l'orchestrazione agentica sui tuoi dati, apri una discussione nella sezione **Discussions** o candidati lasciando un feedback!

---

> A professional cloud infrastructure design tool for IT consultants — built with React + AI.

![Status](https://img.shields.io/badge/status-beta-violet)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Tailwind%20%7C%20Base44-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **Visual Diagram Canvas** — drag & drop AWS, Azure and GCP services onto an infinite canvas
- **AI Architect Chat** — describe your architecture in natural language, AI generates the diagram
- **Project Management Dashboard** — track client projects, statuses and budgets
- **Cost Estimator** — automatic monthly/annual cost projection based on selected services
- **Report Generator** — AI-powered executive summary + one-click PDF export
- **Template Library** — pre-built architectures (Serverless, Data Pipeline, RAG AI, Microservices, ML Platform, Event-Driven)
- **Version History** — save and restore diagram snapshots
- **Group / VPC Boxes** — draw logical boundaries on the canvas
- **PNG / PDF Export** — export diagrams for client presentations

---

## 🖼️ Screenshots

| Dashboard | Diagram Canvas | Cost Panel |
|-----------|---------------|------------|
| Project list with stats | Drag & drop + AI chat | Monthly cost breakdown |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Base44](https://base44.com) account (free tier available)

### Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/architect-ai.git
cd architect-ai
npm install
npm run dev
```

> **Note:** This app runs on the Base44 platform. Backend features (AI, database, auth) require a Base44 app ID configured in the environment.

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BACKEND_URL=https://api.architect-ai.base44.app
```

> 💡 **Where to find these values:** Go to your [Base44 Dashboard](https://base44.com/dashboard) → **Settings** → **API Keys**. Copy the App ID and the backend URL from there.

---

## 🧪 Testing

### Manual MVP Testing Checklist

1. **Dashboard** — Open the app, verify the project list loads correctly
2. **Create Project** — Click "New Project", fill in name + client, confirm it appears in the list
3. **Diagram Canvas** — Open a project, drag at least 2 services from the palette onto the canvas
4. **Connect Services** — Hover a node's side port and drag to another node to create an arrow
5. **AI Chat** — Open the AI Chat panel, type a description like _"3-tier web app on AWS"_ and verify a diagram is generated
6. **Cost Estimator** — Check that the left palette shows a cost estimate after adding services
7. **Export** — Click "Esporta" and verify PNG/PDF download works
8. **Version History** — Save a version, make changes, restore the version and confirm the diagram reverts

> Report any issues by opening a [GitHub Issue](../../issues) with the label `bug`.

---

## 🗂️ Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx        # Project list & stats
│   ├── ProjectDetail.jsx    # Diagram workspace per project
│   └── Architect.jsx        # Standalone free diagrammer
├── components/
│   ├── diagrammer/          # Canvas, nodes, arrows, palette, AI chat
│   └── project/             # Cost panel, report panel
├── lib/
│   ├── serviceLibrary.js    # AWS / Azure / GCP service definitions
│   ├── diagramTemplates.js  # Pre-built architecture templates
│   └── costEstimator.js     # Cost calculation logic
└── hooks/
    └── useVersioning.js     # Diagram version history
```

---

## 🧩 Supported Cloud Services

| Provider | Services |
|----------|----------|
| **AWS** | EC2, S3, RDS, Lambda, CloudFront, EKS, SQS, DynamoDB, Redshift, Kinesis, and more |
| **Azure** | VM, Blob Storage, SQL Database, Functions, CDN, AKS, Service Bus, Cosmos DB, and more |
| **GCP** | Compute Engine, Cloud Storage, Cloud SQL, Cloud Functions, Cloud CDN, GKE, BigQuery, and more |

---

## 🤖 AI Capabilities

The AI Architect Chat uses LLM to:
- Generate full architecture diagrams from a text description
- Explain architectural choices
- Suggest improvements to existing diagrams

---

## 🔄 How to Contribute (Pull Requests)

We welcome contributions! Here's the workflow:

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** — keep commits small and focused

3. **Push** your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

4. **Open a Pull Request** targeting the `main` branch:
   - Describe what you changed and why
   - Link the related issue (e.g. `Closes #42`)
   - Add screenshots if the UI changed

5. **Review** — a maintainer will review your PR within a few days. Be ready for feedback and requested changes.

6. **Merge** — once approved, your PR will be squash-merged into `main`.

> Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on code style, branch naming, and commit conventions.

---

## 🛣️ Roadmap

- [ ] Multi-user collaboration (real-time)
- [ ] Custom service icons
- [ ] Terraform / Bicep export
- [ ] Compliance check (GDPR, ISO 27001)
- [ ] Pricing API integration (live AWS/Azure/GCP pricing)
- [ ] Client portal (read-only share link)

---

## 📄 License

MIT © 2024 IT Architect Studio