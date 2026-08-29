import React from 'react';
import Navbar from "@/components/layout/Navbar";
import DocumentsClient from '@/features/documents/components/DocumentsClient';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      <DocumentsClient />
    </div>
  );
}
