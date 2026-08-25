import { Topic } from "./types";

const mockProfiles = {
  user1: {
    Id: "u1",
    FullName: "Nguyễn Tuấn Hiệp",
    AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiep",
  },
  user2: {
    Id: "u2",
    FullName: "Trần Minh Quang",
    AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quang",
  },
  admin: {
    Id: "admin",
    FullName: "YourExam Support",
    AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  }
};

export const mockTopics: Topic[] = [
  {
    Id: 1,
    Title: "Lỗi không tải được đề thi Toán lớp 12",
    Content: "Chào admin, mình vừa tạo xong đề Toán lớp 12 nhưng khi bấm vào nút tải xuống định dạng DOCX thì bị báo lỗi 500. Nhờ admin kiểm tra giúp nhé. Cảm ơn!",
    AuthorId: mockProfiles.user1.Id,
    Author: mockProfiles.user1,
    CreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    Comments: [
      {
        Id: 101,
        TopicId: 1,
        Content: "Chào bạn, hệ thống vừa ghi nhận sự cố gián đoạn từ server render DOCX. Hiện tại kỹ thuật viên đang khắc phục, dự kiến 15 phút nữa sẽ hoạt động bình thường. Bạn thử lại sau nhé!",
        AuthorId: mockProfiles.admin.Id,
        Author: mockProfiles.admin,
        CreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      },
      {
        Id: 102,
        TopicId: 1,
        Content: "Mình vừa thử lại và tải được rồi, cảm ơn admin nhiều!",
        AuthorId: mockProfiles.user1.Id,
        Author: mockProfiles.user1,
        CreatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      }
    ]
  },
  {
    Id: 2,
    Title: "Góp ý thêm tính năng chia sẻ đề thi công khai",
    Content: "Ứng dụng rất tuyệt vời, nhưng mình muốn hỏi làm sao để gửi link đề thi mình vừa tạo cho các học sinh làm online thay vì in ra giấy? Mong team phát triển thêm tính năng này.",
    AuthorId: mockProfiles.user2.Id,
    Author: mockProfiles.user2,
    CreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    Comments: [
      {
        Id: 103,
        TopicId: 2,
        Content: "Cảm ơn góp ý của bạn. Tính năng chia sẻ link làm bài trực tuyến hiện đang nằm trong lộ trình phát triển (Roadmap) của YourExam và sẽ ra mắt vào tháng tới nhé!",
        AuthorId: mockProfiles.admin.Id,
        Author: mockProfiles.admin,
        CreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
      }
    ]
  }
];
