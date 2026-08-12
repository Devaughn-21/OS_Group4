// Renders payment records as a read-only table, since the backend only has a GET /payments route.

import type { Payment } from "../../types";

interface PaymentTableProps {
  payments: Payment[];
}

function formatDateTime(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function PaymentTable({ payments }: PaymentTableProps) {
  if (payments.length === 0) {
    return <p className="empty-state">No payments recorded yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Rental #</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.rental_id}</td>
              <td>${Number(p.amount).toFixed(2)}</td>
              <td>{p.method.replace("_", " ")}</td>
              <td>
                <span className={`badge status-${p.status}`}>{p.status}</span>
              </td>
              <td>{formatDateTime(p.payment_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
