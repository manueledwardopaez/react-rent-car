import { Link } from "react-router";
import { supabase } from "../supabase/client";

export const NavBar = () => {
  return (
    <div className="mb-4">
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Luxury Rent Car
          </Link>
          <button
            onClick={() => {
              supabase.auth.signOut();
            }}
            to="/"
            className="navbar-brand btn btn-danger text-white"

          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};
