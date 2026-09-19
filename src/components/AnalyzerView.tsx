import React, { useState, useRef } from 'react';
import { extractTextFromPdfFile } from '../utils/pdfExtractor';
import { SAMPLE_SYLLABI, SAMPLE_JOBS } from '../data/sampleData';
import { Upload, FileText, Sparkles, Sliders, CheckCircle, ArrowRight, BookOpen, Briefcase, RefreshCw, AlertCircle } from 'lucide-react';

interface AnalyzerViewProps {
  onStartAnalysis: (
    syllabusText: string,
    syllabusTitle: string,
    jobText: string,
    jobTitle: string,
    thresholds: { covered: number; partial: number }
  ) => Promise<void>;
  isAnalyzing: boolean;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onStartAnalysis,
  isAnalyzing
}) => {
  // State for syllabus
  const [syllabusTitle, setSyllabusTitle] = useState('Web Technology & Internet Applications');
  const [syllabusText, setSyllabusText] = useState(SAMPLE_SYLLABI[0].content);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Web_Technology_Syllabus.pdf');
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // State for job
  const [jobTitle, setJobTitle] = useState('Frontend Engineer (React / TypeScript)');
  const [jobText, setJobText] = useState(SAMPLE_JOBS[0].description);

  // Configurable similarity thresholds
  const [coveredThreshold, setCoveredThreshold] = useState(0.80);
  const [partialThreshold, setPartialThreshold] = useState(0.60);
  const [showAdvancedThresholds, setShowAdvancedThresholds] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF file selection & extraction
  const handleFileUpload = async (file: File) => {
    setPdfError(null);
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setPdfError('File size exceeds 10MB limit. Please upload a smaller syllabus document.');
      return;
    }

    setIsExtractingPdf(true);
    setUploadedFileName(file.name);
    setSyllabusTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));

    try {
      const extracted = await extractTextFromPdfFile(file);
      if (!extracted || extracted.trim().length < 20) {
        throw new Error('Extracted text too short. Make sure the PDF contains selectable text.');
      }
      setSyllabusText(extracted);
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setPdfError(err.message || 'Failed to extract text from PDF. You can paste the syllabus directly.');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSampleSyllabus = (id: string) => {
    const s = SAMPLE_SYLLABI.find(x => x.id === id);
    if (s) {
      setSyllabusTitle(s.courseTitle);
      setSyllabusText(s.content);
      setUploadedFileName(s.fileName);
      setPdfError(null);
    }
  };

  const handleSelectSampleJob = (id: string) => {
    const j = SAMPLE_JOBS.find(x => x.id === id);
    if (j) {
      setJobTitle(j.title);
      setJobText(j.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusText.trim() || !jobText.trim()) return;

    await onStartAnalysis(
      syllabusText,
      syllabusTitle,
      jobText,
      jobTitle,
      { covered: coveredThreshold, partial: partialThreshold }
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Semantic NLP Skill Gap Finder</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Compare College Syllabus with Target Job Description
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Upload your syllabus PDF and paste a target job description. The AI will extract competencies, compute semantic cosine similarities, prioritize missing gaps, and recommend resources.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAdvancedThresholds(!showAdvancedThresholds)}
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-colors"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-400" />
              <span>{showAdvancedThresholds ? 'Hide Thresholds' : 'Similarity Thresholds'}</span>
            </button>
          </div>
        </div>

        {/* Advanced Configurable Thresholds Bar */}
        {showAdvancedThresholds && (
          <div className="mt-5 pt-5 border-t border-slate-800 bg-slate-950/60 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="h-3.5 w-3.5 text-sky-400" />
                <span>Configurable Semantic Similarity Cutoffs</span>
              </span>
              <span className="text-xs text-slate-400">Values are dynamic and not hardcoded</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Covered / Strong Match Threshold:</span>
                  <span className="font-bold text-emerald-400">&ge; {coveredThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.70"
                  max="0.95"
                  step="0.05"
                  value={coveredThreshold}
                  onChange={(e) => setCoveredThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Scores above this represent direct curriculum coverage.</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Related / Partial Match Cutoff:</span>
                  <span className="font-bold text-amber-400">{partialThreshold.toFixed(2)} &ndash; {(coveredThreshold - 0.01).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.45"
                  max="0.75"
                  step="0.05"
                  value={partialThreshold}
                  onChange={(e) => setPartialThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Scores below {partialThreshold.toFixed(2)} are classified as Potential Missing Gaps.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two Columns: Syllabus (Left) and Job (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: University Course Syllabus */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">University Course Syllabus</h3>
                    <p className="text-xs text-slate-400">PDF Upload or Paste Text</p>
                  </div>
                </div>

                {/* Sample Syllabus quick loader */}
                <div className="relative">
                  <select
                    id="sample-syllabus-select"
                    onChange={(e) => handleSelectSampleSyllabus(e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    defaultValue={SAMPLE_SYLLABI[0].id}
                  >
                    <option value="" disabled>Load Sample Syllabus...</option>
                    {SAMPLE_SYLLABI.map(s => (
                      <option key={s.id} value={s.id}>{s.courseTitle}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title input */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Course Title</label>
                <input
                  type="text"
                  value={syllabusTitle}
                  onChange={(e) => setSyllabusTitle(e.target.value)}
                  placeholder="e.g. Web Technology & Applications (CS402)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              {/* PDF Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-950/50 hover:bg-slate-950 rounded-xl p-4 text-center cursor-pointer transition-colors mb-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <Upload className="h-6 w-6 text-sky-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-white">
                  {isExtractingPdf ? 'Extracting text from PDF with PyMuPDF/PDF.js...' : 'Drop syllabus PDF here or click to browse'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF or plain text syllabus (Max 10MB)</p>
                {uploadedFileName && (
                  <div className="mt-2 inline-flex items-center space-x-1.5 bg-sky-950 text-sky-300 text-xs px-2.5 py-1 rounded-full border border-sky-800">
                    <FileText className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                  </div>
                )}
              </div>

              {pdfError && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-850 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{pdfError}</span>
                </div>
              )}

              {/* Raw Text Content */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Syllabus Content (Units, Topics, Labs)</span>
                  <span>{syllabusText.length} characters</span>
                </div>
                <textarea
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  rows={8}
                  placeholder="Paste syllabus modules, course objectives, and weekly topics..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-sky-500 focus:outline-none resize-y"
                  required
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Extracts: Topics, Tools, Frameworks, Languages</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Ready</span>
              </span>
            </div>
          </div>

          {/* RIGHT: Target Job Description */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Target Job Description</h3>
                    <p className="text-xs text-slate-400">Paste real recruiter posting</p>
                  </div>
                </div>

                {/* Sample Job select */}
                <div className="relative">
                  <select
                    id="sample-job-select"
                    onChange={(e) => handleSelectSampleJob(e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    defaultValue={SAMPLE_JOBS[0].id}
                  >
                    <option value="" disabled>Load Industry Job...</option>
                    {SAMPLE_JOBS.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Title */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Full Stack Developer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Job Text area */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Job Requirements, Tech Stack, & Responsibilities</span>
                  <span>{jobText.length} characters</span>
                </div>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  rows={13}
                  placeholder="Paste required skills, nice-to-have technologies, qualifications, and experience level..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-indigo-500 focus:outline-none resize-y"
                  required
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Extracts: Tech stack, Soft skills, Prerequisites</span>
              <span className="text-indigo-400 font-semibold flex items-center space-x-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Big Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm gap-4">
          <div className="text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Execution Pipeline:</p>
            <p>PDF Extraction &rarr; Semantic Skill Extraction &rarr; Knowledge Base Normalization &rarr; Cosine Similarity &rarr; Multi-Factor Priority Scoring</p>
          </div>

          <button
            id="run-analysis-btn"
            type="submit"
            disabled={isAnalyzing || isExtractingPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analyzing Curriculum &amp; Job Gaps...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze My Skill Gap</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
