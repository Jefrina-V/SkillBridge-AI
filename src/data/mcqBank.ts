import { MCQQuestion, SkillProgressSummary } from '../types';

export const DEFAULT_MCQ_BANK: Record<string, MCQQuestion[]> = {
  'react': [
    {
      id: 'react-1',
      skillName: 'React',
      category: 'Frontend Frameworks',
      difficulty: 'Intermediate',
      question: 'In modern React, what is the primary consequence of mutating state directly instead of using the setState/setter function?',
      codeSnippet: `// Mutating state directly
const [user, setUser] = useState({ name: 'Alex', level: 1 });
user.level += 1; // Direct mutation`,
      options: [
        'React will throw an uncaught ReferenceError at runtime.',
        'React compares object references (Object.is) and will skip re-rendering the component.',
        'React will re-render immediately but reset all child component states.',
        'The DOM will update, but the Virtual DOM will retain the stale value.'
      ],
      correctAnswerIndex: 1,
      explanation: 'React uses shallow reference equality (Object.is) during state diffing. Mutating an existing object or array in place preserves the same memory reference, causing React to assume nothing changed and skip the re-render.',
      takeawayTip: 'Always treat React state as immutable. Use spread syntax (e.g. `setUser(prev => ({ ...prev, level: prev.level + 1 }))`) or Immer.'
    },
    {
      id: 'react-2',
      skillName: 'React',
      category: 'Frontend Frameworks',
      difficulty: 'Intermediate',
      question: 'Which React hook should be preferred when caching an expensive computational result across re-renders without re-calculating on every render?',
      options: [
        'useCallback()',
        'useMemo()',
        'useRef()',
        'useLayoutEffect()'
      ],
      correctAnswerIndex: 1,
      explanation: 'useMemo caches the result of invoking a calculation function until one of its declared dependencies changes. useCallback caches the function definition itself, whereas useRef holds a mutable reference that does not trigger re-renders.',
      takeawayTip: 'Use useMemo only for truly expensive operations (like filtering 10,000 items) or to maintain stable object references passed to memoized children.'
    },
    {
      id: 'react-3',
      skillName: 'React',
      category: 'Frontend Frameworks',
      difficulty: 'Advanced',
      question: 'Why does React require stable, unique "key" props when rendering dynamic lists of components?',
      codeSnippet: `{items.map(item => (
  <ListItem key={item.id} data={item} />
))}`,
      options: [
        'Keys are required by the HTML5 specification for <li> elements.',
        'Keys allow React to identify which items were added, removed, or reordered to avoid recreating the entire DOM subtree.',
        'Keys guarantee that child components will execute their useEffect hooks in alphabetical order.',
        'Keys convert asynchronous state updates into synchronous DOM operations.'
      ],
      correctAnswerIndex: 1,
      explanation: 'React uses keys during reconciliation to match elements between render passes. Using stable IDs prevents component state mix-ups and preserves focus and internal state when list order changes.',
      takeawayTip: 'Never use random numbers or array indices as keys if list items can be filtered, re-ordered, or deleted.'
    },
    {
      id: 'react-4',
      skillName: 'React',
      category: 'Frontend Frameworks',
      difficulty: 'Intermediate',
      question: 'What is the correct cleanup pattern when establishing a subscription or interval inside a useEffect hook?',
      codeSnippet: `useEffect(() => {
  const timer = setInterval(tick, 1000);
  // How should timer be cleaned up?
}, []);`,
      options: [
        'Call clearInterval(timer) outside the useEffect block.',
        'Return a cleanup function from useEffect: () => clearInterval(timer)',
        'Pass timer as the second argument in the dependency array.',
        'React cleans up timers automatically when the component unmounts.'
      ],
      correctAnswerIndex: 1,
      explanation: 'React executes any function returned from useEffect during component unmounting or before re-running the effect when dependencies change, preventing memory leaks.',
      takeawayTip: 'Always return cleanup callbacks when adding event listeners, intervals, WebSocket connections, or AbortControllers in useEffect.'
    }
  ],

  'typescript': [
    {
      id: 'ts-1',
      skillName: 'TypeScript',
      category: 'Programming Languages',
      difficulty: 'Intermediate',
      question: 'What is the primary difference between TypeScript "interface" and "type" alias when extending object schemas?',
      options: [
        'Interfaces cannot describe object properties, while types can.',
        'Interfaces support declaration merging (open for extension), whereas type aliases cannot be redeclared.',
        'Types are compiled into JavaScript runtime prototypes, whereas interfaces are erased.',
        'Interfaces are only available when strict mode is disabled in tsconfig.json.'
      ],
      correctAnswerIndex: 1,
      explanation: 'TypeScript interfaces are "open" and support declaration merging (multiple interface definitions with the same name merge their properties). Type aliases are closed and cannot be reopened once declared.',
      takeawayTip: 'Use interfaces for public API and library contracts that consumers might augment; use types for unions, primitives, and complex conditional types.'
    },
    {
      id: 'ts-2',
      skillName: 'TypeScript',
      category: 'Programming Languages',
      difficulty: 'Advanced',
      question: 'Which utility type constructs a type with all properties of T set to optional?',
      codeSnippet: `interface User {
  id: string;
  email: string;
  role: string;
}
// Which creates { id?: string; email?: string; role?: string }?`,
      options: [
        'Omit<User, "all">',
        'Partial<User>',
        'Nullable<User>',
        'Optional<User>'
      ],
      correctAnswerIndex: 1,
      explanation: 'Partial<T> is a built-in mapped utility type defined as `type Partial<T> = { [P in keyof T]?: T[P]; }`. It marks every property of type T as optional.',
      takeawayTip: 'Combine Partial<T> with Pick<T, K> when typing patch or update endpoints where only a subset of fields is modified.'
    },
    {
      id: 'ts-3',
      skillName: 'TypeScript',
      category: 'Programming Languages',
      difficulty: 'Intermediate',
      question: 'What is the purpose of a user-defined type guard in TypeScript?',
      codeSnippet: `function isStudent(person: Person): person is Student {
  return (person as Student).grade !== undefined;
}`,
      options: [
        'It converts JavaScript objects into binary format for faster execution.',
        'It asserts at compile-time that a parameter matches a specific type when the predicate returns true.',
        'It prevents any mutations to the person object at runtime.',
        'It generates runtime schema validation errors if grade is missing.'
      ],
      correctAnswerIndex: 1,
      explanation: 'A type predicate in the return type (`param is Type`) instructs the TypeScript compiler to narrow down the variable type within the conditional block where the guard returns true.',
      takeawayTip: 'Use type guards (`x is Type`) instead of repeatedly writing `as Type` assertions to keep your codebase type-safe.'
    }
  ],

  'nextjs': [
    {
      id: 'next-1',
      skillName: 'Next.js',
      category: 'Frontend Frameworks',
      difficulty: 'Intermediate',
      question: 'In the Next.js App Router (app directory), what is the default rendering behavior of React components?',
      options: [
        'Client Components with automatic hydrateRoot calls.',
        'React Server Components (RSC) rendered exclusively on the server without client JavaScript.',
        'Static HTML pages generated at build time without any dynamic props.',
        'Server-Side Rendered (SSR) legacy pages utilizing getServerSideProps.'
      ],
      correctAnswerIndex: 1,
      explanation: 'In the Next.js App Router, all components inside the `app/` folder are React Server Components by default. To introduce interactivity, state, or browser APIs, you must explicitly declare `"use client"` at the top of the file.',
      takeawayTip: 'Keep data fetching and heavy dependencies in Server Components, and push "use client" boundaries to the leaf components that need interactivity.'
    },
    {
      id: 'next-2',
      skillName: 'Next.js',
      category: 'Frontend Frameworks',
      difficulty: 'Advanced',
      question: 'Which special Next.js file is used to render fallback UI while Server Component contents are streaming from the server?',
      options: [
        'fallback.tsx',
        'loading.tsx',
        'spinner.tsx',
        'suspense.tsx'
      ],
      correctAnswerIndex: 1,
      explanation: 'Next.js automatically wraps page contents in a React <Suspense> boundary using the UI defined in `loading.tsx` for instant loading states and progressive streaming.',
      takeawayTip: 'Use loading.tsx and skeleton loaders to achieve sub-second perceived load times and avoid layout shifts.'
    }
  ],

  'docker': [
    {
      id: 'docker-1',
      skillName: 'Docker',
      category: 'DevOps & Cloud',
      difficulty: 'Intermediate',
      question: 'In a Dockerfile, why is it recommended to copy package.json and run "npm install" before copying the rest of the application source code?',
      codeSnippet: `COPY package*.json ./
RUN npm install
COPY . .`,
      options: [
        'Because npm install fails if other source files are present in the directory.',
        'To leverage Docker layer caching so dependencies are only re-installed when package files change.',
        'Docker requires package.json to be located at the physical root of the container image.',
        'To ensure file ownership permissions are set to root.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Docker caches image layers sequentially. If package*.json files have not changed, Docker reuses the cached layer from `RUN npm install`, cutting rebuild times from minutes to seconds.',
      takeawayTip: 'Order Dockerfile instructions from least-frequently changing (base OS, dependencies) to most-frequently changing (application code).'
    },
    {
      id: 'docker-2',
      skillName: 'Docker',
      category: 'DevOps & Cloud',
      difficulty: 'Intermediate',
      question: 'What is the purpose of the "-p 8080:3000" flag in the command "docker run -d -p 8080:3000 my-app"?',
      options: [
        'It allocates 8080 MB of RAM and 3000 MB of swap memory to the container.',
        'It forwards incoming host machine traffic on port 8080 to container port 3000.',
        'It forwards container traffic on port 8080 to host machine port 3000.',
        'It defines the container process ID range.'
      ],
      correctAnswerIndex: 1,
      explanation: 'The `-p hostPort:containerPort` flag publishes a container port to the host machine. Incoming requests to http://localhost:8080 on the host are forwarded to port 3000 inside the container.',
      takeawayTip: 'Ensure your server inside the container binds to host 0.0.0.0 (not 127.0.0.1) so published ports receive external traffic.'
    },
    {
      id: 'docker-3',
      skillName: 'Docker',
      category: 'DevOps & Cloud',
      difficulty: 'Advanced',
      question: 'What key advantage do multi-stage Docker builds provide for production deployments?',
      codeSnippet: `# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist`,
      options: [
        'They allow running multiple operating systems concurrently in the same container.',
        'They drastically minimize the final production image size by excluding compilers, test suites, and build tools.',
        'They automatically deploy containers across multiple Kubernetes clusters.',
        'They enable zero-downtime rolling database migrations.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Multi-stage builds allow you to use a heavy image with all build tools, compilers, and devDependencies in stage 1, and copy only the compiled artifacts into a lightweight runtime image (like Alpine), reducing image size and attack surface.',
      takeawayTip: 'Production Node images can shrink from 1GB+ down to ~80MB using multi-stage Alpine builds.'
    }
  ],

  'testing': [
    {
      id: 'test-1',
      skillName: 'Testing (Jest / RTL)',
      category: 'Quality Assurance',
      difficulty: 'Intermediate',
      question: 'In React Testing Library, why should developers query elements by role (getByRole, findByRole) rather than querying by CSS class or test-id?',
      options: [
        'Querying by role executes twice as fast as querying by test-id.',
        'It reflects how real assistive technology and users interact with the UI, enforcing accessible semantics.',
        'CSS classes are automatically stripped out during Jest compilation.',
        'React Testing Library throws an error if test-id attributes are present.'
      ],
      correctAnswerIndex: 1,
      explanation: 'The guiding principle of React Testing Library is: "The more your tests resemble the way your software is used, the more confidence they can give you." Querying by role (e.g. `getByRole("button", { name: /submit/i })`) verifies both functionality and accessibility.',
      takeawayTip: 'Prioritize queries in this order: getByRole -> getByLabelText -> getByPlaceholderText -> getByText -> getByTestId (last resort).'
    },
    {
      id: 'test-2',
      skillName: 'Testing (Jest / RTL)',
      category: 'Quality Assurance',
      difficulty: 'Intermediate',
      question: 'When testing a React component that fetches data asynchronously, which RTL query prefix should you use to wait for the element to appear?',
      codeSnippet: `// Which query will wait for the user card to render?
const userCard = await screen.________('user-profile-card');`,
      options: [
        'getByText',
        'queryByText',
        'findByText',
        'selectByText'
      ],
      correctAnswerIndex: 2,
      explanation: 'The `findBy*` queries return a Promise that waits up to 1000ms (by default) for the element to appear in the DOM. `getBy*` throws immediately if not found, and `queryBy*` returns null immediately.',
      takeawayTip: 'Use `findBy*` for elements that appear asynchronously after API responses, timers, or animations.'
    }
  ],

  'cicd': [
    {
      id: 'cicd-1',
      skillName: 'CI/CD Pipelines',
      category: 'DevOps & Automation',
      difficulty: 'Intermediate',
      question: 'In a GitHub Actions workflow YAML file, which section specifies the repository events that automatically trigger the pipeline?',
      codeSnippet: `name: Build & Test
_____:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]`,
      options: [
        'trigger',
        'events',
        'on',
        'listen'
      ],
      correctAnswerIndex: 2,
      explanation: 'In GitHub Actions syntax, the top-level `on:` key defines the event triggers (e.g. push, pull_request, schedule, workflow_dispatch) that launch workflow jobs.',
      takeawayTip: 'Scope pull_request triggers to specific branch paths (e.g. `paths: ["src/**"]`) to avoid running heavy CI checks on Markdown docs.'
    },
    {
      id: 'cicd-2',
      skillName: 'CI/CD Pipelines',
      category: 'DevOps & Automation',
      difficulty: 'Intermediate',
      question: 'What is the primary difference between Continuous Integration (CI) and Continuous Deployment (CD)?',
      options: [
        'CI is for open-source projects; CD is for private enterprise projects.',
        'CI automatically merges, builds, and runs test suites; CD automatically delivers or deploys verified code to production environments.',
        'CI operates on frontend code, whereas CD operates on backend databases.',
        'CI requires Docker containers, whereas CD does not.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Continuous Integration focuses on frequently verifying code changes via automated builds and tests. Continuous Deployment takes passing artifacts and automatically deploys them into staging and production without manual intervention.',
      takeawayTip: 'A robust CI suite prevents regression bugs from ever landing on the main branch.'
    }
  ],

  'rest': [
    {
      id: 'rest-1',
      skillName: 'REST APIs',
      category: 'Backend Architecture',
      difficulty: 'Intermediate',
      question: 'Which HTTP method is defined as idempotent and intended to completely replace an existing resource with the request payload?',
      options: [
        'POST',
        'PATCH',
        'PUT',
        'CONNECT'
      ],
      correctAnswerIndex: 2,
      explanation: 'PUT is defined by RFC 7231 as idempotent (making multiple identical requests results in the same state) and represents a complete resource replacement. PATCH is for partial updates, and POST is non-idempotent for creation.',
      takeawayTip: 'Use POST for creating new records, PUT for full replacement, and PATCH for updating a few fields.'
    },
    {
      id: 'rest-2',
      skillName: 'REST APIs',
      category: 'Backend Architecture',
      difficulty: 'Intermediate',
      question: 'What HTTP response status code should be returned when a client makes an unauthorized request because their authentication token is missing or invalid?',
      options: [
        '400 Bad Request',
        '401 Unauthorized',
        '403 Forbidden',
        '404 Not Found'
      ],
      correctAnswerIndex: 1,
      explanation: '401 Unauthorized specifically means unauthenticated: the request lacks valid authentication credentials. In contrast, 403 Forbidden means the server recognizes the user, but they lack sufficient permissions.',
      takeawayTip: 'Remember: 401 means "Who are you? (Authenticate first)", while 403 means "I know who you are, but you cannot access this resource".'
    }
  ],

  'tailwind': [
    {
      id: 'tw-1',
      skillName: 'Tailwind CSS',
      category: 'Frontend Styling',
      difficulty: 'Beginner',
      question: 'In Tailwind CSS mobile-first responsive design, what does the class prefix "md:flex" mean?',
      options: [
        'Apply display: flex only on medium screens and smaller.',
        'Apply display: flex on medium screens (e.g. 768px) and all screen widths above it.',
        'Apply display: flex only on mobile devices.',
        'Apply display: flex for the medium child element.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Tailwind breakpoints are mobile-first (`min-width`). An un-prefixed class applies to mobile (default), while `md:flex` applies at 768px and up.',
      takeawayTip: 'Always design mobile layouts first using base utility classes, then layer `sm:`, `md:`, `lg:` modifiers for larger screens.'
    }
  ],

  'graphql': [
    {
      id: 'gql-1',
      skillName: 'GraphQL',
      category: 'API & Data Layer',
      difficulty: 'Intermediate',
      question: 'What primary problem of traditional REST APIs does GraphQL solve by allowing clients to request specific fields?',
      options: [
        'Cross-Origin Resource Sharing (CORS) errors.',
        'Over-fetching and under-fetching of data.',
        'Lack of SSL encryption.',
        'Slow database disk write performance.'
      ],
      correctAnswerIndex: 1,
      explanation: 'GraphQL allows the client to dictate the shape and depth of the response payload in a single query, preventing over-fetching (retrieving unneeded fields) and under-fetching (requiring multiple round-trips).',
      takeawayTip: 'Pair GraphQL with DataLoader on the backend to batch and cache database requests, eliminating the N+1 query problem.'
    }
  ],

  'statemanagement': [
    {
      id: 'sm-1',
      skillName: 'State Management',
      category: 'Architecture',
      difficulty: 'Intermediate',
      question: 'In Redux or unidirectional state architectures, what is the role of a pure reducer function?',
      options: [
        'To perform asynchronous fetch API calls to the server.',
        'To accept the previous state and an action, returning a new immutable state object.',
        'To manipulate the browser DOM nodes directly.',
        'To validate authentication cookies.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Reducers are pure functions: given `(state, action) => newState`, they must calculate the next state without side effects, API calls, or mutations to the original state argument.',
      takeawayTip: 'Keep side-effects like API requests inside middleware (Thunks, Sagas) or React Query, keeping state reducers pure and testable.'
    }
  ],

  'docker-cloud': [
    {
      id: 'docker-cloud-1',
      skillName: 'Docker & Containerization',
      category: 'DevOps & Cloud',
      difficulty: 'Intermediate',
      question: 'What is the purpose of the .dockerignore file in project root?',
      options: [
        'It tells the container which npm packages to ignore at runtime.',
        'It prevents specified local files (like node_modules, .env, .git) from being copied into the Docker build context.',
        'It disables Docker daemon logging for security reasons.',
        'It forces Docker to bypass SSL certificate checks.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Just like .gitignore, .dockerignore prevents sensitive or large local files (such as local `node_modules` or `.env` secrets) from being sent to the Docker daemon, speeding up image creation and preventing credential leaks.',
      takeawayTip: 'Always include node_modules, .env*, .git, and dist in your .dockerignore.'
    }
  ]
};

/**
 * Normalizes skill name to match question bank keys
 */
export function normalizeSkillQuery(name: string): string {
  const lower = (name || '').toLowerCase();
  if (lower.includes('react') && !lower.includes('native')) return 'react';
  if (lower.includes('type') || lower.includes('ts')) return 'typescript';
  if (lower.includes('next')) return 'nextjs';
  if (lower.includes('docker') || lower.includes('container')) return 'docker';
  if (lower.includes('test') || lower.includes('jest')) return 'testing';
  if (lower.includes('ci') || lower.includes('action') || lower.includes('pipeline')) return 'cicd';
  if (lower.includes('api') || lower.includes('rest')) return 'rest';
  if (lower.includes('tailwind')) return 'tailwind';
  if (lower.includes('graphql')) return 'graphql';
  if (lower.includes('state') || lower.includes('redux') || lower.includes('zustand')) return 'statemanagement';
  return lower;
}

/**
 * Retrieves questions for a specific skill from the bank.
 */
export function getQuestionsForSkill(skillName: string, count: number = 4): MCQQuestion[] {
  const key = normalizeSkillQuery(skillName);
  let questions = DEFAULT_MCQ_BANK[key];

  if (!questions || questions.length === 0) {
    // Fallback: look for partial match in all question banks
    for (const [k, list] of Object.entries(DEFAULT_MCQ_BANK)) {
      if (skillName.toLowerCase().includes(k) || k.includes(skillName.toLowerCase())) {
        questions = list;
        break;
      }
    }
  }

  // If still not found, construct targeted questions for this technical skill
  if (!questions || questions.length === 0) {
    questions = [
      {
        id: `gen-${skillName}-1`,
        skillName,
        category: 'Technical Competency',
        difficulty: 'Intermediate',
        question: `When implementing production systems with ${skillName}, what is considered the primary architectural best practice?`,
        options: [
          `Decouple ${skillName} logic into modular, testable components with explicit interface boundaries.`,
          `Consolidate all ${skillName} operations into a single global configuration file.`,
          `Avoid using asynchronous operations or promises within ${skillName}.`,
          `Hardcode environment credentials directly within ${skillName} modules for faster execution.`
        ],
        correctAnswerIndex: 0,
        explanation: `Modularity and separation of concerns are fundamental when adopting ${skillName}, ensuring maintainability, code reuse, and testability across team environments.`,
        takeawayTip: `Maintain clear boundaries and comprehensive unit tests when integrating ${skillName} into your codebase.`
      },
      {
        id: `gen-${skillName}-2`,
        skillName,
        category: 'Technical Competency',
        difficulty: 'Intermediate',
        question: `How should error handling and failure scenarios be structured when working with ${skillName}?`,
        options: [
          `Silently suppress errors with empty catch blocks to prevent user disruption.`,
          `Implement structured error boundaries/handlers, logging actionable diagnostics while surfacing user-friendly recovery states.`,
          `Terminate the entire Node.js runtime process immediately on any warning.`,
          `Log raw database query credentials directly to public client consoles.`
        ],
        correctAnswerIndex: 1,
        explanation: `Resilient systems handle failures gracefully: catching expected errors, recording structured audit logs, and returning safe fallback states to the end user.`,
        takeawayTip: `Always use structured logging and defensive error boundaries with ${skillName}.`
      },
      {
        id: `gen-${skillName}-3`,
        skillName,
        category: 'Technical Competency',
        difficulty: 'Advanced',
        question: `What is the optimal performance profiling strategy for identifying bottlenecks in ${skillName}?`,
        options: [
          `Randomly insert setTimeout delays to throttle traffic.`,
          `Measure baseline latency, analyze flame graphs/metrics, and eliminate synchronous blocking operations.`,
          `Disable all caching layers to maximize CPU utilization.`,
          `Increase memory limits indefinitely without profiling code execution.`
        ],
        correctAnswerIndex: 1,
        explanation: `Data-driven profiling with metrics and execution flame graphs identifies the precise bottlenecks (e.g. unindexed queries, blocking loops, memory leaks) without guesswork.`,
        takeawayTip: `Measure before optimizing: establish benchmarks before refactoring ${skillName} implementations.`
      }
    ];
  }

  return questions.slice(0, count);
}

/**
 * Builds a comprehensive mixed diagnostic quiz across all missed skills
 */
export function getDiagnosticQuizForMissedSkills(missedSkills: string[], totalCount: number = 8): MCQQuestion[] {
  if (missedSkills.length === 0) {
    return getQuestionsForSkill('React', 5);
  }

  const result: MCQQuestion[] = [];
  const perSkill = Math.max(1, Math.floor(totalCount / missedSkills.length));

  for (const skill of missedSkills) {
    const qs = getQuestionsForSkill(skill, perSkill);
    result.push(...qs);
    if (result.length >= totalCount) break;
  }

  // If still below totalCount, top up with first available
  if (result.length < totalCount && missedSkills.length > 0) {
    const extra = getQuestionsForSkill(missedSkills[0], totalCount - result.length);
    for (const q of extra) {
      if (!result.find(r => r.id === q.id)) {
        result.push(q);
      }
    }
  }

  return result.slice(0, totalCount);
}

/**
 * Generates initial progress summaries based on gap items
 */
export function buildInitialProgressSummaries(gaps: { skillName: string; status: string; priorityLevel: string }[]): Record<string, SkillProgressSummary> {
  const summaries: Record<string, SkillProgressSummary> = {};

  // Check localStorage for saved progress first
  try {
    const saved = localStorage.getItem('skillbridge_mcq_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read saved MCQ progress:', e);
  }

  // Pre-populate with realistic baseline for missed/partial skills
  for (const gap of gaps) {
    if (gap.status === 'missing' || gap.status === 'partial') {
      const hasSimulatedActivity = gap.skillName === 'TypeScript' || gap.skillName === 'React';
      
      summaries[gap.skillName] = {
        skillName: gap.skillName,
        gapStatus: gap.status as any,
        priorityLevel: gap.priorityLevel,
        totalQuizzesTaken: hasSimulatedActivity ? 2 : 0,
        firstScore: hasSimulatedActivity ? 40 : null,
        latestScore: hasSimulatedActivity ? (gap.skillName === 'React' ? 80 : 75) : null,
        bestScore: hasSimulatedActivity ? (gap.skillName === 'React' ? 80 : 75) : null,
        improvementDelta: hasSimulatedActivity ? (gap.skillName === 'React' ? 40 : 35) : 0,
        masteryLevel: hasSimulatedActivity ? 'Proficient' : 'Needs Practice',
        lastPracticedAt: hasSimulatedActivity ? new Date(Date.now() - 86400000).toISOString() : undefined,
        history: hasSimulatedActivity ? [
          { date: new Date(Date.now() - 3 * 86400000).toISOString(), score: 40 },
          { date: new Date(Date.now() - 86400000).toISOString(), score: gap.skillName === 'React' ? 80 : 75 }
        ] : []
      };
    }
  }

  return summaries;
}
