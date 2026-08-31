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
  { id: 5, name: "Tìm từ có chứa vần chỉ định", code: "Phonetics" },
  { id: 6, name: "Chọn vần đúng để tạo thành từ có nghĩa", code: "Spelling" },
  { id: 7, name: "Sắp xếp các từ để tạo thành câu có nghĩa", code: "WordOrder" },
  { id: 8, name: "Tìm từ khác loại với các từ khác", code: "OddOneOut" },
  { id: 9, name: "Đọc hiểu văn bản ngắn và trả lời câu hỏi", code: "Reading" },
  { id: 10, name: "Chọn từ phù hợp để điền vào chỗ trống", code: "FillInBlank" }
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
    return types.filter(t => t.id !== 8 && t.id !== 10);
  }
  
  return types;
};
