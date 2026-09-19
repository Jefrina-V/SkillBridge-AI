import React, { useState, useEffect } from 'react';
import { CURATED_LEARNING_RESOURCES } from '../data/knowledgeBase';
import { OverallAnalysis, LearningResource } from '../types';
import { BookOpen, ExternalLink, Filter, Search, Award, Clock, CheckCircle } from 'lucide-react';

interface ResourcesViewProps {
  analysis: OverallAnalysis;
  initialSelectedSkill?: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  analysis,
  initialSelectedSkill
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(initialSelectedSkill || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize filter when navigating with a preselected skill
  useEffect(() => {
    if (initialSelectedSkill) {
      setSelectedSkill(initialSelectedSkill);
    }
  }, [initialSelectedSkill]);

  // Collect all resources for target gap skills
  const allResources: LearningResource[] = [];
  Object.values(CURATED_LEARNING_RESOURCES).forEach(resList => {
    allResources.push(...resList);
  });

  const availableSkills = Array.from(new Set(allResources.map(r => r.skill)));

  const filteredResources = allResources.filter(res => {
    const matchesSkill = selectedSkill === 'all' || res.skill.toLowerCase() === selectedSkill.toLowerCase();
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.skill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Educational Resources</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Verified Learning Tracks for Target Skill Gaps
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Authentic documentation, interactive simulators, and project-based tutorials curated directly from primary technology documentation (no broken or simulated links).
        </p>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, tutorials, docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Skill Selector */}
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Skills ({availableSkills.length})</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Category Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Resource Types</option>
              <option value="Documentation">Official Documentation</option>
              <option value="Course">Courses &amp; Curricula</option>
              <option value="Interactive">Interactive Roadmaps &amp; Exercises</option>
              <option value="Book">Open Source Books</option>
              <option value="Tutorial">Hands-on Tutorials</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            No resources match the selected criteria.
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                    {res.skill}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {res.type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 group-hover:text-amber-300 transition-colors">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-3">
                  {res.description}
                </p>

                <div className="mt-4 flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{res.estimatedHours} hrs</span>
                  </span>
                  <span>•</span>
                  <span>{res.difficulty}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Free Access</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{res.provider}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
