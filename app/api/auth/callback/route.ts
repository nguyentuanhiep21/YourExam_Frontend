import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Các thông số nếu token lỗi trả về (vd: từ reset password hoặc email hỏng)
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Nếu Supabase trả về lỗi ngay từ URL (thường xảy ra với Implicit Flow thay vì PKCE nếu config sai, 
  // hoặc link đã hết hạn quá lâu bị backend từ chối thẳng)
  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/verify?status=error&message=${encodeURIComponent(errorDescription || error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      // Xác thực thất bại (hết hạn, mã không hợp lệ, hoặc đã sử dụng)
      return NextResponse.redirect(`${requestUrl.origin}/verify?status=error&message=${encodeURIComponent(exchangeError.message)}`);
    }

    // Thành công, điều hướng dựa theo next param nếu có
    const next = requestUrl.searchParams.get("next");
    if (next) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
    
    // Mặc định
    return NextResponse.redirect(`${requestUrl.origin}/verify?status=success`);
  }

  // Không có code cũng không có error
  return NextResponse.redirect(`${requestUrl.origin}/verify?status=error&message=${encodeURIComponent("Không tìm thấy mã xác thực.")}`);
}
