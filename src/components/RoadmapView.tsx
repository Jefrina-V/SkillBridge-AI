import React, { useState } from 'react';
import { PersonalizedRoadmap } from '../types';
import confetti from 'canvas-confetti';
import { Calendar, Clock, CheckCircle2, Circle, Sparkles, Trophy, ChevronDown, ChevronUp, RefreshCw, BookOpen } from 'lucide-react';

interface RoadmapViewProps {
  roadmap: PersonalizedRoadmap;
  onChangePace: (pace: 1 | 2 | 3) => void;
  onToggleTaskComplete: (weekIndex: number, dayIndex: number) => void;
  onRegenerate: () => void;
  onNavigateToResources: (skill: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onChangePace,
  onToggleTaskComplete,
  onRegenerate,
  onNavigateToResources
}) => {
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  // Compute progress stats
  let totalDays = 0;
  let completedDays = 0;

  roadmap.weeks.forEach(w => {
    w.days.forEach(d => {
      totalDays++;
      if (d.completed) completedDays++;
    });
  });

  const progressPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const handleToggle = (weekIdx: number, dayIdx: number, currentlyCompleted: boolean) => {
    onToggleTaskComplete(weekIdx, dayIdx);
    if (!currentlyCompleted && progressPercentage + (100 / totalDays) >= 99) {
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
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Personalized 4-Week Career Sprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Adaptive Learning Roadmap: {roadmap.targetRole}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Sequential progression structured to bridge high-priority curriculum gaps before target job applications.
            </p>
          </div>

          {/* Study Pace Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 px-2 flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-sky-400" />
              <span>Study Pace:</span>
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((pace) => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => onChangePace(pace as 1 | 2 | 3)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    roadmap.studyPaceHoursPerDay === pace
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {pace} hr/day ({pace * 28} hrs)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Roadmap Progress: {completedDays} of {totalDays} Daily Milestones Achieved</span>
            </span>
            <span className="font-extrabold text-sky-400 text-sm">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Weeks Accordion / Cards */}
      <div className="space-y-4">
        {roadmap.weeks.map((week, weekIdx) => {
          const isExpanded = expandedWeek === week.weekNumber;
          const weekCompletedCount = week.days.filter(d => d.completed).length;
          const isWeekFinished = weekCompletedCount === week.days.length;

          return (
            <div
              key={week.weekNumber}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all shadow-sm ${
                isExpanded ? 'border-indigo-700/60' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Week Header */}
              <div
                onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                className="flex items-center justify-between p-5 cursor-pointer bg-slate-900/90 hover:bg-slate-850"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isWeekFinished
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Week {week.weekNumber}: {week.theme}
                      </h3>
                      {isWeekFinished && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Focus: <strong className="text-sky-400">{week.targetSkill}</strong> • {weekCompletedCount} of 7 days completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToResources(week.targetSkill);
                    }}
                    className="hidden sm:inline-flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                    <span>Resources</span>
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Days breakdown */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 divide-y divide-slate-800/50">
                  {week.days.map((day, dayIdx) => (
                    <div
                      key={day.day}
                      className={`py-3.5 flex items-start space-x-3 transition-colors ${
                        day.completed ? 'opacity-70' : 'opacity-100'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(weekIdx, dayIdx, day.completed)}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-sky-400 transition-colors"
                      >
                        {day.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            onClick={() => handleToggle(weekIdx, dayIdx, day.completed)}
                            className={`text-sm font-semibold cursor-pointer ${
                              day.completed ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            Day {day.day}: {day.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {day.durationMinutes} mins
                          </span>
                        </div>

                        {/* Task list */}
                        <ul className="mt-2 space-y-1">
                          {day.tasks.map((task, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                              <span className="text-sky-400 leading-none mt-1">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>

                        {day.resourceTip && (
                          <p className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 px-2.5 py-1 rounded-lg">
                            <strong>Tip:</strong> {day.resourceTip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
