export enum QuestionType {
  MultipleChoice = 1,
  Essay = 2,
  FillInTheBlank = 3,
  // Thêm các loại câu hỏi khác nếu có
}

export interface GeneratedExamQuestion {
  Id: number;
  GeneratedExamId: number;
  QuestionTemplateId?: number;
  OrderIndex: number;
  QuestionType: QuestionType;
  Difficulty: number;
  QuestionContent: string;
  MultipleChoiceOptions?: string; // JSON string
  CorrectAnswer?: string;
  Score: number;
  Explanation?: string;
}

export interface GeneratedExam {
  Id: number;
  AuthorId: string;
  BlueprintId: number;
  Title: string;
  GradeLevel: number;
  Subject: string;
  DurationMinutes: number;
  TotalScore: number;
  Difficulty: number;
  DocxFileUrl: string;
  PdfFileUrl?: string;
  UpvoteCount: number;
  DownloadCount: number;
  IsPublic: boolean;
  CreatedAt: string;
  UpdatedAt: string;

  // Navigation property for frontend use
  Questions?: GeneratedExamQuestion[];
  hasUpvoted?: boolean;
}

export interface UpdateGeneratedExamPayload {
  Title?: string;
  Difficulty?: number;
  DurationMinutes?: number;
  TotalScore?: number;
  IsPublic?: boolean;
}

export interface UpdateGeneratedExamQuestionPayload {
  Id: number;
  QuestionContent?: string;
  CorrectAnswer?: string;
  MultipleChoiceOptions?: string;
}

export interface ExamMockData {
  id: string;
  title: string;
  subject: string;
  grade: string;
  school: string;
  downloads: number;
  upvotes: number;
  tags: string[];
  hasUpvoted?: boolean;
}
