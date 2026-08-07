import Link from "next/link";

export interface VerificationStatusViewProps {
  status: "success" | "error" | "loading";
  message?: string;
}

export function VerificationStatusView({ status, message }: VerificationStatusViewProps) {
  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-[28px] font-bold tracking-tight text-[#0f0c29] mb-2">Đang xác thực...</h2>
          <p className="text-sm text-gray-500 mb-8">Vui lòng chờ trong giây lát.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-[28px] font-bold tracking-tight text-[#0f0c29] mb-2">Xác thực thành công!</h2>
          <p className="text-sm text-gray-500 mb-8">
            Tuyệt vời! Tài khoản của bạn đã được kích hoạt. Bạn có thể bắt đầu sử dụng YourExam ngay bây giờ.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex justify-center items-center w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
          >
            Truy cập hệ thống
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-[28px] font-bold tracking-tight text-[#0f0c29] mb-2">Xác thực thất bại</h2>
          <p className="text-sm text-gray-500 mb-6">
            {message || "Link xác thực của bạn đã hết hạn, không hợp lệ, hoặc đã được sử dụng trước đó."}
          </p>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8 text-left">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Gợi ý cách khắc phục:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Đảm bảo bạn click vào link mới nhất trong hộp thư.</li>
              <li>Thử đăng nhập lại, hệ thống sẽ gợi ý gửi lại link mới nếu cần.</li>
            </ul>
          </div>
          <Link
            href="/login"
            className="inline-flex justify-center items-center w-full h-12 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
          >
            Quay lại đăng nhập
          </Link>
        </>
      )}
    </div>
  );
}
