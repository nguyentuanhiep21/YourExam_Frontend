export const GRADES = [
  "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9",
  "Lớp 10", "Lớp 11", "Lớp 12"
];

export const SUBJECTS = [
  "Toán", "Tiếng Việt", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học"
];

export const DIFFICULTIES = [
  { id: "easy", name: "Dễ", value: 1 },
  { id: "medium", name: "Trung bình", value: 2 },
  { id: "hard", name: "Khó", value: 3 }
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
  { id: 9, name: "Đọc hiểu văn bản ngắn", code: "Reading" }
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
