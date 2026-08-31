import { Search, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateExamButton } from "@/features/home/components/CreateExamButton";

export async function DocumentSearchHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const categories = ["Toán học", "Tiếng Việt"];

  return (
    <section className="relative w-full pt-20 pb-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-3xl leading-[1.1] font-heading">
          Khám phá & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Chinh phục tri thức</span>
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative flex items-center bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-full p-2.5 group hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] focus-within:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] hover:border-primary/30 focus-within:border-primary/50 transition-all duration-500">
            <div className="pl-5 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent py-3 text-lg text-slate-900 placeholder:text-slate-400 outline-none w-full font-body"
              placeholder="Tìm kiếm khóa học, đề thi hoặc chủ đề..."
            />
            <button className="bg-primary hover:bg-primary-hover shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95 text-white px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300 ml-2 font-body">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Action & Filter Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-2">
          {user && (
            <>
              {/* Create Exam Action */}
              <CreateExamButton />

              <div className="w-px h-8 bg-slate-300 hidden sm:block"></div>
            </>
          )}

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl">
            {categories.map((cat) => (
              <button 
                key={cat}
                className="px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 text-sm font-bold border border-slate-200/80 hover:bg-primary/5 hover:text-primary hover:border-primary/30 hover:shadow-[0_8px_16px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-sm font-body"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
