export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName?: string;
  email: string;
}