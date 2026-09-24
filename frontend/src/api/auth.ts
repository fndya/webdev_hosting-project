import { apiFetch } from "./client";
import type { User } from "@/types/user";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

export function login(data: LoginData): Promise<User> {
    return apiFetch("/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function register(data: RegisterData): Promise<User> {
    return apiFetch("/auth/register/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function logout(): Promise<{ detail: string }> {
    return apiFetch("/auth/logout/", {
        method: "POST",
    });
}

export function getCurrentUser(): Promise<User> {
    return apiFetch("/auth/me/");
}