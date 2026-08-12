// A dismissible success/error message shown at the top of a page after an API call finishes.

interface BannerProps {
  kind: "error" | "success";
  message: string;
  onDismiss: () => void;
}

export function Banner({ kind, message, onDismiss }: BannerProps) {
  return (
    // The role helps screen readers announce it correctly.
    <div className={`banner banner-${kind}`} role={kind === "error" ? "alert" : "status"}>
      <span>{message}</span>
      <button type="button" className="banner-close" onClick={onDismiss} aria-label="Dismiss message">
        &times;
      </button>
    </div>
  );
}
