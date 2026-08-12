// Renders the fleet as a grid of cards, the "read" part of Cars CRUD. CarsPage passes the data and callbacks.

import { CarIcon } from "../icons";
import type { Car } from "../../types";

interface CarGridProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  deletingId: number | null; // which car is mid-delete, so we can show "Deleting..." on just that one
}

export function CarGrid({ cars, onEdit, onDelete, deletingId }: CarGridProps) {
  if (cars.length === 0) {
    return <p className="empty-state">No cars match this filter yet.</p>;
  }

  return (
    <div className="car-grid">
      {cars.map((car) => (
        <div className="car-card" key={car.car_id}>
          {/* The className includes the category so index.css can give each one its own accent color. */}
          <div className={`car-thumb category-${car.category}`}>
            <CarIcon className="car-thumb-icon" />
            {!car.is_available && <span className="car-unavailable-tag">Unavailable</span>}
          </div>
          <div className="car-card-body">
            <div className="car-card-title-row">
              <h3>
                {car.make} {car.model}
              </h3>
              <span className="car-card-year">{car.year}</span>
            </div>
            <p className="car-card-meta">
              {car.color ?? "—"} &middot; {car.license_plate} &middot; {car.mileage ?? "—"} mi
            </p>
            <div className="car-card-footer">
              <span className={`badge category-${car.category}`}>{car.category}</span>
              <span className="car-card-rate">
                ${Number(car.daily_rate).toFixed(2)}
                <small>/day</small>
              </span>
            </div>
          </div>
          <div className="car-card-actions">
            <button type="button" onClick={() => onEdit(car)}>
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              disabled={deletingId === car.car_id}
              onClick={() => onDelete(car)}
            >
              {deletingId === car.car_id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
