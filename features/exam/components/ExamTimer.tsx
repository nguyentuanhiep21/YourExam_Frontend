"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ initialSeconds, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft < 60 * 5; // 5 minutes warning
  const isDanger = secondsLeft < 60; // 1 minute warning

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold shadow-sm border transition-colors ${
      isDanger 
        ? "bg-red-50 text-red-600 border-red-200 animate-pulse" 
        : isWarning 
          ? "bg-amber-50 text-amber-600 border-amber-200"
          : "bg-indigo-50 text-indigo-700 border-indigo-100"
    }`}>
      <Clock className="w-5 h-5" />
      <span className="text-lg font-mono">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
