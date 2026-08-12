// Talks to the backend's /cars routes so pages can just call carsApi.list(), carsApi.create(), etc.

import type { Car, CarInput } from "../types";

// Reads from an env variable so the API address could change later without touching the code.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Sends one request to the API and either returns the data or throws an error.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // DELETEs succeed with "204 No Content", so there's no JSON body to read.
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Prefer the backend's own error message so the banner on screen is actually useful.
    const message = (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

// One function per RESTful action on /cars.
export const carsApi = {
  list: () => request<Car[]>("/cars"),
  create: (data: CarInput) =>
    request<Car>("/cars", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: CarInput) =>
    request<Car>(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/cars/${id}`, { method: "DELETE" }),
};
