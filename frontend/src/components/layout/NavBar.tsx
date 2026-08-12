// The top navigation bar shown on every page: the DriveEasy logo (which
// links back to Home), links to each section, and a "Browse Cars" button.

import { Link, NavLink } from "react-router-dom";
import { SteeringWheelIcon } from "../icons";

const links = [
  { to: "/cars", label: "Cars" },
  { to: "/users", label: "Users" },
  { to: "/rentals", label: "Rentals" },
  { to: "/payments", label: "Payments" },
];

export function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo + name, links back to "/" */}
        <Link to="/" className="brand">
          <SteeringWheelIcon className="brand-icon" />
          DriveEasy
        </Link>

        {/* NavLink adds an "active" class automatically when its "to" matches the current page. */}
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/cars" className="btn-cta">
          Browse Cars
        </Link>
      </div>
    </header>
  );
}
