import { Download, ArrowUpCircle, FileText } from "lucide-react";
import { ExamMockData } from "../types";

// Helper function to format numbers (e.g. 12000 -> 12K)
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

interface ExamCardProps {
  exam: ExamMockData;
}

export function ExamCard({ exam }: ExamCardProps) {
  // Determine icon, gradient, and tag color based on subject
  let coverImage = "";
  let coverGradient = "";
  let tagTextColor = "";
  
  if (exam.subject.includes("Toán") || exam.subject.includes("Math")) {
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]"; // Soft indigo/blue gradient
    tagTextColor = "text-indigo-700";
  } else if (exam.subject.includes("Việt") || exam.subject.includes("Viet")) {
    coverImage = "/images/icon-vietnamese.png";
    coverGradient = "bg-gradient-to-br from-orange-50 to-amber-100";
    tagTextColor = "text-amber-700";
  } else {
    // Default fallback
    coverImage = "/images/icon-math.png";
    coverGradient = "bg-gradient-to-br from-gray-50 to-gray-100";
    tagTextColor = "text-gray-700";
  }

  return (
    <div className="group min-w-[280px] w-[300px] sm:w-[320px] bg-white rounded-2xl border border-gray-100 p-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full snap-start overflow-hidden">
      
      {/* Cover Image Area */}
      <div className={`relative h-44 w-full rounded-xl overflow-hidden mb-4 p-4 ${coverGradient}`}>
        {/* The icon image on the right */}
        <div 
          className="absolute inset-y-4 right-4 w-[60%] bg-right bg-contain bg-no-repeat scale-90 group-hover:scale-100 group-hover:-translate-x-2 transition-transform duration-500 drop-shadow-sm origin-right"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />
        
        {/* Top-left tag on the cover */}
        <div className="absolute top-3 left-3 flex items-center">
          <div className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-1.5 shadow-sm text-xs font-bold tracking-wide ${tagTextColor}`}>
            {exam.subject}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col flex-1">
        {/* Title */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {exam.school}
          </p>
        </div>

        {/* Footer: Stats */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hữu ích</div>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
                {formatNumber(exam.upvotes)} <span className="text-emerald-500 text-xs">↑</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tải xuống</div>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
                {formatNumber(exam.downloads)} <span className="text-red-500 text-xs">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
