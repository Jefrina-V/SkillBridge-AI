import React, { useState } from 'react';
import { OverallAnalysis, SkillGapItem, PriorityLevel, SkillMatchStatus } from '../types';
import { Search, Filter, CheckCircle2, AlertTriangle, XCircle, Info, ArrowUpRight, BookOpen, Layers, HelpCircle } from 'lucide-react';

interface SkillGapsViewProps {
  analysis: OverallAnalysis;
  onOpenEvidence: (gap: SkillGapItem) => void;
  onNavigateToResources: (skillName: string) => void;
  onNavigateToMCQ?: (skillName: string) => void;
}

export const SkillGapsView: React.FC<SkillGapsViewProps> = ({
  analysis,
  onOpenEvidence,
  onNavigateToResources,
  onNavigateToMCQ
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SkillMatchStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');

  const filteredGaps = analysis.gaps.filter(gap => {
    const matchesSearch = gap.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gap.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gap.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || gap.priorityLevel === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: SkillMatchStatus) => {
    switch (status) {
      case 'covered':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="h-3 w-3" />
            <span>Covered</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            <AlertTriangle className="h-3 w-3" />
            <span>Partially Covered</span>
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
            <XCircle className="h-3 w-3" />
            <span>Missing Gap</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (level: PriorityLevel, score: number) => {
    switch (level) {
      case 'Very High':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
            {score}/100 • Very High
          </span>
        );
      case 'High':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800">
            {score}/100 • High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-800">
            {score}/100 • Medium
          </span>
        );
      case 'Low':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            {score}/100 • Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Layers className="h-3.5 w-3.5" />
              <span>Smart Skill Gap Analysis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Classified Skill Requirements &amp; Evidence
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Comparing {analysis.courseName} against target requirements for {analysis.jobRole}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Total Target Skills: <strong className="text-white">{analysis.gaps.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills (e.g. React, TypeScript)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({analysis.gaps.length})
            </button>
            <button
              onClick={() => setStatusFilter('missing')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'missing' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missing ({analysis.missingCount})
            </button>
            <button
              onClick={() => setStatusFilter('partial')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'partial' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Partial ({analysis.partialCount})
            </button>
            <button
              onClick={() => setStatusFilter('covered')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'covered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Covered ({analysis.coveredCount})
            </button>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Very High">Very High (&ge;80)</option>
              <option value="High">High (65-79)</option>
              <option value="Medium">Medium (45-64)</option>
              <option value="Low">Low (&lt;45)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4">Skill &amp; Category</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Semantic Match</th>
                <th className="py-3.5 px-4">Priority Score</th>
                <th className="py-3.5 px-4">Curriculum Evidence</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredGaps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No skills found matching the current search &amp; filter criteria.
                  </td>
                </tr>
              ) : (
                filteredGaps.map((gap) => (
                  <tr key={gap.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{gap.skillName}</div>
                      <div className="text-[11px] text-slate-400">{gap.category}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(gap.status)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              gap.similarityScore >= 0.80
                                ? 'bg-emerald-500'
                                : gap.similarityScore >= 0.60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, gap.similarityScore * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300">
                          {(gap.similarityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      {gap.matchedSyllabusSkill && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]" title={gap.matchedSyllabusSkill}>
                          via: {gap.matchedSyllabusSkill}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getPriorityBadge(gap.priorityLevel, gap.priorityScore)}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-300 text-xs line-clamp-2" title={gap.evidence.reason}>
                        {gap.evidence.reason}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenEvidence(gap)}
                        className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold bg-sky-950/40 hover:bg-sky-950/80 border border-sky-800/60 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Info className="h-3 w-3" />
                        <span>Evidence</span>
                      </button>

                      {gap.status !== 'covered' && onNavigateToMCQ && (
                        <button
                          type="button"
                          onClick={() => onNavigateToMCQ(gap.skillName)}
                          className="inline-flex items-center space-x-1 text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Practice interactive MCQ for this missed skill"
                        >
                          <HelpCircle className="h-3 w-3 text-indigo-400" />
                          <span>Practice MCQ</span>
                        </button>
                      )}

                      {gap.status !== 'covered' && (
                        <button
                          type="button"
                          onClick={() => onNavigateToResources(gap.skillName)}
                          className="inline-flex items-center space-x-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <BookOpen className="h-3 w-3 text-amber-400" />
                          <span>Resources</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
