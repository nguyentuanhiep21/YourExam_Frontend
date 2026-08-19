import { X, Loader2, Download } from "lucide-react";

interface Props {
  generatedQuestions: any[];
  isExporting?: boolean;
  onSetGeneratedQuestions: (questions: any[]) => void;
  onDownloadDocx?: () => void;
}

export const ExamPreviewModal = ({ generatedQuestions, isExporting, onSetGeneratedQuestions, onDownloadDocx }: Props) => {
  if (generatedQuestions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[95vh] overflow-hidden border border-white/80 animate-in zoom-in-[0.98] duration-300">
        <div className="p-7 border-b border-indigo-100/50 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-violet-50/50">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-br from-indigo-900 to-violet-800 bg-clip-text text-transparent tracking-tight">Chi tiết Đề Thi</h2>
            <p className="text-indigo-700/80 font-bold text-sm mt-1.5">Gồm {generatedQuestions.length} câu hỏi được sinh ngẫu nhiên.</p>
          </div>
          <button onClick={() => onSetGeneratedQuestions([])} className="p-2.5 text-indigo-400 hover:text-indigo-900 hover:bg-white/60 rounded-full transition-all active:scale-95 shadow-sm">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-7 space-y-6 bg-gray-50/30">
          {generatedQuestions.map((q, idx) => (
            <div key={idx} className="p-6 border border-gray-200/80 rounded-[1.5rem] bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300">
              <p className="font-extrabold text-gray-900 mb-4 text-lg leading-relaxed"><span className="text-indigo-600 mr-1">Câu {idx + 1}.</span> <span className="font-semibold text-gray-700">{q.content}</span></p>
              {q.format === "trac-nghiem" && q.choices && q.choices.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {q.choices.map((c: string, i: number) => (
                    <div key={i} className={`p-4 rounded-2xl border ${c === q.correctAnswer ? 'border-emerald-300 bg-emerald-50/80 text-emerald-900 shadow-sm' : 'border-gray-200/80 bg-gray-50/80 text-gray-700 hover:bg-white hover:border-indigo-200 transition-all'}`}>
                      <span className="font-bold mr-2 text-indigo-500">{String.fromCharCode(65 + i)}.</span> <span className="font-medium">{c}</span>
                    </div>
                  ))}
                </div>
              )}
              {q.format === "tu-luan" && (
                <div className="p-4 bg-emerald-50/80 text-emerald-900 border border-emerald-200/80 rounded-2xl mb-2 font-bold flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">💡</span> Đáp án: <span className="font-medium">{q.correctAnswer}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-md flex justify-end gap-3">
            <button onClick={() => onSetGeneratedQuestions([])} className="px-6 py-3.5 font-bold text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 rounded-2xl transition-all active:scale-95 shadow-sm">
              Đóng
            </button>
            {onDownloadDocx && (
              <button
                disabled={isExporting}
                onClick={onDownloadDocx}
                className="px-6 py-3.5 font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:shadow-none rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:-translate-y-0.5"
              >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                Tải Đề thi & Đáp án (DOCX)
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
