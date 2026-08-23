import { getGeneratedExamById } from "@/features/exam/api/exam.api";
import ExamViewer from "@/features/exam/components/ExamViewer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Optional: Generate metadata dynamically based on exam info
export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const examId = parseInt(resolvedParams.id, 10);
  if (isNaN(examId)) return { title: "Exam Not Found" };

  const exam = await getGeneratedExamById(examId);
  return {
    title: exam ? `${exam.Title} | YourExam` : "Exam Not Found",
    description: exam ? `Đề kiểm tra môn ${exam.Subject} lớp ${exam.GradeLevel}` : "",
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const resolvedParams = await params;
  const examId = parseInt(resolvedParams.id, 10);

  if (isNaN(examId)) {
    notFound();
  }

  const exam = await getGeneratedExamById(examId);

  if (!exam) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <ExamViewer exam={exam} />
    </main>
  );
}
