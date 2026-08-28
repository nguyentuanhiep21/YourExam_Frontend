import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600/5 mix-blend-multiply"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold mb-8 shadow-sm">
          👋 Sẵn sàng bắt đầu chưa?
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight font-heading">
          Nâng cao hiệu suất giảng dạy và học tập ngay hôm nay
        </h2>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Tham gia cùng hàng ngàn giáo viên và học sinh trên toàn quốc để trải nghiệm phương pháp ôn thi thế hệ mới.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/create-exam" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all hover:shadow-lg active:scale-95"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
