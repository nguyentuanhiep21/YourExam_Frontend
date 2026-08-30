import { Award, Clock, FileText, CheckCircle } from "lucide-react";

interface ExamResultSummaryProps {
  score: number;
  totalScore: number;
  timeTakenSeconds: number;
  durationSeconds: number;
  onReview: () => void;
  onClose: () => void;
  isReviewing: boolean;
}

export default function ExamResultSummary({ 
  score, 
  totalScore, 
  timeTakenSeconds, 
  durationSeconds, 
  onReview, 
  onClose,
  isReviewing
}: ExamResultSummaryProps) {
  const timeTakenMinutes = Math.floor(timeTakenSeconds / 60);
  const timeTakenRemSeconds = timeTakenSeconds % 60;
  
  const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;
  
  let resultColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (percentage < 50) resultColor = "text-rose-600 bg-rose-50 border-rose-200";
  else if (percentage < 80) resultColor = "text-amber-600 bg-amber-50 border-amber-200";

  return (
    <div className="relative overflow-hidden bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10 mb-8 animate-in zoom-in-95 duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-70 pointer-events-none"></div>
      
      <div className="relative z-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900">Hoàn thành bài thi!</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-2 ${resultColor}`}>
            <Award className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Điểm số</span>
            <div className="text-3xl font-black">
              {Math.round(score)} <span className="text-xl font-bold opacity-70">/ {totalScore}</span>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 flex flex-col items-center justify-center gap-2">
            <Clock className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Thời gian làm bài</span>
            <div className="text-3xl font-black">
              {String(timeTakenMinutes).padStart(2, '0')}:{String(timeTakenRemSeconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100 max-w-lg mx-auto">
          {!isReviewing ? (
            <button 
              onClick={onReview}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm"
            >
              <FileText className="w-5 h-5" />
              Xem đáp án chi tiết
            </button>
          ) : (
            <button 
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-400 font-bold rounded-xl shadow-sm cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              Đang xem đáp án
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-xl transition-all shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
