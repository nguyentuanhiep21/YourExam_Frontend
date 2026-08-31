"use client";

import { useState } from "react";
import { CreateTopicCard } from "./CreateTopicCard";
import { TopicThread } from "./TopicThread";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { Pagination } from "./Pagination";
import { HelpCircle, Loader2, ChevronDown, Check } from "lucide-react";
import { useSupport } from "../hooks/useSupport";

export function SupportClient() {
  const { 
    topics, loading, error, currentUser, savedTopicIds,
    totalTopics, page, limit,
    addTopic, addComment, removeTopic, removeComment, loadMoreComments, toggleSaveTopic 
  } = useSupport();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"recent" | "saved" | "posted">("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'topic' | 'comment', topicId: number, commentId?: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabs = [
    { id: "recent", label: "Các chủ đề gần đây" },
    { id: "saved", label: "Đã lưu" },
    { id: "posted", label: "Đã đăng" },
  ] as const;

  const handleCreateTopic = async (title: string, content: string, imageFile: File | null) => {
    try {
      setIsSubmitting(true);
      await addTopic(title, content, imageFile);
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi tạo chủ đề.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (topicId: number, content: string) => {
    try {
      await addComment(topicId, content);
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi tạo bình luận.");
    }
  };

  const handleToggleSave = async (topicId: number) => {
    try {
      await toggleSaveTopic(topicId);
    } catch (err) {
      alert("Đã xảy ra lỗi khi lưu/bỏ lưu chủ đề.");
    }
  };

  const handleDeleteTopic = (topicId: number) => {
    setItemToDelete({ type: 'topic', topicId });
  };

  const handleDeleteComment = (topicId: number, commentId: number) => {
    setItemToDelete({ type: 'comment', topicId, commentId });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      if (itemToDelete.type === 'topic') {
        await removeTopic(itemToDelete.topicId);
      } else if (itemToDelete.type === 'comment' && itemToDelete.commentId) {
        await removeComment(itemToDelete.topicId, itemToDelete.commentId);
      }
      setItemToDelete(null);
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="relative z-10 flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-3 mb-4 tracking-tight font-heading">
            <HelpCircle className="w-10 h-10 text-primary" />
            Diễn đàn
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl font-body">
            Bạn có câu hỏi, báo lỗi hay góp ý? Hãy đăng chủ đề tại đây để cùng cộng đồng YourExam thảo luận và giải đáp.
          </p>
        </div>

        {/* Form Create Topic */}
        <CreateTopicCard currentUser={currentUser} isSubmitting={isSubmitting} onSubmit={handleCreateTopic} />
        
        {/* List Topics */}
        <div className="space-y-2">
          <div className="relative mb-6">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
            >
              {tabs.find(t => t.id === activeTab)?.label}
              <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl shadow-primary/10 border border-slate-200/80 z-20 p-2 origin-top-left animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between group font-body ${
                          activeTab === tab.id 
                            ? 'text-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && <Check className="w-4 h-4 text-primary animate-in zoom-in duration-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl font-body">
              Đã xảy ra lỗi tải danh sách: {error}
            </div>
          ) : (() => {
            const filteredTopics = topics.filter(topic => {
              if (activeTab === "saved") return savedTopicIds.includes(topic.Id);
              if (activeTab === "posted") return currentUser && topic.AuthorId === currentUser.Id;
              return true; // recent
            });
            
            if (filteredTopics.length === 0) {
              return (
                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-[2rem] border border-dashed border-slate-300 font-body">
                  {activeTab === "saved" 
                    ? "Bạn chưa lưu chủ đề nào." 
                    : activeTab === "posted" 
                    ? "Bạn chưa đăng chủ đề nào." 
                    : "Chưa có chủ đề nào. Hãy là người đầu tiên đăng bài!"}
                </div>
              );
            }

            return (
              <>
                {filteredTopics.map(topic => (
                  <TopicThread 
                    key={topic.Id} 
                    topic={topic} 
                    onCreateComment={handleCreateComment}
                    currentUserId={currentUser?.Id}
                    isSaved={savedTopicIds.includes(topic.Id)}
                    onToggleSave={() => handleToggleSave(topic.Id)}
                    onDelete={() => handleDeleteTopic(topic.Id)}
                    onDeleteComment={(commentId) => handleDeleteComment(topic.Id, commentId)}
                    onLoadMoreComments={loadMoreComments}
                  />
                ))}
                
                {/* Phân trang chỉ hiển thị ở tab Tất cả (recent) nếu dữ liệu được phân trang từ server */}
                {activeTab === "recent" && totalTopics > limit && (
                  <Pagination 
                    currentPage={page} 
                    totalItems={totalTopics} 
                    itemsPerPage={limit} 
                  />
                )}
              </>
            );
          })()}
        </div>

      </div>

      <ConfirmDeleteDialog 
        isOpen={itemToDelete !== null}
        isDeleting={isDeleting}
        title={itemToDelete?.type === 'comment' ? "Xóa bình luận?" : "Xóa bài viết?"}
        description={itemToDelete?.type === 'comment' ? "Bạn có chắc chắn muốn xóa bình luận này không?" : "Bạn có chắc chắn muốn xóa chủ đề này không? Hành động này không thể hoàn tác."}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
