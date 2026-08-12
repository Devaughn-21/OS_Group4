// Talks to the backend's /users routes so pages can just call usersApi.list(), usersApi.create(), etc.

import type { User, UserInput } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Sends one request to the API and either returns the data or throws an error.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

// The backend's create/update routes actually return { message, user: [the user] }, an array with one item.
// This describes that shape so we can unwrap it below instead of every page having to know about it.
interface UserResponse {
  message: string;
  user: User[];
}

export const usersApi = {
  list: () => request<User[]>("/users"),

  create: async (data: UserInput): Promise<User> => {
    const res = await request<UserResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.user[0]; // unwrap the single user out of the array
  },

  update: async (id: number, data: UserInput): Promise<User> => {
    const res = await request<UserResponse>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.user[0];
  },

  remove: (id: number) => request<{ message: string }>(`/users/${id}`, { method: "DELETE" }),
};
