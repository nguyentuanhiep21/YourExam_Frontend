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
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Khối Lớp</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {GRADES.map((grade) => (
            <button
              key={grade}
              onClick={() => onSelectGrade(grade)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedGrade === grade
                  ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500"
                  : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-gray-50"
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Môn Học</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => onSelectSubject(subject)}
              className={`py-4 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedSubject === subject
                  ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-500"
                  : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-gray-50"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
