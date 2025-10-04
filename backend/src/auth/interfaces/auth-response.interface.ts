import { UserRole } from '@prisma/client';

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
  };
}
