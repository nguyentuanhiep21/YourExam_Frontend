import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full pt-28 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Phiên bản Beta đã ra mắt
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.1] font-heading animate-in fade-in slide-in-from-bottom-5 duration-700">
          Nền tảng Ôn thi và <br className="hidden md:block" />
          <span className="text-indigo-600">Chia sẻ Tài liệu</span> Toàn diện
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          Tạo đề thi từ file, luyện thi trực tuyến, và cùng cộng đồng giải đáp mọi thắc mắc để đạt kết quả tốt nhất.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <Link
            href="/create-exam"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          >
            Tạo đề thi ngay
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/documents"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl text-base font-bold transition-all active:scale-95"
          >
            <FileText className="w-5 h-5 text-slate-400" />
            Khám phá tài liệu
          </Link>
        </div>
      </div>
    </section>
  );
}
