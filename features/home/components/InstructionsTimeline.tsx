import { Search, PenTool, Users } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6 text-indigo-600" />,
    title: "Tìm kiếm & Đóng góp",
    description: "Truy cập Kho Tài liệu để tìm các đề thi, giáo án có sẵn hoặc đóng góp tài liệu Word/PDF của riêng bạn.",
    bg: "bg-indigo-50",
  },
  {
    icon: <PenTool className="w-6 h-6 text-fuchsia-600" />,
    title: "Tạo Đề & Luyện thi",
    description: "Soạn và số hóa đề thi từ tài liệu của bạn một cách nhanh chóng, hoặc chọn trực tiếp một đề có sẵn để bắt đầu thi.",
    bg: "bg-fuchsia-50",
  },
  {
    icon: <Users className="w-6 h-6 text-amber-600" />,
    title: "Cùng Thảo luận",
    description: "Tham gia diễn đàn cộng đồng để đặt câu hỏi, báo lỗi và nhận giải đáp từ giáo viên và học sinh khác.",
    bg: "bg-amber-50",
  }
];

export function InstructionsTimeline() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            Dễ dàng bắt đầu chỉ với 3 bước
          </h2>
          <p className="text-lg text-slate-600">
            Khám phá quy trình sử dụng YourExam được thiết kế tối ưu nhất cho bạn.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-slate-200"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step number indicator */}
                <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm mb-6 shadow-md ring-4 ring-slate-50">
                  {index + 1}
                </div>
                
                {/* Icon card */}
                <div className={`w-20 h-20 rounded-3xl ${step.bg} flex items-center justify-center mb-6 shadow-sm border border-white`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{step.title}</h3>
                <p className="text-slate-600 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
