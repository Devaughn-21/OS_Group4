// Every SVG icon used in the app, drawn by hand instead of pulling in an icon library.

interface IconProps {
  className?: string;
}

/** Brand mark, matches public/favicon.svg so the nav and browser tab agree. */
export function SteeringWheelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="currentColor" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <path
        d="M24 9v10.5M13 30.5 20.5 25M35 30.5 27.5 25"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Flat side-profile car illustration used for car card thumbnails and hero art. */
export function CarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <path
        d="M8 26h48a4 4 0 0 0 4-4v-2a6 6 0 0 0-5.2-5.95L48.4 12 42 4.8A6 6 0 0 0 37.5 3H24a6 6 0 0 0-4.24 1.76L12 12H8a6 6 0 0 0-6 6v4a4 4 0 0 0 4 4z"
        fill="currentColor"
      />
      <path
        d="M20 12h24l-4.6-5.5A3 3 0 0 0 37.1 5.5H24.9a3 3 0 0 0-2.3 1.05z"
        fill="rgba(255,255,255,0.55)"
      />
      <circle cx="18" cy="27" r="6.5" fill="#1f2430" />
      <circle cx="18" cy="27" r="2.4" fill="#f4f6f9" />
      <circle cx="46" cy="27" r="6.5" fill="#1f2430" />
      <circle cx="46" cy="27" r="2.4" fill="#f4f6f9" />
    </svg>
  );
}

/** Minimal line-style car icon used in the Cars nav card. */
export function CarLineIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 15.5 5 10.8a2.5 2.5 0 0 1 2.4-1.8h9.2a2.5 2.5 0 0 1 2.4 1.8l1.5 4.7" />
      <path d="M3.5 15.5h17v2.25a1 1 0 0 1-1 1h-1.25a1 1 0 0 1-1-1V17h-11v.75a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z" />
      <circle cx="7.5" cy="15.5" r="1.4" />
      <circle cx="16.5" cy="15.5" r="1.4" />
    </svg>
  );
}

/** Two-person icon used on the Users nav card. */
export function UsersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="9" cy="8" r="3.25" />
      <path d="M17 20v-1.5a3.5 3.5 0 0 0-2.2-3.25" />
      <path d="M14.5 5.1a3.25 3.25 0 0 1 0 6.3" />
    </svg>
  );
}

/** Calendar icon used on the Rentals nav card. */
export function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.2M16 3v3.2" />
      <path d="M8 13.2h2.4M13.6 13.2H16M8 16.6h2.4" />
    </svg>
  );
}

/** Credit card icon used on the Payments nav card. */
export function CardIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.5" />
      <path d="M2.75 9.75h18.5" />
      <path d="M6 14.5h4" />
    </svg>
  );
}
