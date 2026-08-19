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
