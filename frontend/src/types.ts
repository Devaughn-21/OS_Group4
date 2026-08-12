// Shared TypeScript shapes for our 4 database tables, so every file imports the same definitions instead of redefining them.

export type CarCategory = "economy" | "standard" | "luxury" | "SUV";

// The full list of valid categories, used by both the Cars form and the Cars page filter chips.
export const CAR_CATEGORIES: CarCategory[] = ["economy", "standard", "luxury", "SUV"];

// Matches a row in the `cars` table.
export interface Car {
  car_id: number;
  make: string;
  model: string;
  year: number;
  color: string | null;
  license_plate: string;
  category: CarCategory;
  daily_rate: number | string;
  is_available: boolean | number;
  mileage: number | null;
}

// What the add/edit car form sends to the API: same as Car but without car_id, and with real number/boolean types.
export type CarInput = Omit<Car, "car_id" | "daily_rate" | "is_available"> & {
  daily_rate: number;
  is_available: boolean;
};

// Matches a row in the `users` table (our customers).
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  license_number: string;
  created_at?: string;
}

export type UserInput = Omit<User, "user_id" | "created_at">;

export type RentalStatus = "pending" | "active" | "completed" | "cancelled";

// Matches a row in the `rentals` table, linking a user to a car for a date range.
export interface Rental {
  rental_id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_cost: number | string;
  status: RentalStatus;
  created_at?: string;
}

export type RentalInput = Omit<Rental, "rental_id" | "created_at" | "total_cost"> & {
  total_cost: number;
};

export type PaymentMethod = "credit_card" | "debit_card" | "cash";
export type PaymentStatus = "pending" | "completed" | "refunded";

// Matches a row in the `payments` table. There's no PaymentInput because the API can't create or update payments.
export interface Payment {
  payment_id: number;
  rental_id: number;
  amount: number | string;
  payment_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
}
