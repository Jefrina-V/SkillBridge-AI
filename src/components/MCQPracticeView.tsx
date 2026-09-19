import React, { useState, useEffect } from 'react';
import { OverallAnalysis, SkillGapItem, MCQQuestion, QuizAttemptRecord, SkillProgressSummary, MasteryLevel } from '../types';
import { 
  getQuestionsForSkill, 
  getDiagnosticQuizForMissedSkills, 
  buildInitialProgressSummaries 
} from '../data/mcqBank';
import confetti from 'canvas-confetti';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  Zap, 
  BarChart2, 
  Check, 
  Flame, 
  Loader2, 
  RefreshCw,
  Clock,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

interface MCQPracticeViewProps {
  analysis: OverallAnalysis;
  initialSelectedSkill?: string;
  onNavigateToRoadmap?: () => void;
  onNavigateToResources?: (skill: string) => void;
}

export const MCQPracticeView: React.FC<MCQPracticeViewProps> = ({
  analysis,
  initialSelectedSkill,
  onNavigateToRoadmap,
  onNavigateToResources
}) => {
  // Extract all missed and partial skills
  const missedGaps = analysis.gaps.filter(g => g.status === 'missing' || g.status === 'partial');
  const missedSkillNames = missedGaps.map(g => g.skillName);

  // Selected skill to practice or 'comprehensive'
  const [selectedSkill, setSelectedSkill] = useState<string>(() => {
    if (initialSelectedSkill && initialSelectedSkill !== 'all') {
      const match = missedSkillNames.find(s => s.toLowerCase() === initialSelectedSkill.toLowerCase());
      if (match) return match;
    }
    return missedSkillNames[0] || 'React';
  });

  // Persistent Progress Summaries
  const [progressMap, setProgressMap] = useState<Record<string, SkillProgressSummary>>(() => {
    return buildInitialProgressSummaries(missedGaps);
  });

  // Attempt History
  const [attemptHistory, setAttemptHistory] = useState<QuizAttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem('skillbridge_mcq_attempts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse attempt history:', e);
    }
    return [
      {
        id: 'att-1',
        skillName: 'TypeScript',
        completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        totalQuestions: 3,
        correctAnswers: 1,
        scorePercentage: 33,
        userAnswers: []
      },
      {
        id: 'att-2',
        skillName: 'TypeScript',
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        totalQuestions: 3,
        correctAnswers: 2,
        scorePercentage: 67,
        userAnswers: []
      },
      {
        id: 'att-3',
        skillName: 'React',
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        totalQuestions: 4,
        correctAnswers: 3,
        scorePercentage: 75,
        userAnswers: []
      }
    ];
  });

  // Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<MCQQuestion[]>([]);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [isLoadingAIQuestions, setIsLoadingAIQuestions] = useState<boolean>(false);
  const [lastFinishedResult, setLastFinishedResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    improvement: number;
    previousScore: number | null;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillbridge_mcq_progress', JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e);
    }
  }, [progressMap]);

  useEffect(() => {
    try {
      localStorage.setItem('skillbridge_mcq_attempts', JSON.stringify(attemptHistory));
    } catch (e) {
      console.warn('Failed to save attempts to localStorage:', e);
    }
  }, [attemptHistory]);

  // Update selected skill if prop changes
  useEffect(() => {
    if (initialSelectedSkill && initialSelectedSkill !== 'all') {
      const match = missedSkillNames.find(s => s.toLowerCase() === initialSelectedSkill.toLowerCase());
      if (match) {
        setSelectedSkill(match);
      }
    }
  }, [initialSelectedSkill]);

  // Launch a new quiz session
  const startQuizForSkill = async (skillToTest: string) => {
    setSelectedSkill(skillToTest);
    setIsLoadingAIQuestions(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsQuizFinished(false);
    setLastFinishedResult(null);

    let questions: MCQQuestion[] = [];

    // Check if user requested comprehensive diagnostic
    if (skillToTest === 'comprehensive') {
      questions = getDiagnosticQuizForMissedSkills(missedSkillNames, 6);
    } else {
      // Try to fetch dynamic AI questions from backend API with fallback
      try {
        const res = await fetch('/api/mcq/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillName: skillToTest, count: 4 })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          questions = data.questions;
        }
      } catch (err) {
        console.warn('Could not fetch AI MCQs, using curated bank:', err);
      }

      if (questions.length === 0) {
        questions = getQuestionsForSkill(skillToTest, 4);
      }
    }

    setActiveQuizQuestions(questions);
    setIsLoadingAIQuestions(false);
    setIsQuizActive(true);
  };

  const handleSelectOption = (idx: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => [...prev, selectedOption]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const total = activeQuizQuestions.length;
    let correct = 0;
    const finalAnswers = [...userAnswers];

    activeQuizQuestions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const scorePercentage = Math.round((correct / total) * 100);

    // Trigger celebration confetti for strong scores
    if (scorePercentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // Determine improvement relative to past attempts
    const existing = progressMap[selectedSkill];
    const previousScore = existing?.latestScore ?? null;
    const firstScore = existing?.firstScore ?? scorePercentage;
    const improvement = previousScore !== null ? scorePercentage - previousScore : 0;

    // Calculate new mastery level
    let newMastery: MasteryLevel = 'Needs Practice';
    const effectiveBest = Math.max(existing?.bestScore ?? 0, scorePercentage);
    if (effectiveBest >= 90) newMastery = 'Mastered';
    else if (effectiveBest >= 70) newMastery = 'Proficient';
    else if (effectiveBest >= 50) newMastery = 'Developing';

    // Update Progress Map
    setProgressMap(prev => {
      const current = prev[selectedSkill] || {
        skillName: selectedSkill,
        gapStatus: 'missing',
        priorityLevel: 'High',
        totalQuizzesTaken: 0,
        firstScore: scorePercentage,
        latestScore: scorePercentage,
        bestScore: scorePercentage,
        improvementDelta: 0,
        masteryLevel: newMastery,
        history: []
      };

      const updatedHistory = [
        ...(current.history || []),
        { date: new Date().toISOString(), score: scorePercentage }
      ];

      const initialScore = current.firstScore ?? scorePercentage;
      const totalDelta = scorePercentage - initialScore;

      return {
        ...prev,
        [selectedSkill]: {
          ...current,
          totalQuizzesTaken: current.totalQuizzesTaken + 1,
          firstScore: initialScore,
          latestScore: scorePercentage,
          bestScore: Math.max(current.bestScore ?? 0, scorePercentage),
          improvementDelta: totalDelta,
          masteryLevel: newMastery,
          lastPracticedAt: new Date().toISOString(),
          history: updatedHistory
        }
      };
    });

    // Record Attempt
    const newAttempt: QuizAttemptRecord = {
      id: `att-${Date.now()}`,
      skillName: selectedSkill === 'comprehensive' ? 'Comprehensive Gap Diagnostic' : selectedSkill,
      completedAt: new Date().toISOString(),
      totalQuestions: total,
      correctAnswers: correct,
      scorePercentage,
      userAnswers: activeQuizQuestions.map((q, idx) => ({
        questionId: q.id,
        selectedOption: finalAnswers[idx],
        isCorrect: finalAnswers[idx] === q.correctAnswerIndex
      }))
    };

    setAttemptHistory(prev => [newAttempt, ...prev.slice(0, 19)]);
    setLastFinishedResult({
      score: correct,
      total,
      percentage: scorePercentage,
      improvement,
      previousScore
    });
    setIsQuizFinished(true);
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset quiz progress and test scores for missed skills?')) {
      const fresh = buildInitialProgressSummaries(missedGaps);
      // clear simulated progress for clean reset
      Object.keys(fresh).forEach(k => {
        fresh[k].totalQuizzesTaken = 0;
        fresh[k].firstScore = null;
        fresh[k].latestScore = null;
        fresh[k].bestScore = null;
        fresh[k].improvementDelta = 0;
        fresh[k].masteryLevel = 'Needs Practice';
        fresh[k].history = [];
      });
      setProgressMap(fresh);
      setAttemptHistory([]);
      localStorage.removeItem('skillbridge_mcq_progress');
      localStorage.removeItem('skillbridge_mcq_attempts');
    }
  };

  // Helper calculations for high-level progress KPIs
  const totalMissedSkills = missedSkillNames.length;
  const practicedSkills = Object.values(progressMap).filter(p => p.totalQuizzesTaken > 0);
  const masteredSkills = Object.values(progressMap).filter(p => p.masteryLevel === 'Mastered' || p.masteryLevel === 'Proficient');
  
  const averageImprovement = practicedSkills.length > 0
    ? Math.round(practicedSkills.reduce((acc, curr) => acc + curr.improvementDelta, 0) / practicedSkills.length)
    : 0;

  const averageLatestScore = practicedSkills.length > 0
    ? Math.round(practicedSkills.reduce((acc, curr) => acc + (curr.latestScore || 0), 0) / practicedSkills.length)
    : 0;

  // Chart data: Comparing Initial Score vs Latest Score
  const comparisonChartData = missedSkillNames.map(skillName => {
    const prog = progressMap[skillName];
    return {
      skill: skillName.length > 14 ? skillName.slice(0, 12) + '...' : skillName,
      fullName: skillName,
      initial: prog?.firstScore ?? 0,
      latest: prog?.latestScore ?? 0,
      best: prog?.bestScore ?? 0
    };
  });

  const currentQ = activeQuizQuestions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1 tracking-wide uppercase">
              <Zap className="h-4 w-4" />
              <span>Skill Gap Remediation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Missed Skills Practice &amp; Mastery Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Take interactive multiple-choice assessments targeting the exact competencies missing from your university syllabus. Track your score deltas and prove measurable competency growth.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => startQuizForSkill('comprehensive')}
              disabled={isLoadingAIQuestions}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Comprehensive Gap Quiz</span>
            </button>
          </div>
        </div>

        {/* Progress KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Skills Assessed</span>
              <Award className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-white">
                {practicedSkills.length}
              </span>
              <span className="text-xs text-slate-400">of {totalMissedSkills} gaps</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (practicedSkills.length / Math.max(1, totalMissedSkills)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Mastered / Proficient</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-emerald-400">
                {masteredSkills.length}
              </span>
              <span className="text-xs text-slate-400">competencies</span>
            </div>
            <p className="text-[11px] text-emerald-300 mt-1">
              {masteredSkills.length > 0 ? 'Verified ready for interview' : 'Practice to verify'}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average Improvement</span>
              <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-sky-400">
                {averageImprovement >= 0 ? `+${averageImprovement}%` : `${averageImprovement}%`}
              </span>
              <span className="text-xs text-slate-400">score delta</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Measurable progress over initial baseline
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average Test Accuracy</span>
              <Flame className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-amber-400">
                {averageLatestScore}%
              </span>
              <span className="text-xs text-slate-400">latest average</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {attemptHistory.length} quiz sessions
            </p>
          </div>
        </div>
      </div>

      {/* QUIZ MODAL / INTERACTIVE RUNNER */}
      {isQuizActive && (
        <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-xl relative animate-in fade-in">
          {isLoadingAIQuestions ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">Preparing targeted MCQs for {selectedSkill}...</p>
              <p className="text-xs text-slate-400">Structuring real-world technical scenarios and code snippets</p>
            </div>
          ) : isQuizFinished && lastFinishedResult ? (
            /* Results Screen */
            <div className="space-y-6">
              <div className="text-center space-y-3 max-w-xl mx-auto py-4">
                <div className={`inline-flex p-4 rounded-full ${
                  lastFinishedResult.percentage >= 70 ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-amber-950 text-amber-400 border border-amber-700'
                }`}>
                  <Award className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Assessment Completed: {selectedSkill === 'comprehensive' ? 'Comprehensive Gap Test' : selectedSkill}
                </h3>

                <div className="flex items-center justify-center space-x-3 text-sm">
                  <span className="font-semibold text-slate-300">Score:</span>
                  <span className="text-2xl font-extrabold text-white">
                    {lastFinishedResult.score} / {lastFinishedResult.total}
                  </span>
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                    lastFinishedResult.percentage >= 70 ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'
                  }`}>
                    {lastFinishedResult.percentage}%
                  </span>
                </div>

                {/* Improvement Badge */}
                {lastFinishedResult.previousScore !== null && (
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl inline-block text-xs">
                    <span className="text-slate-400">Previous Attempt: </span>
                    <strong className="text-slate-300">{lastFinishedResult.previousScore}%</strong>
                    <span className="mx-2 text-slate-600">•</span>
                    <span className="text-slate-400">Improvement Delta: </span>
                    <strong className={`font-bold ${lastFinishedResult.improvement >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {lastFinishedResult.improvement >= 0 ? `+${lastFinishedResult.improvement}%` : `${lastFinishedResult.improvement}%`}
                    </strong>
                  </div>
                )}
              </div>

              {/* Review of Questions */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Review &amp; Explanations
                </h4>
                <div className="space-y-3">
                  {activeQuizQuestions.map((q, idx) => {
                    const userChoice = userAnswers[idx];
                    const isCorrect = userChoice === q.correctAnswerIndex;
                    return (
                      <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                            isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        {q.codeSnippet && (
                          <pre className="bg-slate-900 text-slate-200 p-2.5 rounded text-[11px] font-mono overflow-x-auto border border-slate-800">
                            {q.codeSnippet}
                          </pre>
                        )}

                        <div className="space-y-1 pt-1 text-[11px]">
                          <div className="text-slate-300">
                            <span className="text-slate-400">Your Answer: </span>
                            <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                              {q.options[userChoice] ?? 'Unanswered'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-slate-300">
                              <span className="text-slate-400">Correct Answer: </span>
                              <span className="text-emerald-400 font-semibold">
                                {q.options[q.correctAnswerIndex]}
                              </span>
                            </div>
                          )}
                          <p className="text-slate-400 bg-slate-900/70 p-2 rounded mt-1.5 leading-relaxed">
                            <strong className="text-indigo-400">Explanation: </strong>
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsQuizActive(false)}
                  className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Close &amp; View Progress Matrix
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => startQuizForSkill(selectedSkill)}
                    className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake Assessment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizActive(false);
                      if (onNavigateToRoadmap) onNavigateToRoadmap();
                    }}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>View Roadmap</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : currentQ ? (
            /* Active Question Screen */
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="bg-indigo-950 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-800">
                    {currentQ.skillName}
                  </span>
                  <span className="text-slate-400">
                    Difficulty: <strong className="text-slate-200">{currentQ.difficulty}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-medium">
                    Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsQuizActive(false)}
                    className="text-slate-500 hover:text-slate-300 font-bold ml-2"
                    title="Quit quiz"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                {currentQ.codeSnippet && (
                  <pre className="bg-slate-950 text-indigo-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {currentQ.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;

                  let cardStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      cardStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-indigo-950/60 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start space-x-3 transition-all cursor-pointer ${cardStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{optionText}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box (Post Submit) */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-xl text-xs space-y-2 border animate-in fade-in ${
                  selectedOption === currentQ.correctAnswerIndex
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}>
                  <div className="flex items-center space-x-2 font-bold">
                    {selectedOption === currentQ.correctAnswerIndex ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Excellent! That is correct.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-rose-400" />
                        <span>Incorrect. The correct answer was option {String.fromCharCode(65 + currentQ.correctAnswerIndex)}.</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  {currentQ.takeawayTip && (
                    <div className="flex items-center space-x-1.5 text-sky-400 pt-1 font-medium">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                      <span>{currentQ.takeawayTip}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  {isAnswerSubmitted ? 'Review explanation before proceeding' : 'Select an option to submit'}
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow"
                  >
                    <span>Check Answer</span>
                    <Check className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow"
                  >
                    <span>{currentQuestionIndex + 1 < activeQuizQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* VISUAL IMPROVEMENT COMPARISON CHART */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-indigo-400" />
              <span>Skill Improvement Trajectory (Initial vs. Latest Score)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Visual comparison showing how your test mastery has improved across each missed competency
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
              <span>Initial Baseline</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Latest Verified Score</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="skill" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                domain={[0, 100]} 
                tickFormatter={(v) => `${v}%`} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: any, name: any) => [
                  `${value}%`, 
                  name === 'initial' ? 'Initial Score' : name === 'latest' ? 'Latest Score' : 'Best Score'
                ]}
              />
              <Bar dataKey="initial" fill="#475569" radius={[4, 4, 0, 0]} name="initial" />
              <Bar dataKey="latest" fill="#10b981" radius={[4, 4, 0, 0]} name="latest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SKILL MASTERY & ACTION MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Missed Skills Mastery &amp; Assessment Directory
            </h3>
            <p className="text-xs text-slate-400">
              Select any skill below to test your understanding or bridge conceptual gaps
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetProgress}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
              title="Reset test progress"
            >
              Reset History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4">Missed Skill</th>
                <th className="py-3.5 px-4">Curriculum Gap</th>
                <th className="py-3.5 px-4">Mastery Status</th>
                <th className="py-3.5 px-4">Baseline vs. Latest</th>
                <th className="py-3.5 px-4">Improvement</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {missedGaps.map(gap => {
                const prog = progressMap[gap.skillName];
                const attempts = prog?.totalQuizzesTaken ?? 0;
                const latest = prog?.latestScore ?? null;
                const initial = prog?.firstScore ?? null;
                const delta = prog?.improvementDelta ?? 0;
                const mastery = prog?.masteryLevel ?? 'Needs Practice';

                return (
                  <tr key={gap.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{gap.skillName}</div>
                      <div className="text-[11px] text-slate-400">{gap.category}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        gap.status === 'missing' 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {gap.status === 'missing' ? 'Missing Gap' : 'Partial'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        mastery === 'Mastered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : mastery === 'Proficient'
                          ? 'bg-sky-950 text-sky-300 border border-sky-700'
                          : mastery === 'Developing'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span>{mastery}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {attempts > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-slate-400 font-mono">{initial}%</span>
                            <span className="text-slate-600">→</span>
                            <span className="font-bold text-white font-mono">{latest}%</span>
                          </div>
                          <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (latest || 0) >= 70 ? 'bg-emerald-500' : (latest || 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, latest || 0)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Not assessed yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {attempts > 0 ? (
                        <span className={`inline-flex items-center space-x-0.5 text-xs font-bold ${
                          delta > 0 ? 'text-emerald-400' : delta === 0 ? 'text-slate-400' : 'text-rose-400'
                        }`}>
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => startQuizForSkill(gap.skillName)}
                        className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>{attempts > 0 ? 'Retake MCQ' : 'Take Skill MCQ'}</span>
                      </button>

                      {onNavigateToResources && (
                        <button
                          type="button"
                          onClick={() => onNavigateToResources(gap.skillName)}
                          className="inline-flex items-center space-x-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Study resources for this skill"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                          <span className="hidden sm:inline">Resources</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ATTEMPT LOG & AUDIT TRAILS */}
      {attemptHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Assessment Activity History</span>
            </h3>
            <span className="text-xs text-slate-400">{attemptHistory.length} recorded tests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attemptHistory.slice(0, 6).map(att => (
              <div key={att.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white truncate max-w-[140px]">{att.skillName}</p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(att.completedAt).toLocaleDateString()} at {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold text-sm ${
                    att.scorePercentage >= 70 ? 'text-emerald-400' : att.scorePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {att.scorePercentage}%
                  </span>
                  <p className="text-[10px] text-slate-500">{att.correctAnswers} / {att.totalQuestions} correct</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
