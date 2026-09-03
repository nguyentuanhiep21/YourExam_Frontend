export interface Profile {
  Id: string;
  Email: string;
  FullName: string;
  PhoneNumber: string | null;
  School: string | null;
  SubjectsTaught: string | null;
  AvatarUrl: string | null;
  CreatedAt: string;
}
