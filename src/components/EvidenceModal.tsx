import React from 'react';
import { SkillGapItem } from '../types';
import { SKILL_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { X, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, BookOpen, Clock, Activity, HelpCircle } from 'lucide-react';

interface EvidenceModalProps {
  gap: SkillGapItem | null;
  onClose: () => void;
  onNavigateToResources: (skill: string) => void;
  onNavigateToMCQ?: (skill: string) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  gap,
  onClose,
  onNavigateToResources,
  onNavigateToMCQ
}) => {
  if (!gap) return null;

  const canonical = gap.skillName;
  const kb = SKILL_KNOWLEDGE_BASE[canonical];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Explainable AI • Diagnostic Evidence</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{gap.skillName}</span>
              <span className="text-xs font-normal text-slate-400">({gap.category})</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Priority & Status Badges */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Classification:</span>
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              {gap.status === 'covered' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              {gap.status === 'partial' && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
              {gap.status === 'missing' && <XCircle className="h-3.5 w-3.5 text-rose-400" />}
              <span>{gap.status}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Multi-Factor Priority:</span>
            <span className="font-bold text-rose-400">
              {gap.priorityScore}/100 ({gap.priorityLevel})
            </span>
          </div>
        </div>

        {/* Evidence Blocks */}
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <strong className="text-white block mb-1">Job Market Frequency Evidence:</strong>
            <p>{gap.evidence.marketFrequency}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <strong className="text-white block mb-1">Syllabus Coverage Diagnosis:</strong>
            <p>{gap.evidence.syllabusCoverageStatus}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <strong className="text-white block mb-1">Prerequisite Readiness Analysis:</strong>
            {gap.evidence.prerequisitesMet.length > 0 && (
              <p className="text-emerald-400 mb-1">
                ✓ Prerequisites already satisfied in syllabus: {gap.evidence.prerequisitesMet.join(', ')}
              </p>
            )}
            {gap.evidence.prerequisitesMissing.length > 0 && (
              <p className="text-rose-400">
                ⚠️ Missing prerequisite foundations: {gap.evidence.prerequisitesMissing.join(', ')}
              </p>
            )}
            {gap.evidence.prerequisitesMet.length === 0 && gap.evidence.prerequisitesMissing.length === 0 && (
              <p className="text-slate-400">No strict prerequisite dependencies identified.</p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-900/50">
            <strong className="text-sky-300 block mb-1">Explainable AI Reasoning:</strong>
            <p className="text-slate-200">{gap.evidence.reason}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50">
            <strong className="text-emerald-300 block mb-1">Actionable Recommendation:</strong>
            <p className="text-slate-200">{gap.evidence.recommendation}</p>
            <p className="text-[11px] text-slate-400 mt-1">Estimated Learning Time: ~{gap.learningHours} hours</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            {gap.status !== 'covered' && onNavigateToMCQ && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToMCQ(gap.skillName);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 rounded-xl shadow transition-colors cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5 text-indigo-200" />
                <span>Practice MCQ</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToResources(gap.skillName);
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl shadow transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>Resources</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
