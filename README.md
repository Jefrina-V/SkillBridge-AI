# SkillBridge AI 🎓⚡

> **Bridge the gap between academic curricula and industry hiring demands.**  
> An intelligent full-stack career readiness platform powered by Google Gemini and semantic NLP that parses syllabi, detects technical skill gaps against real-world job vacancies, visualizes competencies in an interactive 3D galaxy, and delivers personalized 4-week learning roadmaps with practice assessments.

---

## 🌟 Overview

Academic syllabi frequently lag behind the fast-evolving tech industry. Students often complete computer science and software engineering degree programs without realizing their curriculum omitted critical industry requirements like modern frontend frameworks, containerization, cloud deployment, and automated testing.

**SkillBridge AI** automates the identification and closure of these knowledge gaps by:
1. **Extracting competencies** from uploaded course syllabi (PDF or text).
2. **Analyzing job postings** to extract modern employer requirements across languages, frameworks, databases, and DevOps tools.
3. **Calculating semantic skill-gap priority scores** (1–100) using multi-factor evaluation (demand weight, difficulty, syllabus overlap).
4. **Providing an interactive 3D Skill Galaxy** to explore competencies and their status in a spatial canvas.
5. **Generating a personalized 4-week study roadmap** with daily actionable tasks and interactive checklists.
6. **Offering AI-powered MCQ practice tests** with detailed explanations and instant feedback.
7. **Exporting comprehensive career-readiness audit reports** in PDF format.

---

## 🚀 Key Features

### 1. 📄 Intelligent Syllabus & Job Vacancy Extraction
- **PDF & Plain Text Parsing**: Drag-and-drop course syllabi or job descriptions directly into the analyzer.
- **Gemini AI + Deterministic Fallback**: Extracts technical skills, frameworks, programming languages, databases, cloud tools, and soft skills using Google Gemini with robust offline keyword and regex boundary matching.

### 2. 🎯 Multi-Factor Skill-Gap Priority Scoring
- **Automated Skill Alignment**: Compares curriculum coverage against market expectations.
- **Explainable Evidence Records**: Generates human-readable explanations detailing *why* a gap exists and offers specific remediation advice.
- **Priority Scoring (1–100)**: Evaluates gap urgency based on industry demand, difficulty, and partial knowledge transfer.

### 3. 🌌 Interactive 3D Skill Galaxy
- **Visual Spatial Canvas**: An interactive 3D orbital visualization of all analyzed competencies categorized by status:
  - 🟢 **Acquired / Covered in Syllabus**
  - 🟡 **Partial / Related Knowledge**
  - 🔴 **Critical Missing Industry Skills**
- Rotate, zoom, inspect, and select nodes to view granular gap details.

### 4. 📅 Adaptive 4-Week Actionable Roadmap
- **Pace Customization**: Adjust your target schedule (1, 2, or 3 hours/day).
- **Weekly Milestones & Daily Tasks**: Progressive skill building from foundational concepts to capstone projects.
- **Interactive Checklist**: Mark daily items as completed with progress tracking.

### 5. 📝 AI-Powered MCQ Practice Assessment
- **Curated & On-Demand Tests**: Practice questions across core technical skills (React, TypeScript, Next.js, Docker, SQL, etc.).
- **Dynamic AI Generation**: Generate custom questions at varying difficulty levels on demand using Google Gemini.
- **In-Depth Rationales**: Instant feedback with full conceptual explanations and key takeaways.

### 6. 📚 Curated Learning Resources
- Direct links to official documentation, interactive tracks, free certifications, and reference tutorials.
- Search and filter by skill, resource type (Course, Docs, Project), and free/paid status.

### 7. 📑 Exportable Career Readiness Reports
- Generate and download comprehensive PDF readiness reports containing executive summaries, skill gap matrices, and weekly study plans.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**:
  - [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) (Build tool & development server)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling & responsive layout)
  - [Lucide React](https://lucide.dev/) (Iconography)
  - [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF) (Client-side PDF report generation)
- **Backend & AI Engine**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Official Google GenAI SDK)
  - High-availability model tier fallback (`gemini-3.6-flash` ➔ `gemini-3.8-flash` ➔ `gemini-3.1-flash-lite`)
  - Server-side API proxy ensuring strict security for `GEMINI_API_KEY`
- **NLP & Algorithms**:
  - Jaccard n-gram and Levenshtein token similarity matching
  - Safe regular expression word-boundary parsing (`escapeRegExp`, `containsSkillWord`) for special-character competencies (`C++`, `C#`, `.NET`, `Jest / RTL`)

---

## 📂 Project Structure

```
skillbridge-ai/
├── src/
│   ├── components/
│   │   ├── AnalyzerView.tsx      # Syllabus & job vacancy input & file upload
│   │   ├── DashboardView.tsx     # Overview dashboard with summary metrics
│   │   ├── EvidenceModal.tsx     # Deep-dive modal explaining match evidence
│   │   ├── MCQPracticeView.tsx   # Interactive MCQ quiz and test engine
│   │   ├── Navbar.tsx            # Navigation header and view switcher
│   │   ├── ReportsView.tsx       # PDF report preview and export view
│   │   ├── ResourcesView.tsx     # Curated learning resource library
│   │   ├── RoadmapView.tsx       # 4-week adaptive learning roadmap
│   │   ├── SkillGalaxyView.tsx   # 3D orbital competency visualization
│   │   └── SkillGapsView.tsx     # Filterable matrix of identified skill gaps
│   ├── data/
│   │   ├── knowledgeBase.ts      # Curated resources, sample syllabi, and job descriptions
│   │   └── sampleRoadmap.ts      # Base roadmap generation templates
│   ├── utils/
│   │   ├── nlpSimilarity.ts      # Semantic matching, priority scoring, safe regex
│   │   ├── pdfExporter.ts        # PDF document compilation and download
│   │   ├── pdfExtractor.ts       # Client-side PDF text extraction
│   │   └── roadmapPlanner.ts     # Personalized schedule calculator
│   ├── App.tsx                   # Main state coordinator and view router
│   ├── main.tsx                  # React DOM entry point
│   ├── index.css                 # Tailwind CSS styles
│   └── types.ts                  # Shared TypeScript interfaces & types
├── server.ts                     # Express server & server-side Gemini API endpoints
├── vite.config.ts                # Vite configuration
├── metadata.json                 # Application metadata & capabilities
├── package.json                  # Dependencies & scripts
└── .env.example                  # Environment variable declarations
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **Google Gemini API Key**: [Get a Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/skillbridge-ai.git
   cd skillbridge-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *(SkillBridge AI includes deterministic local NLP fallbacks, so basic heuristic matching and mock quiz questions remain available even when the API key is not configured).*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Build & Production Deployment

1. **Build the production client and backend bundle**:
   ```bash
   npm run build
   ```
   This compiles the Vite frontend into `dist/` and bundles the backend server into `dist/server.cjs` via `esbuild`.

2. **Run the production server**:
   ```bash
   npm start
   ```

3. **Run TypeScript verification & linter**:
   ```bash
   npm run lint
   ```

---

## 🔒 Security Best Practices

- **Strict Server-Side Key Handling**: `GEMINI_API_KEY` is accessed exclusively in `server.ts` via Node's `process.env`.
- **Zero Frontend Leakage**: Client builds (`src/`) do not expose API keys or credentials.
- **Fail-Safe Operation**: All API endpoints feature graceful error handling and local heuristic fallbacks to ensure the UI remains functional under API rate limits or network issues.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
