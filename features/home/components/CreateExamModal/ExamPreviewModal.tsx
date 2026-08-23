import { X, Loader2, Download, Edit2, Save, XCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  generatedQuestions: any[];
  isExporting?: boolean;
  onSetGeneratedQuestions: (questions: any[]) => void;
  onDownloadDocx?: () => void;
  onSetShowSaveExamDialog?: (val: boolean) => void;
}

const QuestionItem = ({ q, idx, onSave }: { q: any, idx: number, onSave: (updatedQ: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(q.content);
  const [editedChoices, setEditedChoices] = useState<string[]>(q.choices || []);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(q.correctAnswer);

  const handleSave = () => {
    onSave({
      ...q,
      content: editedContent,
      choices: editedChoices,
      correctAnswer: editedCorrectAnswer
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(q.content);
    setEditedChoices(q.choices || []);
    setEditedCorrectAnswer(q.correctAnswer);
    setIsEditing(false);
  };

  const handleChoiceChange = (index: number, val: string) => {
    const newChoices = [...editedChoices];
    newChoices[index] = val;
    setEditedChoices(newChoices);
    // If the changed choice was previously the correct answer, we might want to update the correctAnswer if it was matching by string,
    // but a better way is: if the user selects a radio button, it sets correctAnswer to that exact string.
    // However, if they type while the radio is selected, the correctAnswer should update to match the new string.
    if (q.correctAnswer === editedChoices[index] || editedCorrectAnswer === editedChoices[index]) {
      setEditedCorrectAnswer(val);
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-indigo-300 rounded-[1.5rem] bg-indigo-50/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="font-extrabold text-indigo-700 text-lg">Chỉnh sửa Câu {idx + 1}</span>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Save size={16} /> Lưu
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors">
              <XCircle size={16} /> Hủy
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Nội dung câu hỏi</label>
            <textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 min-h-[80px]"
            />
          </div>

          {q.format === "trac-nghiem" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Các đáp án (Chọn một đáp án đúng)</label>
              <div className="space-y-2.5">
                {editedChoices.map((c, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-xl border ${editedCorrectAnswer === c ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                    <input 
                      type="radio" 
                      name={`correct-answer-${idx}`}
                      checked={editedCorrectAnswer === c}
                      onChange={() => setEditedCorrectAnswer(c)}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-2"
                    />
                    <span className="font-bold text-indigo-500 w-6">{String.fromCharCode(65 + i)}.</span>
                    <input 
                      type="text"
                      value={c}
                      onChange={(e) => handleChoiceChange(i, e.target.value)}
                      className="flex-1 p-2 rounded-lg border-none focus:ring-1 focus:ring-indigo-300 bg-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.format === "tu-luan" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Đáp án / Gợi ý</label>
              <textarea 
                value={editedCorrectAnswer}
                onChange={(e) => setEditedCorrectAnswer(e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-emerald-900 min-h-[60px]"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group p-6 border border-gray-200/80 rounded-[1.5rem] bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 relative">
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Chỉnh sửa câu hỏi"
      >
        <Edit2 size={18} />
      </button>
      
      <p className="font-extrabold text-gray-900 mb-4 text-lg leading-relaxed pr-10">
        <span className="text-indigo-600 mr-1">Câu {idx + 1}.</span> 
        <span className="font-semibold text-gray-700 whitespace-pre-wrap">{q.content}</span>
      </p>
      
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
          <span className="text-emerald-600 mt-0.5">💡</span> Đáp án: <span className="font-medium whitespace-pre-wrap">{q.correctAnswer}</span>
        </div>
      )}
    </div>
  );
};

export const ExamPreviewModal = ({ generatedQuestions, isExporting, onSetGeneratedQuestions, onDownloadDocx, onSetShowSaveExamDialog }: Props) => {
  if (generatedQuestions.length === 0) return null;

  const handleUpdateQuestion = (index: number, updatedQ: any) => {
    const newList = [...generatedQuestions];
    newList[index] = updatedQ;
    onSetGeneratedQuestions(newList);
  };

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
            <QuestionItem 
              key={idx} 
              q={q} 
              idx={idx} 
              onSave={(updated) => handleUpdateQuestion(idx, updated)} 
            />
          ))}
        </div>
        <div className="p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-md flex justify-end gap-3">
            <button onClick={() => onSetGeneratedQuestions([])} className="px-6 py-3.5 font-bold text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 rounded-2xl transition-all active:scale-95 shadow-sm">
              Đóng
            </button>
            {onSetShowSaveExamDialog && (
              <button
                onClick={() => onSetShowSaveExamDialog(true)}
                className="px-6 py-3.5 font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={18} />
                Lưu vào hệ thống
              </button>
            )}
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
