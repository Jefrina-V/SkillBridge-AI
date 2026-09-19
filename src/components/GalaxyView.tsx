import React from 'react';
import { OverallAnalysis, SkillGapItem } from '../types';
import { ThreeSkillGalaxy } from './ThreeSkillGalaxy';
import { Box, Sparkles, Layers, ArrowRight, BookOpen, Compass, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface GalaxyViewProps {
  analysis: OverallAnalysis;
  onNavigate: (tab: string) => void;
  onOpenEvidence: (gap: SkillGapItem) => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({
  analysis,
  onNavigate,
  onOpenEvidence
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 mb-1 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Three.js WebGL Real-Time Visualization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <Box className="h-7 w-7 text-indigo-400" />
              <span>3D Skill Constellation &amp; Galaxy</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Interact with your syllabus and career target in real-time 3D space. 
              Drag to orbit the constellation, hover nodes to inspect cosine semantic similarity, and filter missing gaps.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate('skill-gaps')}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-sky-400" />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors shadow-sm"
            >
              <span>4-Week Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D WebGL Canvas */}
      <ThreeSkillGalaxy
        analysis={analysis}
        onSelectSkill={(skill) => onNavigate('resources')}
        onOpenEvidence={onOpenEvidence}
      />

      {/* 3D Visual Instruction & Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Curriculum Inner Core</span>
          </div>
          <p className="text-slate-300">
            Skills closest to the glowing cyan syllabus hub represent concepts already heavily covered by your course syllabus ({analysis.coveredCount} skills &ge;80% match).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold">
            <ShieldAlert className="h-4 w-4" />
            <span>Outer Orbit Missing Gaps</span>
          </div>
          <p className="text-slate-300">
            Red outer satellites represent critical missing industry competencies ({analysis.missingCount} skills) required by {analysis.jobRole} but not taught in the current curriculum.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold">
            <Compass className="h-4 w-4" />
            <span>Interactive Controls</span>
          </div>
          <p className="text-slate-300">
            Click and drag to rotate the galaxy. Click any node to open learning resources or view full diagnostic evidence records.
          </p>
        </div>
      </div>
    </div>
  );
};
