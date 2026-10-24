// Edit this file to update identity, links, experience, skills and certifications.
export const profile = {
  name: 'Nikhil Kolhe',
  role: 'Associate Developer',
  tagline: 'Building practical AI, data and analytics systems.',
  intro:
    'I build LLM applications, agentic workflows, machine learning systems and business intelligence solutions that turn complex data into useful decisions.',
  github: 'https://github.com/Nikhil-kolhe',
  linkedin: 'https://www.linkedin.com/in/nikhilkolhe',
  email: 'kolhenikhil721@gmail.com',
  formEndpoint: '',
  resumePath: '/assets/resume.pdf',
  resumeAvailable: true,
  location: 'Pune, India',
  currentlyBuilding: '',
  photo: '',
  education: 'B.E. Artificial Intelligence & Data Science, 2020–2024 · CGPA 8.5/10',
}

export const experience = [
  {
    title: 'Associate Developer',
    employer: 'I2E Consulting',
    dates: '2024 – Present',
    kind: 'Professional',
    bullets: [
      'Build LLM-powered applications, agentic workflows and REST APIs for practical business and research use cases.',
      'Develop machine learning solutions for clinical-study forecasting, KPI prediction and resource planning.',
      'Create interactive Power BI reports for workforce and time-card analytics, supporting data-driven decisions.',
    ],
    tools: ['Python', 'LangGraph', 'MCP', 'FastAPI', 'Power BI', 'Databricks'],
    gained: [
      'LLM applications, multi-agent systems and tool integrations with MCP',
      'Machine learning workflows using Databricks, PySpark, MLflow and Delta Lake',
      'Power BI reporting for workforce insights, compliance and operational planning',
    ],
    projects: ['resume-analyzer', 'clinical-study-assistant', 'power-bi-time-card', 'clinical-resource-forecasting'],
  },
]

export const education = [
  {
    degree: 'B.E. Artificial Intelligence & Data Science',
    institution: 'Dr. D.Y. Patil Institute of Technology, Pune',
    years: '2020–2024',
    score: 'CGPA 8.5/10',
    note: 'Built a foundation in programming, analytics, machine learning and AI.',
  },
]

export const skills = [
  { group: 'Programming & Data', items: ['Python', 'SQL', 'Databricks', 'Snowflake'], exploring: false },
  { group: 'Generative AI & Agentic Systems', items: ['LLMs', 'LangChain', 'LangGraph', 'MCP', 'FastMCP', 'Multi-agent systems', 'RAG', 'Embeddings', 'Vector search', 'Prompt engineering', 'Tool calling', 'Structured outputs', 'Human-in-the-loop workflows'], exploring: false },
  { group: 'LLM Providers & APIs', items: ['OpenAI', 'Google Gemini', 'Groq', 'REST APIs', 'FastAPI', 'Flask', 'GraphQL'], exploring: false },
  { group: 'Databases & Deployment', items: ['SQLite', 'MySQL', 'PostgreSQL', 'SQLAlchemy', 'Chroma', 'FAISS', 'Git/GitHub'], exploring: false },
  { group: 'Machine Learning, Data & BI', items: ['scikit-learn', 'Pandas', 'NumPy', 'Deep Learning', 'NLP', 'OCR', 'Power BI', 'Tableau', 'TIBCO Spotfire'], exploring: false },
]

export const certifications = [
  { type: 'Certification', title: 'AWS Certified AI Practitioner (AIF-C01)', issuer: 'Amazon Web Services', date: 'Sep 2026', url: 'https://www.credly.com/badges/b6eb5c19-2fe0-4b40-8ed1-7aaa123420b3/public_url' },
  { type: 'Research · IEEE', title: 'Fun Soundify: Music Generation powered by AI', issuer: 'IEEE', date: 'Aug 2024', url: 'https://ieeexplore.ieee.org/abstract/document/10774982' },
]
