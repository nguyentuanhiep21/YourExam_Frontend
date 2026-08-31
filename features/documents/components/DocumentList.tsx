import React from 'react';
import { FileText, File as FileIcon, Image as ImageIcon, FileArchive } from 'lucide-react';
import { UserDocument } from '../types/document.types';

interface DocumentListProps {
  documents: UserDocument[];
  onDocumentClick: (doc: UserDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentClick }) => {
  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileText className="w-5 h-5 text-primary" />;
    if (t.includes('xls') || t.includes('excel')) return <FileText className="w-5 h-5 text-emerald-600" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FileText className="w-5 h-5 text-orange-500" />;
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg')) return <ImageIcon className="w-5 h-5 text-purple-500" />;
    if (t.includes('zip') || t.includes('rar')) return <FileArchive className="w-5 h-5 text-yellow-600" />;
    return <FileIcon className="w-5 h-5 text-slate-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200/80 text-slate-600 text-sm font-heading">
              <th className="font-semibold py-5 px-6">Tên tài liệu</th>
              <th className="font-semibold py-5 px-6 w-32">Định dạng</th>
              <th className="font-semibold py-5 px-6 w-32">Kích thước</th>
              <th className="font-semibold py-5 px-6 w-48">Người tải lên</th>
              <th className="font-semibold py-5 px-6 w-40">Ngày tải</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr 
                key={doc.Id} 
                onClick={() => onDocumentClick(doc)}
                className="hover:bg-primary/5 transition-colors duration-300 cursor-pointer group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100/80 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                      {getIcon(doc.FileType)}
                    </div>
                    <span className="font-medium font-heading text-slate-800 group-hover:text-primary transition-colors truncate max-w-md">
                      {doc.FileName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {doc.FileType}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm font-body">
                  {formatSize(doc.FileSize)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2.5 font-body">
                    <div className="w-7 h-7 rounded-full bg-primary-light/50 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm">
                      {doc.Author?.FullName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-600 truncate max-w-[120px]">
                      {doc.Author?.FullName || 'Unknown User'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm font-medium font-body">
                  {new Date(doc.CreatedAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
