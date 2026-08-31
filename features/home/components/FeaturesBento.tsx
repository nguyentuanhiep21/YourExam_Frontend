import { FileText, Clock, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FeaturesBento() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-heading tracking-tight">
            Mọi thứ bạn cần cho một <span className="text-primary">kỳ thi hoàn hảo</span>
          </h2>
          <p className="text-lg text-slate-600 font-body">
            Hệ sinh thái công cụ hỗ trợ toàn diện từ khâu chuẩn bị tài liệu, ra đề cho đến khi ôn tập.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Main Feature - Smart Exam Generation (Spans 2 columns on tablet/desktop) */}
          <Link href="/exams" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:col-span-2 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] border border-slate-200/60">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 font-heading">Tạo đề thi dễ dàng</h3>
              <p className="text-slate-600 text-lg max-w-md font-body leading-relaxed">
                Công cụ hỗ trợ tạo và số hóa đề thi. Bạn có thể dễ dàng tạo ra một đề thi trắc nghiệm hoàn chỉnh một cách nhanh chóng.
              </p>
            </div>
            
            <div className="relative z-10 mt-8 flex items-center text-primary font-semibold">
              <span>Trải nghiệm ngay</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>

          {/* Document Repository */}
          <Link href="/documents" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl border border-slate-200/60">
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Kho Tài liệu</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                Chia sẻ và tải xuống hàng ngàn đề thi, giáo trình định dạng PDF/Word từ cộng đồng giáo viên.
              </p>
            </div>
          </Link>

          {/* Online Practice */}
          <Link href="/exams" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl border border-slate-200/60">
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Luyện thi trực tuyến</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                Làm bài trắc nghiệm với thời gian thực, nộp bài tính điểm ngay lập tức và xem giải thích chi tiết.
              </p>
            </div>
          </Link>

          {/* Community Forum (Spans 2 columns on tablet/desktop) */}
          <Link href="/support" className="group relative overflow-hidden rounded-[2rem] bg-white p-8 md:col-span-2 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/60">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-slate-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between h-full gap-6">
              <div className="flex-1">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 font-heading">Diễn đàn trao đổi</h3>
                <p className="text-slate-600 max-w-sm font-body leading-relaxed">
                  Cộng đồng hỗ trợ giải đáp thắc mắc, chia sẻ mẹo học tập và báo cáo lỗi trong quá trình sử dụng hệ thống.
                </p>
              </div>
              
              <div className="shrink-0 flex items-center justify-center md:justify-end mt-4 md:mt-0">
                <div className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold group-hover:bg-slate-200 transition-colors shadow-sm">
                  Tham gia cộng đồng
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
