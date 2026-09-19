import React from 'react';
import { OverallAnalysis, SkillGapItem } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, BookOpen, Calendar, FileText, Sparkles, TrendingUp, Layers, Box, HelpCircle, Zap, Award } from 'lucide-react';
import { ThreeHeroBadge } from './ThreeHeroBadge';
import { ThreeSkillGalaxy } from './ThreeSkillGalaxy';

interface StudentDashboardProps {
  analysis: OverallAnalysis;
  onNavigate: (tab: string) => void;
  onOpenEvidence: (gap: SkillGapItem) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  analysis,
  onNavigate,
  onOpenEvidence,
}) => {
  // Donut chart data for curriculum alignment
  const donutData = [
    { name: 'Covered', value: analysis.coveredCount, color: '#10b981' }, // emerald-500
    { name: 'Partially Covered', value: analysis.partialCount, color: '#f59e0b' }, // amber-500
    { name: 'Missing Gaps', value: analysis.missingCount, color: '#ef4444' }, // red-500
  ];

  // Bar chart data for top priority missing & partial skills
  const prioritySkills = analysis.gaps
    .filter(g => g.status === 'missing' || g.status === 'partial')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 6)
    .map(g => ({
      name: g.skillName,
      priority: g.priorityScore,
      level: g.priorityLevel,
      status: g.status,
      fill: g.priorityLevel === 'Very High' ? '#ef4444' : g.priorityLevel === 'High' ? '#f97316' : '#eab308'
    }));

  const highPriorityGaps = analysis.gaps.filter(g => g.priorityLevel === 'Very High' || g.priorityLevel === 'High');

  return (
    <div className="space-y-6">
      {/* Target Role & Overview Header Banner with 3D Hero Element */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ThreeHeroBadge size={80} />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 mb-1 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Curriculum-to-Career Match</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {analysis.jobRole}
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Curriculum Analyzed: <span className="font-semibold text-slate-100">{analysis.courseName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 p-3 rounded-xl">
            <div className="text-right">
              <p className="text-xs text-slate-400">Curriculum Alignment</p>
              <p className="text-2xl font-extrabold text-emerald-400">
                {analysis.alignmentPercentage}%
              </p>
            </div>
            <div className="h-10 w-1 rounded-full bg-slate-700" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">{analysis.coveredCount}</span> of {analysis.totalJobSkills} skills
              <br />directly covered
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80 relative z-10">
          <button
            id="dash-view-3d-btn"
            type="button"
            onClick={() => onNavigate('3d-galaxy')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-indigo-500/40 transition-all hover:shadow shadow-indigo-500/10 group"
          >
            <Box className="h-3.5 w-3.5 text-indigo-300 group-hover:rotate-12 transition-transform" />
            <span>3D Skill Galaxy</span>
          </button>
          <button
            id="dash-view-gaps-btn"
            type="button"
            onClick={() => onNavigate('skill-gaps')}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all hover:shadow"
          >
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span>View Skill Gaps</span>
          </button>
          <button
            id="dash-gen-roadmap-btn"
            type="button"
            onClick={() => onNavigate('roadmap')}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-sm transition-all"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>4-Week Roadmap</span>
          </button>
          <button
            id="dash-view-resources-btn"
            type="button"
            onClick={() => onNavigate('resources')}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all hover:shadow"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Resources</span>
          </button>
          <button
            id="dash-download-report-btn"
            type="button"
            onClick={() => onNavigate('reports')}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-all hover:shadow"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Evidence Audit</span>
          </button>
        </div>
      </div>


      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Alignment Score</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{analysis.alignmentPercentage}%</span>
            <span className="text-xs text-slate-400">overall match</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${analysis.alignmentPercentage}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Skills Covered</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{analysis.coveredCount}</span>
            <span className="text-xs text-slate-400">in syllabus</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate">Matches target requirements</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Partially Covered</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-400">{analysis.partialCount}</span>
            <span className="text-xs text-slate-400">skills</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate">Prerequisites met, need modern tooling</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Missing Skill Gaps</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-400">{analysis.missingCount}</span>
            <span className="text-xs text-slate-400">skills</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate">Requires dedicated self-study</p>
        </div>
      </div>

      {/* Charts Section: Donut Alignment & Bar Chart Skill Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Curriculum Alignment Breakdown */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Curriculum Alignment Breakdown</h3>
            <span className="text-xs text-slate-400">Threshold &ge; {analysis.thresholds.covered}</span>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{analysis.alignmentPercentage}%</span>
              <p className="text-xs text-slate-400">Aligned</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
              <div className="flex items-center justify-center space-x-1 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Covered</span>
              </div>
              <p className="text-slate-300 font-semibold mt-0.5">{analysis.coveredCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/40">
              <div className="flex items-center justify-center space-x-1 text-amber-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Partial</span>
              </div>
              <p className="text-slate-300 font-semibold mt-0.5">{analysis.partialCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
              <div className="flex items-center justify-center space-x-1 text-rose-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Missing</span>
              </div>
              <p className="text-slate-300 font-semibold mt-0.5">{analysis.missingCount}</p>
            </div>
          </div>
        </div>

        {/* Bar Chart: Skill Priority Engine */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Multi-Factor Skill Priority (0 - 100)</h3>
              <p className="text-xs text-slate-400">Calculated from market frequency, severity, prerequisites, and job weight</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
              Focus Gaps
            </span>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prioritySkills} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 12 }} width={80} />
                <Tooltip
                  formatter={(value: any) => [`${value}/100`, 'Priority Score']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="priority" radius={[0, 6, 6, 0]} barSize={16}>
                  {prioritySkills.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-red-500" /><span>Very High (&ge;80)</span></span>
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-orange-500" /><span>High (65-79)</span></span>
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /><span>Medium (45-64)</span></span>
            </div>
            <button
              id="dash-explore-all-gaps"
              type="button"
              onClick={() => onNavigate('skill-gaps')}
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Visual Constellation Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              3D Interactive Skill Constellation
            </h3>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-700/50">
              WebGL 3D
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('3d-galaxy')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
          >
            <span>Expand Fullscreen 3D View</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <ThreeSkillGalaxy
          analysis={analysis}
          onSelectSkill={(skill) => onNavigate('resources')}
          onOpenEvidence={onOpenEvidence}
        />
      </div>

      {/* Missed Skills MCQ & Mastery Tracking Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400 shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Missed Skills MCQ Assessment &amp; Progress Tracking</h3>
                <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-700">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Bridge the {analysis.missingCount + analysis.partialCount} flagged curriculum gaps through targeted, interactive technical multiple-choice questions with instant explanations and measurable improvement tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('mcq-practice')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Practice MCQs &amp; Track Progress</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Priority Gaps Quick Cards */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Top Actionable Skill Gaps ({highPriorityGaps.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any card to inspect evidence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highPriorityGaps.slice(0, 6).map((gap) => (
            <div
              key={gap.id}
              onClick={() => onOpenEvidence(gap)}
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{gap.category}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    gap.priorityLevel === 'Very High'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                      : 'bg-orange-950 text-orange-300 border border-orange-800/80'
                  }`}
                >
                  {gap.priorityScore}/100 • {gap.priorityLevel}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-2 group-hover:text-sky-300 transition-colors">
                {gap.skillName}
              </h4>

              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                {gap.evidence.reason}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>{gap.learningHours} hrs est. study</span>
                <span className="text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                  <span>Evidence</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
