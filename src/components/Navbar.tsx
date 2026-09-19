import React from 'react';
import { Compass, Sparkles, RefreshCw, LogIn, LogOut, UserPlus, Box } from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResetToDemo: () => void;
  alignmentScore?: number;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onResetToDemo,
  alignmentScore,
  currentUser,
  onLogout,
  onOpenAuth
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: '3d-galaxy', label: '3D Skill Galaxy', is3D: true },
    { id: 'analyze', label: 'Analyze' },
    { id: 'skill-gaps', label: 'Skill Gaps' },
    { id: 'mcq-practice', label: 'Skill MCQs & Progress' },
    { id: 'roadmap', label: '4-Week Roadmap' },
    { id: 'resources', label: 'Resources' },
    { id: 'reports', label: 'Evidence Report' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      {/* Top tier brand bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => onTabChange('dashboard')}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SkillBridge</span>
                <span className="bg-indigo-950 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-700/50">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Curriculum-to-Career Skill Gap Analyzer</p>
            </div>
          </div>

          {/* Right Status, Demo, & Authentication Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {alignmentScore !== undefined && (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400">Match:</span>
                <span className="font-bold text-emerald-400">{alignmentScore}%</span>
              </div>
            )}

            <button
              id="reset-demo-btn"
              type="button"
              onClick={onResetToDemo}
              title="Reset with sample curriculum data"
              className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span>Sample Data</span>
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 pl-2 pr-1.5 py-1 rounded-xl">
                <div className="flex items-center space-x-2">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-7 w-7 rounded-full border border-sky-400/50 object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-sky-400 font-medium leading-none">
                      {currentUser.targetRole || 'Learner'}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  id="user-logout-btn"
                  type="button"
                  onClick={onLogout}
                  title="Sign out of SkillBridge"
                  className="flex items-center space-x-1 ml-1 text-xs text-rose-300 hover:text-white hover:bg-rose-600/80 bg-rose-950/50 border border-rose-800/60 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  id="nav-login-btn"
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-sky-400" />
                  <span>Login</span>
                </button>
                <button
                  id="nav-signup-btn"
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center space-x-1 text-xs text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-3 py-1.5 rounded-lg shadow-sm font-semibold transition-all cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar items-center">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-sky-400 font-semibold border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {tab.is3D ? (
                    <>
                      <Box className={`h-3.5 w-3.5 ${isActive ? 'text-sky-400' : 'text-indigo-400'}`} />
                      <span>{tab.label}</span>
                      <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                        3D
                      </span>
                    </>
                  ) : (
                    <span>{tab.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};


