import { Search, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateExamButton } from "./CreateExamButton";

export async function HeroSection() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const categories = ["Toán học", "Tiếng Việt"];

  return (
    <section className="relative w-full pt-20 pb-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-3xl leading-[1.1]">
          Khám phá & Chinh phục tri thức
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative flex items-center bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full p-2">
            <div className="pl-4 pr-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent py-2.5 text-base text-gray-900 placeholder:text-gray-500 outline-none"
              placeholder="Tìm kiếm khóa học, đề thi hoặc chủ đề..."
            />
            <button className="bg-gray-100/80 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ml-2">
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

              <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
            </>
          )}

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl">
            {categories.map((cat) => (
              <button 
                key={cat}
                className="px-5 py-2 rounded-full bg-white text-gray-700 text-sm font-semibold border border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all duration-200 shadow-sm"
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
