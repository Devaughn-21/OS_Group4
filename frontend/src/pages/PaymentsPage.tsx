// The Payments page. Read-only, since the backend only has a GET /payments route.

import { useCallback, useEffect, useState } from "react";
import { paymentsApi } from "../api/payments";
import type { Payment } from "../types";
import { Banner } from "../components/common/Banner";
import { PaymentTable } from "../components/payments/PaymentTable";
import { useFeedback } from "../hooks/useFeedback";

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { feedback, showError, clear } = useFeedback();

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      setPayments(await paymentsApi.list());
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <section>
      <h1>Payments</h1>
      <p className="page-subtitle">
        Payment records linked to rentals. The API currently only exposes a read endpoint for
        payments, so this view is list-only.
      </p>

      {feedback && <Banner kind={feedback.kind} message={feedback.message} onDismiss={clear} />}

      <div className="panel">
        <h2>All payments ({payments.length})</h2>
        {loading ? <p>Loading payments...</p> : <PaymentTable payments={payments} />}
      </div>
    </section>
  );
}
