export interface CreateExamModalProps {
  onClose: () => void;
}

export interface CustomRule {
  id: string;
  diffId: string;
  diffName: string;
  format: "tu-luan" | "trac-nghiem";
  quantity: number;
}

export interface ExamBlueprintRule {
  Id: number;
  Difficulty: number;
  QuestionFormat: number;
  Quantity: number;
}

export interface ExamBlueprint {
  Id: number;
  Name: string;
  IsSystemProvided?: boolean;
  BlueprintRules?: ExamBlueprintRule[];
}

export interface GeneratedQuestion {
  content: string;
  choices?: string[];
  correctAnswer: string;
  explanation?: string;
  score?: number;
  format?: "tu-luan" | "trac-nghiem";
  exerciseType?: number;
  difficulty?: number;
}

// Request DTOs
export interface GenerateExerciseRequestDto {
  subject: string;
  difficulty: number;
  exerciseType: number;
  gradeLevel: number;
  quantity: number;
  format?: number;
}

export interface CreateBlueprintRuleDto {
  BlueprintId: number;
  Topic: string;
  Difficulty: number;
  QuestionFormat: number;
  Quantity: number;
}
