// Renders every rental as a table row, the "read" part of Rentals CRUD. Takes the users/cars lists too, just to translate IDs into names.

import type { Car, Rental, User } from "../../types";

interface RentalTableProps {
  rentals: Rental[];
  users: User[];
  cars: Car[];
  onEdit: (rental: Rental) => void;
  onDelete: (rental: Rental) => void;
  deletingId: number | null;
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function RentalTable({ rentals, users, cars, onEdit, onDelete, deletingId }: RentalTableProps) {
  // Turns an ID into a human-readable name, falling back to "#id" if it wasn't found.
  function userName(id: number) {
    const u = users.find((u) => u.user_id === id);
    return u ? `${u.first_name} ${u.last_name}` : `#${id}`;
  }

  function carName(id: number) {
    const c = cars.find((c) => c.car_id === id);
    return c ? `${c.make} ${c.model}` : `#${id}`;
  }

  if (rentals.length === 0) {
    return <p className="empty-state">No rentals yet. Create one above.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Car</th>
            <th>Start</th>
            <th>End</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.rental_id}>
              <td>{userName(rental.user_id)}</td>
              <td>{carName(rental.car_id)}</td>
              <td>{formatDate(rental.start_date)}</td>
              <td>{formatDate(rental.end_date)}</td>
              <td>${Number(rental.total_cost).toFixed(2)}</td>
              <td>
                <span className={`badge status-${rental.status}`}>{rental.status}</span>
              </td>
              <td className="row-actions">
                <button type="button" onClick={() => onEdit(rental)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  disabled={deletingId === rental.rental_id}
                  onClick={() => onDelete(rental)}
                >
                  {deletingId === rental.rental_id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
