import type { UserRole } from "../../types";

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
