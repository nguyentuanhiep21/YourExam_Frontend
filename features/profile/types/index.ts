export interface Profile {
  Id: string;
  FullName: string;
  School: string | null;
  SubjectsTaught: string | null;
  AvatarUrl: string | null;
  CoverUrl?: string | null;
  CreatedAt: string;
}
