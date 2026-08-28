import { FileText, Clock, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FeaturesBento() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            Mọi thứ bạn cần cho một kỳ thi hoàn hảo
          </h2>
          <p className="text-lg text-slate-600">
            Hệ sinh thái công cụ hỗ trợ toàn diện từ khâu chuẩn bị tài liệu, ra đề cho đến khi ôn tập.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Main Feature - Smart Exam Generation (Spans 2 columns on tablet/desktop) */}
          <Link href="/create-exam" className="group relative overflow-hidden rounded-3xl bg-indigo-600 p-8 md:col-span-2 flex flex-col justify-between min-h-[320px] transition-transform hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-heading">Tạo đề thi dễ dàng</h3>
              <p className="text-indigo-100 text-lg max-w-md">
                Công cụ hỗ trợ tạo và số hóa đề thi. Bạn có thể dễ dàng tạo ra một đề thi trắc nghiệm hoàn chỉnh một cách nhanh chóng.
              </p>
            </div>
            
            <div className="relative z-10 mt-8 flex items-center text-white font-semibold">
              <span>Trải nghiệm ngay</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>

          {/* Document Repository */}
          <Link href="/documents" className="group relative overflow-hidden rounded-3xl bg-slate-100 p-8 flex flex-col justify-between min-h-[320px] transition-transform hover:-translate-y-1 hover:shadow-lg border border-slate-200 hover:border-slate-300">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <FileText className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Kho Tài liệu</h3>
              <p className="text-slate-600">
                Chia sẻ và tải xuống hàng ngàn đề thi, giáo trình định dạng PDF/Word từ cộng đồng giáo viên.
              </p>
            </div>
          </Link>

          {/* Online Practice */}
          <Link href="/practice" className="group relative overflow-hidden rounded-3xl bg-amber-50 p-8 flex flex-col justify-between min-h-[280px] transition-transform hover:-translate-y-1 hover:shadow-lg border border-amber-100 hover:border-amber-200">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Luyện thi trực tuyến</h3>
              <p className="text-slate-600">
                Làm bài trắc nghiệm với thời gian thực, nộp bài tính điểm ngay lập tức và xem giải thích chi tiết.
              </p>
            </div>
          </Link>

          {/* Community Forum (Spans 2 columns on tablet/desktop) */}
          <Link href="/support" className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:col-span-2 flex flex-col justify-between min-h-[280px] transition-transform hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between h-full gap-6">
              <div className="flex-1">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-heading">Diễn đàn trao đổi</h3>
                <p className="text-slate-400 max-w-sm">
                  Cộng đồng hỗ trợ giải đáp thắc mắc, chia sẻ mẹo học tập và báo cáo lỗi trong quá trình sử dụng hệ thống.
                </p>
              </div>
              
              <div className="shrink-0 flex items-center justify-center md:justify-end">
                <div className="px-6 py-3 rounded-full bg-slate-800 text-white text-sm font-semibold group-hover:bg-slate-700 transition-colors">
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
