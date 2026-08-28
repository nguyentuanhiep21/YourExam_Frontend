"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/documents", label: "Tài liệu" },
  { href: "/exams", label: "Đề thi" },
  { href: "/support", label: "Diễn đàn" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-center gap-8 flex-1">
      {links.map((link) => {
        // Handle nested routes (e.g., /support/123 should still highlight /support)
        // But for "/" it should match exactly
        const isActive = 
          link.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold transition-colors relative group ${
              isActive ? "text-violet-700" : "text-gray-700 hover:text-violet-700"
            }`}
          >
            {link.label}
            
            {/* Active Indicator */}
            {isActive && (
              <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-violet-600 rounded-full animate-in fade-in zoom-in-95 duration-300" />
            )}
            
            {/* Hover Indicator for non-active links */}
            {!isActive && (
              <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-violet-600/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
