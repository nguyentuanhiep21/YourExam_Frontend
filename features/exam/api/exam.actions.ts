"use server";

import { createClient } from "@/lib/supabase/server";
import { UpdateGeneratedExamPayload, UpdateGeneratedExamQuestionPayload } from "../types/exam.types";
import { revalidatePath } from "next/cache";
import { getGmt7IsoString } from "@/utils/time";

/**
 * Server Action to update an existing generated exam and its questions.
 * Verifies that the current user is the author of the exam before allowing any edits.
 */
export async function updateGeneratedExam(
  id: number,
  examPayload?: UpdateGeneratedExamPayload,
  questionsPayload?: UpdateGeneratedExamQuestionPayload[]
) {
  const supabase = await createClient();

  // 1. Get the current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized: Please log in to edit the exam.");
  }

  // 2. Fetch the exam to verify existence and ownership
  const { data: existingExam, error: fetchError } = await supabase
    .from("GeneratedExams")
    .select("Id, AuthorId")
    .eq("Id", id)
    .single();

  if (fetchError || !existingExam) {
    console.error("Error fetching exam for verification:", fetchError.message);
    throw new Error("Exam not found or could not be retrieved.");
  }

  if (existingExam.AuthorId !== user.id) {
    throw new Error("Unauthorized: You are not the owner of this exam.");
  }

  // 3. Update exam metadata if provided
  if (examPayload && Object.keys(examPayload).length > 0) {
    console.log("Updating exam metadata:", examPayload);
    const { data: updatedExam, error: updateExamError } = await supabase
      .from("GeneratedExams")
      .update(examPayload)
      .eq("Id", id)
      .select();

    if (updateExamError) {
      console.error("Error updating exam metadata:", updateExamError.message);
      throw new Error(`Failed to update exam metadata: ${updateExamError.message}`);
    }
    
    if (!updatedExam || updatedExam.length === 0) {
      console.error("No exam rows updated. RLS policy might be blocking the update.");
      throw new Error("Update failed: You might not have permission, or the exam does not exist.");
    }
  }

  // 4. Update questions if provided
  if (questionsPayload && questionsPayload.length > 0) {
    // Loop through and update each question. We enforce that the question belongs to this specific exam.
    for (const question of questionsPayload) {
      // Build the update object dynamically based on provided fields
      const updateData: any = {};
      if (question.QuestionContent !== undefined) updateData.QuestionContent = question.QuestionContent;
      if (question.CorrectAnswer !== undefined) updateData.CorrectAnswer = question.CorrectAnswer;
      if (question.MultipleChoiceOptions !== undefined) updateData.MultipleChoiceOptions = question.MultipleChoiceOptions;

      if (Object.keys(updateData).length > 0) {
        console.log(`Updating question ${question.Id}:`, updateData);
        const { data: updatedQuestion, error: updateQuestionError } = await supabase
          .from("GeneratedExamQuestions")
          .update(updateData)
          .eq("Id", question.Id)
          .eq("GeneratedExamId", id)
          .select();

        if (updateQuestionError) {
          console.error(`Error updating question ${question.Id}:`, updateQuestionError.message);
          throw new Error(`Failed to update question ${question.Id}: ${updateQuestionError.message}`);
        }
        
        if (!updatedQuestion || updatedQuestion.length === 0) {
          console.error(`No rows updated for question ${question.Id}. RLS policy might be blocking.`);
          throw new Error(`Failed to update question ${question.Id}: Permission denied or not found.`);
        }
      }
    }
  }

  // 5. Revalidate cache for the exam page to reflect changes
  revalidatePath(`/exam/${id}`);

  return { success: true, message: "Exam updated successfully." };
}

/**
 * Server Action to upvote an exam.
 */
export async function upvoteGeneratedExam(id: number, increment: boolean = true) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này.");
  }

  // 1. Cập nhật bảng ExamUpvotes
  if (increment) {
    const { error: insertError } = await supabase
      .from("ExamUpvotes")
      .insert({
        ExamId: id,
        UserId: user.id,
        CreatedAt: getGmt7IsoString()
      });
      
    if (insertError) {
      if (insertError.code === '23505') {
        // duplicate key, means already upvoted.
        return { success: true, message: "Already upvoted" };
      }
      console.error("Error inserting vote:", insertError);
      throw new Error("Failed to insert vote record");
    }
  } else {
    const { error: deleteError } = await supabase
      .from("ExamUpvotes")
      .delete()
      .eq("ExamId", id)
      .eq("UserId", user.id);
      
    if (deleteError) {
      console.error("Error deleting vote:", deleteError);
      throw new Error("Failed to remove vote record");
    }
  }

  revalidatePath(`/exam/${id}`);
  return { success: true };
}

/**
 * Server Action to increment download count.
 * Prevents spam by checking the ExamDownloads table.
 */
export async function incrementDownloadCount(id: number) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này.");
  }

  // 1. Check if user already downloaded
  const { data: existingDownload, error: checkError } = await supabase
    .from("ExamDownloads")
    .select("ExamId")
    .eq("ExamId", id)
    .eq("UserId", user.id)
    .single();

  // If a record exists (no error or checkError is not PGRST116-Not Found), do not increment
  if (existingDownload) {
    return { success: true, message: "Already downloaded, count not incremented." };
  }

  // 2. Insert into ExamDownloads
  const { error: insertError } = await supabase
    .from("ExamDownloads")
    .insert({
      ExamId: id,
      UserId: user.id,
      DownloadedAt: getGmt7IsoString()
    });

  if (insertError) {
    if (insertError.code === '23505') {
      // duplicate key, means already downloaded
      return { success: true, message: "Already downloaded" };
    }
    console.error("Error inserting download record:", insertError);
    return { success: false, message: "Failed to record download" };
  }

  revalidatePath(`/exam/${id}`);
  return { success: true };
}

/**
 * Server Action to fetch an exam for downloading.
 */
export async function fetchExamForDownload(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("GeneratedExams")
    .select(`
      *,
      Questions:GeneratedExamQuestions(*)
    `)
    .eq("Id", id)
    .single();

  if (error || !data) {
    throw new Error("Không tìm thấy đề thi hoặc không có quyền truy cập.");
  }

  return data;
}
