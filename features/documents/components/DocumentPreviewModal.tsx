import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { UserDocument } from '../types/document.types';

interface DocumentPreviewModalProps {
  document: UserDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen || !document) return null;

  const isPdf = document.FileType.toLowerCase().includes('pdf');
  const isWord = document.FileType.toLowerCase().includes('doc');
  const isExcel = document.FileType.toLowerCase().includes('xls');
  const isPowerPoint = document.FileType.toLowerCase().includes('ppt');

  // URL cho Office Web Viewer
  const getOfficeViewerUrl = (url: string) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  // Hoặc Google Docs Viewer: `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(document.FileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = document.FileName;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(document.FileUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderPreview = () => {
    if (isPdf) {
      return (
        <iframe 
          src={`${document.FileUrl}#toolbar=0`} 
          className="w-full h-[70vh] rounded-lg border-0"
          title={document.FileName}
        />
      );
    }
    
    if (isWord || isExcel || isPowerPoint) {
      return (
        <iframe 
          src={getOfficeViewerUrl(document.FileUrl)} 
          className="w-full h-[70vh] rounded-lg border-0 bg-slate-50"
          title={document.FileName}
        />
      );
    }

    // Default for images or other unsupported preview types
    if (document.FileType.match(/jpg|jpeg|png|gif/i)) {
      return (
        <div className="w-full h-[70vh] flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden relative">
          <img 
            src={document.FileUrl} 
            alt={document.FileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-slate-50 rounded-lg text-slate-500 p-8 text-center">
        <p className="mb-4">Định dạng {document.FileType} chưa hỗ trợ xem trước trực tiếp.</p>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
          {isDownloading ? 'Đang tải...' : 'Tải xuống để xem'}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3 pr-4 truncate">
            <h2 className="text-xl font-bold text-slate-800 truncate" title={document.FileName}>
              {document.FileName}
            </h2>
            <span className="shrink-0 bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md uppercase">
              {document.FileType}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={document.FileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-2"
              title="Mở tab mới"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
              title="Tải xuống"
            >
              <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
              title="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4 bg-slate-100/50 flex-1 overflow-auto">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};
