// API types voor AudioMon backend

export type UserRole = "admin" | "user";

export interface LoginResponse {
  token: string;
  role: UserRole;
}

export interface ApiError {
  error: string;
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AudioItem {
  id: number;
  title: string;
  artist: string;
  description?: string;
  lat: number;
  lon: number;
}

export interface Statistics {
  users: number;
  tokens: number;
}

export interface PingResponse {
  ping: string;
}
