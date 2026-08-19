export enum QuestionFormat {
  MultipleChoice = 1,
  Essay = 2
}

export enum QuestionDifficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3
}

export const GRADES = [
  "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"
];

export const SUBJECTS = [
  "Toán", "Tiếng Việt"
];

export const DIFFICULTIES = [
  { id: "easy", name: "Dễ", value: QuestionDifficulty.Easy },
  { id: "medium", name: "Trung bình", value: QuestionDifficulty.Medium },
  { id: "hard", name: "Khó", value: QuestionDifficulty.Hard }
];

export const EXERCISE_TYPES = [
  { id: 1, name: "Tính toán", code: "Calculation" },
  { id: 2, name: "Có lời văn", code: "WordProblem" },
  { id: 3, name: "So sánh", code: "Comparison" },
  { id: 4, name: "Điền chỗ trống", code: "FillInTheBlank" }
];

export const EXERCISE_TYPES_TIENG_VIET = [
  { id: 5, name: "Nhận biết vần / Điền vần", code: "Phonetics" },
  { id: 6, name: "Quy tắc Chính tả", code: "Spelling" },
  { id: 7, name: "Sắp xếp từ thành câu", code: "WordOrder" },
  { id: 8, name: "Tìm từ khác loại", code: "OddOneOut" },
  { id: 9, name: "Đọc hiểu văn bản ngắn", code: "Reading" },
  { id: 10, name: "Chọn từ", code: "FillInBlank" }
];

export const SUBJECT_CODE_MAP: Record<string, string> = {
  "Toán": "toan",
  "Tiếng Việt": "tiengviet"
};

export const getExerciseTypes = (subject: string | null, format?: string | null) => {
  let types = EXERCISE_TYPES;
  if (subject === "Tiếng Việt") {
    types = EXERCISE_TYPES_TIENG_VIET;
  }
  
  if (format === "tu-luan") {
    return types.filter(t => t.id !== 5 && t.id !== 8);
  }
  
  return types;
};
