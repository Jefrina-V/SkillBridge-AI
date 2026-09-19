/**
 * Utility to extract clean text from user-uploaded PDF files
 * Supports browser-side PDF text extraction via pdfjs-dist with fallback.
 */
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF Worker initialization fallback:', e);
  }
}

export async function extractTextFromPdfFile(file: File): Promise<string> {
  // If it's a plain text or markdown file, read directly
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return await file.text();
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    } as any);

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageItems = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += `\n--- Page ${pageNum} ---\n` + pageItems;
    }

    const cleanedText = cleanExtractedText(fullText);
    if (cleanedText.trim().length > 30) {
      return cleanedText;
    }
  } catch (error) {
    console.warn('PDF.js client extraction encountered an issue, trying raw text fallback:', error);
  }

  // Fallback: Attempt text reading
  const rawText = await file.text();
  return cleanExtractedText(rawText);
}

export function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    // Replace null bytes and non-printable characters
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    // Normalize spaces
    .replace(/[ \t]+/g, ' ')
    // Normalize multiple newlines
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}
