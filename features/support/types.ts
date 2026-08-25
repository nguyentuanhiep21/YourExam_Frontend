export interface Profile {
  Id: string;
  FullName: string;
  AvatarUrl?: string;
  // Các trường khác của Profile có thể thêm sau
}

export interface TopicComment {
  Id: number;
  TopicId: number;
  Topic?: Topic;
  Content: string;
  AuthorId: string;
  Author?: Profile;
  CreatedAt: string; // ISO date string
}

export interface Topic {
  Id: number;
  Title: string;
  Content: string;
  AuthorId: string;
  Author?: Profile;
  CreatedAt: string; // ISO date string
  Comments?: TopicComment[];
}
