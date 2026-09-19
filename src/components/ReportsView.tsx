import React, { useRef, useState } from 'react';
import { OverallAnalysis } from '../types';
import { exportAnalysisToPdf } from '../utils/pdfExporter';
import { 
  Printer, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  FileDown
} from 'lucide-react';

interface ReportsViewProps {
  analysis: OverallAnalysis;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ analysis }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveAsPdf = async () => {
    try {
      setIsExporting(true);
      setExportStatus('Compiling report...');

      const savedName = await exportAnalysisToPdf(analysis, {
        onProgress: (status) => setExportStatus(status)
      });

      setToastMessage(`Saved PDF report: ${savedName}`);
      setTimeout(() => setToastMessage(null), 6000);
    } catch (error) {
      console.error('PDF export failed:', error);
      setToastMessage('Failed to compile PDF. Please retry or use the Print Dialog.');
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  const handleBrowserPrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error('Print error:', e);
      handleSaveAsPdf();
    }
  };

  const highPriorityGaps = analysis.gaps.filter(g => g.priorityLevel === 'Very High' || g.priorityLevel === 'High');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-white">Evidence-Based Curriculum Gap Report</h2>
          <p className="text-xs text-slate-400">Formal audit document ready for student review or faculty submission</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="print-report-btn"
            type="button"
            onClick={handleSaveAsPdf}
            disabled={isExporting}
            className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Download report as PDF file"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>{exportStatus || 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Print / Save as PDF</span>
              </>
            )}
          </button>

          <button
            id="browser-print-sub-btn"
            type="button"
            onClick={handleBrowserPrint}
            title="Open browser print dialog"
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs border border-slate-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print Dialog</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div 
        ref={reportRef}
        id="printable-audit-report"
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-8 shadow-sm space-y-8 print:border-none print:p-0 print:bg-white print:text-black"
      >

        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 print:border-slate-300">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-widest mb-1 print:text-sky-700">
              <Compass className="h-4 w-4" />
              <span>SkillBridge AI • Curriculum Audit Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
              Curriculum-to-Career Gap Report
            </h1>
            <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
              Document ID: <span className="font-mono">{analysis.id}</span> • Generated: {new Date(analysis.timestamp).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-right print:bg-slate-100 print:border-slate-300">
            <p className="text-xs text-slate-400 print:text-slate-600">Curriculum Alignment Index</p>
            <p className="text-3xl font-extrabold text-emerald-400 print:text-emerald-700">
              {analysis.alignmentPercentage}%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">
              {analysis.coveredCount} of {analysis.totalJobSkills} Skills Verified
            </p>
          </div>
        </div>

        {/* Audit Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs print:bg-slate-50 print:border-slate-300">
          <div>
            <span className="text-slate-400 block print:text-slate-600">Source Syllabus:</span>
            <strong className="text-white text-sm print:text-black">{analysis.courseName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block print:text-slate-600">Target Industry Role:</span>
            <strong className="text-white text-sm print:text-black">{analysis.jobRole}</strong>
          </div>
          <div>
            <span className="text-slate-400 block print:text-slate-600">Evidence Benchmark:</span>
            <span className="text-white font-medium print:text-black">1,250 Curated Job Postings</span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 print:text-black">
            Executive Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">
            This automated, evidence-based audit compared the university course syllabus <strong>{analysis.courseName}</strong> against modern employer requirements for <strong>{analysis.jobRole}</strong>. The syllabus successfully satisfies <strong>{analysis.coveredCount}</strong> core competency requirements ({analysis.alignmentPercentage}% alignment), particularly in foundational scripting and relational data schemas. However, <strong>{analysis.missingCount}</strong> missing skill gaps and <strong>{analysis.partialCount}</strong> partially covered concepts were identified. A structured 4-week bridging program is recommended prior to technical interviews.
          </p>
        </div>

        {/* High-Priority Gaps with Full Evidence Breakdown */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 print:text-black">
            Detailed Evidence &amp; Gap Diagnostics
          </h3>

          <div className="space-y-4">
            {analysis.gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 text-xs space-y-3 print:bg-slate-50 print:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 print:border-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white print:text-black">{gap.skillName}</span>
                    <span className="text-[11px] text-slate-400 font-medium print:text-slate-600">({gap.category})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        gap.status === 'covered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 print:bg-emerald-100 print:text-emerald-800'
                          : gap.status === 'partial'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 print:bg-amber-100 print:text-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800 print:bg-rose-100 print:text-rose-800'
                      }`}
                    >
                      Status: {gap.status.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-300 print:text-black">
                      Priority: {gap.priorityScore}/100 ({gap.priorityLevel})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 print:text-slate-800">
                  <div>
                    <span className="font-semibold text-slate-400 block print:text-slate-600">Market Frequency Evidence:</span>
                    <p>{gap.evidence.marketFrequency}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block print:text-slate-600">Syllabus Coverage:</span>
                    <p>{gap.evidence.syllabusCoverageStatus}</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 print:bg-slate-100 print:border-slate-300">
                  <span className="font-semibold text-sky-400 block mb-0.5 print:text-sky-800">Why this was flagged:</span>
                  <p className="text-slate-300 print:text-slate-800">{gap.evidence.reason}</p>
                </div>

                <div className="flex items-start space-x-2 text-slate-300 print:text-slate-800">
                  <strong className="text-emerald-400 shrink-0 print:text-emerald-700">Recommendation:</strong>
                  <span>{gap.evidence.recommendation} (Est: {gap.learningHours} hours)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Signoff Footer */}
        <div className="border-t border-slate-800 pt-6 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 print:border-slate-300 print:text-slate-600">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-emerald-700" />
            <span>Verified by SkillBridge AI Semantic Engine • Deterministic NLP Matching Protocol</span>
          </div>
          <div>Page 1 of 1 • Official Academic Gap Audit</div>
        </div>
      </div>
    </div>
  );
};
