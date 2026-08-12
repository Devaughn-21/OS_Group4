// The form used to both create and edit a rental. It also takes the full users/cars lists as props to populate its two dropdowns.

import { useMemo, useState, type SubmitEvent } from "react";
import { CarIcon } from "../icons";
import type { Car, Rental, RentalInput, RentalStatus, User } from "../../types";

const STATUSES: RentalStatus[] = ["pending", "active", "completed", "cancelled"];

const emptyValues: RentalInput = {
  user_id: 0,
  car_id: 0,
  start_date: "",
  end_date: "",
  total_cost: 0,
  status: "pending",
};

// <input type="date"> only accepts "YYYY-MM-DD", so this trims off any timestamp the API sends back.
function toDateInputValue(value: string): string {
  return value ? value.slice(0, 10) : "";
}

function toFormValues(rental: Rental): RentalInput {
  return {
    user_id: rental.user_id,
    car_id: rental.car_id,
    start_date: toDateInputValue(rental.start_date),
    end_date: toDateInputValue(rental.end_date),
    total_cost: Number(rental.total_cost),
    status: rental.status,
  };
}

// Whole days between two dates, used for the price estimate. Returns 0 if either date is missing.
function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0;
}

interface RentalFormProps {
  initialValues?: Rental;
  users: User[];
  cars: Car[];
  onSubmit: (data: RentalInput) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel: string;
}

export function RentalForm({ initialValues, users, cars, onSubmit, onCancel, submitLabel }: RentalFormProps) {
  const [values, setValues] = useState<RentalInput>(
    initialValues ? toFormValues(initialValues) : emptyValues,
  );
  const [submitting, setSubmitting] = useState(false);

  // The dropdowns only store an ID, so look up the full objects for the summary panel to display.
  const selectedCar = useMemo(
    () => cars.find((c) => c.car_id === values.car_id),
    [cars, values.car_id],
  );
  const selectedUser = useMemo(
    () => users.find((u) => u.user_id === values.user_id),
    [users, values.user_id],
  );
  const days = daysBetween(values.start_date, values.end_date);
  // Just a helpful estimate on screen, it never overwrites the actual "Total cost" field below.
  const estimatedTotal = selectedCar ? days * Number(selectedCar.daily_rate) : 0;

  function handleChange<K extends keyof RentalInput>(field: K, value: RentalInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success && !initialValues) {
      setValues(emptyValues);
    }
  }

  return (
    <form className="entity-form rental-form" onSubmit={handleSubmit}>
      <div className="rental-form-layout">
        {/* Left side: a read-only summary, friendlier than two dropdowns showing IDs. */}
        <div className="rental-summary">
          <div className={`car-thumb category-${selectedCar?.category ?? "default"}`}>
            <CarIcon className="car-thumb-icon" />
          </div>
          <p className="rental-summary-label">Selected car</p>
          <p className="rental-summary-value">
            {selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : "Choose a car"}
          </p>
          <p className="rental-summary-label">Customer</p>
          <p className="rental-summary-value">
            {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : "Choose a customer"}
          </p>
          {selectedCar && days > 0 && (
            <div className="rental-summary-total">
              <span>
                {days} day{days === 1 ? "" : "s"} &times; ${Number(selectedCar.daily_rate).toFixed(2)}/day
              </span>
              <strong>Est. ${estimatedTotal.toFixed(2)}</strong>
            </div>
          )}
        </div>

        {/* Right side: the actual editable fields. */}
        <div className="form-grid">
          <label>
            Customer
            <select
              required
              value={values.user_id || ""}
              onChange={(e) => handleChange("user_id", Number(e.target.value))}
            >
              <option value="" disabled>
                Select a customer
              </option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Car
            <select
              required
              value={values.car_id || ""}
              onChange={(e) => handleChange("car_id", Number(e.target.value))}
            >
              <option value="" disabled>
                Select a car
              </option>
              {cars.map((c) => (
                <option key={c.car_id} value={c.car_id}>
                  {c.make} {c.model} ({c.license_plate})
                </option>
              ))}
            </select>
          </label>
          <label>
            Start date
            <input
              required
              type="date"
              value={values.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
            />
          </label>
          <label>
            End date
            <input
              required
              type="date"
              value={values.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
            />
          </label>
          <label>
            Total cost ($)
            <input
              required
              type="number"
              step="0.01"
              min={0}
              value={values.total_cost}
              onChange={(e) => handleChange("total_cost", Number(e.target.value))}
            />
          </label>
          <label>
            Status
            <select
              value={values.status}
              onChange={(e) => handleChange("status", e.target.value as RentalStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
