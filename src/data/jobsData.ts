
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  category: string;
  contactEmail: string;
}

export const jobsData: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Innovations LLC",
    location: "Dubai, UAE",
    country: "UAE",
    type: "Full-time",
    salary: "AED 15,000 - 25,000",
    description: "We are seeking a Senior Software Engineer to join our dynamic team in Dubai. You will be responsible for developing cutting-edge software solutions and leading technical initiatives.",
    requirements: [
      "5+ years of software development experience",
      "Proficiency in React, Node.js, and Python",
      "Experience with cloud platforms (AWS/Azure)",
      "Strong problem-solving skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Annual flight tickets",
      "Professional development opportunities",
      "Flexible working hours"
    ],
    postedDate: "2 days ago",
    category: "Technology",
    contactEmail: "careers@techinnovations.ae"
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Global Marketing Solutions",
    location: "London, UK",
    country: "UK",
    type: "Full-time",
    salary: "£45,000 - 55,000",
    description: "Join our marketing team as a Marketing Manager and drive innovative campaigns for our global clients. Perfect opportunity for a creative professional with strong analytical skills.",
    requirements: [
      "3+ years of marketing experience",
      "Digital marketing expertise",
      "Strong analytical and communication skills",
      "Experience with marketing automation tools",
      "Bachelor's degree in Marketing or related field"
    ],
    benefits: [
      "Competitive salary",
      "Pension scheme",
      "25 days annual leave",
      "Training and development budget",
      "Hybrid working options"
    ],
    postedDate: "1 day ago",
    category: "Marketing",
    contactEmail: "hr@globalmktg.co.uk"
  },
  {
    id: "3",
    title: "Financial Analyst",
    company: "Investment Partners Group",
    location: "New York, USA",
    country: "USA",
    type: "Full-time",
    salary: "$70,000 - 85,000",
    description: "We're looking for a detail-oriented Financial Analyst to join our investment team. You'll be analyzing market trends and providing insights for strategic decision-making.",
    requirements: [
      "2+ years of financial analysis experience",
      "Strong Excel and financial modeling skills",
      "Knowledge of financial markets",
      "CFA or similar certification preferred",
      "Bachelor's degree in Finance or Economics"
    ],
    benefits: [
      "Competitive base salary plus bonus",
      "Comprehensive health benefits",
      "401(k) matching",
      "Professional development support",
      "Flexible PTO policy"
    ],
    postedDate: "3 days ago",
    category: "Finance",
    contactEmail: "careers@investmentpartners.com"
  },
  {
    id: "4",
    title: "Civil Engineer",
    company: "Gulf Construction Co.",
    location: "Doha, Qatar",
    country: "Qatar",
    type: "Full-time",
    salary: "QAR 12,000 - 18,000",
    description: "Exciting opportunity for a Civil Engineer to work on major infrastructure projects in Qatar. Join our team and contribute to world-class construction projects.",
    requirements: [
      "4+ years of civil engineering experience",
      "Experience with large-scale construction projects",
      "Professional Engineering license",
      "Knowledge of international building codes",
      "Bachelor's degree in Civil Engineering"
    ],
    benefits: [
      "Tax-free salary",
      "Company accommodation",
      "Transportation allowance",
      "Annual leave with flights",
      "Medical insurance"
    ],
    postedDate: "5 days ago",
    category: "Engineering",
    contactEmail: "recruitment@gulfconstruction.qa"
  },
  {
    id: "5",
    title: "Registered Nurse",
    company: "Metropolitan Hospital",
    location: "Riyadh, Saudi Arabia",
    country: "Saudi Arabia",
    type: "Full-time",
    salary: "SAR 8,000 - 12,000",
    description: "Join our healthcare team as a Registered Nurse. We offer excellent career growth opportunities in a modern hospital environment with state-of-the-art facilities.",
    requirements: [
      "Valid nursing license",
      "2+ years of clinical experience",
      "BLS and ACLS certification",
      "Strong communication skills",
      "Bachelor's degree in Nursing"
    ],
    benefits: [
      "Competitive salary package",
      "Free accommodation",
      "Medical insurance for family",
      "Professional development programs",
      "Annual vacation with airfare"
    ],
    postedDate: "1 week ago",
    category: "Healthcare",
    contactEmail: "hr@metrohosp.sa"
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "Analytics Pro Inc.",
    location: "San Francisco, USA",
    country: "USA",
    type: "Full-time",
    salary: "$95,000 - 120,000",
    description: "We're seeking a talented Data Scientist to extract insights from complex datasets and drive data-driven decision making across our organization.",
    requirements: [
      "3+ years of data science experience",
      "Proficiency in Python, R, and SQL",
      "Machine learning expertise",
      "Experience with big data technologies",
      "Master's degree in Data Science or related field"
    ],
    benefits: [
      "Competitive salary and equity",
      "Premium health insurance",
      "Unlimited PTO",
      "Learning and development budget",
      "Remote work flexibility"
    ],
    postedDate: "4 days ago",
    category: "Technology",
    contactEmail: "talent@analyticspro.com"
  }
];

export const countries = ["All Countries", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "USA", "UK"];
export const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];
export const categories = ["All Categories", "Technology", "Marketing", "Finance", "Engineering", "Healthcare", "Education", "Sales"];
