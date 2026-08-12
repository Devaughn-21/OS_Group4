// The form used to both add a new car and edit an existing one, depending on whether initialValues is passed in.

import { useState, type SubmitEvent } from "react";
import { CAR_CATEGORIES } from "../../types";
import type { Car, CarCategory, CarInput } from "../../types";

// What a brand-new, empty "add a car" form starts out looking like.
const emptyValues: CarInput = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  color: "",
  license_plate: "",
  category: "standard",
  daily_rate: 0,
  is_available: true,
  mileage: 0,
};

// Converts a Car from the API into plain form values, mainly turning daily_rate/is_available into definite types.
function toFormValues(car: Car): CarInput {
  return {
    make: car.make,
    model: car.model,
    year: car.year,
    color: car.color ?? "",
    license_plate: car.license_plate,
    category: car.category,
    daily_rate: Number(car.daily_rate),
    is_available: Boolean(car.is_available),
    mileage: car.mileage ?? 0,
  };
}

interface CarFormProps {
  initialValues?: Car; // set = editing; unset = creating
  onSubmit: (data: CarInput) => Promise<boolean>; // returns true on success
  onCancel?: () => void;
  submitLabel: string;
}

export function CarForm({ initialValues, onSubmit, onCancel, submitLabel }: CarFormProps) {
  // Starts pre-filled with the car being edited, or a blank template when adding a new one.
  const [values, setValues] = useState<CarInput>(
    initialValues ? toFormValues(initialValues) : emptyValues,
  );
  const [submitting, setSubmitting] = useState(false);

  // Updates a single field without touching the rest of the values.
  function handleChange<K extends keyof CarInput>(field: K, value: CarInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from doing a full-page form submit
    setSubmitting(true);
    const success = await onSubmit(values); // hands the data up to CarsPage, which calls the API
    setSubmitting(false);
    // Only reset the form after a successful create, not an edit in progress.
    if (success && !initialValues) {
      setValues(emptyValues);
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Make
          <input
            required
            value={values.make}
            onChange={(e) => handleChange("make", e.target.value)}
          />
        </label>
        <label>
          Model
          <input
            required
            value={values.model}
            onChange={(e) => handleChange("model", e.target.value)}
          />
        </label>
        <label>
          Year
          <input
            required
            type="number"
            min={1980}
            max={2100}
            value={values.year}
            onChange={(e) => handleChange("year", Number(e.target.value))}
          />
        </label>
        <label>
          Color
          <input
            value={values.color ?? ""}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </label>
        <label>
          License plate
          <input
            required
            value={values.license_plate}
            onChange={(e) => handleChange("license_plate", e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value as CarCategory)}
          >
            {CAR_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Daily rate ($)
          <input
            required
            type="number"
            step="0.01"
            min={0}
            value={values.daily_rate}
            onChange={(e) => handleChange("daily_rate", Number(e.target.value))}
          />
        </label>
        <label>
          Mileage
          <input
            type="number"
            min={0}
            value={values.mileage ?? 0}
            onChange={(e) => handleChange("mileage", Number(e.target.value))}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={values.is_available}
            onChange={(e) => handleChange("is_available", e.target.checked)}
          />
          Available for rent
        </label>
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
