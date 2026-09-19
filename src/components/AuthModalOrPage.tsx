import React, { useState } from 'react';
import { AuthUser } from '../types';
import { ThreeHeroBadge } from './ThreeHeroBadge';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X,
  Compass,
  Briefcase
} from 'lucide-react';

interface AuthModalOrPageProps {
  initialMode?: 'login' | 'signup';
  isModal?: boolean;
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthModalOrPage: React.FC<AuthModalOrPageProps> = ({
  initialMode = 'login',
  isModal = false,
  onClose,
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [institution, setInstitution] = useState('Stanford University');
  const [targetRole, setTargetRole] = useState('Frontend Engineer');

  const demoAccounts = [
    {
      label: 'Frontend Learner Demo',
      name: 'Alex Mercer',
      email: 'alex.mercer@student.edu',
      role: 'student' as const,
      institution: 'UC Berkeley',
      targetRole: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      label: 'Full-Stack Candidate Demo',
      name: 'Jordan Lee',
      email: 'jordan.lee@dev.io',
      role: 'student' as const,
      institution: 'Georgia Tech',
      targetRole: 'Full Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
    }
  ];


  const handleQuickLogin = (demo: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      const user: AuthUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: demo.name,
        email: demo.email,
        role: demo.role,
        institution: demo.institution,
        targetRole: demo.targetRole,
        avatar: demo.avatar,
        createdAt: new Date().toISOString()
      };
      setIsLoading(false);
      onAuthSuccess(user);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: authMode === 'signup' ? name : (email.split('@')[0] || 'Member'),
        email,
        role,
        institution: institution || 'Academic Institute',
        targetRole: targetRole || 'Software Engineer',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString()
      };

      setSuccessMsg(authMode === 'signup' ? 'Account created successfully! Welcome to SkillBridge AI.' : 'Logged in successfully!');
      setTimeout(() => {
        onAuthSuccess(user);
      }, 500);
    }, 600);
  };

  const content = (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
      {/* Top Banner with 3D Core Graphic */}
      <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 p-6 sm:p-8 flex items-center justify-between">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500/20 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/30 flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>SkillBridge Secure Auth</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {authMode === 'login'
              ? 'Sign in to access your personal roadmaps and curriculum audits.'
              : 'Join students and universities bridging the curriculum-to-career gap.'}
          </p>
        </div>

        {/* 3D Visual Micro-Core */}
        <div className="hidden sm:block">
          <ThreeHeroBadge size={100} />
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Toggle between Sign In & Sign Up */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              authMode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
            <span className="font-bold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Demo Logins for instant evaluation */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick 1-Click Demo Profiles:
            </span>
            <span className="text-[11px] text-sky-400 font-mono">Instant Test</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoAccounts.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => handleQuickLogin(demo)}
                disabled={isLoading}
                className="flex items-center space-x-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-left transition-all group"
              >
                <img
                  src={demo.avatar}
                  alt={demo.name}
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors truncate">
                    {demo.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {demo.role === 'student' ? 'Student' : 'Faculty / HOD'} • {demo.institution}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute">
            or continue with credentials
          </span>
        </div>

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Institution / College */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  College / University / School
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    id="signup-institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. UC Berkeley"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Career Goal
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="Frontend Engineer">Frontend Engineer (React / TypeScript)</option>
                    <option value="Full Stack Developer">Full Stack Developer (Node / React / Cloud)</option>
                    <option value="Backend Software Engineer">Backend Software Engineer (Go / Java / Python)</option>
                    <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer (Docker / Kubernetes / AWS)</option>
                    <option value="AI / ML Engineer">AI & Machine Learning Engineer (Python / PyTorch)</option>
                    <option value="Data Scientist">Data Scientist & Analytics Engineer</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo password reset link has been simulated to your email.')}
                  className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password for signup */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{authMode === 'login' ? 'Sign In to SkillBridge' : 'Complete Registration'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500">
          {authMode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg(null);
                }}
                className="text-sky-400 font-semibold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className="text-sky-400 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative my-8 w-full max-w-xl animate-in fade-in zoom-in-95">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      {content}
    </div>
  );
};
