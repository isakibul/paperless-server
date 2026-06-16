export type Role = "organization" | "department" | "staff";

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string | number;
    message: string;
  }>;
}

export interface AuthSession {
  role: Role;
  token: string;
  label: string;
  details: Record<string, string>;
}

export interface AuthResponse {
  message: string;
  data: Record<string, string | number | boolean>;
}
