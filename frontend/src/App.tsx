// The root component, mapping each URL path to a page. Routes swaps just <main>'s contents on navigation, no full reload.

import { Route, Routes } from "react-router-dom";
import { NavBar } from "./components/layout/NavBar";
import { HomePage } from "./pages/HomePage";
import { CarsPage } from "./pages/CarsPage";
import { UsersPage } from "./pages/UsersPage";
import { RentalsPage } from "./pages/RentalsPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <div className="app-shell">
      {/* Shown on every page */}
      <NavBar />
      <main className="app-main">
        <Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<HomePage />} />
  <Route path="/cars" element={<CarsPage />} />
  <Route path="/users" element={<UsersPage />} />
  <Route path="/rentals" element={<RentalsPage />} />
  <Route path="/payments" element={<PaymentsPage />} />
  <Route path="*" element={<HomePage />} />
</Routes>
      </main>
    </div>
  );
}
