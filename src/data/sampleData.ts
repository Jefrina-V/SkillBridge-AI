export interface SampleSyllabus {
  id: string;
  courseTitle: string;
  courseCode: string;
  semester: number;
  department: string;
  description: string;
  fileName: string;
  content: string;
  expectedSkills: string[];
}

export interface SampleJob {
  id: string;
  title: string;
  companyTier: string;
  experienceLevel: string;
  description: string;
  expectedSkills: string[];
}

export const SAMPLE_SYLLABI: SampleSyllabus[] = [
  {
    id: 'syl-web-tech',
    courseTitle: 'Web Technology & Internet Applications',
    courseCode: 'CS402',
    semester: 4,
    department: 'Computer Science & Engineering',
    description: 'Foundational undergraduate course covering core client-side and server-side web protocols.',
    fileName: 'Web_Technology_Syllabus.pdf',
    content: `COURSE SYLLABUS: CS402 - WEB TECHNOLOGY & INTERNET PROGRAMMING
DEPARTMENT: Computer Science & Engineering | Semester 4 | Credits: 4

UNIT 1: INTRODUCTION TO INTERNET AND HTML
- History of the Internet, World Wide Web (WWW), HTTP and HTTPS protocols.
- HTML Basics: Tags, Elements, Attributes, Lists, Tables, Forms, HTML5 semantic elements (header, footer, nav, article).
- Core CSS: Selectors, Box Model, Colors, Fonts, Margins, Borders, Simple Flexbox.

UNIT 2: CLIENT-SIDE SCRIPTING WITH JAVASCRIPT
- JavaScript Fundamentals: Variables, Data Types, Operators, Control Flow, Functions.
- Document Object Model (DOM) manipulation, Event handling (onClick, onChange).
- Form validation using regular expressions and client-side JavaScript.
- JSON data representation and asynchronous XMLHttpRequest (AJAX) basics.

UNIT 3: SERVER-SIDE PROGRAMMING WITH PHP
- PHP Architecture, embedding PHP in HTML, Variables, Superglobals ($_GET, $_POST).
- Session and Cookie Management in web applications.
- File handling, error handling, and server response codes.

UNIT 4: DATABASE CONNECTIVITY WITH MYSQL
- Relational Database Management concepts, SQL queries (SELECT, INSERT, UPDATE, DELETE).
- Connecting PHP with MySQL using mysqli and PDO.
- Building a dynamic database-driven web portal (User Registration and Login).

UNIT 5: WEB SERVERS & SECURITY BASICS
- Apache HTTP Server configuration, virtual hosts, .htaccess.
- Basic web security concepts: SQL Injection vulnerabilities, Cross-Site Scripting (XSS) fundamentals, SSL/TLS certificates.

LABORATORY EXPERIMENTS:
1. Design static portfolio using HTML5 and CSS3.
2. Form validation using JavaScript.
3. Create user login system using PHP and MySQL.
4. Mini project: Student Information Portal with MySQL backend.`,
    expectedSkills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'SQL', 'Apache', 'AJAX', 'DOM Manipulation']
  },
  {
    id: 'syl-dsa',
    courseTitle: 'Data Structures and Algorithms',
    courseCode: 'CS201',
    semester: 2,
    department: 'Computer Science & Engineering',
    description: 'Fundamental course on data structures, algorithmic complexity, sorting, and tree traversals.',
    fileName: 'Data_Structures_Algorithms_CS201.pdf',
    content: `COURSE SYLLABUS: CS201 - DATA STRUCTURES AND ALGORITHMS
DEPARTMENT: Computer Science & Engineering | Semester 2 | Credits: 4

UNIT 1: ALGORITHM ANALYSIS & LINEAR STRUCTURES
- Asymptotic Notations (Big O, Omega, Theta), time and space complexity.
- Arrays, dynamic arrays, multidimensional representations.
- Linked Lists: Singly, Doubly, and Circular Linked Lists.

UNIT 2: STACKS, QUEUES & RECURSION
- Stack ADT, Array and Linked List implementation, applications: infix to postfix conversion, evaluation.
- Queue ADT, Circular Queue, Double-Ended Queue (Deque), Priority Queue.
- Recursion mechanics, recursion trees, divide and conquer paradigms.

UNIT 3: TREES & GRAPH ALGORITHMS
- Binary Trees, Binary Search Trees (BST), AVL Trees, Tree Traversals (Inorder, Preorder, Postorder).
- Heaps and Heap Sort.
- Graphs: Adjacency Matrix, Adjacency List, BFS, DFS, Dijkstra Shortest Path, Prim's and Kruskal's MST.

UNIT 4: SORTING, SEARCHING & HASHING
- Sorting: QuickSort, MergeSort, RadixSort.
- Searching: Linear Search, Binary Search.
- Hash tables, hash functions, collision resolution strategies (Chaining, Open Addressing).

LAB WORK:
Implementation in C and C++ of core structures, sorting benchmarks, and graph traversal algorithms.`,
    expectedSkills: ['Data Structures', 'Algorithms', 'C/C++', 'Big-O Analysis', 'Recursion', 'Trees & Graphs', 'Sorting Algorithms', 'Hashing']
  },
  {
    id: 'syl-dbms',
    courseTitle: 'Database Management Systems',
    courseCode: 'CS301',
    semester: 3,
    department: 'Information Technology',
    description: 'Relational data models, normalization, transactions, and SQL query optimization.',
    fileName: 'Database_Management_Systems_CS301.pdf',
    content: `COURSE SYLLABUS: CS301 - DATABASE MANAGEMENT SYSTEMS
DEPARTMENT: Information Technology | Semester 3 | Credits: 4

UNIT 1: DATABASE CONCEPTS & ER MODELING
- Database System Architecture, Three-Schema Architecture, Data Independence.
- Entity-Relationship (ER) model, Extended ER features, mapping ER to Relational schema.

UNIT 2: RELATIONAL MODEL & SQL
- Relational Algebra: Selection, Projection, Join, Division.
- Structured Query Language (SQL): DDL, DML, DCL, Aggregate functions, Nested subqueries, Views.
- Integrity constraints: Primary key, Foreign key, Unique, Check.

UNIT 3: NORMALIZATION & DESIGN
- Functional Dependencies, Anomalies in database design.
- Normal Forms: 1NF, 2NF, 3NF, Boyce-Codd Normal Form (BCNF), Multi-valued dependencies and 4NF.

UNIT 4: TRANSACTION PROCESSING & CONCURRENCY
- ACID properties of transactions.
- Serializability, Concurrency Control protocols: Two-Phase Locking (2PL), Timestamp ordering.
- Deadlock detection and recovery methods. Database backup and log-based recovery.

LAB WORK:
Hands-on database creation, complex SQL queries, stored procedures, triggers on Oracle and PostgreSQL.`,
    expectedSkills: ['SQL', 'Relational Database Design', 'PostgreSQL', 'Normalization', 'ACID Transactions', 'ER Modeling', 'Database Indexing']
  }
];

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'job-frontend',
    title: 'Frontend Engineer (React / TypeScript)',
    companyTier: 'Tier 1 Tech / High-Growth SaaS',
    experienceLevel: 'Entry to Mid-Level (0-2 years)',
    description: `ROLE: Frontend Engineer
LOCATION: Remote / Hybrid

ABOUT THE ROLE:
We are seeking an ambitious Frontend Engineer to build responsive, accessible, and high-performance user interfaces for our core SaaS product platform.

REQUIRED TECHNICAL QUALIFICATIONS:
- 1+ years of experience with React (including hooks, state management, and modern component design).
- Solid proficiency in TypeScript and statically typed modern web development.
- Strong foundational knowledge of JavaScript (ES6+), HTML5 semantic markup, and CSS.
- Experience with Next.js (App Router, Server Components, SSR/SSG).
- Hands-on experience integrating REST APIs and handling asynchronous data flows.
- Proficiency with Git version control (branching, pull requests, code reviews).
- Experience with automated UI unit and integration testing (Jest, React Testing Library).
- Experience with utility styling frameworks such as Tailwind CSS.

NICE TO HAVE:
- Experience with GraphQL APIs.
- Familiarity with CI/CD deployment pipelines (GitHub Actions, Vercel).
- Understanding of Web Vitals and frontend performance optimization.

SOFT SKILLS & COLLABORATION:
- Strong written and verbal technical communication skills.
- Collaborative mindset working with designers, product managers, and backend engineers.
- Passion for writing clean, self-documenting, and maintainable code.`,
    expectedSkills: [
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'HTML',
      'CSS',
      'REST APIs',
      'Git',
      'Testing (Jest / RTL)',
      'Tailwind CSS',
      'GraphQL',
      'CI/CD Pipelines'
    ]
  },
  {
    id: 'job-fullstack',
    title: 'Full Stack Engineer (React + Node.js / Python)',
    companyTier: 'Modern Fintech / Enterprise SaaS',
    experienceLevel: 'Associate to Mid-Level (1-3 years)',
    description: `ROLE: Full Stack Engineer
LOCATION: Remote

RESPONSIBILITIES:
- Design and build end-to-end web applications from user-facing React components down to database schemas.
- Build reliable, performant RESTful APIs using Node.js (Express) or Python (FastAPI).
- Architect relational database models using PostgreSQL and optimize complex query execution.
- Maintain high code coverage using automated unit and integration test suites.
- Containerize services with Docker for deployment on cloud platforms.

REQUIRED SKILLS:
- React and TypeScript on the frontend.
- Node.js or Python backend frameworks (FastAPI / Express).
- PostgreSQL or relational database design with SQL.
- REST APIs architecture and secure JWT authentication.
- Git and collaborative GitHub workflows.
- Docker containerization fundamentals.
- Basic understanding of CI/CD workflows and automated testing.`,
    expectedSkills: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'REST APIs',
      'Docker',
      'Git',
      'Testing (Jest / RTL)'
    ]
  },
  {
    id: 'job-ml-ai',
    title: 'Junior Machine Learning / AI Engineer',
    companyTier: 'AI Lab / Data Intelligence Startup',
    experienceLevel: '0-2 years',
    description: `ROLE: Junior Machine Learning Engineer

KEY REQUIREMENTS:
- Strong programming skills in Python with proficiency in data science packages: NumPy, Pandas, Scikit-learn.
- Solid grounding in Machine Learning fundamentals: Supervised & Unsupervised Learning, Evaluation Metrics, Cross-Validation.
- Experience with Deep Learning libraries (PyTorch or TensorFlow) is a major plus.
- Experience serving ML models via lightweight REST APIs using FastAPI or Flask.
- Knowledge of relational databases (PostgreSQL/MySQL) for data ingestion and retrieval.
- Git version control for reproducible experiments and code collaboration.`,
    expectedSkills: [
      'Python',
      'Pandas & NumPy',
      'Machine Learning',
      'FastAPI',
      'SQL',
      'Git',
      'Docker'
    ]
  }
];
