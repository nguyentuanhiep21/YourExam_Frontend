import { GRADES, SUBJECTS } from "../../constants/createExam.constants";

interface Props {
  selectedGrade: string | null;
  selectedSubject: string | null;
  onSelectGrade: (grade: string) => void;
  onSelectSubject: (subject: string) => void;
}

export const BasicInfoStep = ({
  selectedGrade,
  selectedSubject,
  onSelectGrade,
  onSelectSubject
}: Props) => {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Khối Lớp</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {GRADES.map((grade) => {
            const isDisabled = ["Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"].includes(grade);
            return (
              <button
                key={grade}
                onClick={() => !isDisabled && onSelectGrade(grade)}
                disabled={isDisabled}
                className={`relative py-3.5 px-2 rounded-2xl text-sm font-semibold transition-all duration-300 border overflow-hidden ${
                  isDisabled
                    ? "opacity-50 blur-[0.5px] cursor-not-allowed bg-gray-50/50 border-gray-200 text-gray-400"
                    : selectedGrade === grade
                    ? "bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-400 text-violet-700 shadow-[0_4px_12px_rgba(139,92,246,0.15)] ring-1 ring-violet-400 hover:-translate-y-0.5"
                    : "bg-white border-gray-200/80 text-gray-600 hover:border-violet-300 hover:bg-violet-50/30 hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                <span className="relative z-10">{grade}</span>
                {selectedGrade === grade && (
                  <div className="absolute inset-0 rounded-2xl bg-violet-400/10 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Môn Học</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => onSelectSubject(subject)}
              className={`relative py-4 px-3 rounded-2xl text-base font-semibold transition-all duration-300 border overflow-hidden ${
                selectedSubject === subject
                  ? "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-400 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400 hover:-translate-y-0.5"
                  : "bg-white border-gray-200/80 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
              }`}
            >
              <span className="relative z-10">{subject}</span>
              {selectedSubject === subject && (
                <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
