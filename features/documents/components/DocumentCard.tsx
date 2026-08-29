import React from 'react';
import { FileText, File as FileIcon, Image as ImageIcon, FileArchive, Link as LinkIcon, Download } from 'lucide-react';
import { UserDocument } from '../types/document.types';

interface DocumentCardProps {
  document: UserDocument;
  onClick: (doc: UserDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  
  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileText className="w-8 h-8 text-blue-600" />;
    if (t.includes('xls') || t.includes('excel')) return <FileText className="w-8 h-8 text-green-600" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FileText className="w-8 h-8 text-orange-500" />;
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg')) return <ImageIcon className="w-8 h-8 text-purple-500" />;
    if (t.includes('zip') || t.includes('rar')) return <FileArchive className="w-8 h-8 text-yellow-600" />;
    return <FileIcon className="w-8 h-8 text-slate-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div 
      className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col h-full overflow-hidden"
      onClick={() => onClick(document)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {getIcon(document.FileType)}
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider">
            {document.FileType}
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 text-lg leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {document.FileName}
        </h3>
        <p className="text-sm text-slate-500">
          {formatSize(document.FileSize)}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
            {document.Author?.FullName?.[0] || 'U'}
          </div>
          <span className="truncate max-w-[100px]">{document.Author?.FullName || 'Unknown User'}</span>
        </div>
        <span>{new Date(document.CreatedAt).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Hover action overlay for visual feedback */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl pointer-events-none transition-colors duration-300" />
    </div>
  );
};
