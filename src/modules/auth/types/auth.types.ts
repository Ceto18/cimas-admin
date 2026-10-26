export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  uuid: string;
  name: string;
  last_name: string;
  email: string;
}

export interface LoginData {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}