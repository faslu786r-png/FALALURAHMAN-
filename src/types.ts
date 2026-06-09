export type Language = 'en' | 'ml' | 'ar';

export interface UserProgress {
  xp: number;
  level: number;
  completedLessons: string[]; // lessonIds
  completedLabs: string[]; // labIds
  completedExams: { [examId: string]: number }; // examId -> highest score
  badges: string[]; // badgeIds
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  resumeData?: ResumeData;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    period: string;
  }[];
  certifications: string[];
  skills: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown supported
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface LabScenario {
  id: string;
  title: string;
  category: string;
  objective: string;
  instructions: string;
  startingFiles: { [filename: string]: string };
  expectedOutput?: string;
  validationCheck: (cmd: string, args: string[], files: { [name: string]: string }, logs: string[]) => { success: boolean; message: string; updatedFiles?: { [name: string]: string } };
  solutions: string[];
  xpReward: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  category: string;
  code: string;
  questions: Question[];
  xpReward: number;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  category: string;
  likes: number;
  repliesCount: number;
  replies: {
    id: string;
    author: string;
    role: string;
    content: string;
    timestamp: string;
  }[];
  timestamp: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  description: string;
  requirements: string[];
}
