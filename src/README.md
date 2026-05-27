# 🏗️ IT Architect Studio

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
git clone https://github.com/YOUR_USERNAME/it-architect-studio.git
cd it-architect-studio
npm install
npm run dev
```

> **Note:** This app runs on the Base44 platform. Backend features (AI, database, auth) require a Base44 app ID configured in the environment.

### Environment

The app uses Base44's built-in backend — no separate server needed. The `BASE44_APP_ID` is injected automatically when running inside the platform.

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

## 🛣️ Roadmap

- [ ] Multi-user collaboration (real-time)
- [ ] Custom service icons
- [ ] Terraform / Bicep export
- [ ] Compliance check (GDPR, ISO 27001)
- [ ] Pricing API integration (live AWS/Azure/GCP pricing)
- [ ] Client portal (read-only share link)

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a PR.

---

## 📄 License

MIT © 2024 IT Architect Studio