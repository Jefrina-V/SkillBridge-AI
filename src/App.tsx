import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { AnalyzerView } from './components/AnalyzerView';
import { SkillGapsView } from './components/SkillGapsView';
import { RoadmapView } from './components/RoadmapView';
import { ResourcesView } from './components/ResourcesView';
import { ReportsView } from './components/ReportsView';
import { EvidenceModal } from './components/EvidenceModal';
import { SkillGraphModal } from './components/SkillGraphModal';
import { AuthModalOrPage } from './components/AuthModalOrPage';
import { GalaxyView } from './components/GalaxyView';
import { MCQPracticeView } from './components/MCQPracticeView';

import { OverallAnalysis, SkillGapItem, PersonalizedRoadmap, AuthUser } from './types';
import { SAMPLE_SYLLABI, SAMPLE_JOBS } from './data/sampleData';
import { SKILL_KNOWLEDGE_BASE } from './data/knowledgeBase';
import {
  matchSkillAgainstSyllabus,
  calculatePriorityScore,
  buildEvidenceRecord,
  normalizeSkillName,
  containsSkillWord
} from './utils/nlpSimilarity';
import { generatePersonalizedRoadmap } from './utils/roadmapPlanner';
import { GitMerge, Sparkles, BookOpen, Layers, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    // Default initial user for instant preview
    return {
      id: 'usr_demo_1',
      name: 'Alex Mercer',
      email: 'alex.mercer@student.edu',
      role: 'student',
      institution: 'UC Berkeley',
      targetRole: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
  });


  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  // Active Analysis State
  const [analysis, setAnalysis] = useState<OverallAnalysis>(() => {
    return runInitialAnalysis();
  });

  // Active Roadmap State
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap>(() => {
    const initialAnalysis = runInitialAnalysis();
    return generatePersonalizedRoadmap(initialAnalysis.gaps, initialAnalysis.jobRole, 2);
  });

  // UI Modals
  const [selectedEvidenceGap, setSelectedEvidenceGap] = useState<SkillGapItem | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);
  const [resourceFilterSkill, setResourceFilterSkill] = useState<string>('all');
  const [mcqTargetSkill, setMcqTargetSkill] = useState<string>('React');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);


  // Function to compute analysis based on syllabus text and job text
  function computeAnalysis(
    syllabusText: string,
    courseTitle: string,
    jobText: string,
    jobTitle: string,
    syllabusSkills: string[],
    jobSkills: string[],
    thresholds: { covered: number; partial: number }
  ): OverallAnalysis {
    let coveredCount = 0;
    let partialCount = 0;
    let missingCount = 0;

    const gaps: SkillGapItem[] = jobSkills.map((jobSkill, idx) => {
      const match = matchSkillAgainstSyllabus(jobSkill, syllabusSkills, syllabusText);
      let status: SkillGapItem['status'] = 'missing';

      if (match.similarityScore >= thresholds.covered) {
        status = 'covered';
        coveredCount++;
      } else if (match.similarityScore >= thresholds.partial || match.isPartialConcept) {
        status = 'partial';
        partialCount++;
      } else {
        status = 'missing';
        missingCount++;
      }

      const { score: priorityScore, level: priorityLevel } = calculatePriorityScore(
        jobSkill,
        status,
        syllabusSkills
      );

      const evidence = buildEvidenceRecord(
        jobSkill,
        status,
        match.similarityScore,
        syllabusSkills,
        match.bestMatchSkill || undefined
      );

      const canonical = normalizeSkillName(jobSkill);
      const kb = SKILL_KNOWLEDGE_BASE[canonical];
      const learningHours = kb ? kb.estLearningHours : 15;
      const category = kb ? kb.category : 'Technical Skill';

      return {
        id: `gap-${idx}-${Date.now()}`,
        skillName: jobSkill,
        category,
        status,
        similarityScore: match.similarityScore,
        priorityScore,
        priorityLevel,
        matchedSyllabusSkill: match.bestMatchSkill || undefined,
        evidence,
        learningHours
      };
    });

    // Alignment percentage calculation (Covered = 1.0, Partial = 0.5)
    const totalCount = jobSkills.length;
    const weightedPoints = (coveredCount * 1.0) + (partialCount * 0.5);
    const alignmentPercentage = totalCount > 0 ? Math.round((weightedPoints / totalCount) * 100) : 0;

    return {
      id: `audit-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      courseName: courseTitle,
      jobRole: jobTitle,
      alignmentPercentage,
      coveredCount,
      partialCount,
      missingCount,
      totalJobSkills: totalCount,
      thresholds,
      gaps,
      syllabusSkills,
      jobSkills
    };
  }

  // Initial demo analysis factory
  function runInitialAnalysis(): OverallAnalysis {
    const sampleSyllabus = SAMPLE_SYLLABI[0];
    const sampleJob = SAMPLE_JOBS[0];
    return computeAnalysis(
      sampleSyllabus.content,
      sampleSyllabus.courseTitle,
      sampleJob.description,
      sampleJob.title,
      sampleSyllabus.expectedSkills,
      sampleJob.expectedSkills,
      { covered: 0.80, partial: 0.60 }
    );
  }

  // Start Analysis via Server AI endpoint with local fallback
  const handleStartAnalysis = async (
    syllabusText: string,
    syllabusTitle: string,
    jobText: string,
    jobTitle: string,
    thresholds: { covered: number; partial: number }
  ) => {
    setIsAnalyzing(true);
    try {
      // 1. Attempt server AI extraction for syllabus
      let extractedSyllabusSkills: string[] = [];
      try {
        const sylRes = await fetch('/api/syllabus/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: syllabusText, courseTitle: syllabusTitle })
        });
        if (sylRes.ok) {
          const json = await sylRes.json();
          if (json.data && json.data.technicalSkills) {
            extractedSyllabusSkills = json.data.technicalSkills;
          }
        }
      } catch (err) {
        console.warn('Backend syllabus extraction fallback to local:', err);
      }

      // If backend was offline or empty, use heuristic extraction
      if (extractedSyllabusSkills.length === 0) {
        const keywords = ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'SQL', 'Apache', 'AJAX', 'DOM Manipulation', 'C++', 'Java', 'Python', 'Algorithms', 'Data Structures'];
        extractedSyllabusSkills = keywords.filter(k => containsSkillWord(syllabusText, k));
        if (extractedSyllabusSkills.length === 0) {
          extractedSyllabusSkills = ['Web Fundamentals', 'Database Concepts', 'Client-Side Scripting'];
        }
      }

      // 2. Attempt server AI extraction for Job Description
      let extractedJobSkills: string[] = [];
      try {
        const jobRes = await fetch('/api/jobs/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jobText, role: jobTitle })
        });
        if (jobRes.ok) {
          const json = await jobRes.json();
          if (json.data && json.data.technicalSkills) {
            extractedJobSkills = json.data.technicalSkills;
          }
        }
      } catch (err) {
        console.warn('Backend job extraction fallback to local:', err);
      }

      if (extractedJobSkills.length === 0) {
        const jobKeywords = ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git', 'Testing (Jest / RTL)', 'Tailwind CSS', 'GraphQL', 'CI/CD Pipelines', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Machine Learning'];
        extractedJobSkills = jobKeywords.filter(k => containsSkillWord(jobText, k));
        if (extractedJobSkills.length === 0) {
          extractedJobSkills = ['Core Engineering', 'Problem Solving', 'System Design'];
        }
      }

      // 3. Compute semantic gap analysis
      const newAnalysis = computeAnalysis(
        syllabusText,
        syllabusTitle,
        jobText,
        jobTitle,
        extractedSyllabusSkills,
        extractedJobSkills,
        thresholds
      );

      // 4. Generate fresh 4-week roadmap
      const newRoadmap = generatePersonalizedRoadmap(
        newAnalysis.gaps,
        jobTitle,
        roadmap.studyPaceHoursPerDay
      );

      setAnalysis(newAnalysis);
      setRoadmap(newRoadmap);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Analysis execution failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle roadmap task completion
  const handleToggleRoadmapTask = (weekIdx: number, dayIdx: number) => {
    setRoadmap(prev => {
      const updatedWeeks = prev.weeks.map((week, wIdx) => {
        if (wIdx !== weekIdx) return week;
        const updatedDays = week.days.map((day, dIdx) => {
          if (dIdx !== dayIdx) return day;
          return { ...day, completed: !day.completed };
        });
        return { ...week, days: updatedDays };
      });
      return { ...prev, weeks: updatedWeeks };
    });
  };

  // Change roadmap pace (1, 2, or 3 hours/day)
  const handleChangeRoadmapPace = (pace: 1 | 2 | 3) => {
    const updated = generatePersonalizedRoadmap(analysis.gaps, analysis.jobRole, pace);
    setRoadmap(updated);
  };

  const handleResetToDemo = () => {
    const initial = runInitialAnalysis();
    setAnalysis(initial);
    setRoadmap(generatePersonalizedRoadmap(initial.gaps, initial.jobRole, 2));
    setActiveTab('dashboard');
  };

  const handleNavigateToResources = (skillName: string) => {
    setResourceFilterSkill(skillName);
    setActiveTab('resources');
  };

  const handleNavigateToMCQ = (skillName: string) => {
    setMcqTargetSkill(skillName);
    setActiveTab('mcq-practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('skillbridge_auth_user');
    setCurrentUser(null);
    setAuthNotification('You have been logged out successfully.');
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    localStorage.setItem('skillbridge_auth_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setAuthNotification(`Welcome back, ${user.name}!`);
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResetToDemo={handleResetToDemo}
        alignmentScore={analysis.alignmentPercentage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth notification toast */}
      {authNotification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">{authNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthNotification(null)}
              className="text-emerald-400 hover:text-white font-bold ml-4"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating Quick Action Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target: <strong className="text-white">{analysis.jobRole}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('3d-galaxy')}
              className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors shadow-sm cursor-pointer ${
                activeTab === '3d-galaxy'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>3D Skill Galaxy</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGraphModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <GitMerge className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Prerequisite Graphs</span>
            </button>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === '3d-galaxy' && (
          <GalaxyView
            analysis={analysis}
            onNavigate={setActiveTab}
            onOpenEvidence={setSelectedEvidenceGap}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            analysis={analysis}
            onNavigate={setActiveTab}
            onOpenEvidence={setSelectedEvidenceGap}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzerView
            onStartAnalysis={handleStartAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'skill-gaps' && (
          <SkillGapsView
            analysis={analysis}
            onOpenEvidence={setSelectedEvidenceGap}
            onNavigateToResources={handleNavigateToResources}
            onNavigateToMCQ={handleNavigateToMCQ}
          />
        )}

        {activeTab === 'mcq-practice' && (
          <MCQPracticeView
            analysis={analysis}
            initialSelectedSkill={mcqTargetSkill}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onNavigateToResources={handleNavigateToResources}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            onChangePace={handleChangeRoadmapPace}
            onToggleTaskComplete={handleToggleRoadmapTask}
            onRegenerate={() => handleChangeRoadmapPace(roadmap.studyPaceHoursPerDay)}
            onNavigateToResources={handleNavigateToResources}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            analysis={analysis}
            initialSelectedSkill={resourceFilterSkill}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView analysis={analysis} />
        )}
      </main>


      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">SkillBridge AI</span>
            <span>•</span>
            <span>Deterministic NLP &amp; Semantic Skill Alignment Platform</span>
          </div>
          <div>
            Built with React 19, TypeScript, Tailwind CSS &amp; Google GenAI
          </div>
        </div>
      </footer>

      {/* Evidence Inspection Modal */}
      <EvidenceModal
        gap={selectedEvidenceGap}
        onClose={() => setSelectedEvidenceGap(null)}
        onNavigateToResources={handleNavigateToResources}
        onNavigateToMCQ={handleNavigateToMCQ}
      />

      {/* Skill Prerequisite Graph Modal */}
      <SkillGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        onSelectSkill={handleNavigateToResources}
      />

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModalOrPage
          isModal={true}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

