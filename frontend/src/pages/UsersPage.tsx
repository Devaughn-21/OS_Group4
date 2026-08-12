// The Users page: add-a-user form plus a table of existing customers, same pattern as CarsPage.

import { useCallback, useEffect, useState } from "react";
import { usersApi } from "../api/users";
import type { User, UserInput } from "../types";
import { Banner } from "../components/common/Banner";
import { UserForm } from "../components/users/UserForm";
import { UserTable } from "../components/users/UserTable";
import { useFeedback } from "../hooks/useFeedback";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { feedback, showSuccess, showError, clear } = useFeedback();

  // Fetches every user from the API (GET /users).
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await usersApi.list());
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // POST /users
  async function handleCreate(data: UserInput): Promise<boolean> {
    try {
      await usersApi.create(data);
      showSuccess(`Added ${data.first_name} ${data.last_name}.`);
      await loadUsers();
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add user.");
      return false;
    }
  }

  // PUT /users/:id
  async function handleUpdate(data: UserInput): Promise<boolean> {
    if (!editingUser) return false;
    try {
      await usersApi.update(editingUser.user_id, data);
      showSuccess(`Updated ${data.first_name} ${data.last_name}.`);
      setEditingUser(null);
      await loadUsers();
      return true;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update user.");
      return false;
    }
  }

  // DELETE /users/:id
  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) return;
    setDeletingId(user.user_id);
    try {
      await usersApi.remove(user.user_id);
      showSuccess(`Deleted ${user.first_name} ${user.last_name}.`);
      if (editingUser?.user_id === user.user_id) setEditingUser(null);
      await loadUsers();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h1>Users</h1>
      <p className="page-subtitle">Manage DriveEasy customer accounts.</p>

      {feedback && <Banner kind={feedback.kind} message={feedback.message} onDismiss={clear} />}

      <div className="panel">
        <h2>{editingUser ? `Edit ${editingUser.first_name} ${editingUser.last_name}` : "Add a user"}</h2>
        <UserForm
          key={editingUser?.user_id ?? "create"}
          initialValues={editingUser ?? undefined}
          submitLabel={editingUser ? "Save changes" : "Add user"}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={editingUser ? () => setEditingUser(null) : undefined}
        />
      </div>

      <div className="panel">
        <h2>Customers ({users.length})</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <UserTable users={users} onEdit={setEditingUser} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </div>
    </section>
  );
}
