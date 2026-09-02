import { X, Loader2, Save, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  initialTitle: string;
  isSavingExam: boolean;
  onSetShowSaveExamDialog: (val: boolean) => void;
  onSaveExam: (details: { title: string, difficulty: number, durationMinutes: number, totalScore: number }) => void;
}

export const SaveExamModal = ({
  initialTitle, isSavingExam,
  onSetShowSaveExamDialog, onSaveExam
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [totalScore, setTotalScore] = useState<number>(10);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const diffOptions = [
    { value: 1, label: "Dễ", color: "text-emerald-600", bg: "bg-emerald-50" },
    { value: 2, label: "Trung bình", color: "text-amber-600", bg: "bg-amber-50" },
    { value: 3, label: "Khó", color: "text-rose-600", bg: "bg-rose-50" },
  ];
  
  const selectedDiff = diffOptions.find(o => o.value === difficulty) || diffOptions[0];

  const handleSubmit = () => {
    onSaveExam({
      title,
      difficulty,
      durationMinutes,
      totalScore
    });
  };

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md p-0 rounded-[2rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-[0.98] duration-300 overflow-hidden">
        <div className="flex justify-between items-center p-7 border-b border-gray-200/50">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Lưu đề thi vào hệ thống</h3>
          <button onClick={() => onSetShowSaveExamDialog(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>
        <div className="p-7 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên đề thi <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Đề kiểm tra giữa kì 1..."
              className="w-full border border-gray-200/80 bg-gray-50/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDiffOpen(!isDiffOpen)}
                  className={`w-full flex items-center justify-between border rounded-2xl pl-5 pr-4 py-3 transition-all shadow-sm font-medium ${isDiffOpen ? 'border-indigo-400 ring-2 ring-indigo-500/50 bg-white' : 'border-gray-200/80 bg-gray-50/50 hover:bg-white hover:border-gray-300'}`}
                >
                  <span className="text-gray-700">{selectedDiff.label}</span>
                  <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isDiffOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDiffOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDiffOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {diffOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setDifficulty(opt.value);
                            setIsDiffOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left ${
                            difficulty === opt.value
                              ? `${opt.bg} ${opt.color} font-bold`
                              : 'text-gray-600 hover:bg-gray-50 font-medium'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {difficulty === opt.value && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tổng điểm</label>
              <input 
                type="number"
                min="1"
                value={totalScore}
                onChange={(e) => setTotalScore(Number(e.target.value))}
                className="w-full border border-gray-200/80 bg-gray-50/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian làm bài (phút)</label>
            <input 
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full border border-gray-200/80 bg-gray-50/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isSavingExam}
            className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2 transition-all duration-300"
          >
            {isSavingExam ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Lưu đề thi
          </button>
        </div>
      </div>
    </div>
  );
};
