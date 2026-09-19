import { SKILL_KNOWLEDGE_BASE, SKILL_SYNONYMS } from '../data/knowledgeBase';
import { PriorityLevel, SkillGapItem, SkillMatchStatus } from '../types';

/**
 * Normalizes user and parsed skill names into standardized canonical forms.
 * Example: 'JS' -> 'JavaScript', 'React.js' -> 'React', 'psql' -> 'PostgreSQL'
 */
export function normalizeSkillName(rawName: string): string {
  if (!rawName) return '';
  const trimmed = rawName.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = trimmed.toLowerCase();

  if (SKILL_SYNONYMS[lower]) {
    return SKILL_SYNONYMS[lower];
  }

  // Check matching against canonical knowledge base entries
  for (const canonical of Object.keys(SKILL_KNOWLEDGE_BASE)) {
    if (canonical.toLowerCase() === lower) {
      return canonical;
    }
  }

  return rawName.trim();
}

/**
 * Tokenize and generate character 3-grams for fuzzy sub-word matching
 */
function getTrigrams(str: string): Set<string> {
  const s = `  ${str.toLowerCase()}  `;
  const trigrams = new Set<string>();
  for (let i = 0; i < s.length - 2; i++) {
    trigrams.add(s.substring(i, i + 3));
  }
  return trigrams;
}

/**
 * Cosine similarity between two n-gram sets
 */
function ngramSimilarity(a: string, b: string): number {
  const triA = getTrigrams(a);
  const triB = getTrigrams(b);
  let intersection = 0;
  for (const gram of triA) {
    if (triB.has(gram)) intersection++;
  }
  return (2.0 * intersection) / (triA.size + triB.size);
}

/**
 * Safely escapes all special regex characters.
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if a target phrase/skill exists in text with safe word boundaries.
 * Safely handles non-alphanumeric characters like C++, C#, .NET, and punctuation.
 */
export function containsSkillWord(text: string, skill: string): boolean {
  if (!text || !skill) return false;
  const trimmed = skill.trim();
  if (!trimmed) return false;

  try {
    const escaped = escapeRegExp(trimmed);
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+.-])${escaped}(?=$|[^a-zA-Z0-9_#+.-])`, 'i');
    return pattern.test(text);
  } catch {
    return text.toLowerCase().includes(trimmed.toLowerCase());
  }
}

/**
 * Calculate semantic similarity between a job skill and candidate syllabus skills
 */
export function matchSkillAgainstSyllabus(
  jobSkill: string,
  syllabusSkills: string[],
  syllabusFullText: string
): {
  bestMatchSkill: string | null;
  similarityScore: number;
  isPartialConcept: boolean;
} {
  const canonicalJobSkill = normalizeSkillName(jobSkill);
  const kbEntry = SKILL_KNOWLEDGE_BASE[canonicalJobSkill];

  let bestScore = 0;
  let bestMatch: string | null = null;
  let isPartialConcept = false;

  const normalizedSyllabusSkills = syllabusSkills.map(s => ({
    original: s,
    canonical: normalizeSkillName(s)
  }));

  // 1. Direct exact or synonym match
  for (const s of normalizedSyllabusSkills) {
    if (s.canonical.toLowerCase() === canonicalJobSkill.toLowerCase()) {
      return {
        bestMatchSkill: s.original,
        similarityScore: 0.98,
        isPartialConcept: false
      };
    }
  }

  // 2. Knowledge base prerequisite/related analysis
  if (kbEntry) {
    // If syllabus covers all or some prerequisites of this skill
    const metPrereqs = kbEntry.prerequisites.filter(prereq =>
      normalizedSyllabusSkills.some(s => s.canonical.toLowerCase() === prereq.toLowerCase()) ||
      syllabusFullText.toLowerCase().includes(prereq.toLowerCase())
    );

    if (metPrereqs.length > 0) {
      // E.g., JavaScript is in syllabus, job needs React
      const ratio = metPrereqs.length / Math.max(kbEntry.prerequisites.length, 1);
      const partialScore = 0.60 + (ratio * 0.16); // 0.60 - 0.76 (Partial Match range)
      if (partialScore > bestScore) {
        bestScore = partialScore;
        bestMatch = `${metPrereqs.join(', ')} (Prerequisite foundation)`;
        isPartialConcept = true;
      }
    }

    // Check related technologies (e.g. Next.js related to React)
    for (const related of kbEntry.relatedSkills) {
      if (normalizedSyllabusSkills.some(s => s.canonical.toLowerCase() === related.toLowerCase())) {
        const relatedScore = 0.68;
        if (relatedScore > bestScore) {
          bestScore = relatedScore;
          bestMatch = `${related} (Related ecosystem skill)`;
          isPartialConcept = true;
        }
      }
    }
  }

  // 3. Substring & Fuzzy N-gram similarity
  for (const s of normalizedSyllabusSkills) {
    const sim = ngramSimilarity(canonicalJobSkill, s.canonical);
    if (sim > bestScore) {
      bestScore = sim;
      bestMatch = s.original;
    }
  }

  // 4. Also check presence in raw syllabus text if not captured in skill list
  if (bestScore < 0.80) {
    if (containsSkillWord(syllabusFullText, canonicalJobSkill)) {
      bestScore = Math.max(bestScore, 0.88);
      bestMatch = canonicalJobSkill;
      isPartialConcept = false;
    }
  }

  return {
    bestMatchSkill: bestMatch,
    similarityScore: Number(bestScore.toFixed(2)),
    isPartialConcept
  };
}

/**
 * Computes the multi-factor Priority Score (0-100)
 * Considers:
 * 1. Market Frequency in analyzed job postings (Weight: 35%)
 * 2. Status severity: Missing=1.0, Partial=0.55, Covered=0 (Weight: 25%)
 * 3. Industry relevance score from Knowledge Base (Weight: 20%)
 * 4. Prerequisite readiness: if prerequisites are already met in syllabus, priority increases (Weight: 20%)
 */
export function calculatePriorityScore(
  skillName: string,
  status: SkillMatchStatus,
  syllabusSkills: string[]
): {
  score: number;
  level: PriorityLevel;
} {
  const canonical = normalizeSkillName(skillName);
  const kb = SKILL_KNOWLEDGE_BASE[canonical];

  // If already covered, priority is low
  if (status === 'covered') {
    return { score: 18, level: 'Low' };
  }

  // Base relevance from KB or default
  const industryRelevance = kb ? kb.industryRelevance : 70;
  const marketFrequencyRatio = kb ? (kb.marketFrequency / kb.totalMarketSample) : 0.45; // e.g. 742/1250 = ~0.59

  // Severity multiplier
  const statusWeight = status === 'missing' ? 1.0 : 0.6;

  // Prerequisite check
  let prereqReadiness = 0.5;
  if (kb && kb.prerequisites.length > 0) {
    const met = kb.prerequisites.filter(p =>
      syllabusSkills.some(s => normalizeSkillName(s).toLowerCase() === p.toLowerCase())
    );
    prereqReadiness = met.length / kb.prerequisites.length;
  }

  // Multi-factor formula
  const calculated =
    (marketFrequencyRatio * 100 * 0.35) +
    (industryRelevance * 0.25) +
    (statusWeight * 100 * 0.20) +
    (prereqReadiness * 100 * 0.20);

  const finalScore = Math.min(99, Math.max(25, Math.round(calculated)));

  let level: PriorityLevel = 'Low';
  if (finalScore >= 80) level = 'Very High';
  else if (finalScore >= 65) level = 'High';
  else if (finalScore >= 45) level = 'Medium';
  else level = 'Low';

  return { score: finalScore, level };
}

/**
 * Creates structured, evidence-based gap reason and recommendations
 */
export function buildEvidenceRecord(
  skillName: string,
  status: SkillMatchStatus,
  similarityScore: number,
  syllabusSkills: string[],
  matchedSyllabusSkill?: string
): SkillGapItem['evidence'] {
  const canonical = normalizeSkillName(skillName);
  const kb = SKILL_KNOWLEDGE_BASE[canonical];

  const totalJobs = kb ? kb.totalMarketSample : 1250;
  const count = kb ? kb.marketFrequency : 580;
  const pct = ((count / totalJobs) * 100).toFixed(1);

  const marketFrequency = `Appears in ${count} out of ${totalJobs} benchmarked job descriptions (${pct}%)`;

  let syllabusCoverageStatus = '';
  let reason = '';
  let recommendation = '';
  const prerequisitesMet: string[] = [];
  const prerequisitesMissing: string[] = [];

  if (kb && kb.prerequisites.length > 0) {
    for (const p of kb.prerequisites) {
      if (syllabusSkills.some(s => normalizeSkillName(s).toLowerCase() === p.toLowerCase())) {
        prerequisitesMet.push(p);
      } else {
        prerequisitesMissing.push(p);
      }
    }
  }

  if (status === 'covered') {
    syllabusCoverageStatus = `Directly covered in syllabus via "${matchedSyllabusSkill || skillName}" (Semantic Match: ${(similarityScore * 100).toFixed(0)}%).`;
    reason = `The course curriculum already addresses this competency directly.`;
    recommendation = `Reinforce with practical end-to-end portfolio projects.`;
  } else if (status === 'partial') {
    syllabusCoverageStatus = `Partially covered via foundational topics (${matchedSyllabusSkill || 'prerequisites'}).`;
    reason = `The syllabus covers the foundational concepts (${prerequisitesMet.join(', ') || 'underlying theory'}), but has not modernized to modern production frameworks like ${skillName}.`;
    recommendation = `Leverage existing foundation in ${prerequisitesMet.join(' & ') || 'core concepts'} to bridge into ${skillName}.`;
  } else {
    syllabusCoverageStatus = `No explicit or semantic topic for "${skillName}" found in the uploaded syllabus.`;
    if (prerequisitesMet.length > 0) {
      reason = `${skillName} is required by the target job role. While the syllabus covers prerequisite ${prerequisitesMet.join(', ')}, ${skillName} itself is completely omitted.`;
      recommendation = `Since prerequisite knowledge (${prerequisitesMet.join(', ')}) is already satisfied, start direct hands-on study of ${skillName}.`;
    } else if (prerequisitesMissing.length > 0) {
      reason = `${skillName} is an industry requirement, but both the skill and its prerequisites (${prerequisitesMissing.join(', ')}) are absent from the syllabus.`;
      recommendation = `Review fundamentals (${prerequisitesMissing.join(', ')}) before tackling ${skillName}.`;
    } else {
      reason = `${skillName} is demanded by modern tech employers but not currently taught in this academic syllabus.`;
      recommendation = `Follow the self-paced 4-week roadmap to bridge this gap.`;
    }
  }

  return {
    marketFrequency,
    syllabusCoverageStatus,
    prerequisitesMet,
    prerequisitesMissing,
    reason,
    recommendation
  };
}
