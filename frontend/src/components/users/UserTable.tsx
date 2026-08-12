// Renders the customer list as a table, the "read" part of Users CRUD. UsersPage passes the data and callbacks.

import type { User } from "../../types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  deletingId: number | null;
}

export function UserTable({ users, onEdit, onDelete, deletingId }: UserTableProps) {
  if (users.length === 0) {
    return <p className="empty-state">No users yet. Add one above.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>License #</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>
                {user.first_name} {user.last_name}
              </td>
              <td>{user.email}</td>
              <td>{user.phone ?? "—"}</td>
              <td>{user.license_number}</td>
              <td className="row-actions">
                <button type="button" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  disabled={deletingId === user.user_id}
                  onClick={() => onDelete(user)}
                >
                  {deletingId === user.user_id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
