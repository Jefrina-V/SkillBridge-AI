export type SkillMatchStatus = 'covered' | 'partial' | 'missing' | 'related';

export type PriorityLevel = 'Very High' | 'High' | 'Medium' | 'Low';

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Programming Language' | 'AI & Data' | 'Testing & Tools' | 'Soft Skills';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estLearningHours: number;
  prerequisites: string[];
  relatedSkills: string[];
  industryRelevance: number; // 0-100
  marketFrequency: number; // e.g. 742 / 1250 jobs
  totalMarketSample: number; // 1250
}

export interface ExtractedSkill {
  name: string;
  category?: string;
  contextSnippet?: string;
  confidence?: number;
}

export interface SyllabusAnalysisResult {
  courseTitle: string;
  department?: string;
  semester?: number;
  topics: string[];
  technicalSkills: string[];
  toolsAndFrameworks: string[];
  programmingLanguages: string[];
  databases: string[];
  rawTextPreview: string;
}

export interface JobAnalysisResult {
  role: string;
  companyTier?: string;
  technicalSkills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloudTechnologies: string[];
  tools: string[];
  softSkills: string[];
  experienceRequirements?: string;
  educationRequirements?: string;
}

export interface SkillGapItem {
  id: string;
  skillName: string;
  category: string;
  status: SkillMatchStatus;
  similarityScore: number; // 0.0 - 1.0
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  matchedSyllabusSkill?: string;
  evidence: {
    marketFrequency: string; // e.g., "Appears in 742 out of 1,250 analyzed jobs (59.4%)"
    syllabusCoverageStatus: string;
    prerequisitesMet: string[];
    prerequisitesMissing: string[];
    reason: string;
    recommendation: string;
  };
  learningHours: number;
}

export interface OverallAnalysis {
  id: string;
  timestamp: string;
  courseName: string;
  jobRole: string;
  alignmentPercentage: number;
  coveredCount: number;
  partialCount: number;
  missingCount: number;
  totalJobSkills: number;
  thresholds: {
    covered: number; // e.g. 0.80
    partial: number; // e.g. 0.60
  };
  gaps: SkillGapItem[];
  syllabusSkills: string[];
  jobSkills: string[];
}

export interface RoadmapDay {
  day: number;
  title: string;
  tasks: string[];
  durationMinutes: number;
  completed: boolean;
  resourceTip?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  targetSkill: string;
  days: RoadmapDay[];
}

export interface PersonalizedRoadmap {
  id: string;
  analysisId: string;
  studyPaceHoursPerDay: 1 | 2 | 3;
  targetRole: string;
  totalHours: number;
  weeks: RoadmapWeek[];
  createdAt: string;
}

export interface LearningResource {
  id: string;
  skill: string;
  title: string;
  url: string;
  type: 'Documentation' | 'Course' | 'Interactive' | 'Project' | 'Book' | 'Repository' | 'Tutorial';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  description: string;
  isFree: boolean;
  provider: string;
}

export interface UniversityCourse {
  id: string;
  code: string;
  name: string;
  semester: number;
  instructor?: string;
  coveredSkills: string[];
  syllabusFileName?: string;
  syllabusText?: string;
}

export interface UniversityCurriculumAudit {
  universityName: string;
  department: string;
  academicYear: string;
  courses: UniversityCourse[];
  targetBenchmarkRoles: string[];
  overallAlignmentPercentage: number;
  totalUniqueSkillsCovered: number;
  redundantSkills: { skill: string; appearedInCourses: string[] }[];
  criticalGapsAcrossDepartment: { skill: string; missingFrequency: number; priority: PriorityLevel }[];
  emergingSkillsNotAddressed: string[];
  facultyRecommendations: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  avatar?: string;
  institution?: string;
  targetRole?: string;
  createdAt: string;
}

export type MasteryLevel = 'Needs Practice' | 'Developing' | 'Proficient' | 'Mastered';

export interface MCQQuestion {
  id: string;
  skillName: string;
  category?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  takeawayTip?: string;
}

export interface QuizUserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

export interface QuizAttemptRecord {
  id: string;
  skillName: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds?: number;
  userAnswers: QuizUserAnswer[];
}

export interface SkillProgressSummary {
  skillName: string;
  gapStatus: 'missing' | 'partial' | 'covered';
  priorityLevel: string;
  totalQuizzesTaken: number;
  firstScore: number | null;
  latestScore: number | null;
  bestScore: number | null;
  improvementDelta: number; // e.g. +30%
  masteryLevel: MasteryLevel;
  lastPracticedAt?: string;
  history: { date: string; score: number }[];
}
