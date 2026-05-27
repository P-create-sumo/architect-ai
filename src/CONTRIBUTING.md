# 🤝 Contributing to IT Architect Studio

Thank you for your interest in contributing! This document explains how to get involved.

---

## 🐛 Reporting Bugs

1. Check [existing issues](../../issues) to avoid duplicates
2. Open a new issue using the **Bug Report** template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser + OS version
   - Screenshot or screen recording if possible

---

## 💡 Suggesting Features

1. Open an issue using the **Feature Request** template
2. Describe the use case and the value it brings
3. If you have a design idea, attach a mockup or diagram

---

## 🛠️ Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/it-architect-studio.git
cd it-architect-studio
npm install
```

### 2. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-description
```

Branch naming convention:
- `feat/` — new feature
- `fix/` — bug fix
- `docs/` — documentation only
- `refactor/` — code refactoring
- `chore/` — tooling, deps, etc.

### 3. Make Your Changes

- Keep components small and focused (aim for < 100 lines per file)
- Follow existing code style (React functional components, Tailwind CSS)
- Don't add unnecessary dependencies

### 4. Test Your Changes

- Test manually in the browser
- Check both Dashboard and ProjectDetail flows
- Verify diagram interactions (drag, arrow, group)
- Test on mobile viewport as well

### 5. Commit & Push

```bash
git add .
git commit -m "feat: add terraform export button"
git push origin feat/your-feature-name
```

Commit message format: `type: short description` (lowercase, imperative)

### 6. Open a Pull Request

- Target branch: `main`
- Fill in the PR template
- Link the related issue (e.g. `Closes #42`)
- Add screenshots if UI changed

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/serviceLibrary.js` | Add new cloud services here |
| `src/lib/diagramTemplates.js` | Add new architecture templates here |
| `src/lib/costEstimator.js` | Update pricing logic here |
| `src/components/diagrammer/` | Canvas, nodes, palette, AI chat |
| `src/components/project/` | Cost and report panels |

---

## ➕ Adding a New Cloud Service

Edit `src/lib/serviceLibrary.js` and add an entry to `SERVICE_LIBRARY`:

```js
'aws-new-service': {
  id: 'aws-new-service',
  name: 'Short Name',
  fullName: 'AWS Full Service Name',
  provider: 'aws',
  category: 'compute',          // compute | storage | database | network | ai | security | integration
  icon: 'NS',                   // 2-3 char abbreviation or emoji
  iconType: 'text',             // 'text' | 'emoji'
  color: '#FF9900',
  bg: '#1a1a2e',
  description: 'What this service does.',
  monthlyCost: 50,              // estimated USD/month
},
```

---

## 🎨 UI Guidelines

- Dark theme only (canvas bg `#1a1f2e`, header `#131720`)
- Use existing Tailwind tokens from `tailwind.config.js`
- Rounded corners: `rounded-xl` or `rounded-2xl`
- Font sizes in palette/toolbar: `text-[11px]` or `text-xs`
- Use `framer-motion` for panel animations

---

## ❓ Questions

Open a [Discussion](../../discussions) or reach out via Issues. We're happy to help!