import type { UserRole } from "../../types";

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
