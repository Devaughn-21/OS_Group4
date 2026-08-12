// The landing page: a hero banner, four category cards, and four cards linking into the management screens.

import { Link } from "react-router-dom";
import { CarLineIcon, UsersIcon, CalendarIcon, CardIcon } from "../components/icons";
import heroBanner from "../assets/hero-banner.jpg";
import economyPhoto from "../assets/cars/economy.jpg";
import standardPhoto from "../assets/cars/standard.jpg";
import suvPhoto from "../assets/cars/suv.jpg";
import luxuryPhoto from "../assets/cars/luxury.jpg";
import type { CarCategory } from "../types";

// fromRate is just a representative starting price. Clicking a card takes you to the live Cars page, filtered.
const categoryHighlights: { category: CarCategory; fromRate: string; photo: string }[] = [
  { category: "economy", fromRate: "From $38/day", photo: economyPhoto },
  { category: "standard", fromRate: "From $45/day", photo: standardPhoto },
  { category: "SUV", fromRate: "From $65/day", photo: suvPhoto },
  { category: "luxury", fromRate: "From $120/day", photo: luxuryPhoto },
];

// The 4 cards under "Manage DriveEasy", the real navigation into each CRUD screen.
const sections = [
  {
    to: "/cars",
    title: "Cars",
    description: "Browse the fleet, add new vehicles, and update availability.",
    icon: CarLineIcon,
    tone: "tone-blue",
  },
  {
    to: "/users",
    title: "Users",
    description: "Manage customer accounts and license details.",
    icon: UsersIcon,
    tone: "tone-purple",
  },
  {
    to: "/rentals",
    title: "Rentals",
    description: "Book cars to customers and track rental status.",
    icon: CalendarIcon,
    tone: "tone-amber",
  },
  {
    to: "/payments",
    title: "Payments",
    description: "Review payment records for each rental.",
    icon: CardIcon,
    tone: "tone-green",
  },
];

export function HomePage() {
  return (
    <section>
      {/* The photo is a CSS background-image so the dark ".hero-overlay" gradient can sit on top for readable text. */}
      <div className="hero" style={{ backgroundImage: `url(${heroBanner})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Your Next Journey Starts Here</h1>
          <p className="hero-subtitle">Affordable rentals, anytime, anywhere.</p>
          <Link to="/cars" className="btn-hero">
            Browse Available Cars
          </Link>
        </div>
      </div>

      {/* Each card links to "/cars?category=...", which CarsPage reads to pre-select the matching chip. */}
      <h2 className="section-heading">Explore by category</h2>
      <div className="category-grid">
        {categoryHighlights.map(({ category, fromRate, photo }) => (
          <Link key={category} to={`/cars?category=${category}`} className="category-card">
            <div className="category-photo">
              <img src={photo} alt={`${category} car`} />
            </div>
            <h3>{category}</h3>
            <p>{fromRate}</p>
          </Link>
        ))}
      </div>

      {/* The actual navigation into each management screen. */}
      <h2 className="section-heading">Manage DriveEasy</h2>
      <div className="card-grid">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card-link">
            <span className={`icon-badge ${s.tone}`}>
              <s.icon />
            </span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
