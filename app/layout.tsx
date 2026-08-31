import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "YourExam — Nền tảng tạo đề thi thông minh",
  description: "Nền tảng tạo đề thi và chia sẻ tài liệu dành cho giáo viên và học sinh Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-700">
        {children}
      </body>
    </html>
  );
}
