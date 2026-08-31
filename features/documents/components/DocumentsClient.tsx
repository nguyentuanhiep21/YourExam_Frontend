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
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      {/* Header Section: Bold Minimalism */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight font-heading">
            Kho Tài Liệu
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-body">
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
            className="group flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-full font-semibold transition-all shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
        <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="font-body">{uploadError}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="font-body">{error}</p>
        </div>
      )}

      {/* Search Bar, Filters and View Toggle */}
      <div className="mb-10 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu theo tên..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 text-slate-700 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-base"
            />
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setFilterType(filterType === 'pdf' ? 'all' : 'pdf')}
              className={`px-5 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${filterType === 'pdf' ? 'bg-rose-500 text-white shadow-[0_4px_12px_-4px_rgba(244,63,94,0.5)] border-transparent' : 'bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}
            >
              PDF
            </button>
            <button 
              onClick={() => setFilterType(filterType === 'word' ? 'all' : 'word')}
              className={`px-5 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${filterType === 'word' ? 'bg-primary text-white shadow-[0_4px_12px_-4px_rgba(37,99,235,0.5)] border-transparent' : 'bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}
            >
              Word
            </button>
          </div>
        </div>

        <div className="flex items-center bg-white/60 backdrop-blur-sm border border-slate-200/60 p-1.5 rounded-2xl shrink-0 self-end sm:self-auto shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
              viewMode === 'grid' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
              viewMode === 'list' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
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
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
          <p className="text-lg font-body">Đang tải danh sách tài liệu...</p>
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
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 font-heading">Không tìm thấy tài liệu nào</h3>
          <p className="text-slate-500 mb-6 text-center max-w-md font-body">
            {searchQuery ? `Không có tài liệu nào khớp với từ khóa "${searchQuery}".` : "Chưa có tài liệu nào được tải lên hệ thống."}
          </p>
          {!searchQuery && (
            <button 
              onClick={handleUploadClick}
              className="text-primary font-semibold hover:text-primary-hover hover:underline transition-colors font-body"
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
