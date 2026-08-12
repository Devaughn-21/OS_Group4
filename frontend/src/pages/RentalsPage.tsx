// The Rentals page: booking form plus a table of existing rentals. Also loads users and cars for the form's dropdowns.

import { useCallback, useEffect, useState } from "react";
import { rentalsApi } from "../api/rentals";
import { usersApi } from "../api/users";
import { carsApi } from "../api/cars";
import type { Car, Rental, RentalInput, User } from "../types";
import { Banner } from "../components/common/Banner";
import { RentalForm } from "../components/rentals/RentalForm";
import { RentalTable } from "../components/rentals/RentalTable";
import { useFeedback } from "../hooks/useFeedback";

export function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { feedback, showSuccess, showError, clear } = useFeedback();

  // Loads rentals, users, and cars in parallel so the form and table can show names instead of IDs.
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rentalsData, usersData, carsData] = await Promise.all([
        rentalsApi.list(),
        usersApi.list(),
        carsApi.list(),
      ]);
      setRentals(rentalsData);
      setUsers(usersData);
      setCars(carsData);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // POST /rentals
  async function handleCreate(data: RentalInput): Promise<boolean> {
    try {
      await rentalsApi.create(data);
      showSuccess("Rental created.");
      await loadAll();
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create rental.");
      return false;
    }
  }

  // PUT /rentals/:id
  async function handleUpdate(data: RentalInput): Promise<boolean> {
    if (!editingRental) return false;
    try {
      await rentalsApi.update(editingRental.rental_id, data);
      showSuccess("Rental updated.");
      setEditingRental(null);
      await loadAll();
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update rental.");
      return false;
    }
  }

  // DELETE /rentals/:id
  async function handleDelete(rental: Rental) {
    if (!window.confirm(`Delete rental #${rental.rental_id}?`)) return;
    setDeletingId(rental.rental_id);
    try {
      await rentalsApi.remove(rental.rental_id);
      showSuccess(`Deleted rental #${rental.rental_id}.`);
      if (editingRental?.rental_id === rental.rental_id) setEditingRental(null);
      await loadAll();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete rental.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h1>Rentals</h1>
      <p className="page-subtitle">Book cars to customers and track rental status.</p>

      {feedback && <Banner kind={feedback.kind} message={feedback.message} onDismiss={clear} />}

      <div className="panel">
        <h2>{editingRental ? `Edit rental #${editingRental.rental_id}` : "New rental"}</h2>
        {/* Show a hint instead of a broken-looking form if there's no user or car yet. */}
        {users.length === 0 || cars.length === 0 ? (
          <p className="empty-state">Add at least one user and one car before creating a rental.</p>
        ) : (
          <RentalForm
            key={editingRental?.rental_id ?? "create"}
            initialValues={editingRental ?? undefined}
            users={users}
            cars={cars}
            submitLabel={editingRental ? "Update rental" : "Confirm rental"}
            onSubmit={editingRental ? handleUpdate : handleCreate}
            onCancel={editingRental ? () => setEditingRental(null) : undefined}
          />
        )}
      </div>

      <div className="panel">
        <h2>All rentals ({rentals.length})</h2>
        {loading ? (
          <p>Loading rentals...</p>
        ) : (
          <RentalTable
            rentals={rentals}
            users={users}
            cars={cars}
            onEdit={setEditingRental}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>
    </section>
  );
}
