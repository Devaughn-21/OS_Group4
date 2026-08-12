// Talks to the backend's /rentals routes so pages can just call rentalsApi.list(), rentalsApi.create(), etc.

import type { Rental, RentalInput } from "../types";

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

// Same quirk as users.ts: create/update return { message, rental: [the rental] }, so we unwrap it here.
interface RentalResponse {
  message: string;
  rental: Rental[];
}

export const rentalsApi = {
  list: () => request<Rental[]>("/rentals"),

  create: async (data: RentalInput): Promise<Rental> => {
    const res = await request<RentalResponse>("/rentals", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.rental[0];
  },

  update: async (id: number, data: RentalInput): Promise<Rental> => {
    const res = await request<RentalResponse>(`/rentals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.rental[0];
  },

  remove: (id: number) => request<{ message: string }>(`/rentals/${id}`, { method: "DELETE" }),
};
