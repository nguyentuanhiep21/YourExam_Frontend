"use client";

import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

/**
 * InputField — tách biệt lớp viền bo và lớp nhập liệu.
 * - Lớp ngoài (div): giữ viền bo tròn, màu border, ring focus
 * - Lớp trong (input): chiếm phần nội dung, con trỏ chỉ xuất hiện trong vùng này
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>

        {/* Outer border wrapper */}
        <div
          className={`
            relative flex items-center
            rounded-xl border border-gray-200 bg-white
            transition-all duration-200
            has-[:focus]:border-violet-500 has-[:focus]:ring-4 has-[:focus]:ring-violet-500/10
            has-[:hover]:border-gray-300
            ${error ? "border-red-400 has-[:focus]:border-red-500 has-[:focus]:ring-red-500/10" : ""}
          `}
        >
          {/* Inner content area — cursor only ever appears here */}
          <input
            ref={ref}
            id={id}
            className={`
              w-full bg-transparent px-4 py-3.5 text-sm text-gray-900
              placeholder:text-gray-400 outline-none
              ${className ?? ""}
            `}
            {...props}
          />
        </div>

        {/* Inline validation error */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
