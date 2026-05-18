import type { TeamMemberRole } from "@/types/app-database";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  companyName: string;
  role: TeamMemberRole;
  website: string;
  timezone: string;
  language: string;
}

export type ProfileUpdateInput = Partial<UserProfile>;
