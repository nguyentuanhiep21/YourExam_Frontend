import Navbar from "@/components/layout/Navbar";
import { DocumentSearchHeader } from "@/features/documents/components/DocumentSearchHeader";
import { ExamCarousel } from "@/features/exam/components/ExamCarousel";
import { createClient } from "@/lib/supabase/server";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let myExams: any[] = [];
  let trendingExams: any[] = [];
  let newExams: any[] = [];

  // Fetch Trending Exams (Top 10 out of 50 recent public exams by total engagement)
  const { data: recentExamsData } = await supabase
    .from("GeneratedExams")
    .select("Id, Title, Subject, GradeLevel, DownloadCount, UpvoteCount, Author:Profiles!FK_GeneratedExams_Profiles_AuthorId(FullName, School)")
    .eq("IsPublic", true)
    .order("CreatedAt", { ascending: false })
    .limit(50);

  if (recentExamsData && recentExamsData.length > 0) {
    const sortedForTrending = [...recentExamsData].sort((a, b) => {
      const scoreA = (a.DownloadCount || 0) + (a.UpvoteCount || 0);
      const scoreB = (b.DownloadCount || 0) + (b.UpvoteCount || 0);
      return scoreB - scoreA;
    });

    const top10Trending = sortedForTrending.slice(0, 10);

    const examIds = top10Trending.map((d: any) => d.Id);
    let votedExamIds = new Set<number>();
    
    if (user && examIds.length > 0) {
      const { data: userVotes } = await supabase
        .from("ExamVotes")
        .select("ExamId")
        .eq("UserId", user.id)
        .in("ExamId", examIds);
        
      if (userVotes) {
        userVotes.forEach((v: any) => votedExamIds.add(v.ExamId));
      }
    }

    trendingExams = top10Trending.map((exam: any) => ({
      id: exam.Id.toString(),
      title: exam.Title || "Đề thi chưa đặt tên",
      subject: exam.Subject || "Chung",
      grade: `Lớp ${exam.GradeLevel}`,
      downloads: exam.DownloadCount || 0,
      upvotes: exam.UpvoteCount || 0,
      tags: [exam.Subject, `Lớp ${exam.GradeLevel}`].filter(Boolean),
      hasUpvoted: votedExamIds.has(exam.Id),
      authorName: (Array.isArray(exam.Author) ? exam.Author[0]?.FullName : (exam.Author as any)?.FullName) || "Khuyết danh"
    }));
  }

  // Fetch New Public Exams
  const { data: publicExamsData } = await supabase
    .from("GeneratedExams")
    .select("Id, Title, Subject, GradeLevel, DownloadCount, UpvoteCount, Author:Profiles!FK_GeneratedExams_Profiles_AuthorId(FullName, School)")
    .eq("IsPublic", true)
    .order("CreatedAt", { ascending: false })
    .limit(12);

  if (publicExamsData) {
    const examIds = publicExamsData.map((d: any) => d.Id);
    let votedExamIds = new Set<number>();
    
    if (user && examIds.length > 0) {
      const { data: userVotes } = await supabase
        .from("ExamVotes")
        .select("ExamId")
        .eq("UserId", user.id)
        .in("ExamId", examIds);
        
      if (userVotes) {
        userVotes.forEach((v: any) => votedExamIds.add(v.ExamId));
      }
    }

    newExams = publicExamsData.map((exam: any) => ({
      id: exam.Id.toString(),
      title: exam.Title || "Đề thi chưa đặt tên",
      subject: exam.Subject || "Chung",
      grade: `Lớp ${exam.GradeLevel}`,
      downloads: exam.DownloadCount || 0,
      upvotes: exam.UpvoteCount || 0,
      tags: [exam.Subject, `Lớp ${exam.GradeLevel}`].filter(Boolean),
      hasUpvoted: votedExamIds.has(exam.Id),
      authorName: (Array.isArray(exam.Author) ? exam.Author[0]?.FullName : (exam.Author as any)?.FullName) || "Khuyết danh"
    }));
  }

  if (user) {
    const { data } = await supabase
      .from("GeneratedExams")
      .select("Id, Title, Subject, GradeLevel, DownloadCount, UpvoteCount, Author:Profiles!FK_GeneratedExams_Profiles_AuthorId(FullName, School)")
      .eq("AuthorId", user.id)
      .order("CreatedAt", { ascending: false });
      
    if (data) {
      // Get vote status
      const examIds = data.map(d => d.Id);
      let votedExamIds = new Set<number>();
      
      if (examIds.length > 0) {
        const { data: userVotes } = await supabase
          .from("ExamVotes")
          .select("ExamId")
          .eq("UserId", user.id)
          .in("ExamId", examIds);
          
        if (userVotes) {
          userVotes.forEach(v => votedExamIds.add(v.ExamId));
        }
      }

      myExams = data.map(exam => ({
        id: exam.Id.toString(),
        title: exam.Title || "Đề thi chưa đặt tên",
        subject: exam.Subject || "Chung",
        grade: `Lớp ${exam.GradeLevel}`,
        downloads: exam.DownloadCount || 0,
        upvotes: exam.UpvoteCount || 0,
        tags: [exam.Subject, `Lớp ${exam.GradeLevel}`].filter(Boolean),
        hasUpvoted: votedExamIds.has(exam.Id),
        authorName: (Array.isArray(exam.Author) ? exam.Author[0]?.FullName : (exam.Author as any)?.FullName) || "Bạn"
      }));
    }
  }
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Abstract Background Orbs for Premium Glassmorphism Feel */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse mix-blend-multiply" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] animate-pulse mix-blend-multiply" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-emerald-400/5 blur-[80px] animate-pulse mix-blend-multiply" style={{ animationDuration: '12s' }} />
      </div>

      {/* Background Image generated by AI */}
      <div 
        className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      />

      <Navbar />
      
      <main className="relative z-10 flex-1">
        <DocumentSearchHeader />
        
        <div className="mt-4 mb-24 space-y-2">
          {trendingExams.length > 0 && (
            <ExamCarousel 
              title="Xu hướng" 
              subtitle="Những đề thi được quan tâm nhiều nhất"
              exams={trendingExams}
            />
          )}
          
          {newExams.length > 0 && (
            <ExamCarousel 
              title="Vừa đăng tải" 
              subtitle="Đề thi vừa được cộng đồng chia sẻ"
              exams={newExams}
            />
          )}

          {user && myExams.length > 0 && (
            <ExamCarousel 
              title="Đề thi của bạn" 
              subtitle="Danh sách các đề thi bạn đã thiết kế và lưu lại"
              exams={myExams}
            />
          )}
        </div>
      </main>
    </div>
  );
}
