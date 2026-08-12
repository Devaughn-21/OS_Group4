// The form used to both add a new customer and edit an existing one, same pattern as CarForm.

import { useState, type SubmitEvent } from "react";
import type { User, UserInput } from "../../types";

const emptyValues: UserInput = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  license_number: "",
};

function toFormValues(user: User): UserInput {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone ?? "",
    license_number: user.license_number,
  };
}

interface UserFormProps {
  initialValues?: User;
  onSubmit: (data: UserInput) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel: string;
}

export function UserForm({ initialValues, onSubmit, onCancel, submitLabel }: UserFormProps) {
  const [values, setValues] = useState<UserInput>(
    initialValues ? toFormValues(initialValues) : emptyValues,
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange<K extends keyof UserInput>(field: K, value: UserInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values); // hands off to UsersPage, which calls the API
    setSubmitting(false);
    if (success && !initialValues) {
      setValues(emptyValues); // only reset a successful "create", not an edit
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          First name
          <input
            required
            value={values.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />
        </label>
        <label>
          Last name
          <input
            required
            value={values.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>
        <label>
          Phone
          <input
            value={values.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </label>
        <label>
          License number
          <input
            required
            value={values.license_number}
            onChange={(e) => handleChange("license_number", e.target.value)}
          />
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
