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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-violet-50">
          <div>
            <h2 className="text-2xl font-bold text-violet-900">Chi tiết Đề Thi</h2>
            <p className="text-violet-700 text-sm mt-1">Gồm {generatedQuestions.length} câu hỏi được sinh ngẫu nhiên.</p>
          </div>
          <button onClick={() => onSetGeneratedQuestions([])} className="p-2 text-violet-400 hover:text-violet-700 hover:bg-violet-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {generatedQuestions.map((q, idx) => (
            <div key={idx} className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <p className="font-bold text-gray-900 mb-3 text-lg">Câu {idx + 1}: <span className="font-normal">{q.content}</span></p>
              {q.format === "trac-nghiem" && q.choices && q.choices.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {q.choices.map((c: string, i: number) => (
                    <div key={i} className={`p-3 rounded-xl border ${c === q.correctAnswer ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {c}
                    </div>
                  ))}
                </div>
              )}
              {q.format === "tu-luan" && (
                <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl mb-2 font-medium">
                  Đáp án: {q.correctAnswer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={() => onSetGeneratedQuestions([])} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors">
              Đóng
            </button>
            {onDownloadDocx && (
              <button
                disabled={isExporting}
                onClick={onDownloadDocx}
                className="px-6 py-3 font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl flex items-center justify-center gap-2 transition-colors"
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
