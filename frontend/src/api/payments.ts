// Talks to the backend's /payments route. It only implements GET, so this file only exposes "list".

import type { Payment } from "../types";

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

export const paymentsApi = {
  list: () => request<Payment[]>("/payments"),
};
