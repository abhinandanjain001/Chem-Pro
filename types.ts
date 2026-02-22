
// Data Structures for Organized Content
export interface OrganizedQuestion {
  id: string;
  text: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface SubTopic {
  name: string;
  questions: OrganizedQuestion[];
}

export interface Topic {
  name: string;
  subtopics: SubTopic[];
}

// Data Structures for Quiz
export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
  hint: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard'; // Added for analytics
  topic?: string; // Added for analytics
}

export interface QuizResult {
  score: number;
  total: number;
  answers: number[]; // Index of selected answers
}

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
}

export interface CBTQuestion {
  id: string;
  section: ChemistrySection;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface CBTResult {
  id: string;
  userId: string;
  score: number;
  total: number;
  answers: number[];
  questionIds: string[];
  section: ChemistrySection | 'All';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export type ChemistrySection = 'Organic' | 'Inorganic' | 'Physical';
export type QuizDifficulty = 'JEE Main' | 'JEE Advanced';

export interface JEEQuizConfig {
  sections: ChemistrySection[];
  difficulty: QuizDifficulty;
  questionCount: number;
}

// UI State Management
export type AppView = 'home' | 'organizer' | 'diagrams' | 'quiz' | 'notes' | 'cbt' | 'chat' | 'admin' | 'profile' | 'auth';

export interface GeneratedDiagram {
  code: string; // SVG Code
  prompt: string;
}
