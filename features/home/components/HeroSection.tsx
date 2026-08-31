import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full pt-32 pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-slate-50 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 text-primary text-sm font-semibold mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Phiên bản Beta đã ra mắt</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.15] font-heading animate-in fade-in slide-in-from-bottom-5 duration-700">
          NỀN TẢNG ÔN THI VÀ <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            CHIA SẺ TÀI LIỆU
          </span> TOÀN DIỆN
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 font-body">
          Tạo đề thi từ file, luyện thi trực tuyến, và cùng cộng đồng giải đáp mọi thắc mắc để đạt kết quả tốt nhất.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <Link
            href="/create-exam"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95 group"
          >
            Tạo đề thi ngay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/documents"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl text-base font-bold transition-all active:scale-95 shadow-sm group"
          >
            <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            Khám phá tài liệu
          </Link>
        </div>
      </div>
    </section>
  );
}
