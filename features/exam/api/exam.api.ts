import { createClient } from "@/lib/supabase/server";
import { GeneratedExam } from "../types/exam.types";

/**
 * Lấy chi tiết đề thi và danh sách câu hỏi trực tiếp từ Supabase bằng Server Component.
 * Bảng "GeneratedExams" và "GeneratedExamQuestions" được bảo vệ bởi RLS.
 */
export async function getGeneratedExamById(id: number): Promise<GeneratedExam | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("GeneratedExams")
    .select(`
      *,
      Questions:GeneratedExamQuestions(*)
    `)
    .eq("Id", id)
    .single();

  if (error) {
    console.error("Error fetching exam:", error.message);
    return null;
  }

  return data as GeneratedExam;
}
