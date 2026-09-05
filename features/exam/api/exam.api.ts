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
      Questions:GeneratedExamQuestions(*),
      Author:Profiles!FK_GeneratedExams_Profiles_AuthorId(FullName)
    `)
    .eq("Id", id)
    .single();

  if (error) {
    console.error("Error fetching exam:", error.message);
    return null;
  }

  const examData = data as GeneratedExam;

  // Check if current user has upvoted & downloaded
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const [voteRes, downloadRes] = await Promise.all([
      supabase
        .from("ExamUpvotes")
        .select("ExamId")
        .eq("ExamId", id)
        .eq("UserId", user.id)
        .single(),
      supabase
        .from("ExamDownloads")
        .select("ExamId")
        .eq("ExamId", id)
        .eq("UserId", user.id)
        .single()
    ]);

    if (voteRes.data) {
      examData.hasUpvoted = true;
    }
    
    if (downloadRes.data) {
      examData.hasDownloaded = true;
    }
  }

  return examData;
}
