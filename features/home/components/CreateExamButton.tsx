"use client";

import { useState } from "react";
import { CreateExamModal } from "./CreateExamModal";

export function CreateExamButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-base font-bold shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300"
      >
        <span>+ Tạo đề thi mới</span>
      </button>

      {isOpen && <CreateExamModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
