import { Search, ChevronDown } from "lucide-react";

export function HeroSection() {
  const categories = ["Toán học", "Tiếng Việt"];

  return (
    <section className="relative w-full pt-20 pb-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-3xl leading-[1.1]">
          Discover & Master Your Education
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
              placeholder="Search for courses, exams, or topics..."
            />
            <button className="bg-gray-100/80 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ml-2">
              Search
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl">
          {categories.map((cat) => (
            <button 
              key={cat}
              className="px-5 py-2 rounded-full bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
