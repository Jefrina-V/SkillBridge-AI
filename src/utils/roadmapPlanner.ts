import { SkillGapItem, PersonalizedRoadmap, RoadmapWeek } from '../types';

export function generatePersonalizedRoadmap(
  gaps: SkillGapItem[],
  targetRole: string,
  paceHoursPerDay: 1 | 2 | 3 = 2
): PersonalizedRoadmap {
  // Sort gaps by priority score descending (highest priority first)
  const prioritizedGaps = gaps
    .filter(g => g.status === 'missing' || g.status === 'partial')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  // Take top 3-4 key skills for the 4-week cycle
  const primaryGapSkills = prioritizedGaps.map(g => g.skillName);

  const skill1 = primaryGapSkills[0] || 'Modern Frontend Architecture';
  const skill2 = primaryGapSkills[1] || 'TypeScript & Type Safety';
  const skill3 = primaryGapSkills[2] || 'REST APIs & Integration';
  const skill4 = primaryGapSkills[3] || 'Full Project Integration & Testing';

  const dailyMinutes = paceHoursPerDay * 60;
  const totalWeeklyHours = paceHoursPerDay * 7;
  const totalHours = totalWeeklyHours * 4;

  const weeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      theme: `${skill1} Core Foundations`,
      targetSkill: skill1,
      days: [
        {
          day: 1,
          title: `Introduction & Mental Model of ${skill1}`,
          tasks: [
            `Read official overview docs for ${skill1}`,
            `Set up modern development workspace and starter template`,
            `Analyze difference between declarative component structure vs imperative DOM`
          ],
          durationMinutes: dailyMinutes,
          completed: false,
          resourceTip: `Focus on why ${skill1} was built and how it simplifies UI state.`
        },
        {
          day: 2,
          title: `Component Architecture & Props`,
          tasks: [
            `Understand unidirectional data flow and props contracts`,
            `Build 3 reusable presentation components with clean interfaces`,
            `Practice breaking a design mockup into modular components`
          ],
          durationMinutes: dailyMinutes,
          completed: false,
          resourceTip: 'Keep components pure and free of unnecessary side effects.'
        },
        {
          day: 3,
          title: `State Management & Lifecycle`,
          tasks: [
            `Implement local state variables and dynamic re-renders`,
            `Handle form inputs, controlled inputs, and validation feedback`,
            `Manage arrays and collection mutations safely without in-place mutation`
          ],
          durationMinutes: dailyMinutes,
          completed: false,
          resourceTip: 'Always use setter callbacks or spread operators for state updates.'
        },
        {
          day: 4,
          title: `Interactive Events & User Interactions`,
          tasks: [
            `Attach synthetic event listeners and parameter passing`,
            `Implement keyboard navigation shortcuts and accessibility labels`,
            `Manage modal dialog overlays and dismiss triggers`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 5,
          title: `Essential Hooks & Side Effects`,
          tasks: [
            `Master dependency arrays to avoid infinite loops`,
            `Perform asynchronous data fetches and loading indicators`,
            `Implement cleanup functions for subscriptions/timers`
          ],
          durationMinutes: dailyMinutes,
          completed: false,
          resourceTip: 'Check network tab to verify single trigger execution.'
        },
        {
          day: 6,
          title: `Hands-on Mini-Project: Interactive Dashboard Widget`,
          tasks: [
            `Build a functional interactive tracker application`,
            `Integrate search filtering, sorting, and tag filtering`,
            `Verify zero console warnings and clean DOM tree`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 7,
          title: `Week 1 Review & Code Audit`,
          tasks: [
            `Review all code written during Week 1`,
            `Refactor messy functions into custom utilities`,
            `Self-test on core ${skill1} interview conceptual questions`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        }
      ]
    },
    {
      weekNumber: 2,
      theme: `${skill2} Statically Typed Workflows`,
      targetSkill: skill2,
      days: [
        {
          day: 8,
          title: `${skill2} Types & Type Inference`,
          tasks: [
            `Configure tsconfig compiler options and strict mode`,
            `Define primitive types, literal types, and union types`,
            `Convert a sample JavaScript snippet to strictly typed ${skill2}`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 9,
          title: `Interfaces, Type Aliases & Complex Shapes`,
          tasks: [
            `Define comprehensive domain models (User, Course, SkillGap)`,
            `Differentiate between 'interface' and 'type' semantics`,
            `Implement optional, readonly, and index properties`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 10,
          title: `Generics & Utility Types`,
          tasks: [
            `Build reusable generic wrapper functions and API response contracts`,
            `Master key utility types: Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, T>`,
            `Practice type narrowing with type guards (typeof, instanceof, 'in')`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 11,
          title: `Typing Component Props & Event Handlers`,
          tasks: [
            `Type React component props, children, and callback signatures`,
            `Type DOM events: ChangeEvent<HTMLInputElement>, FormEvent, MouseEvent`,
            `Ensure zero usage of 'any' across component codebase`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 12,
          title: `Async Data Typing & API Contract Integration`,
          tasks: [
            `Define strict Promise return types and async error shapes`,
            `Implement type validation schemas (Zod or type guards)`,
            `Handle fallback error states cleanly`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 13,
          title: `Mini-Project: Strictly Typed Task Management Hub`,
          tasks: [
            `Build multi-status Kanban/Task manager in ${skill2}`,
            `Add drag-and-drop or status toggling with full type inference`,
            `Run linter and TypeScript compiler check (tsc --noEmit)`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 14,
          title: `Week 2 Consolidation & Assessment`,
          tasks: [
            `Complete interactive TypeScript practice puzzles`,
            `Review common error messages (Type X is not assignable to type Y)`,
            `Draft a short summary explaining how types catch runtime bugs`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        }
      ]
    },
    {
      weekNumber: 3,
      theme: `${skill3} & System Communication`,
      targetSkill: skill3,
      days: [
        {
          day: 15,
          title: `HTTP Protocol, REST Conventions & Status Codes`,
          tasks: [
            `Review HTTP methods (GET, POST, PUT, PATCH, DELETE)`,
            `Deep dive into HTTP status codes (200, 201, 400, 401, 403, 404, 500)`,
            `Inspect network payloads using Browser DevTools Network tab`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 16,
          title: `Asynchronous Data Fetching & State Handling`,
          tasks: [
            `Implement fetch/axios requests with custom headers and auth tokens`,
            `Manage 3 distinct UI states: Loading Spinner, Data Rendered, Error Banner`,
            `Handle request cancellation and debounce search queries`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 17,
          title: `Authentication & Session Tokens`,
          tasks: [
            `Understand Bearer Token headers and JWT structure`,
            `Store authentication tokens securely in client state`,
            `Implement protected route redirects and auto logout on 401`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 18,
          title: `Data Mutation, Optimistic Updates & Cache Sync`,
          tasks: [
            `Create POST and PATCH forms with validation errors displayed inline`,
            `Implement optimistic UI updates with immediate visual feedback`,
            `Handle rollback if the server returns an error response`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 19,
          title: `Pagination, Filtering & Infinite Scrolling`,
          tasks: [
            `Handle paginated API endpoints with query parameters (?page=1&limit=10)`,
            `Sync URL search params with application filter state`,
            `Build previous/next pagination controls with disabled states`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 20,
          title: `Mini-Project: Real-time Data Explorer Client`,
          tasks: [
            `Integrate a public API (e.g. GitHub API, Weather, or Job Feed)`,
            `Support live keyword searching, sorting, and detail modal view`,
            `Simulate offline state and retry button for resilience`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 21,
          title: `Week 3 Review & API Best Practices Checklist`,
          tasks: [
            `Document API endpoints with mock request/response examples`,
            `Verify graceful handling of 500 server crashes`,
            `Self-review CORS policies and error boundary handling`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        }
      ]
    },
    {
      weekNumber: 4,
      theme: `${skill4}: Capstone Project & Job Readiness`,
      targetSkill: skill4,
      days: [
        {
          day: 22,
          title: `Capstone Planning & System Architecture`,
          tasks: [
            `Design complete application spec bridging all learned skills`,
            `Create wireframe diagram and entity data relationships`,
            `Set up Git repository with feature branch workflow`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 23,
          title: `Building Core Features & State Machine`,
          tasks: [
            `Implement primary user journey with responsive layout`,
            `Connect UI components with API integration`,
            `Ensure robust input validation and error feedback`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 24,
          title: `Automated Testing & Edge Cases`,
          tasks: [
            `Write unit tests for core helper functions and business logic`,
            `Write component integration tests verifying user interaction flows`,
            `Fix all uncovered edge cases (empty states, very long strings)`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 25,
          title: `Performance Optimization & Accessibility Audit`,
          tasks: [
            `Run Lighthouse audit and target 90+ accessibility & performance`,
            `Check color contrast ratios (WCAG AA compliance)`,
            `Optimize re-renders using React.memo or useMemo where needed`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 26,
          title: `CI/CD & Production Deployment`,
          tasks: [
            `Set up automated build check on git push`,
            `Deploy live project to Vercel / Cloud Run / Netlify`,
            `Configure production environment variables and custom domain`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 27,
          title: `Technical Documentation & README`,
          tasks: [
            `Write comprehensive README: Problem solved, Tech stack, Architecture diagram`,
            `Add live demo link and step-by-step local setup instructions`,
            `Record a 2-minute Loom/video demonstration of the finished app`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        },
        {
          day: 28,
          title: `Portfolio Review & Resume Gap Closing`,
          tasks: [
            `Update resume bullets with evidence: "${skill1}, ${skill2}, ${skill3}"`,
            `Prepare answers for typical interview questions on this project`,
            `Download final SkillBridge AI Curriculum Gap completion certificate`
          ],
          durationMinutes: dailyMinutes,
          completed: false
        }
      ]
    }
  ];

  return {
    id: `roadmap-${Date.now()}`,
    analysisId: `analysis-${Date.now()}`,
    studyPaceHoursPerDay: paceHoursPerDay,
    targetRole,
    totalHours,
    weeks,
    createdAt: new Date().toISOString()
  };
}
