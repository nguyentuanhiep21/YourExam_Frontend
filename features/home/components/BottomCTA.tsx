import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-sm font-semibold mb-8 shadow-sm">
            👋 Sẵn sàng bắt đầu chưa?
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight font-heading max-w-3xl leading-[1.2]">
            Nâng cao hiệu suất giảng dạy và học tập ngay hôm nay
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
            Tham gia cùng hàng ngàn giáo viên và học sinh trên toàn quốc để trải nghiệm phương pháp ôn thi thế hệ mới.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/exams" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] active:scale-95 group"
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
