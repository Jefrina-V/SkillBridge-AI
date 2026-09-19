import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy GoogleGenAI initialization
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    try {
      genAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return genAiClient;
}

// Model fallback chain: gemini-3.6-flash -> gemini-3.8-flash -> gemini-3.1-flash-lite -> gemini-flash-latest
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callGemini(prompt: string, responseMimeType: string = 'application/json'): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;

  for (const model of GEMINI_MODELS) {
    // Attempt up to 2 times per model with short backoff for transient 503/429 demand spikes
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType
          }
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        const status = err?.status || err?.code || 500;
        const msg = String(err?.message || '');
        const isTransient = status === 503 || status === 429 || msg.includes('high demand') || msg.includes('UNAVAILABLE');

        if (isTransient && attempt === 1) {
          await sleep(500);
          continue;
        }

        console.log(`[SkillBridge AI] Model ${model} temporarily unavailable (code: ${status}), trying next fallback`);
        break;
      }
    }
  }
  return null;
}

function containsSkillWord(text: string, skill: string): boolean {
  if (!text || !skill) return false;
  const trimmed = skill.trim();
  if (!trimmed) return false;
  try {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+.-])${escaped}(?=$|[^a-zA-Z0-9_#+.-])`, 'i');
    return pattern.test(text);
  } catch {
    return text.toLowerCase().includes(trimmed.toLowerCase());
  }
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge AI Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 1. Syllabus Skill Extraction API
app.post('/api/syllabus/extract', async (req: Request, res: Response) => {
  try {
    const { text, courseTitle = 'University Course' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required for syllabus extraction.' });
    }

    const prompt = `You are a curriculum analysis AI. Extract all technical competencies from the following university syllabus text.
Output MUST be a valid JSON object strictly adhering to this structure:
{
  "courseTitle": "${courseTitle}",
  "topics": ["topic 1", "topic 2"],
  "technicalSkills": ["HTML", "CSS", "JavaScript", "SQL", "PHP"],
  "toolsAndFrameworks": ["MySQL", "Apache"],
  "programmingLanguages": ["JavaScript", "PHP", "SQL"],
  "databases": ["MySQL"]
}

SYLLABUS TEXT:
${text.slice(0, 8000)}`;

    const geminiText = await callGemini(prompt, 'application/json');
    if (geminiText) {
      try {
        const parsed = JSON.parse(geminiText);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini syllabus response:', parseErr);
      }
    }

    // Heuristic NLP fallback
    const techSkillKeywords = [
      'HTML', 'HTML5', 'CSS', 'CSS3', 'JavaScript', 'TypeScript', 'PHP', 'Python',
      'Java', 'C++', 'C#', 'SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'MongoDB',
      'Apache', 'Nginx', 'AJAX', 'DOM', 'JSON', 'REST', 'Git', 'Linux',
      'Algorithms', 'Data Structures', 'OOP', 'Networking', 'Security'
    ];

    const foundSkills = techSkillKeywords.filter(k => containsSkillWord(text, k));

    return res.json({
      success: true,
      data: {
        courseTitle,
        topics: ['Core Theory & Principles', 'Implementation Labs', 'Database & Connectivity'],
        technicalSkills: foundSkills.length > 0 ? foundSkills : ['Web Fundamentals', 'Scripting', 'Data Management'],
        toolsAndFrameworks: foundSkills.filter(s => ['MySQL', 'PostgreSQL', 'Apache', 'Git'].includes(s)),
        programmingLanguages: foundSkills.filter(s => ['JavaScript', 'TypeScript', 'PHP', 'Python', 'Java', 'C++', 'SQL'].includes(s)),
        databases: foundSkills.filter(s => ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'SQL'].includes(s))
      },
      source: 'semantic-nlp'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error in syllabus extraction' });
  }
});

// 2. Job Description Skill Extraction API
app.post('/api/jobs/extract', async (req: Request, res: Response) => {
  try {
    const { text, role = 'Target Job' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const prompt = `You are a technical recruitment AI analyzer. Extract structured skill requirements from this job description.
Return a valid JSON object matching:
{
  "role": "${role}",
  "technicalSkills": ["React", "TypeScript", "Next.js", "REST APIs", "Git", "Testing"],
  "programmingLanguages": ["TypeScript", "JavaScript"],
  "frameworks": ["React", "Next.js"],
  "databases": ["PostgreSQL"],
  "cloudTechnologies": ["Vercel", "AWS", "Docker"],
  "tools": ["Git", "Jest", "Tailwind CSS"],
  "softSkills": ["Communication", "Teamwork", "Problem Solving"]
}

JOB DESCRIPTION:
${text.slice(0, 8000)}`;

    const geminiText = await callGemini(prompt, 'application/json');
    if (geminiText) {
      try {
        const parsed = JSON.parse(geminiText);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini job response:', parseErr);
      }
    }

    // Heuristic fallback
    const commonJobSkills = [
      'React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs',
      'GraphQL', 'Git', 'Testing', 'Jest', 'Tailwind CSS', 'Node.js', 'Express',
      'Python', 'FastAPI', 'Docker', 'PostgreSQL', 'CI/CD', 'AWS', 'Communication'
    ];

    const detected = commonJobSkills.filter(s => containsSkillWord(text, s));

    return res.json({
      success: true,
      data: {
        role,
        technicalSkills: detected.length > 0 ? detected : ['Modern Web Stack', 'Version Control', 'API Integration'],
        programmingLanguages: detected.filter(s => ['TypeScript', 'JavaScript', 'Python'].includes(s)),
        frameworks: detected.filter(s => ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI'].includes(s)),
        databases: detected.filter(s => ['PostgreSQL', 'MongoDB'].includes(s)),
        cloudTechnologies: detected.filter(s => ['Docker', 'AWS', 'CI/CD'].includes(s)),
        tools: detected.filter(s => ['Git', 'Jest', 'Testing', 'Tailwind CSS'].includes(s)),
        softSkills: ['Written & Verbal Communication', 'Collaborative Teamwork', 'System Thinking']
      },
      source: 'semantic-nlp'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error in job extraction' });
  }
});

// 3. AI Smart Explanation & Recommendation Endpoint
app.post('/api/analysis/explain', async (req: Request, res: Response) => {
  try {
    const { skillName, status, syllabusSkills, jobRole } = req.body;

    const prompt = `You are the explainable AI engine for SkillBridge AI.
Generate a concise, factual, evidence-based 2-sentence explanation of why the skill "${skillName}" is classified as "${status}" for the target role "${jobRole}".
Context: The syllabus explicitly covers [${(syllabusSkills || []).join(', ')}].
Provide:
1. Reason (why it's classified as ${status})
2. Concrete action recommendation for the student.
Return JSON:
{
  "reason": "string",
  "recommendation": "string"
}`;

    const geminiText = await callGemini(prompt, 'application/json');
    if (geminiText) {
      try {
        return res.json({ success: true, data: JSON.parse(geminiText) });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini explain response:', parseErr);
      }
    }

    return res.json({
      success: true,
      data: {
        reason: `${skillName} was classified as ${status} based on curriculum coverage and prerequisite alignment.`,
        recommendation: `Follow the prioritized 4-week roadmap to build competency in ${skillName}.`
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AI-Generated Practice MCQs for Missed Skills
app.post('/api/mcq/generate', async (req: Request, res: Response) => {
  try {
    const { skillName, count = 4, difficulty = 'Intermediate' } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'skillName is required' });
    }

    const prompt = `You are a senior technical interviewer and educator for SkillBridge AI.
Generate ${count} high-quality, practical Multiple Choice Questions (MCQs) for the technical skill: "${skillName}" at "${difficulty}" difficulty level.
These questions are designed to help students bridge their curriculum gap and develop real-world engineering mastery.

Output MUST be a valid JSON array of objects strictly matching this schema:
[
  {
    "id": "gen-1",
    "skillName": "${skillName}",
    "category": "Technical Competency",
    "difficulty": "${difficulty}",
    "question": "Clear, practical technical question targeting real-world engineering scenarios or concepts",
    "codeSnippet": "// optional code snippet if relevant, or empty string",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Detailed explanation of why the correct answer is right and why other options are incorrect.",
    "takeawayTip": "1-sentence actionable engineering best practice"
  }
]`;

    const geminiText = await callGemini(prompt, 'application/json');
    if (geminiText) {
      try {
        const parsed = JSON.parse(geminiText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ success: true, questions: parsed, source: 'gemini' });
        }
      } catch (parseErr) {
        console.warn('Failed to parse Gemini MCQ response:', parseErr);
      }
    }

    return res.json({
      success: true,
      questions: [],
      source: 'fallback'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VITE / STATIC SERVING ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillBridge AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
