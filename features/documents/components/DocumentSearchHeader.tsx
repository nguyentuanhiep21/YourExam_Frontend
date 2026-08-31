import { Search, ChevronDown, PenTool } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateExamButton } from "@/features/exam/components/CreateExamButton";

export async function DocumentSearchHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const categories = ["Toán học", "Tiếng Việt"];

  return (
    <section className="relative w-full pt-12 pb-12 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 flex items-center gap-3 mb-4 tracking-tight font-heading">
              <PenTool className="w-10 h-10 text-primary" />
              Ngân Hàng Đề Thi
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl font-body">
              Tự xây dựng đề thi của riêng bạn từ kho câu hỏi phong phú. Tùy chỉnh dễ dàng, nhanh chóng và chia sẻ cùng cộng đồng.
            </p>
          </div>
          
          {user && (
            <div className="flex items-center shrink-0">
              <CreateExamButton />
            </div>
          )}
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/60 shadow-sm">
          
          <div className="w-full lg:max-w-2xl">
            <div className="relative flex items-center bg-white border border-slate-200 shadow-sm rounded-full p-1.5 group hover:border-primary/30 focus-within:border-primary/50 transition-all duration-300">
              <div className="pl-4 pr-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none w-full font-body"
                placeholder="Tìm kiếm đề thi hoặc chủ đề..."
              />
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ml-2 font-body shadow-sm">
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500 mr-2">Gợi ý:</span>
            {categories.map((cat) => (
              <button 
                key={cat}
                className="px-4 py-2 rounded-full bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm font-body"
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
