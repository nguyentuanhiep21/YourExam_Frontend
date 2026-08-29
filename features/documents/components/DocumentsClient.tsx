"use client";

import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, Loader2, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useUploadDocument } from '@/features/documents/hooks/useUploadDocument';
import { DocumentCard } from '@/features/documents/components/DocumentCard';
import { DocumentList } from '@/features/documents/components/DocumentList';
import { DocumentPreviewModal } from '@/features/documents/components/DocumentPreviewModal';
import { UploadDisclaimerModal } from '@/features/documents/components/UploadDisclaimerModal';
import { UserDocument } from '@/features/documents/types/document.types';

export default function DocumentsClient() {
  const { documents, isLoading, error, refresh } = useDocuments();
  const { uploadDocument, isUploading, error: uploadError } = useUploadDocument();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<UserDocument | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'word'>('all');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.FileName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    
    if (filterType === 'all') return true;
    const type = doc.FileType.toLowerCase();
    if (filterType === 'pdf') return type.includes('pdf');
    if (filterType === 'word') return type.includes('doc'); // matches doc, docx
    
    return true;
  });

  const handleUploadClick = () => {
    const isVerified = localStorage.getItem('UploadVerified');
    if (isVerified === 'true') {
      fileInputRef.current?.click();
    } else {
      setIsDisclaimerOpen(true);
    }
  };

  const handleDisclaimerConfirm = () => {
    localStorage.setItem('UploadVerified', 'true');
    setIsDisclaimerOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file dưới 10MB.");
      return;
    }

    const result = await uploadDocument(file);
    if (result) {
      refresh();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section: Bold Minimalism */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-[#0F172A] mb-4 tracking-tight">
            Kho Tài Liệu
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Quản lý, xem trước và chia sẻ tài liệu học tập của bạn. Hỗ trợ đa dạng các định dạng từ PDF, Word, Excel đến hình ảnh.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip,.rar"
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="group flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3.5 rounded-full font-semibold transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            )}
            {isUploading ? "Đang tải lên..." : "Tải Tài Liệu Lên"}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p>{uploadError}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar, Filters and View Toggle */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu theo tên..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow text-base"
            />
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setFilterType(filterType === 'pdf' ? 'all' : 'pdf')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-colors ${filterType === 'pdf' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              PDF
            </button>
            <button 
              onClick={() => setFilterType(filterType === 'word' ? 'all' : 'word')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-colors ${filterType === 'word' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Word
            </button>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              viewMode === 'grid' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Dạng danh sách"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#2563EB]" />
          <p className="text-lg">Đang tải danh sách tài liệu...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocs.map(doc => (
              <DocumentCard 
                key={doc.Id} 
                document={doc} 
                onClick={setSelectedDoc}
              />
            ))}
          </div>
        ) : (
          <DocumentList 
            documents={filteredDocs} 
            onDocumentClick={setSelectedDoc} 
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy tài liệu nào</h3>
          <p className="text-slate-500 mb-6 text-center max-w-md">
            {searchQuery ? `Không có tài liệu nào khớp với từ khóa "${searchQuery}".` : "Chưa có tài liệu nào được tải lên hệ thống."}
          </p>
          {!searchQuery && (
            <button 
              onClick={handleUploadClick}
              className="text-[#2563EB] font-semibold hover:underline"
            >
              Tải lên tài liệu đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <DocumentPreviewModal 
        isOpen={!!selectedDoc} 
        document={selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />

      {/* Upload Disclaimer Modal */}
      <UploadDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onConfirm={handleDisclaimerConfirm}
      />
    </main>
  );
}
