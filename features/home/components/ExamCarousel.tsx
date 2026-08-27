"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExamMockData } from "../types";
import { ExamCard } from "./ExamCard";

interface ExamCarouselProps {
  title: string;
  subtitle?: string;
  exams: ExamMockData[];
  emoji?: string;
}

export function ExamCarousel({ title, subtitle, exams, emoji }: ExamCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
            {emoji && <span className="text-3xl drop-shadow-sm">{emoji}</span>}
            {title}
          </h2>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-gray-200/80 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-[0_8px_16px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-gray-200/80 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-[0_8px_16px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  );
}
