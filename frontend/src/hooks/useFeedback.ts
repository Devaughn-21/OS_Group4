// Shared success/error banner state, reused by every page instead of each one writing its own.

import { useCallback, useState } from "react";

interface Feedback {
  kind: "error" | "success";
  message: string;
}

export function useFeedback() {
  // null = no banner showing right now.
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showSuccess = useCallback(
    (message: string) => setFeedback({ kind: "success", message }),
    [],
  );
  const showError = useCallback(
    (message: string) => setFeedback({ kind: "error", message }),
    [],
  );
  const clear = useCallback(() => setFeedback(null), []);

  return { feedback, showSuccess, showError, clear };
}
