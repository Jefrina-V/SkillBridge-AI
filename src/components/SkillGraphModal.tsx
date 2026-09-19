import React from 'react';
import { X, GitMerge, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface SkillGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: string) => void;
}

export const SkillGraphModal: React.FC<SkillGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectSkill
}) => {
  if (!isOpen) return null;

  const pathways = [
    {
      title: 'Modern Web Frontend Track',
      steps: [
        { name: 'HTML5 & Core CSS', role: 'Foundational Markup & Layout', hours: '10 hrs' },
        { name: 'JavaScript (ES6+)', role: 'Core Imperative Scripting & DOM', hours: '25 hrs' },
        { name: 'React', role: 'Declarative Component Framework', hours: '25 hrs' },
        { name: 'TypeScript', role: 'Compile-Time Static Type Safety', hours: '20 hrs' },
        { name: 'Next.js', role: 'Full-Stack SSR / SSG Production Architecture', hours: '22 hrs' }
      ]
    },
    {
      title: 'AI, Data Science & Machine Learning Track',
      steps: [
        { name: 'Python Basics', role: 'Language Syntax & Data Types', hours: '20 hrs' },
        { name: 'NumPy & Pandas', role: 'Vectorized Computing & Data Wrangling', hours: '18 hrs' },
        { name: 'Scikit-learn', role: 'Classical Machine Learning Models', hours: '25 hrs' },
        { name: 'FastAPI / Serving', role: 'Model Inference Microservice API', hours: '16 hrs' },
        { name: 'Machine Learning Ops', role: 'Containerization, Evaluation & Deployment', hours: '30 hrs' }
      ]
    },
    {
      title: 'Backend Systems & Cloud Infrastructure Track',
      steps: [
        { name: 'HTTP & REST APIs', role: 'Stateless Protocols & JSON Payloads', hours: '15 hrs' },
        { name: 'PostgreSQL / SQL', role: 'Relational Database Architecture & Indexing', hours: '20 hrs' },
        { name: 'Node.js / Express', role: 'Asynchronous Network Services', hours: '25 hrs' },
        { name: 'Docker', role: 'Container Packaging & Isolation', hours: '20 hrs' },
        { name: 'CI/CD Pipelines', role: 'Automated Testing & Cloud Deployments', hours: '15 hrs' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <GitMerge className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Skill Dependency &amp; Prerequisite Knowledge Graphs</h3>
              <p className="text-xs text-slate-400">Step-by-step career skill progression mapping foundational courses to modern tech roles</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {pathways.map((pathway, pIdx) => (
            <div key={pIdx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3">
                {pathway.title}
              </h4>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 overflow-x-auto pb-1">
                {pathway.steps.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <div
                      onClick={() => {
                        onClose();
                        onSelectSkill(step.name);
                      }}
                      className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 rounded-xl p-3 flex-1 min-w-[130px] cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>Step {sIdx + 1}</span>
                        <span className="text-indigo-400">{step.hours}</span>
                      </div>
                      <div className="font-bold text-white group-hover:text-sky-300 transition-colors">
                        {step.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {step.role}
                      </div>
                    </div>

                    {sIdx < pathway.steps.length - 1 && (
                      <div className="hidden sm:flex text-slate-600 shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors"
          >
            Close Graph
          </button>
        </div>
      </div>
    </div>
  );
};
