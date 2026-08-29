import { Profile } from "@/features/support/types/support.types";

export interface UserDocument {
  Id: number;
  FileName: string;
  FileUrl: string;
  FileType: string;
  FileSize: number; // in bytes
  AuthorId: string;
  Author?: Profile;
  CreatedAt: string; // ISO date string
}
