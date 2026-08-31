import { Search, PenTool, Users } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-7 h-7 text-primary" />,
    title: "Tìm kiếm & Đóng góp",
    description: "Truy cập Kho Tài liệu để tìm các đề thi, giáo án có sẵn hoặc đóng góp tài liệu Word/PDF của riêng bạn.",
    bg: "bg-primary-light/50",
    border: "border-primary/20"
  },
  {
    icon: <PenTool className="w-7 h-7 text-accent" />,
    title: "Tạo Đề & Luyện thi",
    description: "Soạn và số hóa đề thi từ tài liệu của bạn một cách nhanh chóng, hoặc chọn trực tiếp một đề có sẵn để bắt đầu thi.",
    bg: "bg-accent/10",
    border: "border-accent/20"
  },
  {
    icon: <Users className="w-7 h-7 text-emerald-600" />,
    title: "Cùng Thảo luận",
    description: "Tham gia diễn đàn cộng đồng để đặt câu hỏi, báo lỗi và nhận giải đáp từ giáo viên và học sinh khác.",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  }
];

export function InstructionsTimeline() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-heading tracking-tight">
            Dễ dàng bắt đầu chỉ với 3 bước
          </h2>
          <p className="text-lg text-slate-600 font-body">
            Khám phá quy trình sử dụng YourExam được thiết kế tối ưu nhất cho bạn.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary-light via-accent/30 to-emerald-200"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Icon card */}
                <div className={`relative w-32 h-32 rounded-[2rem] ${step.bg} border ${step.border} flex items-center justify-center mb-8 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300 z-10 bg-white`}>
                   {/* Step number indicator */}
                  <div className="absolute -top-4 -right-4 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-base shadow-md border-4 border-white">
                    {index + 1}
                  </div>
                  <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">{step.title}</h3>
                <p className="text-slate-600 max-w-[280px] font-body leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
