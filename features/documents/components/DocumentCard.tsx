import React from 'react';
import { FileText, File as FileIcon, Image as ImageIcon, FileArchive } from 'lucide-react';
import { UserDocument } from '../types/document.types';

interface DocumentCardProps {
  document: UserDocument;
  onClick: (doc: UserDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  
  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return <FileText className="w-8 h-8 text-rose-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileText className="w-8 h-8 text-primary" />;
    if (t.includes('xls') || t.includes('excel')) return <FileText className="w-8 h-8 text-emerald-600" />;
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
      className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/80 hover:border-primary/50 rounded-[2rem] p-6 transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-1 cursor-pointer flex flex-col h-full overflow-hidden"
      onClick={() => onClick(document)}
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
          {getIcon(document.FileType)}
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full uppercase tracking-widest">
            {document.FileType}
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative z-10">
        <h3 className="font-semibold font-heading text-slate-900 text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {document.FileName}
        </h3>
        <p className="text-sm text-slate-500 font-body">
          {formatSize(document.FileSize)}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between text-sm text-slate-500 relative z-10 font-body">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-primary-light/50 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {document.Author?.FullName?.[0] || 'U'}
          </div>
          <span className="truncate max-w-[100px] font-medium">{document.Author?.FullName || 'Unknown'}</span>
        </div>
        <span className="text-xs font-medium">{new Date(document.CreatedAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
  );
};
