// The Cars page: the add-a-car form, a category filter, and the fleet grid. This file owns the state and talks to the API.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { carsApi } from "../api/cars";
import { CAR_CATEGORIES } from "../types";
import type { Car, CarCategory, CarInput } from "../types";
import { Banner } from "../components/common/Banner";
import { CarForm } from "../components/cars/CarForm";
import { CarGrid } from "../components/cars/CarGrid";
import { useFeedback } from "../hooks/useFeedback";

type CategoryFilter = CarCategory | "all";

export function CarsPage() {
  // Reads/writes the ?category=... part of the URL, so a Home page link like "/cars?category=SUV" can pre-select a chip.
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { feedback, showSuccess, showError, clear } = useFeedback();

  // Falls back to "all" if the URL doesn't have a valid category in it.
  const requestedCategory = searchParams.get("category");
  const categoryFilter: CategoryFilter =
    requestedCategory && CAR_CATEGORIES.includes(requestedCategory as CarCategory)
      ? (requestedCategory as CarCategory)
      : "all";

  // Clicking a chip updates the URL instead of a plain useState, which is what lets Home page links pre-select it.
  function setCategoryFilter(next: CategoryFilter) {
    if (next === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: next });
    }
  }

  // The cars actually shown below, after applying the active category filter.
  const filteredCars = useMemo(
    () => (categoryFilter === "all" ? cars : cars.filter((c) => c.category === categoryFilter)),
    [cars, categoryFilter],
  );

  // Fetches the fleet from the API (GET /cars) and stores it in state.
  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      setCars(await carsApi.list());
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load the fleet once when the page first mounts.
  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // Called when the "Add a car" form is submitted (POST /cars).
  async function handleCreate(data: CarInput): Promise<boolean> {
    try {
      await carsApi.create(data);
      showSuccess(`Added ${data.make} ${data.model}.`);
      await loadCars(); // refresh the list so the new car shows up
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add car.");
      return false;
    }
  }

  // Called when editing an existing car and saving changes (PUT /cars/:id).
  async function handleUpdate(data: CarInput): Promise<boolean> {
    if (!editingCar) return false;
    try {
      await carsApi.update(editingCar.car_id, data);
      showSuccess(`Updated ${data.make} ${data.model}.`);
      setEditingCar(null); // exit edit mode
      await loadCars();
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update car.");
      return false;
    }
  }

  // Called when clicking "Delete" on a car card (DELETE /cars/:id).
  async function handleDelete(car: Car) {
    if (!window.confirm(`Delete ${car.make} ${car.model} (${car.license_plate})?`)) return;
    setDeletingId(car.car_id);
    try {
      await carsApi.remove(car.car_id);
      showSuccess(`Deleted ${car.make} ${car.model}.`);
      if (editingCar?.car_id === car.car_id) setEditingCar(null);
      await loadCars();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete car.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h1>Cars</h1>
      <p className="page-subtitle">Manage the DriveEasy rental fleet.</p>

      {/* Shows the last success or error message, if there is one. */}
      {feedback && <Banner kind={feedback.kind} message={feedback.message} onDismiss={clear} />}

      {/* The same form is reused for add and edit, depending on whether editingCar is set. */}
      <div className="panel">
        <h2>{editingCar ? `Edit ${editingCar.make} ${editingCar.model}` : "Add a car"}</h2>
        <CarForm
          key={editingCar?.car_id ?? "create"}
          initialValues={editingCar ?? undefined}
          submitLabel={editingCar ? "Save changes" : "Add car"}
          onSubmit={editingCar ? handleUpdate : handleCreate}
          onCancel={editingCar ? () => setEditingCar(null) : undefined}
        />
      </div>

      {/* Category chips + the fleet grid. */}
      <div className="panel">
        <h2>Fleet ({filteredCars.length})</h2>
        <div className="filter-chips">
          <button
            type="button"
            className={categoryFilter === "all" ? "chip active" : "chip"}
            onClick={() => setCategoryFilter("all")}
          >
            All Categories
          </button>
          {CAR_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={categoryFilter === c ? "chip active" : "chip"}
              onClick={() => setCategoryFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {loading ? (
          <p>Loading cars...</p>
        ) : (
          <CarGrid cars={filteredCars} onEdit={setEditingCar} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </div>
    </section>
  );
}
